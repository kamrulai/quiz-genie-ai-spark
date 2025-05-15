
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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

  // Format code for better syntax highlighting
  const formatCode = (code: string) => {
    // Add some basic syntax highlighting
    return code
      .replace(/(&lt;[\/]?[a-zA-Z0-9]+)/g, '<span style="color: #f87171;">$1</span>')
      .replace(/([a-zA-Z-]+)=/g, '<span style="color: #60a5fa;">$1</span>=')
      .replace(/"(.*?)"/g, '"<span style="color: #a78bfa;">$1</span>"')
      .replace(/style="(.*?)"/g, 'style="<span style="color: #4ade80;">$1</span>"');
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={headerStyle}>
        <span style={titleStyle}>React & CSS Code</span>
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
      <pre style={codeContainerStyle}>
        <code dangerouslySetInnerHTML={{ __html: formatCode(code) }} />
      </pre>
    </div>
  );
};

export default CodePreview;
