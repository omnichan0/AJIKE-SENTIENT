import React, { useRef, useEffect, useState } from 'react';

interface SandboxProps {
  code: string;
  onOutput: (output: string) => void;
}

export function CodeSandbox({ code, onOutput }: SandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const sandboxCode = `
      <html>
        <body>
          <script>
            window.addEventListener('message', (event) => {
              const { code } = event.data;
              try {
                const result = eval(code);
                window.parent.postMessage({ type: 'output', result: String(result) }, '*');
              } catch (error) {
                window.parent.postMessage({ type: 'output', result: 'Error: ' + error.message }, '*');
              }
            });
          </script>
        </body>
      </html>
    `;

    if (iframeRef.current) {
      iframeRef.current.srcdoc = sandboxCode;
      iframeRef.current.onload = () => {
        iframeRef.current?.contentWindow?.postMessage({ code }, '*');
      };
    }
  }, [code]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'output') {
        onOutput(event.data.result);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onOutput]);

  return <iframe ref={iframeRef} className="hidden" sandbox="allow-scripts" />;
}
