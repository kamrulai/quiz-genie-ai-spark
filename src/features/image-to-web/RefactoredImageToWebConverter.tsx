
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateCodeFromImage } from "@/utils/imageToWeb";
import UploadForm from "./UploadForm";
import ResultDisplay from "./ResultDisplay";

const RefactoredImageToWebConverter = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleImageGenerate = async (file: File) => {
    setSelectedImage(file);
    setIsLoading(true);
    try {
      const code = await generateCodeFromImage(file);
      setGeneratedCode(code);
      setIsGenerated(true);
      toast.success("Code generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setGeneratedCode("");
    setIsGenerated(false);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleCodeUpdate = (newCode: string) => {
    setGeneratedCode(newCode);
  };

  const containerStyle = {
    width: "100%",
    maxWidth: "64rem",
    marginLeft: "auto",
    marginRight: "auto"
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px"
  };

  const titleStyle = {
    fontSize: "1.875rem",
    fontWeight: "700",
    background: "linear-gradient(to right, #9333ea, #ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          Image to Web Converter
        </h1>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          Back
        </Button>
      </div>

      {!isGenerated ? (
        <UploadForm 
          onImageGenerate={handleImageGenerate}
          isLoading={isLoading}
        />
      ) : (
        <ResultDisplay 
          generatedCode={generatedCode}
          onCodeUpdate={handleCodeUpdate}
          onReset={handleReset}
          isMaximized={isMaximized}
          toggleMaximize={toggleMaximize}
        />
      )}
    </div>
  );
};

export default RefactoredImageToWebConverter;
