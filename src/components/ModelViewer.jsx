import { useRef, useState, useEffect } from "react";

export default function ModelViewer() {
  const modelRef = useRef(null);
  const [labelUrl, setLabelUrl] = useState("");
  const [topColor, setTopColor] = useState("#ffffff");
  const [bottomColor, setBottomColor] = useState("#ffffff");
  const [modelLoaded, setModelLoaded] = useState(false);
  const [selectedModel, setSelectedModel] = useState("/src/models/120ml_round.glb");

  const models = [
    { name: "120ml Round", path: "/src/models/120ml_round.glb" },
    { name: "250ml Round", path: "/src/models/250ml_round.glb" },
    { name: "350ml Round", path: "/src/models/50ml_hinged_container.glb" },
    { name: "500ml Round", path: "/src/models/500ml_round.glb" },
    { name: "750ml Round", path: "/src/models/750ml_round.glb" },
  ];

  // example: add this above your component or inside it (near models definition)
const categories = [
  {
    id: "round",
    title: "ROUND (7)",
    items: [
      { id: "100ml", label: "100 ml", path: "/src/models/120ml_round.glb" },
      { id: "250ml", label: "250 ml", path: "/src/models/250ml_round.glb" },
      { id: "500gm", label: "500 gm", path: "/src/models/500ml_round.glb" },
      { id: "500ml", label: "500 ml", path: "/src/models/500ml_round.glb" },
      { id: "750ml", label: "750 ml", path: "/src/models/750ml_round.glb" },
      { id: "750ml_tall", label: "750 ml (Tall)", path: "/src/models/750ml_round.glb" },
      { id: "1000ml", label: "1000 ml", path: "/src/models/50ml_hinged_container.glb" },
    ],
  },
  {
    id: "round_bevel",
    title: "ROUND BEVEL (4)",
    items: [
      { id: "300ml_rb", label: "300 ml", path: "/src/models/120ml_round.glb" },
      { id: "500ml_rb", label: "500 ml", path: "/src/models/500ml_round.glb" },
      { id: "750ml_rb", label: "750 ml", path: "/src/models/750ml_round.glb" },
      { id: "1000ml_rb", label: "1000 ml", path: "/src/models/50ml_hinged_container.glb" },
    ],
  },
  {
    id: "oval",
    title: "OVAL (3)",
    items: [
      { id: "250ml_oval", label: "250 ml", path: "/src/models/120ml_round.glb" },
      { id: "500ml_oval", label: "500 ml", path: "/src/models/500ml_round.glb" },
      { id: "1000ml_oval", label: "1000 ml", path: "/src/models/50ml_hinged_container.glb" },
    ],
  },
  {
    id: "taper_evident",
    title: "TAPER EVIDENT (4)",
    items: [
      { id: "250ml_te", label: "250 ml", path: "/src/models/120ml_round.glb" },
      { id: "b500ml_te", label: "B-500 ml", path: "/src/models/250ml_round.glb" },
      { id: "500ml_te", label: "500 ml", path: "/src/models/500ml_round.glb" },
      { id: "1000ml_te", label: "1000 ml", path: "/src/models/50ml_hinged_container.glb" },
    ],
  },
  {
    id: "sweet_box",
    title: "SWEET BOX (5)",
    items: [
      { id: "250_tr", label: "250 TRANSPARENT", path: "/src/models/120ml_round.glb" },
      { id: "250_premium", label: "250 PREMIUM (GREEN)", path: "/src/models/250ml_round.glb" },
      { id: "750_tr", label: "750 TRANSPARENT", path: "/src/models/750ml_round.glb" },
      { id: "750_red", label: "SAS TRADITIONAL (RED) ~750 ml", path: "/src/models/750ml_round.glb" },
      { id: "1000_blue", label: "SHRI DHIVYAM (BLUE) ~1000 ml", path: "/src/models/50ml_hinged_container.glb" },
    ],
  },
];

const [openCategory, setOpenCategory] = useState(null); // id of open category or null
// you already have selectedModel state; keep using it

  const patterns = [
    "/patterns/round_brown.png",
    "/patterns/round_green.png",
    "/patterns/round_mix.png",
  ];

  const [selectedPattern, setSelectedPattern] = useState(null);

  // Helper: Convert hex to RGB normalized (0-1)
  const hexToRgba = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [1, 1, 1, 1];
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
      1,
    ];
  };

  // Wait for model to load
  useEffect(() => {
    const mv = modelRef.current;
    if (!mv) return;

    const handleLoad = () => {
      console.log("Model loaded");
      setModelLoaded(true);

      // Log available materials (for debugging)
      const materials = mv.model?.materials;
      if (materials) {
        console.log("Available materials:", materials.map((m) => m.name));
      }



      

//       const dumpMaterials = (mv) => {
//   const mats = mv.model?.materials || [];
//   console.log("Materials count:", mats.length);
//   mats.forEach((m, i) => {
//     console.log(`Material[${i}] name:`, m.name);
//     if (m.pbrMetallicRoughness) {
//       console.log("  has pbrMetallicRoughness");
//       console.log("  baseColorFactor:", m.pbrMetallicRoughness.baseColorFactor);
//       console.log("  baseColorTexture:", m.pbrMetallicRoughness.baseColorTexture);
//     } else {
//       console.log("  NO pbrMetallicRoughness");
//     }
//     // If available, check for extra uv info on the underlying prim (best-effort)
//     console.log("  material object:", m);
//   });
// };

// inside handleLoad
// dumpMaterials(mv);

    };

    mv.addEventListener("load", handleLoad);
    return () => mv.removeEventListener("load", handleLoad);
  }, []);

  // Apply colors - ONLY when model is loaded
