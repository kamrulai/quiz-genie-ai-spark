
import { useState } from "react";
import { QuizQuestion } from "@/utils/googleAI";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

interface QuizResultsProps {
  questions: QuizQuestion[];
}

const QuizResults = ({ questions }: QuizResultsProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    if (showResults) return; // Don't allow changes after submission
    
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
    const correctAnswers = questions.reduce((count, question, index) => {
      return selectedAnswers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);
    
    const percentage = (correctAnswers / questions.length) * 100;
    
    if (percentage >= 80) {
      toast.success(`Great job! You scored ${correctAnswers}/${questions.length} (${percentage.toFixed(1)}%)`);
    } else if (percentage >= 50) {
      toast.info(`You scored ${correctAnswers}/${questions.length} (${percentage.toFixed(1)}%)`);
    } else {
      toast.info(`You scored ${correctAnswers}/${questions.length} (${percentage.toFixed(1)}%). Try again!`);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  return (
    <div className="space-y-8">
      {questions.map((question, questionIndex) => (
        <Card key={questionIndex} className="p-6 shadow-md">
          <div className="space-y-4">
            <h3 className="text-xl font-medium">
              {questionIndex + 1}. {question.question}
            </h3>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => {
                const isSelected = selectedAnswers[questionIndex] === option;
                const isCorrect = question.correctAnswer === option;
                
                let className = "border p-3 rounded-md text-left w-full transition-all";
                
                if (showResults) {
                  if (isCorrect) {
                    className += " bg-green-100 border-green-500";
                  } else if (isSelected) {
                    className += " bg-red-100 border-red-500";
                  }
                } else if (isSelected) {
                  className += " bg-blue-100 border-blue-500";
                } else {
                  className += " hover:bg-gray-50";
                }
                
                return (
                  <button
                    key={optionIndex}
                    className={className}
                    onClick={() => handleSelectAnswer(questionIndex, option)}
                    disabled={showResults}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResults && isCorrect && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {showResults && isSelected && !isCorrect && (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      ))}

      <div className="flex justify-center space-x-4">
        {!showResults ? (
          <Button 
            onClick={handleSubmit} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={Object.keys(selectedAnswers).length !== questions.length}
          >
            Submit Answers
          </Button>
        ) : (
          <Button 
            onClick={handleReset}
            variant="outline"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizResults;
