
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

  return (
    <div className="relative">
      <div className="flex justify-between items-center p-4 bg-gray-100">
        <span className="text-sm font-semibold">React & CSS Code</span>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="text-xs h-8"
        >
          {isCopied ? "Copied!" : "Copy Code"}
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-md overflow-auto max-h-[500px] text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodePreview;