useEffect(() => {
  if (!modelLoaded || !modelRef.current) return;

  const mv = modelRef.current;
  const materials = mv.model?.materials;

  if (!materials) return;   

  materials.forEach((material) => {
    if (material.name === "lid") {  // ← Match your actual material name
      const rgba = hexToRgba(topColor);  // ← Use hexToRgba
      material.pbrMetallicRoughness.setBaseColorFactor(rgba);
      console.log("Applied top color:", topColor, "to", material.name);
    }
  });
}, [topColor, modelLoaded]);  // ← Only topColor and modelLoaded
  // Apply label texture
useEffect(() => {
  if (!modelLoaded || !modelRef.current) return;

  const mv = modelRef.current;
  const materials = mv.model?.materials;

  if (!materials) return;

  materials.forEach((material) => {
    if (material.name === "texture_area") {  // ← Match your actual material name
      const rgba = hexToRgba(bottomColor);  // ← Use hexToRgba
      material.pbrMetallicRoughness.setBaseColorFactor(rgba);
      console.log("Applied bottom color:", bottomColor, "to", material.name);
    }
  });
}, [bottomColor, modelLoaded]);  // ← Only bottomColor and modelLoaded
 // Apply pattern texture ONLY to "bottom"
useEffect(() => {
  if (!selectedPattern || !modelLoaded || !modelRef.current) return;

  const mv = modelRef.current;
  const materials = mv.model?.materials || [];

  (async () => {
    try {
      // Load pattern
      const texture = await mv.createTexture(selectedPattern);
      if (!texture) {
        console.error("Pattern texture creation failed");
        return;
      }

      // Find bottom material
      const bottomMaterial = materials.find(
        (mat) => mat.name === "texture_area"
      );

      if (!bottomMaterial) {
        console.warn("Material 'bottom' not found");
        return;
      }

      console.log("Applying pattern to:", bottomMaterial.name);

      // Apply the texture correctly
      if (bottomMaterial.pbrMetallicRoughness?.setBaseColorTexture) {
        bottomMaterial.pbrMetallicRoughness.setBaseColorTexture(texture);
      } else if (
        bottomMaterial.pbrMetallicRoughness?.baseColorTexture?.setTexture
      ) {
        bottomMaterial.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
      } else {
        bottomMaterial.pbrMetallicRoughness.baseColorTexture = texture;
      }

      // OPTIONAL (but recommended): make texture more visible
      bottomMaterial.pbrMetallicRoughness.setMetallicFactor(0.0);
      bottomMaterial.pbrMetallicRoughness.setRoughnessFactor(1.0);

    } catch (error) {
      console.error("Error applying pattern:", error);
    }
  })();
}, [selectedPattern, modelLoaded]);

  const handleLabelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLabelUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };
