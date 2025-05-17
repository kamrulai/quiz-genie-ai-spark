import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateCodeFromImage } from "@/utils/imageToWeb";
import { Upload, Code, Maximize, Minimize, PenLine } from "lucide-react";
import CodePreview from "./CodePreview";
import LiveEditor from "./LiveEditor";

const ImageToWebConverter = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("image")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setIsLoading(true);
    try {
      const code = await generateCodeFromImage(selectedImage);
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
    setImagePreview(null);
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

  const cardStyle = {
    padding: "24px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderTop: "4px solid #8b5cf6"
  };

  const cardContentStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px"
  };

  const cardHeaderStyle = {
    textAlign: "center" as const
  };

  const cardTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "600"
  };

  const cardDescriptionStyle = {
    color: "#6b7280",
    marginTop: "8px"
  };

  const uploadContainerStyle = {
    border: "2px dashed #d1d5db",
    borderRadius: "0.5rem",
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center"
  };

  const imagePreviewContainerStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    width: "100%"
  };

  const imagePreviewStyle = {
    maxHeight: "16rem",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: "0.375rem",
    objectFit: "contain" as const
  };

  const uploadIconContainerStyle = {
    height: "4rem",
    width: "4rem",
    borderRadius: "9999px",
    backgroundColor: "#f3e8ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const uploadTextContainerStyle = {
    textAlign: "center" as const,
    marginTop: "16px"
  };

  const uploadTextStyle = {
    fontSize: "0.875rem",
    color: "#6b7280"
  };

  const uploadSubtextStyle = {
    fontSize: "0.75rem",
    color: "#9ca3af"
  };

  const buttonStyle = {
    width: "100%",
    background: "linear-gradient(to right, #9333ea, #ec4899)",
    color: "white",
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500" as const,
    transition: "background 0.3s"
  };

  const loadingStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const spinnerStyle = {
    height: "20px",
    width: "20px",
    borderTop: "2px solid white",
    borderBottom: "2px solid white",
    borderRadius: "9999px",
    animation: "spin 1s linear infinite",
    marginRight: "8px"
  };

  const maximizedStyle = {
    position: "fixed" as const,
    inset: "0",
    zIndex: "50",
    backgroundColor: "white",
    padding: "16px"
  };

  const resultHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  };

  const resultTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "700"
  };

  const buttonGroupStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px"
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
        <Card style={cardStyle}>
          <div style={cardContentStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={cardTitleStyle}>
                Upload an image to convert
              </h2>
              <p style={cardDescriptionStyle}>
                Our AI will convert your image to responsive React code with custom CSS
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={uploadContainerStyle}>
                {imagePreview ? (
                  <div style={imagePreviewContainerStyle}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={imagePreviewStyle}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      style={{ width: "100%" }}
                    >
                      Remove image
                    </Button>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div style={uploadIconContainerStyle}>
                        <Upload style={{ height: "2rem", width: "2rem", color: "#8b5cf6" }} />
                      </div>
                    </div>
                    <div style={uploadTextContainerStyle}>
                      <p style={uploadTextStyle}>
                        Drag and drop or click to upload
                      </p>
                      <p style={uploadSubtextStyle}>
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      style={{
                        position: "absolute",
                        inset: "0",
                        opacity: "0",
                        cursor: "pointer"
                      }}
                      onChange={handleImageChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                      style={{ marginTop: "16px" }}
                    >
                      Select image
                    </Button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{
                  ...buttonStyle,
                  opacity: !selectedImage || isLoading ? "0.7" : "1",
                }}
                disabled={!selectedImage || isLoading}
              >
                {isLoading ? (
                  <div style={loadingStyle}>
                    <div style={spinnerStyle}></div>
                    Generating Code...
                  </div>
                ) : (
                  "Generate Web Code"
                )}
              </button>
            </form>
          </div>
        </Card>
      ) : (
        <div style={isMaximized ? maximizedStyle : { marginBottom: "24px" }}>
          <div style={resultHeaderStyle}>
            <h2 style={resultTitleStyle}>
              Generated Code
            </h2>
            <div style={buttonGroupStyle}>
              <Button
                variant="outline"
                onClick={toggleMaximize}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {isMaximized ? (
                  <>
                    <Minimize style={{ height: "16px", width: "16px" }} />
                    Minimize
                  </>
                ) : (
                  <>
                    <Maximize style={{ height: "16px", width: "16px" }} />
                    Maximize
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                Upload new image
              </Button>
            </div>
          </div>

          <Card style={{ overflow: "hidden", marginTop: "16px" }}>
            <Tabs defaultValue="preview" style={{ width: "100%" }}>
              <div style={{ borderBottom: "1px solid #e5e7eb", padding: "0 16px" }}>
                <TabsList style={{ height: "3rem" }}>
                  <TabsTrigger value="preview" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    Preview & Edit
                  </TabsTrigger>
                  <TabsTrigger value="code" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Code style={{ height: "16px", width: "16px" }} />
                    Code
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="preview" style={{ padding: "0" }}>
                <LiveEditor
                  generatedCode={generatedCode}
                  onCodeUpdate={handleCodeUpdate}
                />
              </TabsContent>
              <TabsContent value="code" style={{ padding: "0" }}>
                <CodePreview code={generatedCode} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ImageToWebConverter;
