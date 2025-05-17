
import React from "react";
import RefactoredLiveEditor from "@/features/image-to-web/RefactoredLiveEditor";

interface LiveEditorProps {
  generatedCode: string;
  onCodeUpdate: (newCode: string) => void;
}

// This is a wrapper component that helps with the migration
const LiveEditor: React.FC<LiveEditorProps> = ({ generatedCode, onCodeUpdate }) => {
  return (
    <RefactoredLiveEditor generatedCode={generatedCode} onCodeUpdate={onCodeUpdate} />
  );
};

export default LiveEditor;
