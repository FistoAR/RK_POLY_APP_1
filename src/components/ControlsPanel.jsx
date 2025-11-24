import { useAppStore } from "../store";
import { useRef } from "react";

const patterns = [
  "/patterns/round_brown.png",
  "/patterns/round_green.png",
  "/patterns/round_mix.png",
];

export default function ControlsPanel() {
  const setTarget = useAppStore((s) => s.setTarget);
  const setColor = useAppStore((s) => s.setColor);
  const setPattern = useAppStore((s) => s.setPattern);

  const target = useAppStore((s) => s.target);
  const color = useAppStore((s) => s.color);
  const pattern = useAppStore((s) => s.pattern);

  const uploadRef = useRef();

  const upload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPattern(url);
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl space-y-4">
      
      {/* Part Selection */}
      <div>
        <label className="font-medium">Select Part</label>
        <div className="flex gap-2 mt-2">
          {["top", "bottom", "both"].map((p) => (
            <button
              key={p}
              onClick={() => setTarget(p)}
              className={`px-3 py-1 rounded 
                ${target === p ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div>
        <label className="font-medium">Base Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="mt-2 w-20 h-10"
        />
      </div>

      {/* Preset Patterns */}
      <div>
        <label className="font-medium">Preset Patterns</label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {patterns.map((p) => (
            <img
              key={p}
              src={p}
              onClick={() => setPattern(p)}
              className={`w-16 h-16 rounded border cursor-pointer 
                ${pattern === p ? "ring-2 ring-indigo-600" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Upload Label */}
      <div>
        <label className="font-medium">Upload Label</label>
        <input type="file" accept="image/*" onChange={upload} />
      </div>

      <button
        onClick={() => setPattern(null)}
        className="px-3 py-1 bg-gray-200 rounded"
      >
        Clear Pattern
      </button>
    </div>
  );
}
