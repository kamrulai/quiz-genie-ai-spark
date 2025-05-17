
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface CodePreviewProps {
  code: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy code");
    }
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f9fafb"
  };

  const titleStyle = {
    fontSize: "0.875rem",
    fontWeight: "600"
  };

  const codeContainerStyle = {
    backgroundColor: "#111827",
    color: "#f9fafb",
    padding: "16px",
    borderBottomLeftRadius: "6px",
    borderBottomRightRadius: "6px",
    overflow: "auto",
    maxHeight: "500px",
    fontSize: "0.875rem"
  };

  // Extract CSS from HTML
  const extractCSS = (htmlCode: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlCode;
    
    const styles: Record<string, string> = {};
    const elements = tempDiv.querySelectorAll('*[style]');
    
    elements.forEach((el, index) => {
      const style = el.getAttribute('style');
      if (style) {
        const className = `.element-${index}`;
        styles[className] = style;
      }
    });
    
    // Format into CSS
    let cssText = '';
    Object.entries(styles).forEach(([selector, rules]) => {
      cssText += `${selector} {\n`;
      rules.split(';').filter(rule => rule.trim()).forEach(rule => {
        cssText += `  ${rule.trim()};\n`;
      });
      cssText += '}\n\n';
    });
    
    return cssText;
  };

  // Format code for better syntax highlighting
  const formatHTML = (code: string) => {
    // Add some basic syntax highlighting
    return code
      .replace(/(&lt;[\/]?[a-zA-Z0-9]+)/g, '<span style="color: #f87171;">$1</span>')
      .replace(/([a-zA-Z-]+)=/g, '<span style="color: #60a5fa;">$1</span>=')
      .replace(/"(.*?)"/g, '"<span style="color: #a78bfa;">$1</span>"')
      .replace(/style="(.*?)"/g, 'style="<span style="color: #4ade80;">$1</span>"');
  };

  const formatCSS = (css: string) => {
    return css
      .replace(/(\.[a-zA-Z0-9-_]+)/g, '<span style="color: #f87171;">$1</span>')
      .replace(/\{|\}/g, (match) => `<span style="color: #60a5fa;">${match}</span>`)
      .replace(/(:[^;]+;)/g, '<span style="color: #a78bfa;">$1</span>');
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={headerStyle}>
        <span style={titleStyle}>Code Preview</span>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          style={{
            fontSize: "0.75rem",
            height: "2rem"
          }}
        >
          {isCopied ? "Copied!" : "Copy Code"}
        </Button>
      </div>
      
      <Tabs defaultValue="html">
        <TabsList className="bg-muted grid w-full grid-cols-2">
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
        </TabsList>
        <TabsContent value="html">
          <pre style={codeContainerStyle}>
            <code dangerouslySetInnerHTML={{ __html: formatHTML(code) }} />
          </pre>
        </TabsContent>
        <TabsContent value="css">
          <pre style={codeContainerStyle}>
            <code dangerouslySetInnerHTML={{ __html: formatCSS(extractCSS(code)) }} />
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodePreview;
