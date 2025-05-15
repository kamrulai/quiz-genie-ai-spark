
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileImage, PenSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Web Tools
          </h1>
          <p className="text-gray-600 text-lg">
            Generate quizzes or convert images to code with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quiz Generator Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mx-auto mb-4">
                <PenSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">AI Quiz Generator</h2>
              <p className="text-gray-500 text-center mb-6">
                Generate custom quizzes on any topic using AI
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link to="/quiz">Create Quiz</Link>
              </Button>
            </div>
          </div>

          {/* Image to Web Converter Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mx-auto mb-4">
                <FileImage className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">Image to Web Converter</h2>
              <p className="text-gray-500 text-center mb-6">
                Convert any image to responsive React code
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link to="/image-to-web">Convert Image</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
