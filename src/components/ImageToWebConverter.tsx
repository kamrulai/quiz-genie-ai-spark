
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateCodeFromImage } from "@/utils/imageToWeb";
import { Upload, Code, Maximize, Minimize } from "lucide-react";
import CodePreview from "./CodePreview";

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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Image to Web Converter
        </h1>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="flex items-center gap-2"
        >
          Back
        </Button>
      </div>

      {!isGenerated ? (
        <Card className="p-6 shadow-lg border-t-4 border-t-purple-500">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">
                Upload an image to convert
              </h2>
              <p className="text-gray-500 mt-2">
                Our AI will convert your image to responsive React code with custom CSS
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                {imagePreview ? (
                  <div className="space-y-4 w-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-md object-contain"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="w-full"
                    >
                      Remove image
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Drag and drop or click to upload
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.querySelector('input[type="file"]')?.click()}
                    >
                      Select image
                    </Button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
                disabled={!selectedImage || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Generating Code...
                  </div>
                ) : (
                  "Generate Web Code"
                )}
              </Button>
            </form>
          </div>
        </Card>
      ) : (
        <div className={`space-y-6 ${isMaximized ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Generated Code
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={toggleMaximize}
                className="flex items-center gap-2"
              >
                {isMaximized ? (
                  <>
                    <Minimize className="h-4 w-4" />
                    Minimize
                  </>
                ) : (
                  <>
                    <Maximize className="h-4 w-4" />
                    Maximize
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                Upload new image
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden">
            <Tabs defaultValue="preview" className="w-full">
              <div className="border-b px-4">
                <TabsList className="h-12">
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Code
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="preview" className="p-0">
                <div className="bg-white p-6 min-h-[400px] max-h-[600px] overflow-auto">
                  <div
                    className="preview-container"
                    style={{ width: "100%", height: "100%" }}
                    dangerouslySetInnerHTML={{ __html: generatedCode }}
                  />
                </div>
              </TabsContent>
              <TabsContent value="code" className="p-0">
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
