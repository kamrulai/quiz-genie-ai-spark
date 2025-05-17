
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface UploadFormProps {
  onImageGenerate: (file: File) => void;
  isLoading: boolean;
}

const UploadForm: React.FC<UploadFormProps> = ({ onImageGenerate, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    onImageGenerate(selectedImage);
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

  return (
    <Card style={{
      padding: "24px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      borderTop: "4px solid #8b5cf6"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column" as const,
        gap: "24px"
      }}>
        <div style={{
          textAlign: "center" as const
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "600"
          }}>
            Upload an image to convert
          </h2>
          <p style={{
            color: "#6b7280",
            marginTop: "8px"
          }}>
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
  );
};

export default UploadForm;
