
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

  // Determine if text element should render as image
  const renderElement = (id: string, element: EditableElement) => {
    // Check if the text looks like an image URL or data URL
    const isImageSrc = element.text.startsWith('http') || 
                       element.text.startsWith('data:') ||
                       element.text.startsWith('./');

    const elementStyle: React.CSSProperties = {
      position: "absolute" as const,
      top: `${element.position.top}px`,
      left: `${element.position.left}px`,
      padding: "2px",
      cursor: "move",
      border: selectedElementId === id ? "2px dashed #4f46e5" : "2px dashed transparent",
      zIndex: selectedElementId === id ? 10 : 1,
      ...Object.entries(element.style)
        .filter(([key]) => key !== 'top' && key !== 'left')
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
    };

    if (isImageSrc) {
      return (
        <img 
          src={element.text}
          alt="Element" 
          style={elementStyle} 
          onMouseDown={(e) => onMouseDown(e, id)}
          onClick={() => setSelectedElementId(id)}
        />
      );
    }

    return (
      <div
        style={elementStyle}
        onMouseDown={(e) => onMouseDown(e, id)}
        onClick={() => setSelectedElementId(id)}
      >
        {element.text}
      </div>
    );
  };

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
        <React.Fragment key={id}>
          {renderElement(id, element)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default PreviewArea;
