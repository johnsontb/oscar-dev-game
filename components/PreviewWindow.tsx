import React, { useEffect, useRef } from 'react';

interface PreviewWindowProps {
  code: string;
  baseStyles?: string;
}

export const PreviewWindow: React.FC<PreviewWindowProps> = ({ code, baseStyles = '' }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <html>
            <head>
              <style>
                ${baseStyles}
                /* Default friendly styles for elements if not specified */
                div { transition: all 0.3s ease; box-sizing: border-box; }
              </style>
            </head>
            <body>
              ${code}
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [code, baseStyles]);

  return (
    <div className="h-full bg-white rounded-xl overflow-hidden border-4 border-slate-200 shadow-2xl relative">
        <div className="absolute top-0 left-0 bg-slate-200 px-3 py-1 text-slate-600 text-xs font-bold rounded-br-lg z-10">
            SHIP PREVIEW
        </div>
      <iframe
        ref={iframeRef}
        title="preview"
        className="w-full h-full"
        sandbox="allow-scripts"
      />
    </div>
  );
};