useEffect(() => {
  if (!labelUrl || !modelLoaded || !modelRef.current) return;

  const mv = modelRef.current;
  const materials = mv.model?.materials || [];

  (async () => {
    try {
      const texture = await mv.createTexture(labelUrl);
      if (!texture) {
        console.error("Texture creation failed");
        return;
      }

      // Find EXACT material named bottom_logo
      const targetMaterial = materials.find(
        (mat) => mat.name === "bottom_logo"
      );

      if (!targetMaterial) {
        console.warn("Material 'bottom_logo' not found in model");
        return;
      }

      console.log("Applying label to:", targetMaterial.name);

      // Apply texture (important: use PBR API)
      if (targetMaterial.pbrMetallicRoughness?.setBaseColorTexture) {
        targetMaterial.pbrMetallicRoughness.setBaseColorTexture(texture);
      } else if (
        targetMaterial.pbrMetallicRoughness?.baseColorTexture?.setTexture
      ) {
        targetMaterial.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
      } else {
        targetMaterial.pbrMetallicRoughness.baseColorTexture = texture;
      }

    //   // Optional: Improve texture visibility
    //   targetMaterial.pbrMetallicRoughness.setMetallicFactor(0.0);
    //   targetMaterial.pbrMetallicRoughness.setRoughnessFactor(1.0);

      console.log("Label applied successfully!");
    } catch (err) {
      console.error("Error applying label texture:", err);
    }
  })();
}, [labelUrl, modelLoaded]);

  const handleModelChange = (modelPath) => {
    setSelectedModel(modelPath);
    setModelLoaded(false);
  };

  return (
    <div className="flex gap-[2vw] h-screen bg-gray-50 p-[1vw]">
      {/* LEFT SIDE - CONTROLS */}
      <div className="w-[25vw] bg-white rounded-[1vw] shadow-lg p-[1.5vw] overflow-y-auto space-y-[1vw]">
        {/* MODELS SECTION */}
       {/* MODELS / CATEGORIES SECTION (REPLACE existing models map) */}
<div>
  <h3 className="text-[1.5vw] font-bold text-gray-800 mb-[.4vw]">Select Container Type</h3>

  {categories.map((cat) => {
    const isOpen = openCategory === cat.id;
    return (
      <div key={cat.id} className="mb-[0.2vw]">
        {/* Category header */}
        <button
          onClick={() => setOpenCategory(isOpen ? null : cat.id)}
          className="w-full flex items-center justify-between px-[1vw] py-[.5vw] text-[1vw] rounded-[.5vw] font-medium bg-[#1fa4dd] text-white hover:bg-gray-400 hover:text-black focus:outline-none cursor-pointer"
          aria-expanded={isOpen}
          aria-controls={`cat-${cat.id}`}
        >
          <span>{cat.title}</span>
          <span className="text-[1vw] text-white">{isOpen ? "▾" : "▸"}</span>
        </button>

        {/* Category items (collapsible) */}
        <div
          id={`cat-${cat.id}`}
          className={`mt-[.3vw] ml-[2vw] transition-all overflow-hidden ${isOpen ? "max-h-[50vw]" : "max-h-0"} `}
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
                    // ensure category stays open / show feedback
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
              value={topColor}
              onChange={(e) => setTopColor(e.target.value)}
              className="w-[4vw] h-[2.5vw]  rounded-[.5vw] cursor-pointer  border-gray-300 hover:border-indigo-500"
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
              value={bottomColor}
              onChange={(e) => setBottomColor(e.target.value)}
              className="w-[4vw] h-[2.5vw] rounded-lg cursor-pointer  border-gray-300 hover:border-indigo-500"
            />
            <span className="text-[.8vw] text-gray-600 font-mono">{bottomColor}</span>
          </div>
        </div>
</div>
     

        <div className="border-t border-gray-300"></div>

        {/* PATTERN PRESETS */}
        <div className="absolute  top-[1vw] right-[2vw] w-[30vw] z-22 ">
          <h3 className="text-[1vw] font-bold text-gray-700 mb-[1vw]">
            Choose Pattern Preset      
          </h3>
          <div className="grid grid-cols-3 gap-[.5vw]">
            {patterns.map((pattern) => (
              <button
                key={pattern}
                onClick={() => setSelectedPattern(pattern)}
                className={`relative rounded-[.5vw] overflow-hidden border-[.2vw] transition-all h-[3vw] ${
                  selectedPattern === pattern
                    ? "border-indigo-600 shadow-lg"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img
                  src={pattern}
                  alt="Pattern"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

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

        
      </div>

      {/* RIGHT SIDE - MODEL VIEWER */}
      <div className="flex-1 mt-[6vw] bg-gray-200 rounded-[.5vw] shadow-lg overflow-hidden">
        <model-viewer
          ref={modelRef}
          src={selectedModel}
          alt="Container"
          camera-controls
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}

