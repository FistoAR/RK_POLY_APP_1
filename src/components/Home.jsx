// import { useRef, useState, useEffect } from "react";

// // import round100 from "../assets/models-with-logo/120ml_round.glb";
// // import round250 from "../assets/models-with-logo/250ml_round.glb";
// // import round500gms from "../assets/models-with-logo/500ml_round.glb";
// // import round500 from "../assets/models-with-logo/750ml_round.glb";
// // import round750tall from "../assets/models-with-logo/50ml_hinged_container.glb";

// // import round100A from "../assets/models/120ml_round.glb";
// // import round250A from "../assets/models/250ml_round.glb";
// // import round500gmsA from "../assets/models/500ml_round.glb";
// // import round500A from "../assets/models/750ml_round.glb";
// // import round750tallA from "../assets/models/50ml_hinged_container.glb";

// // rk poly models 

// import round100 from "../assets/models/round/round-100-ml.glb";
// import round250 from "../assets/models/round/round-250-ml.glb";
// import round500gms from "../assets/models/round/round-500-gram.glb";
// import round500 from "../assets/models/round/round-500-ml.glb";
// import round750tall from "../assets/models/round/round-750-ml-tall.glb";
// // import round750flat from "../assets/models/round/round-750-ml-flat.glb";
// // import round1000 from "../assets/models/round/round-1000-ml.glb";

// // import rs300 from "../assets/models/RS/300.glb";
// // import rs500 from "../assets/models/RS/500.glb";
// // import rs750 from "../assets/models/RS/750.glb";
// // import rs1000 from "../assets/models/RS/1000.glb";

// // import oval250 from "../assets/models/oval/250ml oval.glb";
// // import oval500 from "../assets/models/oval/500ml oval new.glb";
// // import oval1000 from "../assets/models/oval/250ml oval.glb";


// // import sb250 from "../assets/models/Sweet box/250ml premium.glb";
// // import sb500 from "../assets/models/Sweet box/500ml sweet box.glb";
// // import sb1000 from "../assets/models/Sweet box/1000ml sweet box.glb";

// // import sb5side250 from "../assets/models/SB for 5 side iml/250 Transparent SB.glb";
// // import sb5side500 from "../assets/models/SB for 5 side iml/750 (SAS) Red.glb";

// // import tub250 from "../assets/models/tub/251ml_meganta.glb";
// // import tub500 from "../assets/models/tub/500-1.glb";
// // import tub500sas from "../assets/models/tub/501ml_skyblue.glb";
// // import tub1000 from "../assets/models/tub/1000ml_tub.glb";




// // Images 

// import round100img from "../assets/images/product-img/round-120.webp";
// import round250img from "../assets/images/product-img/round-250.webp";
// import round500img from "../assets/images/product-img/round-500.webp";
// import round750img from "../assets/images/product-img/round-750.webp";
// import round1000img from "../assets/images/product-img/round-1000.webp";







// // Import default logos
// import defaultLogo1 from "/Images/rk-poly-logo.webp";
// import defaultLogo2 from "/Images/rk-poly-logo.webp"; // Replace with actual paths
// import defaultLogo3 from "/Images/rk-poly-logo.webp"; // Replace with actual paths
// import defaultLogo4 from "/Images/rk-poly-logo.webp"; // Replace with actual paths

// import jsPDF from "jspdf";
// import Label from "./Label";

// export default function ModelViewer() {
//   const modelRef = useRef(null);
//   const [labelUrl, setLabelUrl] = useState("");
//   const [topColor, setTopColor] = useState(null);
//   const [bottomColor, setBottomColor] = useState(null);
//   const [modelLoaded, setModelLoaded] = useState(false);
//   const [selectedModel, setSelectedModel] = useState(round100);
//   const [bgColor, setBgColor] = useState("#e5e7eb");
//   const [displayModel, setDisplayModel] = useState(round100);
//   const [currentView, setCurrentView] = useState("home");
//   const [customLabelTexture, setCustomLabelTexture] = useState(null);
//   const [openCategory, setOpenCategory] = useState(null);
//   const [showExportMenu, setShowExportMenu] = useState(false);

