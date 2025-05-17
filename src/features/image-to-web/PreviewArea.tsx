
import React, { useRef } from "react";
import { EditableElement } from "./types";

interface PreviewAreaProps {
  editableElements: Record<string, EditableElement>;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseDown: (e: React.MouseEvent, elementId: string) => void;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ 
  editableElements,
  selectedElementId,
  setSelectedElementId,
  onMouseMove,
  onMouseUp,
  onMouseDown
}) => {
  const previewContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={previewContainerRef}
      style={{ 
        flex: "1", 
        position: "relative", 
        height: "100%", 
        overflow: "auto",
        backgroundColor: "white",
        minHeight: "400px",
        padding: "20px"
      }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {Object.entries(editableElements).map(([id, element]) => (
        <div
          key={id}
          style={{
            position: "absolute",
            top: `${element.position.top}px`,
            left: `${element.position.left}px`,
            padding: "2px",
            cursor: "move",
            border: selectedElementId === id ? "2px dashed #4f46e5" : "2px dashed transparent",
            zIndex: selectedElementId === id ? 10 : 1,
            ...Object.entries(element.style)
              .filter(([key]) => key !== 'top' && key !== 'left')
              .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
          }}
          onMouseDown={(e) => onMouseDown(e, id)}
          onClick={() => setSelectedElementId(id)}
        >
          {element.text}
        </div>
      ))}
    </div>
  );
};

export default PreviewArea;
