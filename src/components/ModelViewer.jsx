import { useRef, useState, useEffect } from "react";
import model120 from "../assets/models-with-logo/120ml_round.glb";
import model250 from "../assets/models-with-logo/250ml_round.glb";
import model500 from "../assets/models-with-logo/500ml_round.glb";
import model750 from "../assets/models-with-logo/750ml_round.glb";
import model1000 from "../assets/models-with-logo/50ml_hinged_container.glb";

import model120A from "../assets/models/120ml_round.glb";
import model250A from "../assets/models/250ml_round.glb";
import model500A from "../assets/models/500ml_round.glb";
import model750A from "../assets/models/750ml_round.glb";
import model1000A from "../assets/models/50ml_hinged_container.glb";

// Import default logos
import defaultLogo1 from "/Images/rk-poly-logo.webp";
import defaultLogo2 from "/Images/rk-poly-logo.webp"; // Replace with actual paths
import defaultLogo3 from "/Images/rk-poly-logo.webp"; // Replace with actual paths
import defaultLogo4 from "/Images/rk-poly-logo.webp"; // Replace with actual paths

import jsPDF from "jspdf";
import Label from "./Label";

export default function ModelViewer() {
  const modelRef = useRef(null);
  const [labelUrl, setLabelUrl] = useState("");
  const [topColor, setTopColor] = useState(null);
  const [bottomColor, setBottomColor] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [selectedModel, setSelectedModel] = useState(model120);
  const [bgColor, setBgColor] = useState("#e5e7eb");
  const [displayModel, setDisplayModel] = useState(model120);
  const [currentView, setCurrentView] = useState("home");
  const [customLabelTexture, setCustomLabelTexture] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Model mapping: with-logo and without-logo versions
  const modelMap = {
    [model120]: { withLogo: model120, withoutLogo: model120A },
    [model250]: { withLogo: model250, withoutLogo: model250A },
    [model500]: { withLogo: model500, withoutLogo: model500A },
    [model750]: { withLogo: model750, withoutLogo: model750A },
    [model1000]: { withLogo: model1000, withoutLogo: model1000A },
  };

  const defaultLogos = [
    { id: 1, name: "Logo 1", src: defaultLogo1 },
    { id: 2, name: "Logo 2", src: defaultLogo2 },
    { id: 3, name: "Logo 3", src: defaultLogo3 },
    { id: 4, name: "Logo 4", src: defaultLogo4 },
  ];

  // Get current model variant (with or without logo)
  const getCurrentModel = () => {
    const mapping = modelMap[selectedModel];
    if (!mapping) return selectedModel;
    // Use without-logo model when custom label texture is applied
    return customLabelTexture ? mapping.withoutLogo : mapping.withLogo;
  };

  // Update displayModel whenever the current model changes
  useEffect(() => {
    const newModel = getCurrentModel();
    setDisplayModel(newModel);
    setModelLoaded(false);
  }, [selectedModel, customLabelTexture]);

  const models = [
    { name: "120ml Round", path: model120 },
    { name: "250ml Round", path: model250 },
    { name: "350ml Round", path: model500 },
    { name: "500ml Round", path: model750 },
    { name: "750ml Round", path: model1000 },
  ];

  const categories = [
    {
      id: "round",
      title: "ROUND (7)",
      items: [
        { id: "100ml", label: "100 ml", path: model120 },
        { id: "250ml", label: "250 ml", path: model250 },
        { id: "500gm", label: "500 gm", path: model500 },
        { id: "500ml", label: "500 ml", path: model500 },
        { id: "750ml", label: "750 ml", path: model750 },
        { id: "750ml_tall", label: "750 ml (Tall)", path: model750 },
        { id: "1000ml", label: "1000 ml", path: model1000 },
      ],
    },
    {
      id: "round_bevel",
      title: "ROUND BEVEL (4)",
      items: [
        { id: "300ml_rb", label: "300 ml", path: model120 },
        { id: "500ml_rb", label: "500 ml", path: model250 },
        { id: "750ml_rb", label: "750 ml", path: model750 },
        { id: "1000ml_rb", label: "1000 ml", path: model1000 },
      ],
    },
    {
      id: "oval",
      title: "OVAL (3)",
      items: [
        { id: "250ml_oval", label: "250 ml", path: model120 },
        { id: "500ml_oval", label: "500 ml", path: model500 },
        { id: "1000ml_oval", label: "1000 ml", path: model750 },
      ],
    },
    {
      id: "taper_evident",
      title: "TAPER EVIDENT (4)",
      items: [
        { id: "250ml_te", label: "250 ml", path: model120 },
        { id: "b500ml_te", label: "B-500 ml", path: model250 },
        { id: "500ml_te", label: "500 ml", path: model500 },
        { id: "1000ml_te", label: "1000 ml", path: model750 },
      ],
    },
    {
      id: "sweet_box",
      title: "SWEET BOX (5)",
      items: [
        { id: "250_tr", label: "250 TRANSPARENT", path: model120 },
        { id: "250_premium", label: "250 PREMIUM (GREEN)", path: model250 },
        { id: "750_tr", label: "750 TRANSPARENT", path: model750 },
        { id: "750_red", label: "SAS TRADITIONAL (RED) ~750 ml", path: model1000 },
        { id: "1000_blue", label: "SHRI DHIVYAM (BLUE) ~1000 ml", path: model1000 },
      ],
    },
  ];

  // Helper: Convert hex to RGB normalized (0-1)
  const hexToRgba = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [1, 1, 1, 1];
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
      1.0,
    ];
  };

  // Apply color to material with proper PBR settings
  const applyColorToMaterial = (material, hexColor) => {
    try {
      const rgba = hexToRgba(hexColor);
      rgba[3] = 1.0;

      material.pbrMetallicRoughness.setBaseColorFactor(rgba);
      material.pbrMetallicRoughness.setMetallicFactor(0.0);
      material.pbrMetallicRoughness.setRoughnessFactor(0.25);
      material.opacity = 1.0;
      material.transparent = false;

      console.log(`✓ Applied ${hexColor} (Solid/Shiny) to "${material.name}"`);
    } catch (error) {
      console.error(`Error applying color to ${material.name}:`, error);
    }
  };          

  // Wait for model to load
  useEffect(() => {
    const mv = modelRef.current;
    if (!mv) return;

    const handleLoad = () => {
      console.log("Model loaded");
      setModelLoaded(true);

      const materials = mv.model?.materials;
      if (materials) {
        console.log("Available materials:", materials.map((m) => m.name));
        materials.forEach((m, i) => {
          console.log(`Material[${i}]: "${m.name}"`);
        });
      }
    };

    mv.addEventListener("load", handleLoad);
    return () => mv.removeEventListener("load", handleLoad);
  }, [displayModel]); // Changed from selectedModel to displayModel

  // Apply TOP color - Re-apply when model loads
  useEffect(() => {
    if (!modelLoaded || !modelRef.current || !topColor) return;

    const mv = modelRef.current;
    const materials = mv.model?.materials;
    if (!materials) return;

    materials.forEach((material) => {
      const name = material.name.toLowerCase();
      if (name.includes("lid") || name.includes("top")) {
        applyColorToMaterial(material, topColor);
      }
    });
  }, [topColor, modelLoaded]); // Removed displayModel dependency

  // Apply BOTTOM color - Re-apply when model loads
  useEffect(() => {
    if (!modelLoaded || !modelRef.current || !bottomColor) return;

    const mv = modelRef.current;
    const materials = mv.model?.materials;
    if (!materials) return;

    materials.forEach((material) => {
      const name = material.name.toLowerCase();

      // NEVER apply bottom color to logo materials
      if (name.includes("logo")) return;
      
      // Skip texture_area ONLY if custom label is applied
      if (name === "texture_area" && customLabelTexture) return;

      if (
        name.includes("tub") ||
        name.includes("bottom") ||
        name === "texture_area"
      ) {
        applyColorToMaterial(material, bottomColor);
      }
    });
  }, [bottomColor, modelLoaded, customLabelTexture]); // Added customLabelTexture

  // Apply Custom Label to "texture_area"
  useEffect(() => {
    if (!customLabelTexture || !modelLoaded || !modelRef.current) return;

    const mv = modelRef.current;

    (async () => {
      try {
        console.log("Applying custom label texture...");
        const texture = await mv.createTexture(customLabelTexture);
        const targetMat = mv.model?.materials.find((m) => m.name === "texture_area");

        if (targetMat) {
          targetMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
          targetMat.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
          targetMat.pbrMetallicRoughness.setMetallicFactor(0.0);
          targetMat.pbrMetallicRoughness.setRoughnessFactor(0.5);

          console.log("✓ Custom label texture applied to texture_area");
        }
      } catch (e) {
        console.error("Error applying custom label texture:", e);
      }
    })();
  }, [customLabelTexture, modelLoaded]);

  // Apply uploaded logo to bottom logo material
  useEffect(() => {
    if (!labelUrl || !modelLoaded || !modelRef.current) return;

    const mv = modelRef.current;
    const materials = mv.model?.materials;

    (async () => {
      try {
        const texture = await mv.createTexture(labelUrl);
        if (!texture) {
          console.error("Texture creation failed");
          return;
        }

        // Try different possible material names
        const targetMaterial = materials.find((mat) => 
          mat.name === "bottom_logo" || 
          mat.name === "bottomlogo" ||
          mat.name.toLowerCase().includes("logo")
        );
        
        if (!targetMaterial) {
          console.warn("Material logo not found in model");
          console.log("Available materials:", materials.map(m => m.name));
          return;
        }

        console.log("Applying logo to", targetMaterial.name);
        targetMaterial.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
        targetMaterial.pbrMetallicRoughness.setMetallicFactor(0.0);
        targetMaterial.pbrMetallicRoughness.setRoughnessFactor(0.0);

        console.log("Logo applied successfully!");
      } catch (err) {
        console.error("Error applying logo texture:", err);
      }
    })();
  }, [labelUrl, modelLoaded]);

  const handleLabelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLabelUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDefaultLogoSelect = (logoSrc) => {
    setLabelUrl(logoSrc);
  };

  const handleExportGLB = async () => {
    const mv = modelRef.current;
    if (!mv) return;
    const blob = await mv.exportScene();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const modelName = models.find((m) => m.path === selectedModel)?.name || "model";
    a.download = `${modelName}.glb`;
    a.click();
    setShowExportMenu(false);
  };

  const handleExportPDF = async () => {
    try {
      const mv = modelRef.current;
      if (!mv) {
        console.error("Model viewer not available");
        alert("Model not ready. Please wait until the model loads.");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      let dataUrl = null;

      if (typeof mv.toDataURL === "function") {
        dataUrl = await mv.toDataURL("image/png", 1.0);
      } else if (typeof mv.captureScreenshot === "function") {
        const blob = await mv.captureScreenshot();
        dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } else {
        const canvas = mv.shadowRoot?.querySelector("canvas");
        if (canvas) {
          dataUrl = canvas.toDataURL("image/png");
        } else {
          throw new Error("Cannot find WebGL canvas to export");
        }
      }

      if (!dataUrl || !dataUrl.startsWith("data:")) {
        throw new Error("Failed to capture model screenshot");
      }

      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const img = new Image();
      img.src = dataUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const imgAspectRatio = img.width / img.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;

      let finalWidth, finalHeight, xOffset, yOffset;

      if (imgAspectRatio > pdfAspectRatio) {
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / imgAspectRatio;
        xOffset = 0;
        yOffset = (pdfHeight - finalHeight) / 2;
      } else {
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * imgAspectRatio;
        yOffset = 0;
        xOffset = (pdfWidth - finalWidth) / 2;
      }

      pdf.addImage(dataUrl, "PNG", xOffset, yOffset, finalWidth, finalHeight);

      const modelName = models.find((m) => m.path === selectedModel)?.name || "model";
      pdf.save(`${modelName}.pdf`);

      setShowExportMenu(false);
      console.log("PDF exported successfully with correct aspect ratio!");
    } catch (err) {
      console.error("Error exporting PDF:", err);
      alert(`Failed to export PDF: ${err.message}. Try again after the model fully loads.`);
    }
  };

  const handleModelChange = (modelPath) => {
    setSelectedModel(modelPath);
    setModelLoaded(false);
  };

  if (currentView === "label") {
    return (
      <Label
        onBack={() => setCurrentView("home")}
        onApply={(generatedImage) => {
          setCustomLabelTexture(generatedImage);
          setCurrentView("home");
        }}
      />
    );
  }

  return (
    <div className="flex gap-[2vw] h-screen bg-gray-50 p-[1vw]">
      {/* LEFT SIDE - CONTROLS */}
      <div className="w-[25vw] bg-white rounded-[1vw] shadow-lg p-[1.5vw] overflow-y-auto space-y-[1vw]">
        {/* MODELS / CATEGORIES SECTION */}
        <div>
          <h3 className="text-[1.5vw] font-bold text-gray-800 mb-[.4vw]">
            Select Container Type
          </h3>

          {categories.map((cat) => {
            const isOpen = openCategory === cat.id;
            return (
              <div key={cat.id} className="mb-[0.2vw]">
                <button
                  onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                  className="w-full flex items-center justify-between px-[1vw] py-[.5vw] text-[1vw] rounded-[.5vw] font-medium bg-[#1fa4dd] text-white hover:bg-gray-400 hover:text-black focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`cat-${cat.id}`}
                >
                  <span>{cat.title}</span>
                  <span className="text-[1vw] text-white">{isOpen ? "▾" : "▸"}</span>
                </button>

                <div
                  id={`cat-${cat.id}`}
                  className={`mt-[.3vw] ml-[2vw] transition-all overflow-hidden ${
                    isOpen ? "max-h-[50vw]" : "max-h-0"
                  } `}
                  style={{ transition: "max-height 240ms ease" }}
                >
                  <div className="space-y-[.2vw] mt-[.2vw]">
                    {cat.items.map((item) => {
                      const isSelected = selectedModel === item.path;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            handleModelChange(item.path);
                            setOpenCategory(cat.id);
                          }}
                          className={`w-full text-[1vw] text-left px-[1vw] py-[.5vw] rounded-[.5vw] cursor-pointer hover:bg-gray-200 hover:text-black font-medium transition-all ${
                            isSelected
                              ? "bg-indigo-600 text-white shadow-md"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-300"></div>

        <div className="flex gap-[3vw]">
          {/* TOP COLOR */}
          <div>
            <label className="block text-[1vw] font-bold text-gray-700 mb-[1vw]">
              Top Lid Color
            </label>
            <div className="flex items-center gap-[.5vw] ">
              <input
                type="color"
                value={topColor || "#ffffff"}
                onChange={(e) => setTopColor(e.target.value)}
                className="w-[4vw] h-[2.5vw] rounded-[.5vw] cursor-pointer border-gray-300 hover:border-indigo-500"
              />
              <span className="text-[.8vw] text-gray-600 font-mono">{topColor}</span>
            </div>
          </div>

          {/* BOTTOM COLOR */}
          <div>
            <label className="block text-[1vw] font-bold text-gray-700 mb-[1vw]">
              Bottom Tub Color
            </label>
            <div className="flex items-center gap-[.5vw]">
              <input
                type="color"
                value={bottomColor || "#ffffff"}
                onChange={(e) => setBottomColor(e.target.value)}
                className="w-[4vw] h-[2.5vw] rounded-lg cursor-pointer border-gray-300 hover:border-indigo-500"
              />
              <span className="text-[.8vw] text-gray-600 font-mono">{bottomColor}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300"></div>

        <div>
          <label className="block text-[1vw] font-bold text-gray-700 mb-[0.8vw]">
            Label Design
          </label>

          <button
            onClick={() => setCurrentView("label")}
            className="w-full py-[0.8vw] bg-blue-600 text-white rounded-[0.5vw] text-[1.1vw] font-bold shadow-md hover:shadow-lg hover:bg-blue-700 cursor-pointer transition-all"
          >
             Customize Your Label
          </button>

          {/* Active Label Indicator */}
          {customLabelTexture && (
            <div className="mt-[0.8vw] bg-green-50 border border-green-200 p-[0.5vw] rounded flex justify-between items-center">
              <span className="text-green-700 text-[0.8vw] font-bold">
                ✓ Custom Label Applied
              </span>
              <button
                onClick={() => setCustomLabelTexture(null)}
                className="text-blue-500 text-[0.8vw] hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-300"></div>

        {/* UPLOAD LOGO */}
        <div>
          <label className="block text-[1vw] font-bold text-gray-700 mb-[1vw]">
            Upload Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLabelUpload}
            className="block w-full text-[.8vw] text-gray-600
              file:mr-[1vw] file:py-[.5vw] file:px-[1vw]
              file:rounded-[.5vw] file:border-0
              file:text-[.8vw] file:font-semibold
              file:bg-indigo-600 file:text-white
              hover:file:bg-indigo-700 cursor-pointer"
          />
          {labelUrl && (
            <p className="text-[.8vw] text-green-600 mt-[.5vw]">✓ Logo uploaded</p>
          )}
        </div>

        {/* DEFAULT LOGOS SECTION */}
        <div>
          <label className="block text-[1vw] font-bold text-gray-700 mb-[0.8vw]">
            Or Choose Default Logo
          </label>
          <div className="grid grid-cols-2 gap-[0.8vw]">
            {defaultLogos.map((logo) => (
              <button
                key={logo.id}
                onClick={() => handleDefaultLogoSelect(logo.src)}
                className={`h-[5vw] border-2 rounded-[0.5vw] overflow-hidden transition-all hover:scale-105 ${
                  labelUrl === logo.src
                    ? "border-blue-600 shadow-lg"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="w-full h-full object-contain p-[0.5vw] bg-white"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - MODEL VIEWER */}
      <div className="flex-1 mt-[3.5vw] bg-gray-200 rounded-[.5vw] shadow-lg overflow-hidden relative model-viewer-container">
        <model-viewer
          ref={modelRef}
          src={displayModel}
          alt="Container"
          camera-controls
          shadow-intensity="1"
          shadow-softness="1"
          exposure="1"
          tone-mapping="commerce"
          crossorigin="anonymous"
          
          style={{ width: "100%", height: "100%", backgroundColor: bgColor }}
        />

        {/* Bottom Right - Background Color Picker */}
        <div className="absolute bottom-[2vw] right-[2vw] bg-white rounded-[0.8vw] shadow-lg p-[1.2vw] flex items-center gap-[0.6vw] z-50">
          <label className="text-[0.9vw] font-bold text-gray-700">BG</label>
          <div className="flex flex-col">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-[3vw] h-[2.5vw] rounded-[0.5vw] cursor-pointer "
            />
            <span className="text-[0.75vw] text-gray-500 font-mono text-center">
              {bgColor}
            </span>
          </div>
        </div>
      </div>

      {/* Top Right - Export Button with Dropdown */}
      <div className="absolute top-[1vw] right-[1vw] z-50">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="px-[1.5vw] py-[0.6vw] bg-blue-500 text-white rounded-[0.5vw] text-[0.95vw] font-bold shadow-lg hover:shadow-xl hover:bg-blue-700 cursor-pointer transition-all flex items-center gap-[0.5vw]"
        >
           Export
          <span className={`transition-transform ${showExportMenu ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>

        {/* Dropdown Menu */}
        {showExportMenu && (
          <div className="absolute top-[2.8vw] right-0 bg-white rounded-[0.5vw] shadow-xl border border-gray-300 overflow-hidden z-50">
            <button
              onClick={handleExportPDF}
              className="w-full px-[1.2vw] py-[0.6vw] text-left text-[0.9vw] text-gray-700 font-semibold hover:bg-red-50 hover:text-red-700 transition-all flex items-center gap-[0.5vw] cursor-pointer"
            >
               PDF
            </button>
            <div className="h-px bg-gray-200"></div>
            <button
              onClick={handleExportGLB}
              className="w-full px-[1.2vw] py-[0.6vw] text-left text-[0.9vw] text-gray-700 font-semibold hover:bg-purple-50 hover:text-purple-700 transition-all flex items-center gap-[0.5vw] cursor-pointer"
            >
               GLB
            </button>
          </div>
        )}
      </div>
    </div>
  );
}






































// import { useRef, useState, useEffect } from "react";
// import model120 from "../assets/models-with-logo/120ml_round.glb";
// import model250 from "../assets/models-with-logo/250ml_round.glb";
// import model500 from "../assets/models-with-logo/500ml_round.glb";
// import model750 from "../assets/models-with-logo/750ml_round.glb";
// import model1000 from "../assets/models-with-logo/50ml_hinged_container.glb";

// import model120A from "../assets/models/120ml_round.glb";
// import model250A from "../assets/models/250ml_round.glb";
// import model500A from "../assets/models/500ml_round.glb";
// import model750A from "../assets/models/750ml_round.glb";
// import model1000A from "../assets/models/50ml_hinged_container.glb";

// import jsPDF from "jspdf";
// import Label from "./Label";

// export default function ModelViewer() {
//   const modelRef = useRef(null);
//   const [labelUrl, setLabelUrl] = useState("");
//   const [topColor, setTopColor] = useState(null);
//   const [bottomColor, setBottomColor] = useState(null);
//   const [modelLoaded, setModelLoaded] = useState(false);
//   const [selectedModel, setSelectedModel] = useState(model120);
//   const [bgColor, setBgColor] = useState("#e5e7eb");
//   const [displayModel, setDisplayModel] = useState(model120);
//   const [currentView, setCurrentView] = useState("home");
//   const [customLabelTexture, setCustomLabelTexture] = useState(null);
//   const [openCategory, setOpenCategory] = useState(null);
//   const [showExportMenu, setShowExportMenu] = useState(false);

//   // Model mapping: with-logo and without-logo versions
//   const modelMap = {
//     [model120]: { withLogo: model120, withoutLogo: model120A },
//     [model250]: { withLogo: model250, withoutLogo: model250A },
//     [model500]: { withLogo: model500, withoutLogo: model500A },
//     [model750]: { withLogo: model750, withoutLogo: model750A },
//     [model1000]: { withLogo: model1000, withoutLogo: model1000A },
//   };

//   // Get current model variant (with or without logo)
//   const getCurrentModel = () => {
//     const mapping = modelMap[selectedModel];
//     if (!mapping) return selectedModel;
//     // Use without-logo model when custom label texture is applied
//     return customLabelTexture ? mapping.withoutLogo : mapping.withLogo;
//   };

//   // Update displayModel whenever the current model changes
//   useEffect(() => {
//     const newModel = getCurrentModel();
//     setDisplayModel(newModel);
//     setModelLoaded(false);
//   }, [selectedModel, customLabelTexture]);

//   const models = [
//     { name: "120ml Round", path: model120 },
//     { name: "250ml Round", path: model250 },
//     { name: "350ml Round", path: model500 },
//     { name: "500ml Round", path: model750 },
//     { name: "750ml Round", path: model1000 },
//   ];

//   const categories = [
//     {
//       id: "round",
//       title: "ROUND (7)",
//       items: [
//         { id: "100ml", label: "100 ml", path: model120 },
//         { id: "250ml", label: "250 ml", path: model250 },
//         { id: "500gm", label: "500 gm", path: model500 },
//         { id: "500ml", label: "500 ml", path: model500 },
//         { id: "750ml", label: "750 ml", path: model750 },
//         { id: "750ml_tall", label: "750 ml (Tall)", path: model750 },
//         { id: "1000ml", label: "1000 ml", path: model1000 },
//       ],
//     },
//     {
//       id: "round_bevel",
//       title: "ROUND BEVEL (4)",
//       items: [
//         { id: "300ml_rb", label: "300 ml", path: model120 },
//         { id: "500ml_rb", label: "500 ml", path: model250 },
//         { id: "750ml_rb", label: "750 ml", path: model750 },
//         { id: "1000ml_rb", label: "1000 ml", path: model1000 },
//       ],
//     },
//     {
//       id: "oval",
//       title: "OVAL (3)",
//       items: [
//         { id: "250ml_oval", label: "250 ml", path: model120 },
//         { id: "500ml_oval", label: "500 ml", path: model500 },
//         { id: "1000ml_oval", label: "1000 ml", path: model750 },
//       ],
//     },
//     {
//       id: "taper_evident",
//       title: "TAPER EVIDENT (4)",
//       items: [
//         { id: "250ml_te", label: "250 ml", path: model120 },
//         { id: "b500ml_te", label: "B-500 ml", path: model250 },
//         { id: "500ml_te", label: "500 ml", path: model500 },
//         { id: "1000ml_te", label: "1000 ml", path: model750 },
//       ],
//     },
//     {
//       id: "sweet_box",
//       title: "SWEET BOX (5)",
//       items: [
//         { id: "250_tr", label: "250 TRANSPARENT", path: model120 },
//         { id: "250_premium", label: "250 PREMIUM (GREEN)", path: model250 },
//         { id: "750_tr", label: "750 TRANSPARENT", path: model750 },
//         { id: "750_red", label: "SAS TRADITIONAL (RED) ~750 ml", path: model1000 },
//         { id: "1000_blue", label: "SHRI DHIVYAM (BLUE) ~1000 ml", path: model1000 },
//       ],
//     },
//   ];

//   // Helper: Convert hex to RGB normalized (0-1)
//   const hexToRgba = (hex) => {
//     const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//     if (!result) return [1, 1, 1, 1];
//     return [
//       parseInt(result[1], 16) / 255,
//       parseInt(result[2], 16) / 255,
//       parseInt(result[3], 16) / 255,
//       1.0,
//     ];
//   };

//   // Apply color to material with proper PBR settings
//   const applyColorToMaterial = (material, hexColor) => {
//     try {
//       const rgba = hexToRgba(hexColor);
//       rgba[3] = 1.0;

//       material.pbrMetallicRoughness.setBaseColorFactor(rgba);
//       material.pbrMetallicRoughness.setMetallicFactor(0.0);
//       material.pbrMetallicRoughness.setRoughnessFactor(0.0);

//       console.log(`✓ Applied ${hexColor} (Solid/Shiny) to "${material.name}"`);
//     } catch (error) {
//       console.error(`Error applying color to ${material.name}:`, error);
//     }
//   };

//   // Wait for model to load
//   useEffect(() => {
//     const mv = modelRef.current;
//     if (!mv) return;

//     const handleLoad = () => {
//       console.log("Model loaded");
//       setModelLoaded(true);

//       const materials = mv.model?.materials;
//       if (materials) {
//         console.log("Available materials:", materials.map((m) => m.name));
//         materials.forEach((m, i) => {
//           console.log(`Material[${i}]: "${m.name}"`);
//         });
//       }
//     };

//     mv.addEventListener("load", handleLoad);
//     return () => mv.removeEventListener("load", handleLoad);
//   }, [selectedModel]);

//   // Apply TOP color
//   useEffect(() => {
//     if (!modelLoaded || !modelRef.current || !topColor) return;

//     const mv = modelRef.current;
//     const materials = mv.model?.materials;
//     if (!materials) return;

//     materials.forEach((material) => {
//       const name = material.name.toLowerCase();
//       if (name.includes("lid") || name.includes("top")) {
//         applyColorToMaterial(material, topColor);
//       }
//     });
//   }, [topColor, modelLoaded, displayModel]);

//   // Apply BOTTOM color
//   useEffect(() => {
//     if (!modelLoaded || !modelRef.current || !bottomColor) return;

//     const mv = modelRef.current;
//     const materials = mv.model?.materials;
//     if (!materials) return;

//     materials.forEach((material) => {
//       const name = material.name.toLowerCase();

//       if (name.includes("logo")) return;
//       if (name === "texture_area" && customLabelTexture) return;

//       if (
//         name.includes("tub") ||
//         name.includes("bottom") ||
//         name === "texture_area"
//       ) {
//         applyColorToMaterial(material, bottomColor);
//       }
//     });
//   }, [bottomColor, modelLoaded, customLabelTexture, displayModel]);

//   // Apply Custom Label to "texture_area"
//   useEffect(() => {
//     if (!customLabelTexture || !modelLoaded || !modelRef.current) return;

//     const mv = modelRef.current;

//     (async () => {
//       try {
//         const texture = await mv.createTexture(customLabelTexture);
//         const targetMat = mv.model?.materials.find((m) => m.name === "texture_area");

//         if (targetMat) {
//           targetMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
//           targetMat.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
//           targetMat.pbrMetallicRoughness.setMetallicFactor(0.0);
//           targetMat.pbrMetallicRoughness.setRoughnessFactor(0.5);

//           console.log("✓ Texture applied to texture_area only");
//         }
//       } catch (e) {
//         console.error("Error applying texture:", e);
//       }
//     })();
//   }, [customLabelTexture, modelLoaded, displayModel]);

//   // Apply uploaded logo to bottom logo material
//   useEffect(() => {
//     if (!labelUrl || !modelLoaded || !modelRef.current) return;

//     const mv = modelRef.current;
//     const materials = mv.model?.materials;

//     (async () => {
//       try {
//         const texture = await mv.createTexture(labelUrl);
//         if (!texture) {
//           console.error("Texture creation failed");
//           return;
//         }

//         const targetMaterial = materials.find((mat) => mat.name === "bottomlogo");
//         if (!targetMaterial) {
//           console.warn("Material bottomlogo not found in model");
//           return;
//         }

//         console.log("Applying logo to", targetMaterial.name);
//         targetMaterial.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
//         targetMaterial.pbrMetallicRoughness.setMetallicFactor(0.0);
//         targetMaterial.pbrMetallicRoughness.setRoughnessFactor(0.0);

//         console.log("Logo applied successfully!");
//       } catch (err) {
//         console.error("Error applying logo texture:", err);
//       }
//     })();
//   }, [labelUrl, modelLoaded]);

//   const handleLabelUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setLabelUrl(event.target.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleExportGLB = async () => {
//     const mv = modelRef.current;
//     if (!mv) return;
//     const blob = await mv.exportScene();
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     const modelName = models.find((m) => m.path === selectedModel)?.name || "model";
//     a.download = `${modelName}.glb`;
//     a.click();
//     setShowExportMenu(false);
//   };

//   const handleExportPDF = async () => {
//     try {
//       const mv = modelRef.current;
//       if (!mv) {
//         console.error("Model viewer not available");
//         alert("Model not ready. Please wait until the model loads.");
//         return;
//       }

//       await new Promise((resolve) => setTimeout(resolve, 100));

//       let dataUrl = null;

//       if (typeof mv.toDataURL === "function") {
//         dataUrl = await mv.toDataURL("image/png", 1.0);
//       } else if (typeof mv.captureScreenshot === "function") {
//         const blob = await mv.captureScreenshot();
//         dataUrl = await new Promise((resolve) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result);
//           reader.readAsDataURL(blob);
//         });
//       } else {
//         const canvas = mv.shadowRoot?.querySelector("canvas");
//         if (canvas) {
//           dataUrl = canvas.toDataURL("image/png");
//         } else {
//           throw new Error("Cannot find WebGL canvas to export");
//         }
//       }

//       if (!dataUrl || !dataUrl.startsWith("data:")) {
//         throw new Error("Failed to capture model screenshot");
//       }

//       const pdf = new jsPDF("l", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();

//       const img = new Image();
//       img.src = dataUrl;

//       await new Promise((resolve, reject) => {
//         img.onload = resolve;
//         img.onerror = reject;
//       });

//       const imgAspectRatio = img.width / img.height;
//       const pdfAspectRatio = pdfWidth / pdfHeight;

//       let finalWidth, finalHeight, xOffset, yOffset;

//       if (imgAspectRatio > pdfAspectRatio) {
//         finalWidth = pdfWidth;
//         finalHeight = pdfWidth / imgAspectRatio;
//         xOffset = 0;
//         yOffset = (pdfHeight - finalHeight) / 2;
//       } else {
//         finalHeight = pdfHeight;
//         finalWidth = pdfHeight * imgAspectRatio;
//         yOffset = 0;
//         xOffset = (pdfWidth - finalWidth) / 2;
//       }

//       pdf.addImage(dataUrl, "PNG", xOffset, yOffset, finalWidth, finalHeight);

//       const modelName = models.find((m) => m.path === selectedModel)?.name || "model";
//       pdf.save(`${modelName}.pdf`);

//       setShowExportMenu(false);
//       console.log("PDF exported successfully with correct aspect ratio!");
//     } catch (err) {
//       console.error("Error exporting PDF:", err);
//       alert(`Failed to export PDF: ${err.message}. Try again after the model fully loads.`);
//     }
//   };

//   const handleModelChange = (modelPath) => {
//     setSelectedModel(modelPath);
//     setModelLoaded(false);
//   };

//   if (currentView === "label") {
//     return (
//       <Label
//         onBack={() => setCurrentView("home")}
//         onApply={(generatedImage) => {
//           setCustomLabelTexture(generatedImage);
//           setCurrentView("home");
//         }}
//       />
//     );
//   }

//   return (
//     <div className="flex gap-[2vw] h-screen bg-gray-50 p-[1vw]">
//       {/* LEFT SIDE - CONTROLS */}
//       <div className="w-[25vw] bg-white rounded-[1vw] shadow-lg p-[1.5vw] overflow-y-auto space-y-[1vw]">
//         {/* MODELS / CATEGORIES SECTION */}
//         <div>
//           <h3 className="text-[1.5vw] font-bold text-gray-800 mb-[.4vw]">
//             Select Container Type
//           </h3>

//           {categories.map((cat) => {
//             const isOpen = openCategory === cat.id;
//             return (
//               <div key={cat.id} className="mb-[0.2vw]">
//                 <button
//                   onClick={() => setOpenCategory(isOpen ? null : cat.id)}
//                   className="w-full flex items-center justify-between px-[1vw] py-[.5vw] text-[1vw] rounded-[.5vw] font-medium bg-[#1fa4dd] text-white hover:bg-gray-400 hover:text-black focus:outline-none cursor-pointer"
//                   aria-expanded={isOpen}
//                   aria-controls={`cat-${cat.id}`}
//                 >
//                   <span>{cat.title}</span>
//                   <span className="text-[1vw] text-white">{isOpen ? "▾" : "▸"}</span>
//                 </button>

//                 <div
//                   id={`cat-${cat.id}`}
//                   className={`mt-[.3vw] ml-[2vw] transition-all overflow-hidden ${
//                     isOpen ? "max-h-[50vw]" : "max-h-0"
//                   } `}
//                   style={{ transition: "max-height 240ms ease" }}
//                 >
//                   <div className="space-y-[.2vw] mt-[.2vw]">
//                     {cat.items.map((item) => {
//                       const isSelected = selectedModel === item.path;
//                       return (
//                         <button
//                           key={item.id}
//                           onClick={() => {
//                             handleModelChange(item.path);
//                             setOpenCategory(cat.id);
//                           }}
//                           className={`w-full text-[1vw] text-left px-[1vw] py-[.5vw] rounded-[.5vw] cursor-pointer hover:bg-gray-200 hover:text-black font-medium transition-all ${
//                             isSelected
//                               ? "bg-indigo-600 text-white shadow-md"
//                               : "bg-white text-gray-700 hover:bg-gray-50"
//                           }`}
//                         >
//                           {item.label}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div className="border-t border-gray-300"></div>

//         <div className="flex gap-[3vw]">
//           {/* TOP COLOR */}
//           <div>
//             <label className="block text-[1vw] font-bold text-gray-700 mb-[1vw]">
//               Top Lid Color
//             </label>
//             <div className="flex items-center gap-[.5vw] ">
//               <input
//                 type="color"
//                 value={topColor || "#ffffff"}
//                 onChange={(e) => setTopColor(e.target.value)}
//                 className="w-[4vw] h-[2.5vw] rounded-[.5vw] cursor-pointer border-gray-300 hover:border-indigo-500"
//               />
//               <span className="text-[.8vw] text-gray-600 font-mono">{topColor}</span>
//             </div>
//           </div>

//           {/* BOTTOM COLOR */}
//           <div>
//             <label className="block text-[1vw] font-bold text-gray-700 mb-[1vw]">
//               Bottom Tub Color
//             </label>
//             <div className="flex items-center gap-[.5vw]">
//               <input
//                 type="color"
//                 value={bottomColor || "#ffffff"}
//                 onChange={(e) => setBottomColor(e.target.value)}
//                 className="w-[4vw] h-[2.5vw] rounded-lg cursor-pointer border-gray-300 hover:border-indigo-500"
//               />
//               <span className="text-[.8vw] text-gray-600 font-mono">{bottomColor}</span>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-gray-300"></div>

//         <div>
//           <label className="block text-[1vw] font-bold text-gray-700 mb-[0.8vw]">
//             Label Design
//           </label>

//           <button
//             onClick={() => setCurrentView("label")}
//             className="w-full py-[0.8vw] bg-blue-600 text-white rounded-[0.5vw] text-[1.1vw] font-bold shadow-md hover:shadow-lg hover:bg-blue-700 cursor-pointer transition-all"
//           >
//             Customize Your Label
//           </button>

//           {/* Active Label Indicator */}
//           {customLabelTexture && (
//             <div className="mt-[0.8vw] bg-green-50 border border-green-200 p-[0.5vw] rounded flex justify-between items-center">
//               <span className="text-green-700 text-[0.8vw] font-bold">
//                 ✓ Custom Label Applied
//               </span>
//               <button
//                 onClick={() => setCustomLabelTexture(null)}
//                 className="text-blue-500 text-[0.8vw] hover:underline cursor-pointer"
//               >
//                 Remove
//               </button>
//             </div>
//           )}
//         </div>

//         {/* UPLOAD LOGO */}
//         <div>
//           <label className="block text-[1vw] font-bold text-gray-700 mb-[1vw]">
//             Upload Logo
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleLabelUpload}
//             className="block w-full text-[.8vw] text-gray-600
//               file:mr-[1vw] file:py-[.5vw] file:px-[1vw]
//               file:rounded-[.5vw] file:border-0
//               file:text-[.8vw] file:font-semibold
//               file:bg-indigo-600 file:text-white
//               hover:file:bg-indigo-700 cursor-pointer"
//           />
//           {labelUrl && (
//             <p className="text-[.8vw] text-green-600 mt-[.5vw]">✓ Logo uploaded</p>
//           )}
//         </div>
//       </div>

//       {/* RIGHT SIDE - MODEL VIEWER */}
//       <div className="flex-1 mt-[3.5vw] bg-gray-200 rounded-[.5vw] shadow-lg overflow-hidden relative model-viewer-container">
//         <model-viewer
//           ref={modelRef}
//           src={displayModel}
//           alt="Container"
//           camera-controls
//           shadow-intensity="1"
//           shadow-softness="1"
//           exposure="1"
//           tone-mapping="commerce"
//           crossorigin="anonymous"
//           style={{ width: "100%", height: "100%", backgroundColor: bgColor }}
//         />

//         {/* Bottom Right - Background Color Picker */}
//         <div className="absolute bottom-[2vw] right-[2vw] bg-white rounded-[0.8vw] shadow-lg p-[1.2vw] flex items-center gap-[0.6vw] z-50">
//           <label className="text-[0.9vw] font-bold text-gray-700">BG</label>
//           <div className="flex flex-col">
//             <input
//               type="color"
//               value={bgColor}
//               onChange={(e) => setBgColor(e.target.value)}
//               className="w-[3vw] h-[2.5vw] rounded-[0.5vw] cursor-pointer "
//             />
//             <span className="text-[0.75vw] text-gray-500 font-mono text-center">
//               {bgColor}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Top Right - Export Button with Dropdown */}
//       <div className="absolute top-[1vw] right-[1vw] z-50">
//         <button
//           onClick={() => setShowExportMenu(!showExportMenu)}
//           className="px-[1.5vw] py-[0.6vw] bg-blue-500 text-white rounded-[0.5vw] text-[0.95vw] font-bold shadow-lg hover:shadow-xl hover:bg-blue-700 cursor-pointer transition-all flex items-center gap-[0.5vw]"
//         >
//            Export
//           <span className={`transition-transform ${showExportMenu ? "rotate-180" : ""}`}>
//             ▼
//           </span>
//         </button>

//         {/* Dropdown Menu */}
//         {showExportMenu && (
//           <div className="absolute top-[2.8vw] right-0 bg-white rounded-[0.5vw] shadow-xl border border-gray-300 overflow-hidden z-50">
//             <button
//               onClick={handleExportPDF}
//               className="w-full px-[1.2vw] py-[0.6vw] text-left text-[0.9vw] text-gray-700 font-semibold hover:bg-red-50 hover:text-red-700 transition-all flex items-center gap-[0.5vw] cursor-pointer"
//             >
//                PDF
//             </button>
//             <div className="h-px bg-gray-200"></div>
//             <button
//               onClick={handleExportGLB}
//               className="w-full px-[1.2vw] py-[0.6vw] text-left text-[0.9vw] text-gray-700 font-semibold hover:bg-purple-50 hover:text-purple-700 transition-all flex items-center gap-[0.5vw] cursor-pointer"
//             >
//                GLB
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



























// import { useRef, useState, useEffect } from "react";
// import model120 from "../assets/models-with-logo/120ml_round.glb";
// import model250 from "../assets/models-with-logo/250ml_round.glb";
// import model500 from "../assets/models-with-logo/500ml_round.glb";
// import model750 from "../assets/models-with-logo/750ml_round.glb";
// import model1000 from "../assets/models-with-logo/50ml_hinged_container.glb";

// import model120A from "../assets/models/120ml_round.glb";
// import model250A from "../assets/models/250ml_round.glb";
// import model500A from "../assets/models/500ml_round.glb";
// import model750A from "../assets/models/750ml_round.glb";
// import model1000A from "../assets/models/50ml_hinged_container.glb";



// import roundbrown from "../assets/patterns/round_brown.png";
// import roundgreen from "../assets/patterns/round_green.png";
// import roundmix from "../assets/patterns/round_mix.png";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import Label from "./Label"; // Assuming Label.jsx is in the same folder


// export default function ModelViewer() {
//   const modelRef = useRef(null);
//   const [labelUrl, setLabelUrl] = useState("");
//   const [topColor, setTopColor] = useState(null);
//   const [bottomColor, setBottomColor] = useState(null);
//   const [modelLoaded, setModelLoaded] = useState(false);
//   const [selectedModel, setSelectedModel] = useState(model120);
//   const [bgColor, setBgColor] = useState("#e5e7eb"); // Background color state
//   const [displayModel, setDisplayModel] = useState(model120); // Track actual model being displayed
//   const [currentView, setCurrentView] = useState("home"); // View State: 'home' or 'label'
//   const [customLabelTexture, setCustomLabelTexture] = useState(null); // Texture State: Stores the image generated from the Label page
//   const [openCategory, setOpenCategory] = useState(null);
//   const [selectedPattern, setSelectedPattern] = useState(null);
//   const [showExportMenu, setShowExportMenu] = useState(false);

//   // Model mapping: with-logo and without-logo versions
//   const modelMap = {
//     [model120]: { withLogo: model120, withoutLogo: model120A },
//     [model250]: { withLogo: model250, withoutLogo: model250A },
//     [model500]: { withLogo: model500, withoutLogo: model500A },
//     [model750]: { withLogo: model750, withoutLogo: model750A },
//     [model1000]: { withLogo: model1000, withoutLogo: model1000A },
//   };

//   // Get current model variant (with or without logo)
//   const getCurrentModel = () => {
//     const mapping = modelMap[selectedModel];
//     if (!mapping) return selectedModel;
//     // Use without-logo model when pattern is active
//     return selectedPattern || customLabelTexture ? mapping.withoutLogo : mapping.withLogo;
//   };

//   // Update displayModel whenever the current model changes
//   useEffect(() => {
//     const newModel = getCurrentModel();
//     setDisplayModel(newModel);
//     setModelLoaded(false);
//   }, [selectedModel, selectedPattern, customLabelTexture]);

//   const models = [
//     { name: "120ml Round", path: model120 },
//     { name: "250ml Round", path: model250 },
//     { name: "350ml Round", path: model500 },
//     { name: "500ml Round", path: model750 },
//     { name: "750ml Round", path: model1000 },
//   ];

//   const categories = [
//     {
//       id: "round",
//       title: "ROUND (7)",
//       items: [
//         { id: "100ml", label: "100 ml", path: model120 },
//         { id: "250ml", label: "250 ml", path: model250 },
//         { id: "500gm", label: "500 gm", path: model500 },
//         { id: "500ml", label: "500 ml", path: model500 },
//         { id: "750ml", label: "750 ml", path: model750 },
//         { id: "750ml_tall", label: "750 ml (Tall)", path: model750 },
//         { id: "1000ml", label: "1000 ml", path: model1000 },
//       ],
//     },
//     {
//       id: "round_bevel",
//       title: "ROUND BEVEL (4)",
//       items: [
//         { id: "300ml_rb", label: "300 ml", path: model120 },
//         { id: "500ml_rb", label: "500 ml", path: model250 },
//         { id: "750ml_rb", label: "750 ml", path: model750 },
//         { id: "1000ml_rb", label: "1000 ml", path: model1000 },
//       ],
//     },
//     {
//       id: "oval",
//       title: "OVAL (3)",
//       items: [
//         { id: "250ml_oval", label: "250 ml", path: model120 },
//         { id: "500ml_oval", label: "500 ml", path: model500 },
//         { id: "1000ml_oval", label: "1000 ml", path: model750 },
//       ],
//     },
//     {
//       id: "taper_evident",
//       title: "TAPER EVIDENT (4)",
//       items: [
//         { id: "250ml_te", label: "250 ml", path: model120 },
//         { id: "b500ml_te", label: "B-500 ml", path: model250 },
//         { id: "500ml_te", label: "500 ml", path: model500 },
//         { id: "1000ml_te", label: "1000 ml", path: model750 },
//       ],
//     },
//     {
//       id: "sweet_box",
//       title: "SWEET BOX (5)",
//       items: [
//         { id: "250_tr", label: "250 TRANSPARENT", path: model120 },
//         { id: "250_premium", label: "250 PREMIUM (GREEN)", path: model250 },
//         { id: "750_tr", label: "750 TRANSPARENT", path: model750 },
//         { id: "750_red", label: "SAS TRADITIONAL (RED) ~750 ml", path: model1000 },
//         { id: "1000_blue", label: "SHRI DHIVYAM (BLUE) ~1000 ml", path: model1000 },
//       ],
//     },
//   ];

//   const patterns = [roundbrown, roundgreen, roundmix];

//   // Helper: Convert hex to RGB normalized (0-1)
//   const hexToRgba = (hex) => {
//     const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//     if (!result) return [1, 1, 1, 1];
//     return [
//       parseInt(result[1], 16) / 255,
//       parseInt(result[2], 16) / 255,
//       parseInt(result[3], 16) / 255,
//       1.0,
//     ];
//   };

//   // ✅ FIXED: Helper function to apply color with proper PBR settings
//  // ✅ FIXED: Only change color, do not overwrite shine/glass settings
// // ✅ FIXED: Applies Color + Forces Solid, Shiny Plastic look
// const applyColorToMaterial = (material, hexColor) => {
//   try {
//     const rgba = hexToRgba(hexColor);
    
//     // 1. FORCE OPAQUE (Alpha = 1) as requested
//     rgba[3] = 1.0; 

//     // Apply the color
//     material.pbrMetallicRoughness.setBaseColorFactor(rgba);
    
//     // 2. FORCE METALLIC TO 0 (Plastic look)
//     material.pbrMetallicRoughness.setMetallicFactor(0.0);
    
//     // 3. FORCE ROUGHNESS TO 0 (Very Shiny/Glossy)
//     material.pbrMetallicRoughness.setRoughnessFactor(0.0);

//     console.log(`✓ Applied ${hexColor} (Solid/Shiny) to "${material.name}"`);
//   } catch (error) {
//     console.error(`Error applying color to ${material.name}:`, error);
//   }
// };

//   // Wait for model to load
//   useEffect(() => {
//     const mv = modelRef.current;
//     if (!mv) return;

//     const handleLoad = () => {
//       console.log("Model loaded");
//       setModelLoaded(true);

//       // Log available materials (for debugging)
//       const materials = mv.model?.materials;
//       if (materials) {
//         console.log(
//           "Available materials:",
//           materials.map((m) => m.name)
//         );
//         materials.forEach((m, i) => {
//           console.log(`Material[${i}]: "${m.name}"`);
//         });
//       }
//     };

//     mv.addEventListener("load", handleLoad);
//     return () => mv.removeEventListener("load", handleLoad);
//   }, [selectedModel]); // Added selectedModel dependency

 


// // Apply TOP color
// useEffect(() => {
//   // 🛑 STOP if model isn't loaded OR if user hasn't picked a color yet
//   if (!modelLoaded || !modelRef.current || !topColor) return;

//   const mv = modelRef.current;
//   const materials = mv.model?.materials;
//   if (!materials) return;

//   materials.forEach((material) => {
//     const name = material.name.toLowerCase();
//     if (name.includes("lid") || name.includes("top")) {
//       // Apply the solid/shiny color
//       applyColorToMaterial(material, topColor); 
//     }
//   });
// }, [topColor, modelLoaded, displayModel]);





// // Apply BOTTOM color
// useEffect(() => {
//   // 🛑 STOP if model isn't loaded OR if user hasn't picked a color yet
//   if (!modelLoaded || !modelRef.current || !bottomColor) return;

//   const mv = modelRef.current;
//   const materials = mv.model?.materials;
//   if (!materials) return;

//   materials.forEach((material) => {
//     const name = material.name.toLowerCase();
    
//     // NEVER apply bottom color to logo materials
//     if (name.includes("logo")) return;
    
//     // Skip texture area if pattern is applied
//     if (name === "texture_area" && (selectedPattern || customLabelTexture)) return; 

//     if (
//       name.includes("tub") ||
//       name.includes("bottom") ||
//       name === "texture_area"
//     ) {
//       applyColorToMaterial(material, bottomColor); 
//     }
//   });
// }, [bottomColor, modelLoaded, selectedPattern, customLabelTexture, displayModel]);



// // Apply Pattern OR Custom Label to "texture_area"
// useEffect(() => {
//   // Determine which texture to use (Custom takes priority, or fallback to Pattern)
//   const activeTexture = customLabelTexture || selectedPattern;

//   if (!activeTexture || !modelLoaded || !modelRef.current) return;

//   const mv = modelRef.current;
  
//   (async () => {
//     try {
//       const texture = await mv.createTexture(activeTexture);
      
//       // Find the specific material area for the label (only in texture_area)
//       const targetMat = mv.model?.materials.find(m => m.name === "texture_area");
      
//       if (targetMat) {
//           // 1. Reset base color to white so the image colors show correctly
//           targetMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]); 
          
//           // 2. Apply the image ONLY to texture_area
//           targetMat.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
          
//           // 3. Set material properties for a printed label look (Semi-gloss)
//           targetMat.pbrMetallicRoughness.setMetallicFactor(0.0);
//           targetMat.pbrMetallicRoughness.setRoughnessFactor(0.5);
          
//           console.log("✓ Texture applied to texture_area only");
//       }
//     } catch (e) { 
//         console.error("Error applying texture:", e); 
//     }
//   })();
// }, [selectedPattern, customLabelTexture, modelLoaded, displayModel]);




//   const handleLabelUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setLabelUrl(event.target.result);
//       // Clear custom label texture to avoid conflicts
//       setCustomLabelTexture(null);
//     };
//     reader.readAsDataURL(file);
//   };

// const handleExportGLB = async () => {
//     const mv = modelRef.current;
//     if(!mv) return;
//     const blob = await mv.exportScene();
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     const modelName = models.find(m => m.path === selectedModel)?.name || "model";
//     a.download = `${modelName}.glb`;
//     a.click();
//     setShowExportMenu(false);
// };

// const handleExportPDF = async () => {
//   try {
//     const mv = modelRef.current;
//     if (!mv) {
//       console.error("Model viewer not available");
//       alert("Model not ready. Please wait until the model loads.");
//       return;
//     }

//     // Wait a bit to ensure model is fully rendered
//     await new Promise(resolve => setTimeout(resolve, 100));

//     // Try to get screenshot from model-viewer
//     let dataUrl = null;
    
//     if (typeof mv.toDataURL === 'function') {
//       dataUrl = await mv.toDataURL('image/png', 1.0);
//     } else if (typeof mv.captureScreenshot === 'function') {
//       const blob = await mv.captureScreenshot();
//       dataUrl = await new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result);
//         reader.readAsDataURL(blob);
//       });
//     } else {
//       // Fallback: try to capture the internal canvas
//       const canvas = mv.shadowRoot?.querySelector('canvas');
//       if (canvas) {
//         dataUrl = canvas.toDataURL('image/png');
//       } else {
//         throw new Error("Cannot find WebGL canvas to export");
//       }
//     }

//     if (!dataUrl || !dataUrl.startsWith('data:')) {
//       throw new Error("Failed to capture model screenshot");
//     }

//     // Create the PDF
//     const pdf = new jsPDF('l', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();

//     // Load image to get its dimensions
//     const img = new Image();
//     img.src = dataUrl;
    
//     await new Promise((resolve, reject) => {
//       img.onload = resolve;
//       img.onerror = reject;
//     });

//     // Calculate aspect ratios
//     const imgAspectRatio = img.width / img.height;
//     const pdfAspectRatio = pdfWidth / pdfHeight;

//     let finalWidth, finalHeight, xOffset, yOffset;

//     // Fit image to PDF while maintaining aspect ratio
//     if (imgAspectRatio > pdfAspectRatio) {
//       // Image is wider than PDF - fit to width
//       finalWidth = pdfWidth;
//       finalHeight = pdfWidth / imgAspectRatio;
//       xOffset = 0;
//       yOffset = (pdfHeight - finalHeight) / 2; // Center vertically
//     } else {
//       // Image is taller than PDF - fit to height
//       finalHeight = pdfHeight;
//       finalWidth = pdfHeight * imgAspectRatio;
//       yOffset = 0;
//       xOffset = (pdfWidth - finalWidth) / 2; // Center horizontally
//     }

//     // Add the image with correct aspect ratio (centered)
//     pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, finalWidth, finalHeight);

//     // Get model name for filename
//     const modelName = models.find(m => m.path === selectedModel)?.name || 'model';
//     pdf.save(`${modelName}.pdf`);
    
//     setShowExportMenu(false);
//     console.log("PDF exported successfully with correct aspect ratio!");

//   } catch (err) {
//     console.error("Error exporting PDF:", err);
//     alert(`Failed to export PDF: ${err.message}. Try again after the model fully loads.`);
//   }
// };




//   // Apply label texture
// // Apply Pattern OR Custom Label to texturearea
// useEffect(() => {
//   const activeTexture = customLabelTexture || selectedPattern;
  
//   if (!activeTexture || !modelLoaded || !modelRef.current) {
//     return;
//   }

//   const mv = modelRef.current;

//   const applyTexture = async () => {
//     try {
//       console.log("Applying texture to model...", activeTexture.substring(0, 50));
      
//       // Create texture from the image data URL
//       const texture = await mv.createTexture(activeTexture);
      
//       if (!texture) {
//         console.error("Texture creation failed");
//         return;
//       }

//       // Get all materials
//       const materials = mv.model?.materials;
//       if (!materials) {
//         console.error("No materials found in model");
//         return;
//       }

//       // Log all material names for debugging
//       console.log("Available materials:", materials.map(m => m.name));

//       // Find the texture area material
//       const targetMat = materials.find(m => m.name === "texturearea");
      
//       if (!targetMat) {
//         console.error("Material 'texturearea' not found. Available materials:", materials.map(m => m.name));
//         // alert("This model doesn't have a 'texturearea' material. Check console for available materials.");
//         return;
//       }

//       console.log("Applying texture to:", targetMat.name);

//       // Reset base color to white so texture colors show correctly
//       targetMat.pbrMetallicRoughness.setBaseColorFactor(1, 1, 1, 1);

//       // Apply the texture
//       targetMat.pbrMetallicRoughness.baseColorTexture.setTexture(texture);

//       // Set material properties for printed label look
//       targetMat.pbrMetallicRoughness.setMetallicFactor(0.0);
//       targetMat.pbrMetallicRoughness.setRoughnessFactor(0.5);

//       console.log("✓ Texture applied successfully to texturearea!");
      
//       // Force a render update
//       mv.updateFraming();
//       mv.jumpCameraToGoal();

//     } catch (e) {
//       console.error("Error applying texture:", e);
//       alert(`Failed to apply label: ${e.message}`);
//     }
//   };

//   applyTexture();

// }, [selectedPattern, customLabelTexture, modelLoaded, displayModel]);


//   const handleModelChange = (modelPath) => {
//     setSelectedModel(modelPath);
//     setModelLoaded(false);
//     // Reset pattern when model changes
//     setSelectedPattern(null);
//   };

//   // ✅ RENDER LOGIC: Check currentView BEFORE returning JSX
//   if (currentView === "label") {
//     return (
//         <Label 
//             onBack={() => setCurrentView("home")} 
//             onApply={(generatedImage) => {
//                 setCustomLabelTexture(generatedImage);
//                 setSelectedPattern(null);
//                 setCurrentView("home");
//             }}
//         />
//     );
//   }

//   // Otherwise, return the main 3D viewer
//   return (
//     <div className="flex gap-[2vw] h-screen bg-gray-50 p-[1vw]">
//       {/* LEFT SIDE - CONTROLS */}
//       <div className="w-[25vw] bg-white rounded-[1vw] shadow-lg p-[1.5vw] overflow-y-auto space-y-[1vw]">
//         {/* MODELS / CATEGORIES SECTION */}
//         <div>
//           <h3 className="text-[1.5vw] font-bold text-gray-800 mb-[.4vw]">
//             Select Container Type
//           </h3>

//           {categories.map((cat) => {
//             const isOpen = openCategory === cat.id;
//             return (
//               <div key={cat.id} className="mb-[0.2vw]">
//                 {/* Category header */}
//                 <button
//                   onClick={() => setOpenCategory(isOpen ? null : cat.id)}
//                   className="w-full flex items-center justify-between px-[1vw] py-[.5vw] text-[1vw] rounded-[.5vw] font-medium bg-[#1fa4dd] text-white hover:bg-gray-400 hover:text-black focus:outline-none cursor-pointer"
//                   aria-expanded={isOpen}
//                   aria-controls={`cat-${cat.id}`}
//                 >
//                   <span>{cat.title}</span>
//                   <span className="text-[1vw] text-white">
//                     {isOpen ? "▾" : "▸"}
//                   </span>
//                 </button>

//                 {/* Category items (collapsible) */}
//                 <div
//                   id={`cat-${cat.id}`}
//                   className={`mt-[.3vw] ml-[2vw] transition-all overflow-hidden ${
//                     isOpen ? "max-h-[50vw]" : "max-h-0"
//                   } `}
//                   style={{ transition: "max-height 240ms ease" }}
//                 >
//                   <div className="space-y-[.2vw] mt-[.2vw]">
//                     {cat.items.map((item) => {
//                       const isSelected = selectedModel === item.path;
//                       return (
//                         <button
//                           key={item.id}
//                           onClick={() => {
//                             handleModelChange(item.path);
//                             setOpenCategory(cat.id);
//                           }}
//                           className={`w-full text-[1vw] text-left px-[1vw] py-[.5vw] rounded-[.5vw] cursor-pointer hover:bg-gray-200 hover:text-black font-medium transition-all ${
//                             isSelected
//                               ? "bg-indigo-600 text-white shadow-md"
//                               : "bg-white text-gray-700 hover:bg-gray-50"
//                           }`}
//                         >
//                           {item.label}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div className="border-t border-gray-300"></div>

//         <div className="flex gap-[3vw]">
//           {/* TOP COLOR */}
//           <div>
//             <label className="block text-[1vw] font-bold text-gray-700 mb-[1vw]">
//               Top Lid Color
//             </label>
//             <div className="flex items-center gap-[.5vw] ">
//               <input
//                 type="color"
//                    value={topColor || "#ffffff"} 
//                 onChange={(e) => setTopColor(e.target.value)}
//                 className="w-[4vw] h-[2.5vw] rounded-[.5vw] cursor-pointer border-gray-300 hover:border-indigo-500"
//               />
//               <span className="text-[.8vw] text-gray-600 font-mono">
//                 {topColor}
//               </span>
//             </div>
//           </div>

//           {/* BOTTOM COLOR */}
//           <div>
//             <label className="block text-[1vw] font-bold text-gray-700 mb-[1vw]">
//               Bottom Tub Color
//             </label>
//             <div className="flex items-center gap-[.5vw]">
//               <input
//                 type="color"
//                    value={bottomColor || "#ffffff"} 
//                 onChange={(e) => setBottomColor(e.target.value)}
//                 className="w-[4vw] h-[2.5vw] rounded-lg cursor-pointer border-gray-300 hover:border-indigo-500"
//               />
//               <span className="text-[.8vw] text-gray-600 font-mono">
//                 {bottomColor}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-gray-300"></div>

//         <div>
//             <label className="block text-[1vw] font-bold text-gray-700 mb-[0.8vw]">Label Design</label>
            
//             <button 
//                 onClick={() => setCurrentView("label")}
//                 className="w-full py-[0.8vw] bg-blue-600 text-white rounded-[0.5vw] text-[1.1vw] font-bold shadow-md hover:shadow-lg hover:bg-blue-700 cursor-pointer transition-all"
//             >
//                  Customize Your Label
//             </button>

//             {/* Active Label Indicator */}
//             {customLabelTexture && (
//                 <div className="mt-[0.8vw] bg-green-50 border border-green-200 p-[0.5vw] rounded flex justify-between items-center">
//                     <span className="text-green-700 text-[0.8vw] font-bold">✓ Custom Label Applied</span>
//                     <button onClick={() => setCustomLabelTexture(null)} className="text-blue-500 text-[0.8vw] hover:underline cursor-pointer">Remove</button>
//                 </div>
//             )}
//         </div>


//         <div className="mt-[1vw]">
//           <h3 className="text-[1vw] font-bold text-gray-700 mb-[0.5vw]">Or Choose Pattern</h3>
//           <div className="grid grid-cols-3 gap-[0.6vw]">
//             {patterns.map((pattern, i) => (
//               <button
//                 key={i}
//                 onClick={() => { setSelectedPattern(pattern); setCustomLabelTexture(null); }}
//                 className={`h-[3.5vw] border-2 rounded-[0.4vw] overflow-hidden transition-all ${
//                   selectedPattern === pattern
//                     ? "border-indigo-600 scale-105 shadow-md"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//               >
//                 <img
//                   src={pattern}
//                   alt="Pattern"
//                   className="w-full h-full object-cover"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>
        
//         {/* UPLOAD LOGO */}
//         <div>
//           <label className="block text-[1vw] font-bold text-gray-700 mb-[1vw]">
//             Upload Logo
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleLabelUpload}
//             className="block w-full text-[.8vw] text-gray-600
//               file:mr-[1vw] file:py-[.5vw] file:px-[1vw]
//               file:rounded-[.5vw] file:border-0
//               file:text-[.8vw] file:font-semibold
//               file:bg-indigo-600 file:text-white
//               hover:file:bg-indigo-700 cursor-pointer"
//           />
//           {labelUrl && (
//             <p className="text-[.8vw] text-green-600 mt-[.5vw]">
//               ✓ Logo uploaded
//             </p>
//           )}
//         </div>
//       </div>

//       {/* RIGHT SIDE - MODEL VIEWER */}
//       <div className="flex-1 mt-[3.5vw] bg-gray-200 rounded-[.5vw] shadow-lg overflow-hidden relative model-viewer-container">
//        <model-viewer
//   ref={modelRef}
//   src={displayModel}
//   alt="Container"
//   camera-controls
//   shadow-intensity="1" 
//   shadow-softness="1"
//   exposure="1"
//   tone-mapping="commerce"
//   crossorigin="anonymous"
 
//   style={{ width: "100%", height: "100%", backgroundColor: bgColor }}
// />
        
      

//         {/* Bottom Right - Background Color Picker */}
//         <div className="absolute bottom-[2vw] right-[2vw] bg-white rounded-[0.8vw] shadow-lg p-[1.2vw] flex items-center gap-[0.6vw] z-50">
//           <label className="text-[0.9vw] font-bold text-gray-700">BG</label>
//           <div className="flex flex-col">
//             <input
//               type="color"
//               value={bgColor}
//               onChange={(e) => setBgColor(e.target.value)}
//               className="w-[3vw] h-[2.5vw] rounded-[0.5vw] cursor-pointer "
//             />
//             <span className="text-[0.75vw] text-gray-500 font-mono text-center">{bgColor}</span>
//           </div>
//         </div>
//       </div>
        
        
//         {/* Top Right - Export Button with Dropdown */}
//         <div className="absolute top-[1vw] right-[1vw] z-50">
//           <button 
//             onClick={() => setShowExportMenu(!showExportMenu)}
//             className="px-[1.5vw] py-[0.6vw] bg-blue-500 text-white rounded-[0.5vw] text-[0.95vw] font-bold shadow-lg hover:shadow-xl hover:bg-blue-700 cursor-pointer transition-all flex items-center gap-[0.5vw]"
//           >
//              Export
//             <span className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`}>▼</span>
//           </button>

//           {/* Dropdown Menu */}
//           {showExportMenu && (
//             <div className="absolute top-[2.8vw] right-0 bg-white rounded-[0.5vw] shadow-xl border border-gray-300 overflow-hidden z-50">
//               <button 
//                 onClick={handleExportPDF}
//                 className="w-full px-[1.2vw] py-[0.6vw] text-left text-[0.9vw] text-gray-700 font-semibold hover:bg-red-50 hover:text-red-700 transition-all flex items-center gap-[0.5vw] cursor-pointer"
//               >
//                  PDF
//               </button>
//               <div className="h-px bg-gray-200"></div>
//               <button 
//                 onClick={handleExportGLB}
//                 className="w-full px-[1.2vw] py-[0.6vw] text-left text-[0.9vw] text-gray-700 font-semibold hover:bg-purple-50 hover:text-purple-700 transition-all flex items-center gap-[0.5vw] cursor-pointer"
//               >
//                  GLB
//               </button>
//             </div>
//           )}
//         </div>
//     </div>
//   );
// }