//   // Model mapping: with-logo and without-logo versions
//   const modelMap = {
//     [round100]: { withLogo: round100, withoutLogo: round100 },
//     [round250]: { withLogo: round250, withoutLogo: round250 },
//     [round500gms]: { withLogo: round500gms, withoutLogo: round500gms },
//     [round500]: { withLogo: round500, withoutLogo: round500 },
//     [round750tall]: { withLogo: round750tall, withoutLogo: round750tall},
//   };

//   const defaultLogos = [
//     { id: 1, name: "Logo 1", src: defaultLogo1 },
//     { id: 2, name: "Logo 2", src: defaultLogo2 },
//     { id: 3, name: "Logo 3", src: defaultLogo3 },
//     { id: 4, name: "Logo 4", src: defaultLogo4 },
//   ];

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
//     { name: "120ml Round", path: round250 },
//     { name: "250ml Round", path: round250 },
//     { name: "350ml Round", path: round500gms },
//     { name: "500ml Round", path: round500 },
//     { name: "750ml Round", path: round750tall},
//   ];

//   const categories = [
//     {
//       id: "round",
//       title: "ROUND (7)",
//       items: [
//         { id: "100ml", label: "100 ml", path: round100 },
//         { id: "250ml", label: "250 ml", path: round250 },
//         { id: "500gm", label: "500 gm", path: round500gms },
//         { id: "500ml", label: "500 ml", path: round500gms },
//         { id: "750ml", label: "750 ml", path: round500 },
//         { id: "750ml_tall", label: "750 ml (Tall)", path: round500 },
//         { id: "1000ml", label: "1000 ml", path: round750tall },
//       ],
//     },
//     {
//       id: "round_bevel",
//       title: "ROUND BEVEL (4)",
//       items: [
//         { id: "300ml_rb", label: "300 ml", path: round100 },
//         { id: "500ml_rb", label: "500 ml", path: round250 },
//         { id: "750ml_rb", label: "750 ml", path: round500 },
//         { id: "1000ml_rb", label: "1000 ml", path: round750tall },
//       ],
//     },
//     {
//       id: "oval",
//       title: "OVAL (3)",
//       items: [
//         { id: "250ml_oval", label: "250 ml", path: round100 },
//         { id: "500ml_oval", label: "500 ml", path: round500gms },
//         { id: "1000ml_oval", label: "1000 ml", path: round500 },
//       ],
//     },
//     {
//       id: "taper_evident",
//       title: "TAPER EVIDENT (4)",
//       items: [
//         { id: "250ml_te", label: "250 ml", path: round100 },
//         { id: "b500ml_te", label: "B-500 ml", path: round250 },
//         { id: "500ml_te", label: "500 ml", path: round500gms },
//         { id: "1000ml_te", label: "1000 ml", path: round500 },
//       ],
//     },
//     {
//       id: "sweet_box",
//       title: "SWEET BOX (5)",
//       items: [
//         { id: "250_tr", label: "250 TRANSPARENT", path: round100 },
//         { id: "250_premium", label: "250 PREMIUM (GREEN)", path: round250 },
//         { id: "750_tr", label: "750 TRANSPARENT", path: round500 },
//         { id: "750_red", label: "SAS TRADITIONAL (RED) ~750 ml", path: round750tall },
//         { id: "1000_blue", label: "SHRI DHIVYAM (BLUE) ~1000 ml", path: round750tall },
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
//       material.pbrMetallicRoughness.setRoughnessFactor(0.25);
//       material.opacity = 1.0;
//       material.transparent = false;

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
//   }, [displayModel]); // Changed from selectedModel to displayModel

//   // Apply TOP color - Re-apply when model loads
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
//   }, [topColor, modelLoaded]); // Removed displayModel dependency

//   // Apply BOTTOM color - Re-apply when model loads
//   useEffect(() => {
//     if (!modelLoaded || !modelRef.current || !bottomColor) return;

//     const mv = modelRef.current;
//     const materials = mv.model?.materials;
//     if (!materials) return;

//     materials.forEach((material) => {
//       const name = material.name.toLowerCase();

//       // NEVER apply bottom color to logo materials
//       if (name.includes("logo")) return;
      
//       // Skip texture_area ONLY if custom label is applied
//       if (name === "texture_area" && customLabelTexture) return;

