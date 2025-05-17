
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { EditableElement } from "./types";

interface ElementEditorProps {
  selectedElementId: string | null;
  editableElements: Record<string, EditableElement>;
  onTextChange: (id: string, newText: string) => void;
  onStyleChange: (id: string, property: string, value: string) => void;
  onPositionChange: (id: string, direction: 'left' | 'right' | 'up' | 'down', amount?: number) => void;
}

const ElementEditor: React.FC<ElementEditorProps> = ({
  selectedElementId,
  editableElements,
  onTextChange,
  onStyleChange,
  onPositionChange
}) => {
  const commonStyles = [
    { name: "color", type: "color" as const },
    { name: "background-color", type: "color" as const },
    { name: "font-size", type: "text" as const },
    { name: "font-weight", type: "select" as const, options: ["normal", "bold", "lighter", "bolder", "500", "600", "700"] },
    { name: "text-align", type: "select" as const, options: ["left", "center", "right", "justify"] },
    { name: "padding", type: "text" as const },
    { name: "margin", type: "text" as const },
    { name: "border", type: "text" as const },
    { name: "border-radius", type: "text" as const },
    { name: "width", type: "text" as const },
    { name: "height", type: "text" as const },
  ];

  if (!selectedElementId) {
    return (
      <div style={{ textAlign: "center", color: "#6b7280" }}>
        Click on an element to edit
      </div>
    );
  }

  const selectedElement = editableElements[selectedElementId];
  if (!selectedElement) return null;

  return (
    <div>
      <h3 style={{ marginBottom: "16px", fontWeight: "600" }}>Edit Element</h3>
      
      <Label>Text Content</Label>
      <Input 
        value={selectedElement.text || ""} 
        onChange={(e) => onTextChange(selectedElementId, e.target.value)}
        style={{ marginBottom: "16px" }}
      />
      
      <Label>Position</Label>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: "8px", 
        marginBottom: "16px" 
      }}>
        <div></div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onPositionChange(selectedElementId, 'up')}
        >
          <ArrowUp size={16} />
        </Button>
        <div></div>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onPositionChange(selectedElementId, 'left')}
        >
          <ArrowLeft size={16} />
        </Button>
        <div style={{ 
          textAlign: "center", 
          fontSize: "12px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          Move
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onPositionChange(selectedElementId, 'right')}
        >
          <ArrowRight size={16} />
        </Button>
        
        <div></div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onPositionChange(selectedElementId, 'down')}
        >
          <ArrowDown size={16} />
        </Button>
        <div></div>
      </div>
      
      <Label>Style Properties</Label>
      <div style={{ 
        marginTop: "8px", 
        display: "grid", 
        gridTemplateColumns: "repeat(1, minmax(0, 1fr))", 
        gap: "8px" 
      }}>
        {commonStyles.map((prop) => (
          <div key={prop.name} style={{ marginBottom: "8px" }}>
            <Label>{prop.name}</Label>
            {prop.type === "select" ? (
              <select 
                value={selectedElement.style[prop.name] || ""}
                onChange={(e) => onStyleChange(selectedElementId, prop.name, e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  borderRadius: "4px",
                  border: "1px solid #e5e7eb"
                }}
              >
                <option value="">Select...</option>
                {prop.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : prop.type === "color" ? (
              <div style={{ display: "flex", gap: "8px" }}>
                <Input 
                  type="text"
                  value={selectedElement.style[prop.name] || ""}
                  onChange={(e) => onStyleChange(selectedElementId, prop.name, e.target.value)}
                  style={{ flex: "1" }}
                />
                <Input
                  type="color"
                  value={selectedElement.style[prop.name] || "#000000"}
                  onChange={(e) => onStyleChange(selectedElementId, prop.name, e.target.value)}
                  style={{ width: "40px", padding: "2px" }}
                />
              </div>
            ) : (
              <Input 
                value={selectedElement.style[prop.name] || ""}
                onChange={(e) => onStyleChange(selectedElementId, prop.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElementEditor;
