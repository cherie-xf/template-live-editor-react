import { useRef, useEffect } from 'react';

interface Props {
  content: string;
  frameStyle?: React.CSSProperties;
  stylesheets?: Array<string>;
}
export default function EmailFrame(props: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { content, frameStyle, stylesheets } = props;

  const handleMouseUp = (event: MouseEvent) => {
    console.log(event.target);
  };

  const handleMouseEnter = (event: MouseEvent) => {
    console.log('mouse over', event.target);
    if (event.target) {
      const dom: HTMLElement = event.target as HTMLElement;
      dom.style.outline = '1px dotted red';
      dom.style.cursor = 'pointer';
      dom.setAttribute('title', 'click to edit');
    }
  };

  const handleMouseLeave = (event: MouseEvent) => {
    if (event.target) {
      const dom: HTMLElement = event.target as HTMLElement;
      dom.style.outline = 'none';
      dom.style.cursor = 'default';
      dom.setAttribute('title', '');
    }
  };

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
      body.addEventListener('mouseup', handleMouseUp);
      body.querySelectorAll('[data-customized]').forEach((item: Element) => {
        if (item) {
          const dom = item as HTMLElement;
          dom.addEventListener('mouseenter', handleMouseEnter);
          dom.addEventListener('mouseleave', handleMouseLeave);
        }
      });
      return () => {
        body.removeEventListener('mouseup', handleMouseUp);
        body.querySelectorAll('[data-customized]').forEach((item: Element) => {
          if (item) {
            const dom = item as HTMLElement;
            dom.removeEventListener('mouseenter', handleMouseLeave);
          }
        });
      };
    }
  }, [frameRef, content]);

  return (
    <div className="preview">
      <iframe ref={frameRef} />
    </div>
  );
}
