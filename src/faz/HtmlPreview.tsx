import EmailFrame from './EmailFrame';
import { useEffect, useState } from 'react';

export const HtmlPreview = () => {
  const [value, setValue] = useState<string>('');
  const [html, setHtml] = useState<string>('');

  const handleChange = (val: string) => {
    setValue(val);
  };

  useEffect(() => {
    const readTemplateFile = async () => {
      const content = await fetch('faz-tmp.html').then(result => result.text());
      setValue(content);
      setHtml(content);
    };
    readTemplateFile()
      .then(() => {
        // setHtml(value)
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setHtml(value);
  }, [value]);

  return (
    <div className="previewContainer">
      <div className="editor"></div>
      <EmailFrame content={html} />
    </div>
  );
};
