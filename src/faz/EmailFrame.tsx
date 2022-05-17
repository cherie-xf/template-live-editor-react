import { useRef, useEffect, useState } from 'react';
import beautify from 'js-beautify';

interface Props {
  content: string;
  setNewContent: React.Dispatch<any>;
  frameStyle?: React.CSSProperties;
  stylesheets?: Array<string>;
  setEditContent?: React.Dispatch<any>;
  changeContent?: string;
}
export default function EmailFrame(props: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const {
    content,
    setNewContent,
    frameStyle,
    stylesheets,
    setEditContent,
    changeContent
  } = props;
  const [currentDomId, setCurrentDomId] = useState<string | null>('');

  const formatCode = (code: string) => {
    const formatted = beautify(code, {
      indent_size: 2,
      space_in_empty_paren: true
    });
    console.log('formatted', formatted);
    return formatted;
  };

  const handleMouseUp = (event: MouseEvent) => {
    const dom = event.target as HTMLElement;
    if (dom.hasAttribute('data-customized') && setEditContent) {
      dom.style.outline = '';
      dom.style.cursor = '';
      dom.removeAttribute('title');
      const str = dom.outerHTML;
      console.log('mouse click, dom outerHTML: ', str);
      setCurrentDomId(dom.getAttribute('id'));
      setEditContent && setEditContent(str);
    }
  };

  const handleMouseEnter = (event: MouseEvent) => {
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
      dom.style.outline = '';
      dom.style.cursor = '';
      dom.removeAttribute('title');
    }
  };

  const initIframe = () => {
    if (frameRef.current?.contentDocument) {
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
            dom.removeEventListener('mouseenter', handleMouseEnter);
            dom.removeEventListener('mouseleave', handleMouseLeave);
          }
        });
      };
    }
  };
  useEffect(() => {
    initIframe();
    setTimeout(() => {
      console.log('================iframe content changed');
      if (currentDomId && frameRef.current) {
        const frameDoument = frameRef.current.contentDocument;
        const body = frameDoument?.body;
        if (body) {
          const currentDom = body.querySelector(`#${currentDomId}`);
          const str = currentDom?.outerHTML;
          setEditContent && setEditContent(str);
        }
      }
    });
  }, [content]);

  useEffect(() => {
    console.log('----------- first load');
    setCurrentDomId('');
    initIframe();
    // }, [frameRef, content]);
  }, [frameRef]);

  useEffect(() => {
    if (frameRef.current?.contentDocument && changeContent && currentDomId) {
      const frameDoument = frameRef.current.contentDocument;
      const body = frameDoument.body;
      const currentDom = body.querySelector(`#${currentDomId}`);
      if (currentDom?.tagName === 'IMG') {
        const newSrc = getImgAttribute(changeContent, 'src');
        const newStyle = getImgAttribute(changeContent, 'style');
        const newAlt = getImgAttribute(changeContent, 'alt');
        const newDataHref = getImgAttribute(changeContent, 'data-href');
        newSrc && currentDom.setAttribute('src', newSrc);
        newStyle && currentDom.setAttribute('style', newStyle);
        newAlt && currentDom.setAttribute('alt', newAlt);
        newDataHref && currentDom.setAttribute('data-href', newDataHref);
      } else if (currentDom && currentDom.innerHTML !== changeContent) {
        console.log('------------ changeContent listen', changeContent);
        currentDom.innerHTML = changeContent;
      }
      setNewContent(body.innerHTML);
    }
  }, [changeContent]);

  return (
    <div className="preview">
      <iframe ref={frameRef} />
    </div>
  );
}

const getImgAttribute = (source: string, name: string): string | undefined => {
  const regrexMap: Record<string, any> = {
    src: /src="(.*?)"/,
    alt: /alt="(.*?)"/,
    style: /style="(.*?)"/,
    'data-href': /data-href="(.*?)"/
  };
  if (source && name && regrexMap[name]) {
    const arr = source.match(regrexMap[name]);
    return arr?.[1];
  }
  return undefined;
};
