
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditableProperty {
  name: string;
  value: string;
  type: "text" | "color" | "number" | "select";
  options?: string[];
}

interface CssEditorProps {
  generatedCode: string;
  onCodeUpdate: (newCode: string) => void;
}

const CssEditor: React.FC<CssEditorProps> = ({ generatedCode, onCodeUpdate }) => {
  const [editableElements, setEditableElements] = useState<{
    [key: string]: { text: string; style: Record<string, string> };
  }>({});

  // Extract elements from the generated code when component mounts or code changes
  useEffect(() => {
    if (!generatedCode) return;
    
    // Parse the HTML from generatedCode
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = generatedCode;
    
    // Find elements with text or styling
    const elements: Record<string, { text: string; style: Record<string, string> }> = {};
    let elementId = 0;
    
    const processNode = (node: Element) => {
      // Check if this node has text content
      if (node.childNodes.length > 0 && 
          Array.from(node.childNodes).some(child => 
            child.nodeType === Node.TEXT_NODE && child.textContent?.trim())) {
        
        // Create a unique ID for this element
        const id = `element-${elementId++}`;
        
        // Extract inline styles
        const styleObj: Record<string, string> = {};
        const styleAttr = node.getAttribute("style");
        if (styleAttr) {
          styleAttr.split(";").forEach(style => {
            if (style.trim()) {
              const [property, value] = style.split(":");
              if (property && value) {
                styleObj[property.trim()] = value.trim();
              }
            }
          });
        }
        
        // Get text content
        const text = Array.from(node.childNodes)
          .filter(child => child.nodeType === Node.TEXT_NODE)
          .map(child => child.textContent)
          .join("");
          
        if (text.trim()) {
          elements[id] = {
            text: text.trim(),
            style: styleObj
          };
          
          // Mark element in the original HTML with a data attribute for identification
          node.setAttribute("data-edit-id", id);
        }
      }
      
      // Process child elements
      Array.from(node.children).forEach(processNode);
    };
    
    // Start processing from the root elements
    Array.from(tempDiv.children).forEach(processNode);
    
    // Update the state with extracted elements
    setEditableElements(elements);
    
    // Update the generated code with the added data attributes
    onCodeUpdate(tempDiv.innerHTML);
  }, [generatedCode]);

  const handleTextChange = (id: string, newText: string) => {
    setEditableElements(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        text: newText
      }
    }));
    
    updateGeneratedCode();
  };

  const handleStyleChange = (id: string, property: string, value: string) => {
    setEditableElements(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        style: {
          ...prev[id].style,
          [property]: value
        }
      }
    }));
    
    updateGeneratedCode();
  };
  
  const updateGeneratedCode = () => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = generatedCode;
    
    // Update each element in the DOM
    Object.entries(editableElements).forEach(([id, { text, style }]) => {
      const element = tempDiv.querySelector(`[data-edit-id="${id}"]`);
      if (!element) return;
      
      // Update text content if it's a text-only node
      const textNodes = Array.from(element.childNodes).filter(
        node => node.nodeType === Node.TEXT_NODE
      );
      
      if (textNodes.length === 1) {
        textNodes[0].textContent = text;
      }
      
      // Update styles
      let styleStr = "";
      Object.entries(style).forEach(([prop, value]) => {
        styleStr += `${prop}: ${value}; `;
      });
      
      element.setAttribute("style", styleStr);
    });
    
    onCodeUpdate(tempDiv.innerHTML);
  };

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
  ];

  const editorStyle = {
    maxHeight: "400px",
    overflowY: "auto" as const,
    padding: "16px",
    borderTop: "1px solid #e5e7eb"
  };

  const elementCardStyle = {
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb"
  };

  const propertyGroupStyle = {
    marginTop: "8px",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "8px"
  };

  if (Object.keys(editableElements).length === 0) {
    return (
      <div style={{ padding: "16px", color: "#6b7280", textAlign: "center" }}>
        Generate code first to enable editing
      </div>
    );
  }

  return (
    <div style={editorStyle}>
      <h3 style={{ marginBottom: "16px", fontWeight: "600" }}>Edit Elements</h3>
      
      {Object.entries(editableElements).map(([id, { text, style }]) => (
        <div key={id} style={elementCardStyle}>
          <Label>Text Content</Label>
          <Input 
            value={text} 
            onChange={(e) => handleTextChange(id, e.target.value)}
            style={{ marginBottom: "8px" }}
          />
          
          <details>
            <summary style={{ cursor: "pointer", marginBottom: "8px", fontWeight: "500" }}>
              Style Properties
            </summary>
            <div style={propertyGroupStyle}>
              {commonStyles.map((prop) => (
                <div key={prop.name} style={{ marginBottom: "8px" }}>
                  <Label>{prop.name}</Label>
                  {prop.type === "select" ? (
                    <select 
                      value={style[prop.name] || ""}
                      onChange={(e) => handleStyleChange(id, prop.name, e.target.value)}
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
                        value={style[prop.name] || ""}
                        onChange={(e) => handleStyleChange(id, prop.name, e.target.value)}
                        style={{ flex: "1" }}
                      />
                      <Input
                        type="color"
                        value={style[prop.name] || "#000000"}
                        onChange={(e) => handleStyleChange(id, prop.name, e.target.value)}
                        style={{ width: "40px", padding: "2px" }}
                      />
                    </div>
                  ) : (
                    <Input 
                      value={style[prop.name] || ""}
                      onChange={(e) => handleStyleChange(id, prop.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </details>
        </div>
      ))}
    </div>
  );
};

export default CssEditor;