//       if (
//         name.includes("tub") ||
//         name.includes("bottom") ||
//         name === "texture_area"
//       ) {
//         applyColorToMaterial(material, bottomColor);
//       }
//     });
//   }, [bottomColor, modelLoaded, customLabelTexture]); // Added customLabelTexture

//   // Apply Custom Label to "texture_area"
//   useEffect(() => {
//     if (!customLabelTexture || !modelLoaded || !modelRef.current) return;

//     const mv = modelRef.current;

//     (async () => {
//       try {
//         console.log("Applying custom label texture...");
//         const texture = await mv.createTexture(customLabelTexture);
//         const targetMat = mv.model?.materials.find((m) => m.name === "texture_area");

//         if (targetMat) {
//           targetMat.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
//           targetMat.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
//           targetMat.pbrMetallicRoughness.setMetallicFactor(0.0);
//           targetMat.pbrMetallicRoughness.setRoughnessFactor(0.5);

//           console.log("✓ Custom label texture applied to texture_area");
//         }
//       } catch (e) {
//         console.error("Error applying custom label texture:", e);
//       }
//     })();
//   }, [customLabelTexture, modelLoaded]);

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

//         // Try different possible material names
//         const targetMaterial = materials.find((mat) => 
//           mat.name === "bottom_logo" || 
//           mat.name === "bottomlogo" ||
//           mat.name.toLowerCase().includes("logo")
//         );
        
//         if (!targetMaterial) {
//           console.warn("Material logo not found in model");
//           console.log("Available materials:", materials.map(m => m.name));
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

//   const handleDefaultLogoSelect = (logoSrc) => {
//     setLabelUrl(logoSrc);
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
//     <div className="flex gap-[2vw] h-screen bg-gray-50">
    

//       {/* left SIDE - MODEL VIEWER */}
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
//  <div className="absolute bottom-[5%] left-[5%] flex gap-[3vw]">
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

//         {/* right SIDE - CONTROLS */}
//       <div className="w-[25vw] mt-[3.5vw] bg-white rounded-[1vw] shadow-lg p-[1.5vw] overflow-y-auto space-y-[1vw]">
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
//                   <span className="text-[1vw] text-white">{isOpen ? "⮟" : "⮞"}</span>
//                 </button>

//                 <div
//                   id={`cat-${cat.id}`}
//                   className={`mt-[.3vw]  transition-all overflow-hidden ${
//                     isOpen ? "max-h-[50vw]" : "max-h-0"
//                   } `}
//                   style={{ transition: "max-height 240ms ease" }}
//                 >
//                   <div className="space-y-[.2vw] mt-[.2vw] grid grid-cols-2 gap-2" >
//                     {cat.items.map((item) => {
//                       const isSelected = selectedModel === item.path;
//                       return (
//                         <button
//                           key={item.id}
//                           onClick={() => {
//                             handleModelChange(item.path);
//                             {round100img}
//                             setOpenCategory(cat.id);
//                           }}
//                           className={`w-[10vw] h-[10vw] text-[1vw] text-left px-[1vw] py-[.5vw] rounded-[.5vw] cursor-pointer hover:bg-gray-200 hover:text-black font-medium transition-all ${
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

       

//         <div className="border-t border-gray-300"></div>

//         <div>
//           <label className="block text-[1vw] font-bold text-gray-700 mb-[0.8vw]">
//             Label Design
//           </label>

//           <button
//             onClick={() => setCurrentView("label")}
//             className="w-full py-[0.8vw] bg-blue-600 text-white rounded-[0.5vw] text-[1.1vw] font-bold shadow-md hover:shadow-lg hover:bg-blue-700 cursor-pointer transition-all"
//           >
//              Customize Your Label
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

//         <div className="border-t border-gray-300"></div>

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

//         {/* DEFAULT LOGOS SECTION */}
//         <div>
//           <label className="block text-[1vw] font-bold text-gray-700 mb-[0.8vw]">
//             Or Choose Default Logo
//           </label>
//           <div className="grid grid-cols-2 gap-[0.8vw]">
//             {defaultLogos.map((logo) => (
//               <button
//                 key={logo.id}
//                 onClick={() => handleDefaultLogoSelect(logo.src)}
//                 className={`h-[5vw] border-2 rounded-[0.5vw] overflow-hidden transition-all hover:scale-105 ${
//                   labelUrl === logo.src
//                     ? "border-blue-600 shadow-lg"
//                     : "border-gray-300 hover:border-blue-400"
//                 }`}
//               >
//                 <img
//                   src={logo.src}
//                   alt={logo.name}
//                   className="w-full h-full object-contain p-[0.5vw] bg-white"
//                 />
//               </button>
//             ))}
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





