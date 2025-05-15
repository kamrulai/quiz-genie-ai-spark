
import { toast } from "sonner";

const API_KEY = "AIzaSyAA-LxlJvmSbFr9t3vNcYROsQUM-1823bg";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export const generateQuiz = async (title: string): Promise<QuizQuestion[]> => {
  try {
    // For Google Gemini API, we need to ensure we're using the correct endpoint format
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a quiz with 10 multiple-choice questions about "${title}". 
                  Each question should have 4 options with one correct answer. 
                  Format the response as a JSON array with this structure:
                  [
                    {
                      "question": "Question text goes here?",
                      "options": ["Option A", "Option B", "Option C", "Option D"],
                      "correctAnswer": "Option that is correct"
                    }
                  ]
                  Don't include any other text in your response, just return the JSON array.`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google API Error:", errorData);
      throw new Error(`API error: ${errorData.error?.message || "Failed to generate quiz"}`);
    }

    const data = await response.json();
    
    // Extract the text content from the response
    const textContent = data.candidates[0].content.parts[0].text;
    
    // Find the JSON array in the response
    const jsonStartIndex = textContent.indexOf("[");
    const jsonEndIndex = textContent.lastIndexOf("]") + 1;
    const jsonString = textContent.substring(jsonStartIndex, jsonEndIndex);
    
    // Parse the JSON array
    const quizQuestions: QuizQuestion[] = JSON.parse(jsonString);
    return quizQuestions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    toast.error("Failed to generate quiz. Please try again.");
    return [];
  }
};
