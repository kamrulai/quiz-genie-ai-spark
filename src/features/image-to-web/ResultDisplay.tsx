
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Maximize, Minimize } from "lucide-react";
import RefactoredCodePreview from "@/components/RefactoredCodePreview";
import RefactoredLiveEditor from "./RefactoredLiveEditor";

interface ResultDisplayProps {
  generatedCode: string;
  onCodeUpdate: (newCode: string) => void;
  onReset: () => void;
  isMaximized: boolean;
  toggleMaximize: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  generatedCode,
  onCodeUpdate,
  onReset,
  isMaximized,
  toggleMaximize
}) => {
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
            onClick={onReset}
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
            <RefactoredLiveEditor
              generatedCode={generatedCode}
              onCodeUpdate={onCodeUpdate}
            />
          </TabsContent>
          <TabsContent value="code" style={{ padding: "0" }}>
            <RefactoredCodePreview code={generatedCode} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ResultDisplay;
