
// Format code for better syntax highlighting
export const formatHTML = (code: string): string => {
  // Add some basic syntax highlighting
  return code
    .replace(/(&lt;[\/]?[a-zA-Z0-9]+)/g, '<span style="color: #f87171;">$1</span>')
    .replace(/([a-zA-Z-]+)=/g, '<span style="color: #60a5fa;">$1</span>=')
    .replace(/"(.*?)"/g, '"<span style="color: #a78bfa;">$1</span>"')
    .replace(/style="(.*?)"/g, 'style="<span style="color: #4ade80;">$1</span>"');
};

export const formatCSS = (css: string): string => {
  return css
    .replace(/(\.[a-zA-Z0-9-_]+)/g, '<span style="color: #f87171;">$1</span>')
    .replace(/\{|\}/g, (match) => `<span style="color: #60a5fa;">${match}</span>`)
    .replace(/(:[^;]+;)/g, '<span style="color: #a78bfa;">$1</span>');
};

// Extract CSS from HTML
export const extractCSS = (htmlCode: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlCode;
  
  const styles: Record<string, string> = {};
  const elements = tempDiv.querySelectorAll('*[style]');
  
  elements.forEach((el, index) => {
    const style = el.getAttribute('style');
    if (style) {
      const className = `.element-${index}`;
      styles[className] = style;
    }
  });
  
  // Format into CSS
  let cssText = '';
  Object.entries(styles).forEach(([selector, rules]) => {
    cssText += `${selector} {\n`;
    rules.split(';').filter(rule => rule.trim()).forEach(rule => {
      cssText += `  ${rule.trim()};\n`;
    });
    cssText += '}\n\n';
  });
  
  return cssText;
};
