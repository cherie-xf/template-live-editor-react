import { useRef, useEffect } from 'react';

interface Props {
  content: string;
  frameStyle?: React.CSSProperties;
  stylesheets?: Array<string>;
}
export default function PreviewFrame(props: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { content, frameStyle, stylesheets } = props;

  useEffect(() => {
    if (frameRef.current && frameRef.current.contentDocument) {
      const document = frameRef.current.contentDocument;
      const head = document.getElementsByTagName('head')[0];
      const body = document.body;
      body.innerHTML = content;
      const base = document.createElement('base');
      base.target = '_blank';
      head.appendChild(base);
      if (stylesheets) {
        stylesheets.forEach(url => {
          const ref = document.createElement('link');
          ref.rel = 'stylesheet';
          ref.type = 'text/css';
          ref.href = url;
          head.appendChild(ref);
        });
      }
    }
  }, [frameRef, content]);

  return (
    <div className="preview">
      <iframe ref={frameRef} />
    </div>
  );
}
