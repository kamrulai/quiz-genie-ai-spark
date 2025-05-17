
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";

interface LiveEditorProps {
  generatedCode: string;
  onCodeUpdate: (newCode: string) => void;
}

interface ElementPosition {
  top: number;
  left: number;
}

interface EditableElement {
  text: string;
  style: Record<string, string>;
  position: ElementPosition;
}

const LiveEditor: React.FC<LiveEditorProps> = ({ generatedCode, onCodeUpdate }) => {
  const [editableElements, setEditableElements] = useState<{
    [key: string]: EditableElement;
  }>({});
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const startDragPosRef = useRef<{ x: number, y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Extract elements from the generated code when component mounts or code changes
  useEffect(() => {
    if (!generatedCode) return;
    
    // Parse the HTML from generatedCode
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = generatedCode;
    
    // Find elements with text or styling
    const elements: Record<string, EditableElement> = {};
    let elementId = 0;
    
    const processNode = (node: Element) => {
      // Check if this node has text content or is an image
      if (node.tagName === 'IMG' || (
          node.childNodes.length > 0 && 
          Array.from(node.childNodes).some(child => 
            child.nodeType === Node.TEXT_NODE && child.textContent?.trim()))) {
        
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
        
        // Make all elements position absolute by default if not specified
        if (!styleObj['position']) {
          styleObj['position'] = 'absolute';
        }
        
        // Get text content for non-image elements
        let text = '';
        if (node.tagName !== 'IMG') {
          text = Array.from(node.childNodes)
            .filter(child => child.nodeType === Node.TEXT_NODE)
            .map(child => child.textContent)
            .join("");
        }
          
        // Add element to our collection
        elements[id] = {
          text: text.trim(),
          style: styleObj,
          position: {
            top: parseInt(styleObj['top'] || '10', 10),
            left: parseInt(styleObj['left'] || '10', 10)
          }
        };
          
        // Mark element in the original HTML with a data attribute for identification
        node.setAttribute("data-edit-id", id);
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

  const handlePositionChange = (id: string, direction: 'left' | 'right' | 'up' | 'down', amount: number = 10) => {
    setEditableElements(prev => {
      const element = prev[id];
      if (!element) return prev;
      
      const newPosition = { ...element.position };
      
      switch (direction) {
        case 'left':
          newPosition.left -= amount;
          break;
        case 'right':
          newPosition.left += amount;
          break;
        case 'up':
          newPosition.top -= amount;
          break;
        case 'down':
          newPosition.top += amount;
          break;
      }
      
      // Update position in style
      const newStyle = { ...element.style };
      newStyle.left = `${newPosition.left}px`;
      newStyle.top = `${newPosition.top}px`;
      
      return {
        ...prev,
        [id]: {
          ...element,
          position: newPosition,
          style: newStyle
        }
      };
    });
    
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
      if (element.tagName !== 'IMG') {
        const textNodes = Array.from(element.childNodes).filter(
          node => node.nodeType === Node.TEXT_NODE
        );
        
        if (textNodes.length === 1) {
          textNodes[0].textContent = text;
        }
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

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    setSelectedElementId(elementId);
    setIsDragging(true);
    startDragPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElementId || !startDragPosRef.current) return;
    
    const dx = e.clientX - startDragPosRef.current.x;
    const dy = e.clientY - startDragPosRef.current.y;
    
    setEditableElements(prev => {
      const element = prev[selectedElementId];
      if (!element) return prev;
      
      const newPosition = {
        left: element.position.left + dx,
        top: element.position.top + dy
      };
      
      // Update position in style
      const newStyle = { ...element.style };
      newStyle.left = `${newPosition.left}px`;
      newStyle.top = `${newPosition.top}px`;
      
      return {
        ...prev,
        [selectedElementId]: {
          ...element,
          position: newPosition,
          style: newStyle
        }
      };
    });
    
    startDragPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      updateGeneratedCode();
    }
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
    { name: "width", type: "text" as const },
    { name: "height", type: "text" as const },
  ];

  if (Object.keys(editableElements).length === 0) {
    return (
      <div style={{ padding: "16px", color: "#6b7280", textAlign: "center" }}>
        Generate code first to enable editing
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "600px" }}>
      <div style={{ display: "flex", height: "100%" }}>
        {/* Preview section */}
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
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
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
              onMouseDown={(e) => handleMouseDown(e, id)}
              onClick={() => setSelectedElementId(id)}
            >
              {element.text}
            </div>
          ))}
        </div>

        {/* Editing panel */}
        <div style={{ 
          width: "300px", 
          borderLeft: "1px solid #e5e7eb", 
          padding: "16px", 
          overflow: "auto" 
        }}>
          {selectedElementId ? (
            <div>
              <h3 style={{ marginBottom: "16px", fontWeight: "600" }}>Edit Element</h3>
              
              <Label>Text Content</Label>
              <Input 
                value={editableElements[selectedElementId]?.text || ""} 
                onChange={(e) => handleTextChange(selectedElementId, e.target.value)}
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
                  onClick={() => handlePositionChange(selectedElementId, 'up')}
                >
                  <ArrowUp size={16} />
                </Button>
                <div></div>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handlePositionChange(selectedElementId, 'left')}
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
                  onClick={() => handlePositionChange(selectedElementId, 'right')}
                >
                  <ArrowRight size={16} />
                </Button>
                
                <div></div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handlePositionChange(selectedElementId, 'down')}
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
                        value={editableElements[selectedElementId]?.style[prop.name] || ""}
                        onChange={(e) => handleStyleChange(selectedElementId, prop.name, e.target.value)}
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
                          value={editableElements[selectedElementId]?.style[prop.name] || ""}
                          onChange={(e) => handleStyleChange(selectedElementId, prop.name, e.target.value)}
                          style={{ flex: "1" }}
                        />
                        <Input
                          type="color"
                          value={editableElements[selectedElementId]?.style[prop.name] || "#000000"}
                          onChange={(e) => handleStyleChange(selectedElementId, prop.name, e.target.value)}
                          style={{ width: "40px", padding: "2px" }}
                        />
                      </div>
                    ) : (
                      <Input 
                        value={editableElements[selectedElementId]?.style[prop.name] || ""}
                        onChange={(e) => handleStyleChange(selectedElementId, prop.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#6b7280" }}>
              Click on an element to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveEditor;
