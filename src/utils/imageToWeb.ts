
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
                  text: `Convert this image to responsive HTML with inline CSS styles. 
                  Make the output look EXACTLY like the image with precise positioning.
                  
                  Requirements:
                  1. Use position:absolute for text and UI elements with PRECISE top/left values in pixels to match exactly the image.
                  2. Set a position:relative container with appropriate width/height.
                  3. Preserve all colors, backgrounds, borders, and styling from the image exactly.
                  4. Match all font sizes, font styles, colors, and text formatting precisely.
                  5. Include proper styling for all elements including borders, backgrounds, shadows if present.
                  6. For images, use https://placehold.co/ with appropriate dimensions if needed.
                  7. Use only inline CSS styles with style attributes (not React style objects).
                  8. Make sure to set background-color for containers that have backgrounds.
                  9. Ensure all HTML elements have proper opening and closing tags.
                  
                  DO NOT explain your work - respond ONLY with the complete, valid HTML code.
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
  // First check for code blocks between ```jsx or ```html and ```
  const codeBlockRegex = /```(?:jsx|html|react|tsx)?\s*([\s\S]*?)```/g;
  const matches = [...markdown.matchAll(codeBlockRegex)];
  
  if (matches && matches.length > 0) {
    // Join all found code blocks
    return matches.map(match => match[1].trim()).join('\n\n');
  }
  
  // If no code blocks found, clean the raw text to extract HTML
  // Remove any markdown formatting or explanations
  let cleanedText = markdown;
  
  // Look for HTML tags - find the first opening tag
  const firstTagIndex = cleanedText.indexOf('<');
  if (firstTagIndex >= 0) {
    cleanedText = cleanedText.substring(firstTagIndex);
    
    // Find the last closing tag
    const lastClosingTagMatch = cleanedText.match(/<\/[^>]+>(?![\s\S]*<\/)/);
    if (lastClosingTagMatch && lastClosingTagMatch.index !== undefined) {
      cleanedText = cleanedText.substring(0, lastClosingTagMatch.index + lastClosingTagMatch[0].length);
    }
  }
  
  return cleanedText.trim();
};
