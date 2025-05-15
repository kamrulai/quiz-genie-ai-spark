
import { toast } from "sonner";

const API_KEY = "AIzaSyAA-LxlJvmSbFr9t3vNcYROsQUM-1823bg";

export const generateCodeFromImage = async (image: File): Promise<string> => {
  try {
    // Convert the image to base64
    const base64Image = await fileToBase64(image);
    
    // For Google Gemini API, we need to ensure we're using the correct endpoint format
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
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
                  text: `Convert this image to responsive React code with inline CSS styles (no Tailwind or external CSS). 
                  Make it look exactly like the image. Use modern React and inline style objects.
                  Respond only with the HTML and CSS code, no explanations needed.
                  Make sure the code is fully responsive and will adapt to different screen sizes.
                  Use only inline CSS styles with React style objects, NOT Tailwind classes.
                  `,
                },
                {
                  inline_data: {
                    mime_type: image.type,
                    data: base64Image.split(",")[1], // Remove the data:image/xxx;base64, part
                  },
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
      throw new Error(`API error: ${errorData.error?.message || "Failed to generate code"}`);
    }

    const data = await response.json();
    
    // Extract the text content from the response
    const textContent = data.candidates[0].content.parts[0].text;
    
    // Extract code blocks from the response
    const htmlCode = extractCodeFromMarkdown(textContent);
    return htmlCode;
  } catch (error) {
    console.error("Error generating code:", error);
    toast.error("Failed to generate code. Please try again.");
    return "";
  }
};

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to extract code from markdown response
const extractCodeFromMarkdown = (markdown: string): string => {
  // Simple regex to find code blocks between ```jsx or ```html and ```
  const codeBlockRegex = /```(?:jsx|html|react|tsx)?\s*([\s\S]*?)```/g;
  const matches = [...markdown.matchAll(codeBlockRegex)];
  
  if (matches && matches.length > 0) {
    // Join all found code blocks
    return matches.map(match => match[1].trim()).join('\n\n');
  }
  
  // If no code blocks found, return the whole text
  return markdown;
};