import { useRef, useState, useEffect } from "react";

import round100 from "../assets/models/round/round-100-ml.glb";
import round250 from "../assets/models/round/round-250-ml.glb";
import round500gms from "../assets/models/round/round-500-gram.glb";
import round500 from "../assets/models/round/round-500-ml.glb";
import round750tall from "../assets/models/round/round-750-ml-tall.glb";

// STEP 1: Import all product images
import round100img from "../assets/images/product-img/round-120.webp";
import round250img from "../assets/images/product-img/round-250.webp";
import round500img from "../assets/images/product-img/round-500.webp";
import round750img from "../assets/images/product-img/round-750.webp";
import round1000img from "../assets/images/product-img/round-1000.webp";

// Import default logos
import defaultLogo1 from "/Images/rk-poly-logo.webp";
import defaultLogo2 from "/Images/rk-poly-logo.webp";
import defaultLogo3 from "/Images/rk-poly-logo.webp";
import defaultLogo4 from "/Images/rk-poly-logo.webp";

import jsPDF from "jspdf";
import Label from "./Label";

export default function ModelViewer() {
  const modelRef = useRef(null);
  const [labelUrl, setLabelUrl] = useState("");
  const [topColor, setTopColor] = useState(null);
  const [bottomColor, setBottomColor] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [selectedModel, setSelectedModel] = useState(round100);
  const [bgColor, setBgColor] = useState("#e5e7eb");
  const [displayModel, setDisplayModel] = useState(round100);
  const [currentView, setCurrentView] = useState("home");
  const [customLabelTexture, setCustomLabelTexture] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const modelMap = {
    [round100]: { withLogo: round100, withoutLogo: round100 },
    [round250]: { withLogo: round250, withoutLogo: round250 },
    [round500gms]: { withLogo: round500gms, withoutLogo: round500gms },
    [round500]: { withLogo: round500, withoutLogo: round500 },
    [round750tall]: { withLogo: round750tall, withoutLogo: round750tall},
  };

  const defaultLogos = [
    { id: 1, name: "Logo 1", src: defaultLogo1 },
    { id: 2, name: "Logo 2", src: defaultLogo2 },
    { id: 3, name: "Logo 3", src: defaultLogo3 },
    { id: 4, name: "Logo 4", src: defaultLogo4 },
  ];

  const getCurrentModel = () => {
    const mapping = modelMap[selectedModel];
    if (!mapping) return selectedModel;
    return customLabelTexture ? mapping.withoutLogo : mapping.withLogo;
  };

  useEffect(() => {
    const newModel = getCurrentModel();
    setDisplayModel(newModel);
    setModelLoaded(false);
  }, [selectedModel, customLabelTexture]);

  // STEP 2: Updated categories array with image property
  const categories = [
    {
      id: "round",
      title: "ROUND (7)",
      items: [
        { id: "100ml", label: "100 ml", path: round100, image: round100img },
        { id: "250ml", label: "250 ml", path: round250, image: round250img },
        { id: "500gm", label: "500 gm", path: round500gms, image: round500img },
        { id: "500ml", label: "500 ml", path: round500gms, image: round500img },
        { id: "750ml", label: "750 ml", path: round500, image: round750img },
        { id: "750ml_tall", label: "750 ml (Tall)", path: round500, image: round750img },
        { id: "1000ml", label: "1000 ml", path: round750tall, image: round1000img },
      ],
    },
    {
      id: "round_bevel",
      title: "ROUND BEVEL (4)",
      items: [
        { id: "300ml_rb", label: "300 ml", path: round100, image: round100img },
        { id: "500ml_rb", label: "500 ml", path: round250, image: round250img },
        { id: "750ml_rb", label: "750 ml", path: round500, image: round750img },
        { id: "1000ml_rb", label: "1000 ml", path: round750tall, image: round1000img },
      ],
    },
    {
      id: "oval",
      title: "OVAL (3)",
      items: [
        { id: "250ml_oval", label: "250 ml", path: round100, image: round100img },
        { id: "500ml_oval", label: "500 ml", path: round500gms, image: round500img },
        { id: "1000ml_oval", label: "1000 ml", path: round500, image: round1000img },
      ],
    },
    {
      id: "taper_evident",
      title: "TAPER EVIDENT (4)",
      items: [
        { id: "250ml_te", label: "250 ml", path: round100, image: round100img },
        { id: "b500ml_te", label: "B-500 ml", path: round250, image: round250img },
        { id: "500ml_te", label: "500 ml", path: round500gms, image: round500img },
        { id: "1000ml_te", label: "1000 ml", path: round500, image: round1000img },
      ],
    },
    {
      id: "sweet_box",
      title: "SWEET BOX (5)",
      items: [
        { id: "250_tr", label: "250 TRANSPARENT", path: round100, image: round100img },
        { id: "250_premium", label: "250 PREMIUM (GREEN)", path: round250, image: round250img },
        { id: "750_tr", label: "750 TRANSPARENT", path: round500, image: round750img },
        { id: "750_red", label: "SAS TRADITIONAL (RED) ~750 ml", path: round750tall, image: round1000img },
        { id: "1000_blue", label: "SHRI DHIVYAM (BLUE) ~1000 ml", path: round750tall, image: round1000img },
      ],
    },
  ];

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
  }, [displayModel]);

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
  }, [topColor, modelLoaded]);

  useEffect(() => {
    if (!modelLoaded || !modelRef.current || !bottomColor) return;

    const mv = modelRef.current;
    const materials = mv.model?.materials;
    if (!materials) return;

    materials.forEach((material) => {
      const name = material.name.toLowerCase();

      if (name.includes("logo")) return;
      
      if (name === "texture_area" && customLabelTexture) return;

      if (
        name.includes("tub") ||
        name.includes("bottom") ||
        name === "texture_area"
      ) {
        applyColorToMaterial(material, bottomColor);
      }
    });
  }, [bottomColor, modelLoaded, customLabelTexture]);

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
    const modelName = categories.flatMap(cat => cat.items).find((m) => m.path === selectedModel)?.label || "model";
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

      const modelName = categories.flatMap(cat => cat.items).find((m) => m.path === selectedModel)?.label || "model";
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
    <div className="flex gap-[2vw] h-screen bg-gray-50">
      {/* left SIDE - MODEL VIEWER */}
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
        <div className="absolute bottom-[5%] left-[5%] flex gap-[3vw]">
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

      {/* right SIDE - CONTROLS */}
      <div className="w-[25vw] mt-[3.5vw] bg-white rounded-[1vw] shadow-lg p-[1.5vw] overflow-y-auto space-y-[1vw]">
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
                  <span className="text-[1vw] text-white">{isOpen ? "⮟" : "⮞"}</span>
                </button>

                <div
                  id={`cat-${cat.id}`}
                  className={`mt-[.3vw]  transition-all overflow-hidden ${
                    isOpen ? "max-h-[50vw]" : "max-h-0"
                  } `}
                  style={{ transition: "max-height 240ms ease" }}
                >
                  {/* STEP 3: Updated grid layout with images */}
                  <div className="space-y-[.2vw] mt-[.2vw] grid grid-cols-2 gap-[0.5vw]">
                    {cat.items.map((item) => {
                      const isSelected = selectedModel === item.path;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            handleModelChange(item.path);
                            setOpenCategory(cat.id);
                          }}
                          className={`flex flex-col items-center gap-[0.4vw] p-[0.5vw] rounded-[.5vw] cursor-pointer transition-all ${
                            isSelected
                              ? "bg-indigo-600 text-white shadow-md"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                          }`}
                        >
                          {/* STEP 4: Display product image */}
                          <img
                            src={item.image}
                            alt={item.label}
                            className="w-[8vw] h-[8vw] object-contain bg-gray-50 rounded-[.3vw]"
                          />
                          {/* STEP 5: Display label below image */}
                          <span className="text-[0.75vw] font-semibold text-center leading-tight">
                            {item.label}
                          </span>
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
