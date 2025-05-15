
import React, { useState } from "react";
import { generateQuiz, QuizQuestion } from "@/utils/googleAI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import QuizResults from "./QuizResults";
import { CheckCircle, X } from "lucide-react";

const QuizGenerator = () => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    setIsLoading(true);
    try {
      const generatedQuestions = await generateQuiz(title);
      if (generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setIsGenerated(true);
        toast.success("Quiz generated successfully!");
      } else {
        toast.error("Failed to generate quiz. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsGenerated(false);
    setQuestions([]);
    setTitle("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!isGenerated ? (
        <Card className="p-6 shadow-lg border-t-4 border-t-blue-500">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Quiz Generator
              </h1>
              <p className="text-gray-500 mt-2">
                Enter a topic and our AI will create a custom quiz for you
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Topic
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ancient Rome, JavaScript Basics, Climate Change..."
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Generating Quiz...
                  </div>
                ) : (
                  "Generate Quiz"
                )}
              </Button>
            </form>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Quiz: <span className="text-blue-600">{title}</span>
            </h2>
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              New Quiz
            </Button>
          </div>
          <QuizResults questions={questions} />
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;
