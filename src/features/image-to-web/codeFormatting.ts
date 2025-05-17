
// The function to format HTML code with highlighting
export const formatHTML = (html: string) => {
  if (!html) return "";

  // Basic HTML formatting - replace < and > with &lt; and &gt; to display as text
  let formattedHTML = html
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Add syntax highlighting
  formattedHTML = formattedHTML
    // Highlight HTML tags
    .replace(/&lt;(\/?[a-zA-Z][a-zA-Z0-9]*)/g, '<span style="color: #e06c75;">&lt;$1</span>')
    // Highlight attributes
    .replace(/([a-zA-Z-]+)=/g, '<span style="color: #d19a66;">$1</span>=')
    // Highlight attribute values
    .replace(/"([^"]*)"/g, '<span style="color: #98c379;">"$1"</span>');

  return formattedHTML;
};

// Extract CSS from inline styles in HTML
export const extractCSS = (html: string) => {
  if (!html) return "";

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  
  // Find all elements with style attributes
  const styledElements = tempDiv.querySelectorAll("[style]");
  
  // Build a CSS stylesheet
  let cssRules: { selector: string; styles: string }[] = [];
  
  styledElements.forEach((el, index) => {
    // Create a unique class name
    const className = `element-${index}`;
    
    // Get the element's tag name
    const tagName = el.tagName.toLowerCase();
    
    // Get the style attribute
    const styleAttr = el.getAttribute("style") || "";
    
    // Add to our CSS rules
    cssRules.push({
      selector: `.${className}`,
      styles: styleAttr
    });
  });
  
  // Format the CSS
  let cssText = "";
  cssRules.forEach(rule => {
    cssText += `${rule.selector} {\n`;
    
    // Split the styles by semicolon and format each property
    const styles = rule.styles.split(";");
    styles.forEach(style => {
      const trimmed = style.trim();
      if (trimmed) {
        cssText += `  ${trimmed};\n`;
      }
    });
    
    cssText += "}\n\n";
  });
  
  return cssText;
};

// Format CSS with syntax highlighting
export const formatCSS = (css: string) => {
  if (!css) return "";

  // Basic CSS formatting
  let formattedCSS = css
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Add syntax highlighting
  formattedCSS = formattedCSS
    // Highlight selectors
    .replace(/([.#][a-zA-Z0-9_-]+)/g, '<span style="color: #e06c75;">$1</span>')
    // Highlight properties
    .replace(/([a-zA-Z-]+):/g, '<span style="color: #d19a66;">$1</span>:')
    // Highlight values
    .replace(/:([^;]*);/g, ':<span style="color: #98c379;">$1</span>;')
    // Highlight braces
    .replace(/[{}]/g, '<span style="color: #abb2bf;">$&</span>');

  return formattedCSS;
};
