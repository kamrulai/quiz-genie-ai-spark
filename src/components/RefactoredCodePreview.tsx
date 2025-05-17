
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatHTML, formatCSS, extractCSS } from "@/features/image-to-web/codeFormatting";

interface CodePreviewProps {
  code: string;
}

const RefactoredCodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("html");

  const copyToClipboard = async () => {
    try {
      // Copy appropriate content based on active tab
      const contentToCopy = activeTab === "html" ? code : extractCSS(code);
      
      await navigator.clipboard.writeText(contentToCopy);
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

  const formattedHTML = formatHTML(code);
  const formattedCSS = formatCSS(extractCSS(code));

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
      
      <Tabs defaultValue="html" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
        </TabsList>
        <TabsContent value="html">
          <pre style={codeContainerStyle}>
            <code dangerouslySetInnerHTML={{ __html: formattedHTML }} />
          </pre>
        </TabsContent>
        <TabsContent value="css">
          <pre style={codeContainerStyle}>
            <code dangerouslySetInnerHTML={{ __html: formattedCSS }} />
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RefactoredCodePreview;
