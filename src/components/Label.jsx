import { useState, useEffect, useRef } from "react";
import logoImage from "/Images/rk-poly-logo.webp";
import roundbrown from "../assets/patterns/round_brown.png";
import roundgreen from "../assets/patterns/round_green.png";
import roundmix from "../assets/patterns/round_mix.png";

// Add your 4 default logo options here
import defaultLogo1 from "/Images/rk-poly-logo.webp";
import defaultLogo2 from "/Images/rk-poly-logo.webp"; // Replace with actual logo paths
import defaultLogo3 from "/Images/rk-poly-logo.webp"; // Replace with actual logo paths
import defaultLogo4 from "/Images/rk-poly-logo.webp"; // Replace with actual logo paths

const Label = ({ onBack, onApply }) => {
  const canvasRef = useRef(null);
  const [openSection, setOpenSection] = useState("company");

  // --- STATE FOR LABELS ---
  const [companyName, setCompanyName] = useState("Your Company Name");
  const [companySize, setCompanySize] = useState(40);
  const [companyColor, setCompanyColor] = useState("#000000");
  const [address, setAddress] = useState("Your Address, City, Country");
  const [customText, setCustomText] = useState("");
  const [customTextColor, setCustomTextColor] = useState("#000000");
  const [customTextSize, setCustomTextSize] = useState(20);
  const [customTextFont, setCustomTextFont] = useState("Arial");
  const [customTextAlign, setCustomTextAlign] = useState("center");
  const [logoImg, setLogoImg] = useState(null);
  
  // Pattern/Template selection
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Logo position and drag state
  const [logoPosition, setLogoPosition] = useState({ x: 50, y: 50 });
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasWidth = 1024;
  const canvasHeight = 256;
  const logoSize = 180;

  const patterns = [
    { id: 1, name: "Brown Pattern", src: roundbrown },
    { id: 2, name: "Green Pattern", src: roundgreen },
    { id: 3, name: "Mix Pattern", src: roundmix },
  ];

  const defaultLogos = [
    { id: 1, name: "Logo 1", src: defaultLogo1 },
    { id: 2, name: "Logo 2", src: defaultLogo2 },
    { id: 3, name: "Logo 3", src: defaultLogo3 },
    { id: 4, name: "Logo 4", src: defaultLogo4 },
  ];

  // --- DRAW CANVAS ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background pattern if selected, otherwise white background
    if (selectedTemplate) {
      const patternImg = new Image();
      patternImg.src = selectedTemplate;
      patternImg.onload = () => {
        ctx.drawImage(patternImg, 0, 0, canvasWidth, canvasHeight);
        renderContent();
      };
    } else {
      ctx.fillStyle = "#f9fafb";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      renderContent();
    }

    function renderContent() {
      // Company Name (Centered)
      ctx.font = `bold ${companySize}px Arial`;
      ctx.fillStyle = companyColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(companyName, canvasWidth / 2, canvasHeight / 2 - 20);

      // Address (Right side)
      ctx.font = "18px Arial";
      ctx.fillStyle = "#4b5563";
      ctx.textAlign = "right";
      ctx.fillText(address, canvasWidth - 50, canvasHeight / 2 + 10);

      // Custom Text with alignment and styling
      if (customText) {
        ctx.font = `${customTextSize}px ${customTextFont}`;
        ctx.fillStyle = customTextColor;
        
        let xPos = canvasWidth / 2;
        if (customTextAlign === "left") {
          ctx.textAlign = "left";
          xPos = 50;
        } else if (customTextAlign === "right") {
          ctx.textAlign = "right";
          xPos = canvasWidth - 50;
        } else {
          ctx.textAlign = "center";
        }
        
        ctx.fillText(customText, xPos, canvasHeight - 30);
      }

      // Draw Logo on top
      if (logoImg) {
        const img = new Image();
        img.src = logoImg;
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          let dw = logoSize;
          let dh = logoSize;

          if (aspectRatio > 1) dh = logoSize / aspectRatio;
          else dw = logoSize * aspectRatio;

          ctx.drawImage(img, logoPosition.x, (canvasHeight - dh) / 2, dw, dh);
        };
      } else {
        ctx.beginPath();
        ctx.arc(logoPosition.x + logoSize / 2, canvasHeight / 2, 70, 0, 2 * Math.PI);
        ctx.strokeStyle = "#d1d5db";
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.fillStyle = "#9ca3af";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("LOGO", logoPosition.x + logoSize / 2, canvasHeight / 2 + 8);
      }
    }

  }, [companyName, companySize, companyColor, address, customText, customTextColor, customTextSize, customTextFont, customTextAlign, logoImg, logoPosition, selectedTemplate]);

  // --- DRAG AND DROP HANDLERS ---
  const handleLogoDragStart = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left) * (canvasWidth / rect.width);
    const canvasY = (e.clientY - rect.top) * (canvasHeight / rect.height);
    
    setDragOffset({
      x: canvasX - logoPosition.x,
      y: canvasY - logoPosition.y,
    });
    setIsDraggingLogo(true);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDraggingLogo) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left) * (canvasWidth / rect.width);
    const canvasY = (e.clientY - rect.top) * (canvasHeight / rect.height);

    setLogoPosition({
      x: Math.max(0, Math.min(canvasX - dragOffset.x, canvasWidth - logoSize)),
      y: logoPosition.y,
    });
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingLogo(false);
  };

  // --- HANDLERS ---
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDefaultLogoSelect = (logoSrc) => {
    setLogoImg(logoSrc);
  };

  const handleExportImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "my-label-design.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleApplyToModel = () => {
    if (!canvasRef.current) {
      alert("Canvas not ready");
      return;
    }

    try {
      const imageData = canvasRef.current.toDataURL("image/png");
      
      if (!imageData || !imageData.startsWith("data:image")) {
        throw new Error("Invalid canvas data");
      }

      console.log("✓ Label design exported successfully");
      onApply(imageData);
      
    } catch (err) {
      console.error("Error exporting canvas:", err);
      alert("Failed to export label design");
    }
  };

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col font-sans">
      
      {/* --- HEADER (BLUE THEME) --- */}
      <div className="h-[5vw] bg-blue-600 shadow-sm flex items-center justify-between px-[2vw]">
        <div className="flex items-center gap-[1vw]">
          <div className="w-[3vw] h-[3vw] bg-white flex items-center justify-center text-blue-600 font-bold text-[0.8vw]">
            <img src={logoImage} alt="Logo" />
          </div>
        </div>
        <div className="flex gap-[1vw]">
          <button 
            onClick={onBack} 
            className="px-[2vw] py-[0.6vw] bg-white text-blue-600 rounded-[0.4vw] text-[1vw] font-bold hover:bg-blue-50 transition-colors"
          >
            ← Back
          </button>
          <button 
            onClick={handleExportImage} 
            className="px-[2vw] py-[0.6vw] bg-white text-blue-600 rounded-[0.4vw] text-[1vw] font-bold hover:bg-blue-50 transition-colors"
          >
            ⬇ Export PNG
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT (SWAPPED LAYOUT) --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* RIGHT SIDE (PREVIEW) - NOW ON RIGHT */}
        <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-[2vw] relative">
            
          {/* <h3 className="absolute top-[2vw] text-[1.2vw] text-gray-500 font-medium">Live Preview</h3> */}

          {/* CANVAS CONTAINER */}
          <div 
            className="bg-white p-[1vw] shadow-xl rounded-[0.5vw] border border-gray-300 cursor-move"
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            <canvas 
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="w-[50vw] h-auto border border-dashed border-gray-300"
              onMouseDown={handleLogoDragStart}
            />
          </div>

          <p className="mt-[2vw] text-[0.9vw] text-gray-500 max-w-[40vw] text-center">
            Drag the logo to reposition it. This design will wrap around the container's texture area.
          </p>

          <button 
            onClick={handleApplyToModel}
            className="mt-[3vw] px-[4vw] py-[1vw] bg-blue-600 text-white text-[1.2vw] font-bold rounded-[0.5vw] shadow-lg hover:bg-blue-700 hover:scale-105 transition-all"
          >
            ✓ APPLY TO 3D MODEL
          </button>

          {/* DEFAULT LOGO SELECTION AT BOTTOM */}
          <div className="mt-[2vw] w-[50vw]">
            <h4 className="text-[1vw] font-bold text-gray-700 mb-[1vw] text-center">
              Or Choose a Default Logo
            </h4>
            <div className="grid grid-cols-4 gap-[1vw]">
              {defaultLogos.map((logo) => (
                <button
                  key={logo.id}
                  onClick={() => handleDefaultLogoSelect(logo.src)}
                  className={`h-[6vw] border-2 rounded-[0.5vw] overflow-hidden transition-all hover:scale-105 ${
                    logoImg === logo.src
                      ? "border-blue-600 shadow-lg"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="w-full h-full object-contain p-[0.5vw]"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LEFT SIDEBAR (CONTROLS) - NOW ON LEFT */}
        <div className="w-[28vw] border-r border-gray-200 p-[2vw] overflow-y-auto bg-white">
          <h2 className="text-[1.8vw] font-bold text-gray-800 mb-[2vw]">
             <span className="text-blue-600">Customize </span>Your Label
          </h2>

          <div className="space-y-[1vw]">
            
            {/* 1. CHOOSE TEMPLATE ACCORDION */}
            <div className="border border-gray-200 rounded-[0.5vw] overflow-hidden">
              <button onClick={() => toggleSection('template')} className="w-full flex justify-between items-center p-[1vw] bg-white hover:bg-gray-50 transition">
                <span className="text-[1vw] font-medium text-gray-700"> Choose Template</span>
                <span className={`text-[1vw] transition-transform ${openSection === 'template' ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openSection === 'template' && (
                <div className="p-[1.2vw] bg-gray-50 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-[0.8vw]">
                    {patterns.map((pattern) => (
                      <button
                        key={pattern.id}
                        onClick={() => setSelectedTemplate(pattern.src)}
                        className={`h-[5vw] border-2 rounded-[0.4vw] overflow-hidden transition-all ${
                          selectedTemplate === pattern.src
                            ? "border-blue-600 scale-105 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={pattern.src}
                          alt={pattern.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  {selectedTemplate && (
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="mt-[1vw] w-full py-[0.5vw] text-[0.9vw] text-red-600 hover:text-red-800 font-semibold"
                    >
                      ✕ Clear Template
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 2. LOGO ACCORDION */}
            <div className="border border-gray-200 rounded-[0.5vw] overflow-hidden">
              <button onClick={() => toggleSection('logo')} className="w-full flex justify-between items-center p-[1vw] bg-white hover:bg-gray-50 transition">
                <span className="text-[1vw] font-medium text-gray-700"> Upload Logo</span>
                <span className={`text-[1vw] transition-transform ${openSection === 'logo' ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openSection === 'logo' && (
                <div className="p-[1.2vw] bg-gray-50 border-t border-gray-100">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload}
                    className="block w-full text-[0.9vw] text-slate-500
                    file:mr-[1vw] file:py-[0.5vw] file:px-[1vw]
                    file:rounded-[0.3vw] file:border-0
                    file:text-[0.9vw] file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  />
                  <p className="text-[0.8vw] text-gray-500 mt-[0.5vw]"> Drag logo on preview to reposition</p>
                </div>
              )}
            </div>

            {/* 3. COMPANY NAME ACCORDION */}
            <div className="border border-gray-200 rounded-[0.5vw] overflow-hidden">
              <button onClick={() => toggleSection('company')} className="w-full flex justify-between items-center p-[1vw] bg-white hover:bg-gray-50 transition">
                <span className="text-[1vw] font-medium text-gray-700"> Company Name</span>
                <span className={`text-[1vw] transition-transform ${openSection === 'company' ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openSection === 'company' && (
                <div className="p-[1.2vw] bg-gray-50 border-t border-gray-100 space-y-[1vw]">
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full border border-gray-300 rounded-[0.4vw] p-[0.6vw] text-[1vw] focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter Company Name"
                  />
                  <div className="flex gap-[1vw]">
                    <div className="flex-1">
                      <label className="block text-[0.8vw] text-gray-500 mb-[0.3vw]">Font Size</label>
                      <input 
                        type="number" 
                        value={companySize} 
                        onChange={(e) => setCompanySize(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-[0.4vw] p-[0.5vw] text-[1vw]"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.8vw] text-gray-500 mb-[0.3vw]">Color</label>
                      <input 
                        type="color" 
                        value={companyColor} 
                        onChange={(e) => setCompanyColor(e.target.value)}
                        className="h-[2.5vw] w-[2.5vw] cursor-pointer border-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. ADDRESS ACCORDION */}
            <div className="border border-gray-200 rounded-[0.5vw] overflow-hidden">
              <button onClick={() => toggleSection('address')} className="w-full flex justify-between items-center p-[1vw] bg-white hover:bg-gray-50 transition">
                <span className="text-[1vw] font-medium text-gray-700"> Address</span>
                <span className={`text-[1vw] transition-transform ${openSection === 'address' ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openSection === 'address' && (
                <div className="p-[1.2vw] bg-gray-50 border-t border-gray-100">
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded-[0.4vw] p-[0.6vw] text-[1vw] focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter Address"
                  />
                </div>
              )}
            </div>

            {/* 5. CUSTOM TEXT ACCORDION */}
            <div className="border border-gray-200 rounded-[0.5vw] overflow-hidden">
              <button onClick={() => toggleSection('custom')} className="w-full flex justify-between items-center p-[1vw] bg-white hover:bg-gray-50 transition">
                <span className="text-[1vw] font-medium text-gray-700"> Custom Text</span>
                <span className={`text-[1vw] transition-transform ${openSection === 'custom' ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openSection === 'custom' && (
                <div className="p-[1.2vw] bg-gray-50 border-t border-gray-100 space-y-[1vw]">
                  <textarea 
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full border border-gray-300 rounded-[0.4vw] p-[0.6vw] text-[1vw] focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter custom text..."
                    rows="2"
                  />
                  
                  <div className="grid grid-cols-2 gap-[0.8vw]">
                    <div>
                      <label className="block text-[0.8vw] text-gray-500 mb-[0.3vw]">Font Size</label>
                      <input 
                        type="number" 
                        value={customTextSize} 
                        onChange={(e) => setCustomTextSize(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-[0.4vw] p-[0.5vw] text-[1vw]"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.8vw] text-gray-500 mb-[0.3vw]">Color</label>
                      <input 
                        type="color" 
                        value={customTextColor} 
                        onChange={(e) => setCustomTextColor(e.target.value)}
                        className="h-[2.5vw] w-full cursor-pointer border-none bg-transparent rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.8vw] text-gray-500 mb-[0.3vw]">Font Family</label>
                    <select 
                      value={customTextFont}
                      onChange={(e) => setCustomTextFont(e.target.value)}
                      className="w-full border border-gray-300 rounded-[0.4vw] p-[0.5vw] text-[1vw]"
                    >
                      <option>Arial</option>
                      <option>Georgia</option>
                      <option>Times New Roman</option>
                      <option>Courier New</option>
                      <option>Verdana</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.8vw] text-gray-500 mb-[0.3vw]">Text Alignment</label>
                    <div className="flex gap-[0.5vw]">
                      <button 
                        onClick={() => setCustomTextAlign("left")}
                        className={`flex-1 py-[0.4vw] rounded-[0.3vw] text-[0.9vw] font-medium transition ${
                          customTextAlign === "left" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        ⬅ Left
                      </button>
                      <button 
                        onClick={() => setCustomTextAlign("center")}
                        className={`flex-1 py-[0.4vw] rounded-[0.3vw] text-[0.9vw] font-medium transition ${
                          customTextAlign === "center" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        ↔ Center
                      </button>
                      <button 
                        onClick={() => setCustomTextAlign("right")}
                        className={`flex-1 py-[0.4vw] rounded-[0.3vw] text-[0.9vw] font-medium transition ${
                          customTextAlign === "right" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Right ➡
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Label;




























// import { useState, useEffect, useRef } from "react";
// import logoImage from "/Images/rk-poly-logo.webp";
// const Label = ({ onBack, onApply }) => {
//   const canvasRef = useRef(null);
//   const [openSection, setOpenSection] = useState("company");

//   // --- STATE FOR LABELS ---
//   const [companyName, setCompanyName] = useState("Your Company Name");
//   const [companySize, setCompanySize] = useState(40);
//   const [companyColor, setCompanyColor] = useState("#000000");
//   const [address, setAddress] = useState("Your Address, City, Country");
//   const [customText, setCustomText] = useState("");
//   const [customTextColor, setCustomTextColor] = useState("#000000");
//   const [customTextSize, setCustomTextSize] = useState(20);
//   const [customTextFont, setCustomTextFont] = useState("Arial");
//   const [customTextAlign, setCustomTextAlign] = useState("center");
//   const [logoImg, setLogoImg] = useState(null);
  
//   // Logo position and drag state
//   const [logoPosition, setLogoPosition] = useState({ x: 50, y: 50 });
//   const [isDraggingLogo, setIsDraggingLogo] = useState(false);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

//   const canvasWidth = 1024;
//   const canvasHeight = 256;
//   const logoSize = 180;

//   // --- DRAW CANVAS ---
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");

//     ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//     ctx.fillStyle = "#f9fafb";
//     ctx.fillRect(0, 0, canvasWidth, canvasHeight);

//     const renderText = () => {
//       // Company Name (Centered)
//       ctx.font = `bold ${companySize}px Arial`;
//       ctx.fillStyle = companyColor;
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillText(companyName, canvasWidth / 2, canvasHeight / 2 - 20);

//       // Address (Right side)
//       ctx.font = "18px Arial";
//       ctx.fillStyle = "#4b5563";
//       ctx.textAlign = "right";
//       ctx.fillText(address, canvasWidth - 50, canvasHeight / 2 + 10);

//       // Custom Text with alignment and styling
//       if (customText) {
//         ctx.font = `${customTextSize}px ${customTextFont}`;
//         ctx.fillStyle = customTextColor;
        
//         let xPos = canvasWidth / 2;
//         if (customTextAlign === "left") {
//           ctx.textAlign = "left";
//           xPos = 50;
//         } else if (customTextAlign === "right") {
//           ctx.textAlign = "right";
//           xPos = canvasWidth - 50;
//         } else {
//           ctx.textAlign = "center";
//         }
        
//         ctx.fillText(customText, xPos, canvasHeight - 30);
//       }
//     };

//     if (logoImg) {
//       const img = new Image();
//       img.src = logoImg;
//       img.onload = () => {
//         const aspectRatio = img.width / img.height;
//         let dw = logoSize;
//         let dh = logoSize;

//         if (aspectRatio > 1) dh = logoSize / aspectRatio;
//         else dw = logoSize * aspectRatio;

//         ctx.drawImage(img, logoPosition.x, (canvasHeight - dh) / 2, dw, dh);
//         renderText();
//       };
//     } else {
//       ctx.beginPath();
//       ctx.arc(logoPosition.x + logoSize / 2, canvasHeight / 2, 70, 0, 2 * Math.PI);
//       ctx.strokeStyle = "#d1d5db";
//       ctx.lineWidth = 4;
//       ctx.stroke();
      
//       ctx.fillStyle = "#9ca3af";
//       ctx.font = "bold 20px Arial";
//       ctx.textAlign = "center";
//       ctx.fillText("LOGO", logoPosition.x + logoSize / 2, canvasHeight / 2 + 8);
      
//       renderText();
//     }

//   }, [companyName, companySize, companyColor, address, customText, customTextColor, customTextSize, customTextFont, customTextAlign, logoImg, logoPosition]);

//   // --- DRAG AND DROP HANDLERS ---
//   const handleLogoDragStart = (e) => {
//     const rect = canvasRef.current.getBoundingClientRect();
//     const canvasX = (e.clientX - rect.left) * (canvasWidth / rect.width);
//     const canvasY = (e.clientY - rect.top) * (canvasHeight / rect.height);
    
//     setDragOffset({
//       x: canvasX - logoPosition.x,
//       y: canvasY - logoPosition.y,
//     });
//     setIsDraggingLogo(true);
//   };

//   const handleCanvasMouseMove = (e) => {
//     if (!isDraggingLogo) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const canvasX = (e.clientX - rect.left) * (canvasWidth / rect.width);
//     const canvasY = (e.clientY - rect.top) * (canvasHeight / rect.height);

//     setLogoPosition({
//       x: Math.max(0, Math.min(canvasX - dragOffset.x, canvasWidth - logoSize)),
//       y: logoPosition.y,
//     });
//   };

//   const handleCanvasMouseUp = () => {
//     setIsDraggingLogo(false);
//   };

//   // --- HANDLERS ---
//   const handleLogoUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (ev) => setLogoImg(ev.target.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleExportImage = () => {
//     if (!canvasRef.current) return;
//     const link = document.createElement("a");
//     link.download = "my-label-design.png";
//     link.href = canvasRef.current.toDataURL("image/png");
//     link.click();
//   };

//   const toggleSection = (id) => {
//     setOpenSection(openSection === id ? null : id);
//   };

//   return (
//     <div className="w-full h-screen bg-white flex flex-col font-sans">
      
//       {/* --- HEADER (BLUE THEME) --- */}
//       <div className="h-[5vw] bg-blue-600 shadow-sm flex items-center justify-between px-[2vw]">
//         <div className="flex items-center gap-[1vw]">
//           <div className="w-[3vw] h-[3vw] bg-white flex items-center justify-center text-blue-600 font-bold text-[0.8vw]">
//             <img src={logoImage}/>
//           </div>
//         </div>
//         <div className="flex gap-[1vw]">
//           <button 
//             onClick={onBack} 
//             className="px-[2vw] py-[0.6vw] bg-white text-blue-600 rounded-[0.4vw] text-[1vw] font-bold hover:bg-blue-50 transition-colors"
//           >
//             ← Back
//           </button>
//           <button 
//             onClick={handleExportImage} 
//             className="px-[2vw] py-[0.6vw] bg-white text-blue-600 rounded-[0.4vw] text-[1vw] font-bold hover:bg-blue-50 transition-colors"
//           >
//             ⬇ Export PNG
//           </button>
//         </div>
//       </div>

//       {/* --- MAIN CONTENT (SWAPPED LAYOUT) --- */}
//       <div className="flex flex-1 overflow-hidden">
        
//         {/* RIGHT SIDE (PREVIEW) - NOW ON RIGHT */}
//         <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-[2vw] relative">
            
//           <h3 className="absolute top-[2vw] text-[1.2vw] text-gray-500 font-medium">Live Preview</h3>

//           {/* CANVAS CONTAINER */}
//           <div 
//             className="bg-white p-[1vw] shadow-xl rounded-[0.5vw] border border-gray-300 cursor-move"
//             onMouseMove={handleCanvasMouseMove}
//             onMouseUp={handleCanvasMouseUp}
//             onMouseLeave={handleCanvasMouseUp}
//           >
//             <canvas 
//               ref={canvasRef}
//               width={canvasWidth}
//               height={canvasHeight}
//               className="w-[50vw] h-auto border border-dashed border-gray-300"
//               onMouseDown={handleLogoDragStart}
//             />
//           </div>

//           <p className="mt-[2vw] text-[0.9vw] text-gray-500 max-w-[40vw] text-center">
//             Drag the logo to reposition it. This design will wrap around the container's texture area.
//           </p>

//           <button 
//             onClick={() => onApply(canvasRef.current.toDataURL("image/png"))}
//             className="mt-[3vw] px-[4vw] py-[1vw] bg-blue-600 text-white text-[1.2vw] font-bold rounded-[0.5vw] shadow-lg hover:bg-blue-700 hover:scale-105 transition-all"
//           >
//             ✓ APPLY TO 3D MODEL
//           </button>
//         </div>

//         {/* LEFT SIDEBAR (CONTROLS) - NOW ON LEFT */}
//         <div className="w-[28vw] border-r border-gray-200 p-[2vw] overflow-y-auto bg-white">
//           <h2 className="text-[1.8vw] font-bold text-gray-800 mb-[2vw]">
//              <span className="text-blue-600">Customize </span>Your Label
//           </h2>

//           <div className="space-y-[1vw]">
            
//             {/* 1. LOGO ACCORDION */}
//             <div className="border border-gray-200 rounded-[0.5vw] overflow-hidden">
//               <button onClick={() => toggleSection('logo')} className="w-full flex justify-between items-center p-[1vw] bg-white hover:bg-gray-50 transition">
//                 <span className="text-[1vw] font-medium text-gray-700"> Upload Logo</span>
//                 <span className={`text-[1vw] transition-transform ${openSection === 'logo' ? 'rotate-180' : ''}`}>▼</span>
//               </button>
//               {openSection === 'logo' && (
//                 <div className="p-[1.2vw] bg-gray-50 border-t border-gray-100">
//                   <input 
//                     type="file" 
//                     accept="image/*" 
//                     onChange={handleLogoUpload}
//                     className="block w-full text-[0.9vw] text-slate-500
//                     file:mr-[1vw] file:py-[0.5vw] file:px-[1vw]
//                     file:rounded-[0.3vw] file:border-0
//                     file:text-[0.9vw] file:font-semibold
//                     file:bg-blue-50 file:text-blue-700
//                     hover:file:bg-blue-100"
//                   />
//                   <p className="text-[0.8vw] text-gray-500 mt-[0.5vw]"> Drag logo on preview to reposition</p>
//                 </div>
//               )}
//             </div>

//             {/* 2. COMPANY NAME ACCORDION */}
//             <div className="border border-gray-200 rounded-[0.5vw] overflow-hidden">
//               <button onClick={() => toggleSection('company')} className="w-full flex justify-between items-center p-[1vw] bg-white hover:bg-gray-50 transition">
//                 <span className="text-[1vw] font-medium text-gray-700"> Company Name</span>
//                 <span className={`text-[1vw] transition-transform ${openSection === 'company' ? 'rotate-180' : ''}`}>▼</span>
//               </button>
//               {openSection === 'company' && (
//                 <div className="p-[1.2vw] bg-gray-50 border-t border-gray-100 space-y-[1vw]">
//                   <input 
//                     type="text" 
//                     value={companyName}
//                     onChange={(e) => setCompanyName(e.target.value)}
//                     className="w-full border border-gray-300 rounded-[0.4vw] p-[0.6vw] text-[1vw] focus:ring-2 focus:ring-blue-500 outline-none"
//                     placeholder="Enter Company Name"
//                   />
//                   <div className="flex gap-[1vw]">
//                     <div className="flex-1">
//                       <label className="block text-[0.8vw] text-gray-500 mb-[0.3vw]">Font Size</label>
//                       <input 
//                         type="number" 
//                         value={companySize} 
//                         onChange={(e) => setCompanySize(Number(e.target.value))}
//                         className="w-full border border-gray-300 rounded-[0.4vw] p-[0.5vw] text-[1vw]"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[0.8vw] text-gray-500 mb-[0.3vw]">Color</label>
//                       <input 
//                         type="color" 
//                         value={companyColor} 
//                         onChange={(e) => setCompanyColor(e.target.value)}
//                         className="h-[2.5vw] w-[2.5vw] cursor-pointer border-none bg-transparent"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* 3. ADDRESS ACCORDION */}
//             <div className="border border-gray-200 rounded-[0.5vw] overflow-hidden">
//               <button onClick={() => toggleSection('address')} className="w-full flex justify-between items-center p-[1vw] bg-white hover:bg-gray-50 transition">
//                 <span className="text-[1vw] font-medium text-gray-700"> Address</span>
//                 <span className={`text-[1vw] transition-transform ${openSection === 'address' ? 'rotate-180' : ''}`}>▼</span>
//               </button>
//               {openSection === 'address' && (
//                 <div className="p-[1.2vw] bg-gray-50 border-t border-gray-100">
//                   <input 
//                     type="text" 
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     className="w-full border border-gray-300 rounded-[0.4vw] p-[0.6vw] text-[1vw] focus:ring-2 focus:ring-blue-500 outline-none"
//                     placeholder="Enter Address"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* 4. CUSTOM TEXT ACCORDION */}
//             <div className="border border-gray-200 rounded-[0.5vw] overflow-hidden">
//               <button onClick={() => toggleSection('custom')} className="w-full flex justify-between items-center p-[1vw] bg-white hover:bg-gray-50 transition">
//                 <span className="text-[1vw] font-medium text-gray-700"> Custom Text</span>
//                 <span className={`text-[1vw] transition-transform ${openSection === 'custom' ? 'rotate-180' : ''}`}>▼</span>
//               </button>
//               {openSection === 'custom' && (
//                 <div className="p-[1.2vw] bg-gray-50 border-t border-gray-100 space-y-[1vw]">
//                   <textarea 
//                     value={customText}
//                     onChange={(e) => setCustomText(e.target.value)}
//                     className="w-full border border-gray-300 rounded-[0.4vw] p-[0.6vw] text-[1vw] focus:ring-2 focus:ring-blue-500 outline-none"
//                     placeholder="Enter custom text..."
//                     rows="2"
//                   />
                  
//                   <div className="grid grid-cols-2 gap-[0.8vw]">
//                     <div>
//                       <label className="block text-[0.8vw] text-gray-500 mb-[0.3vw]">Font Size</label>
//                       <input 
//                         type="number" 
//                         value={customTextSize} 
//                         onChange={(e) => setCustomTextSize(Number(e.target.value))}
//                         className="w-full border border-gray-300 rounded-[0.4vw] p-[0.5vw] text-[1vw]"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[0.8vw] text-gray-500 mb-[0.3vw]">Color</label>
//                       <input 
//                         type="color" 
//                         value={customTextColor} 
//                         onChange={(e) => setCustomTextColor(e.target.value)}
//                         className="h-[2.5vw] w-full cursor-pointer border-none bg-transparent rounded"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-[0.8vw] text-gray-500 mb-[0.3vw]">Font Family</label>
//                     <select 
//                       value={customTextFont}
//                       onChange={(e) => setCustomTextFont(e.target.value)}
//                       className="w-full border border-gray-300 rounded-[0.4vw] p-[0.5vw] text-[1vw]"
//                     >
//                       <option>Arial</option>
//                       <option>Georgia</option>
//                       <option>Times New Roman</option>
//                       <option>Courier New</option>
//                       <option>Verdana</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-[0.8vw] text-gray-500 mb-[0.3vw]">Text Alignment</label>
//                     <div className="flex gap-[0.5vw]">
//                       <button 
//                         onClick={() => setCustomTextAlign("left")}
//                         className={`flex-1 py-[0.4vw] rounded-[0.3vw] text-[0.9vw] font-medium transition ${
//                           customTextAlign === "left" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                         }`}
//                       >
//                         ⬅ Left
//                       </button>
//                       <button 
//                         onClick={() => setCustomTextAlign("center")}
//                         className={`flex-1 py-[0.4vw] rounded-[0.3vw] text-[0.9vw] font-medium transition ${
//                           customTextAlign === "center" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                         }`}
//                       >
//                         ↔ Center
//                       </button>
//                       <button 
//                         onClick={() => setCustomTextAlign("right")}
//                         className={`flex-1 py-[0.4vw] rounded-[0.3vw] text-[0.9vw] font-medium transition ${
//                           customTextAlign === "right" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                         }`}
//                       >
//                         Right ➡
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Label;