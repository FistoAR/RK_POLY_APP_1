import "@google/model-viewer";
import { useEffect, useRef } from "react";
import { useAppStore } from "../store";

export default function Viewer() {
  const viewerRef = useRef();

  const color = useAppStore((s) => s.color);
  const pattern = useAppStore((s) => s.pattern);
  const target = useAppStore((s) => s.target);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const apply = async () => {
      const model = viewer.model;
      if (!model) return;

      for (const material of model.materials) {
        const name = material.name.toLowerCase();
        const isTop = name.includes("top") || name.includes("lid");
        const isBottom = name.includes("bottom") || name.includes("tub");

        const shouldApply =
          target === "both" ||
          (target === "top" && isTop) ||
          (target === "bottom" && isBottom);

        if (!shouldApply) continue;

        // Apply color
        const rgb = hexToRgb(color);
        material.pbrMetallicRoughness.setBaseColorFactor(rgb);

        // Apply texture pattern
        if (pattern) {
          const tex = await createTexture(pattern);
          material.pbrMetallicRoughness.baseColorTexture.setTexture(tex);
        } else {
          material.pbrMetallicRoughness.baseColorTexture.setTexture(null);
        }
      }
    };

    if (viewer.model) apply();
    viewer.addEventListener("load", apply);
    return () => viewer.removeEventListener("load", apply);
  }, [color, pattern, target]);

  // Convert HEX → RGBA
  const hexToRgb = (hex) => {
    const v = hex.replace("#", "");
    const r = parseInt(v.substring(0, 2), 16) / 255;
    const g = parseInt(v.substring(2, 4), 16) / 255;
    const b = parseInt(v.substring(4, 6), 16) / 255;
    return [r, g, b, 1];
  };

  // Load image as texture
  const createTexture = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject("Texture load failed");
      img.src = url;
    });

  return (
    <model-viewer
      ref={viewerRef}
      src="/models/250ml_round.glb"
      alt="Product Model"
      camera-controls
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
      }}
    />
  );
}
