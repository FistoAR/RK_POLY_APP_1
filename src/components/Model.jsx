import { useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useAppStore } from "../store";
import { Color } from "three";

export default function Model(props) {
  const ref = useRef();
  const { scene } = useGLTF("/models/250ml_round.glb");

  const target = useAppStore((s) => s.target);
  const color = useAppStore((s) => s.color);
  const pattern = useAppStore((s) => s.pattern);

  const texture = pattern ? useTexture(pattern) : null;

  useEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = 1000;
      texture.repeat.set(1, 1);
    }
  }, [texture]);

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (!child.isMesh) return;

      const name = child.name.toLowerCase();
      const isTop = name.includes("top") || name.includes("lid");
      const isBottom = name.includes("bottom") || name.includes("tub");

      const shouldApply =
        target === "both" ||
        (target === "top" && isTop) ||
        (target === "bottom" && isBottom);

      if (!shouldApply) return;

      child.material.color = new Color(color);

      if (pattern && texture) {
        child.material.map = texture;
        child.material.needsUpdate = true;
      } else {
        child.material.map = null;
        child.material.needsUpdate = true;
      }
    });
  }, [color, pattern, target, texture, scene]);

  return <primitive ref={ref} object={scene} {...props} />;
}

useGLTF.preload("/models/250ml_round.glb");
