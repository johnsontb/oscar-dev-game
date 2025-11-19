import React from 'react';

interface PreviewWindowProps {
  code: string;
  baseStyles?: string;
}

export const PreviewWindow: React.FC<PreviewWindowProps> = ({ code, baseStyles = '' }) => {
  // We use srcDoc to ensure the iframe renders reliably on every update without flickering or history issues.
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Reset & Base */
          body {
            margin: 0;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            font-family: 'Fredoka', sans-serif;
            background-color: #f8fafc;
            
            /* Grid pattern to make it look like a workspace */
            background-image: 
              linear-gradient(#e2e8f0 1px, transparent 1px),
              linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
            background-size: 20px 20px;
            
            /* Layout support */
            display: flex; 
            justify-content: center; 
            align-items: center;
            
            /* Custom level styles override default defaults */
            ${baseStyles}
          }

          /* Defaults for elements so they are visible to kids immediately */
          div { 
            min-width: 80px; 
            min-height: 80px; 
            border: 4px dashed #cbd5e1; /* Dashed border placeholder */
            margin: 10px;
            border-radius: 16px;
            background-color: rgba(255, 255, 255, 0.5);
            box-sizing: border-box;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            display: flex;
            justify-content: center;
            align-items: center;
          }

          p {
            font-size: 24px;
            font-weight: bold;
            color: #334155;
            margin: 0;
            padding: 10px;
            text-align: center;
            background: rgba(255,255,255,0.8);
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        ${code}
      </body>
    </html>
  `;

  return (
    <div className="h-full bg-slate-100 rounded-xl overflow-hidden border-4 border-slate-300 shadow-inner relative">
      <div className="absolute top-0 left-0 bg-slate-300 px-4 py-2 text-slate-600 text-sm font-bold rounded-br-xl z-10 shadow-sm tracking-wide uppercase">
        Live Preview
      </div>
      <iframe
        srcDoc={srcDoc}
        title="preview"
        className="w-full h-full block"
        sandbox="allow-scripts"
      />
    </div>
  );
};