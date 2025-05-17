
import RefactoredImageToWebConverter from "@/features/image-to-web/RefactoredImageToWebConverter";

const ImageToWeb = () => {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(to bottom, #f9fafb, #f3f4f6)", 
      padding: "40px 16px" 
    }}>
      <RefactoredImageToWebConverter />
    </div>
  );
};

export default ImageToWeb;
