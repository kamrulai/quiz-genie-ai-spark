
import React, { useState, useEffect, useRef } from "react";
import PreviewArea from "./PreviewArea";
import ElementEditor from "./ElementEditor";
import { EditableElement } from "./types";

interface LiveEditorProps {
  generatedCode: string;
  onCodeUpdate: (newCode: string) => void;
}

const RefactoredLiveEditor: React.FC<LiveEditorProps> = ({ generatedCode, onCodeUpdate }) => {
  const [editableElements, setEditableElements] = useState<{
    [key: string]: EditableElement;
  }>({});
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
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
      const hasText = Array.from(node.childNodes).some(child => 
        child.nodeType === Node.TEXT_NODE && child.textContent?.trim());
      
      if (node.tagName === 'IMG' || hasText) {
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
        
        // Ensure position is set
        if (!styleObj['position']) {
          styleObj['position'] = 'absolute';
        }
        
        // Extract position from style
        let top = parseInt(styleObj['top'] || '0', 10);
        let left = parseInt(styleObj['left'] || '0', 10);
        
        // If position values don't have units, extract them as direct numbers
        if (styleObj['top'] && !isNaN(top)) {
          if (!styleObj['top'].includes('px') && !styleObj['top'].includes('%')) {
            styleObj['top'] = `${top}px`;
          }
        }
        
        if (styleObj['left'] && !isNaN(left)) {
          if (!styleObj['left'].includes('px') && !styleObj['left'].includes('%')) {
            styleObj['left'] = `${left}px`;
          }
        }
        
        // Get text content for non-image elements
        let text = '';
        if (node.tagName !== 'IMG') {
          text = Array.from(node.childNodes)
            .filter(child => child.nodeType === Node.TEXT_NODE)
            .map(child => child.textContent)
            .join("");
        } else {
          // For images, store the src as text (for displaying in editor)
          text = node.getAttribute('src') || '';
        }
          
        // Add element to our collection
        elements[id] = {
          text: text.trim(),
          style: styleObj,
          position: {
            top: parseInt(styleObj['top'] || '0', 10),
            left: parseInt(styleObj['left'] || '0', 10)
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
        } else if (textNodes.length === 0 && text.trim()) {
          // If no text nodes but we have text, create a new text node
          element.appendChild(document.createTextNode(text));
        }
      } else if (element.tagName === 'IMG') {
        // For images, update the src if it looks like a URL
        if (text.startsWith('http') || text.startsWith('data:') || text.startsWith('./')) {
          element.setAttribute('src', text);
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
        <PreviewArea 
          editableElements={editableElements}
          selectedElementId={selectedElementId}
          setSelectedElementId={setSelectedElementId}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
        />

        {/* Editing panel */}
        <div style={{ 
          width: "300px", 
          borderLeft: "1px solid #e5e7eb", 
          padding: "16px", 
          overflow: "auto" 
        }}>
          <ElementEditor 
            selectedElementId={selectedElementId}
            editableElements={editableElements}
            onTextChange={handleTextChange}
            onStyleChange={handleStyleChange}
            onPositionChange={handlePositionChange}
          />
        </div>
      </div>
    </div>
  );
};

export default RefactoredLiveEditor;
