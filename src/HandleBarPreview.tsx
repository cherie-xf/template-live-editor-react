import * as Handlebars from 'handlebars';
import PreviewFrame from './PreviewFrame';
import AceEditor from 'react-ace';
import { template as email } from './template';
import { useEffect, useState } from 'react';

import 'brace/mode/handlebars';
import 'brace/theme/monokai';
import 'brace/ext/searchbox';
import 'brace/ext/language_tools';

interface state {
  value: string;
}

interface props {}

export const HandleBarPreview = () => {
  const [value, setValue] = useState<string>(email);
  const [html, setHtml] = useState<string>('');
  const handleChange = (val: string) => {
    setValue(val);
  };
  useEffect(() => {
    const template = Handlebars.compile(value);
    let html = '';
    try {
      html = template({
        name: 'Tobias',
        surname: 'Piskula',
        action_url: 'jg.or.at/xxx'
      });
    } catch (e) {
      html = value;
    }
    setHtml(html);
  }, [value]);
  return (
    <div className="previewContainer">
      <AceEditor
        mode="handlebars"
        theme="monokai"
        name="blah2"
        className="editor"
        //onLoad={this.onLoad}
        onChange={handleChange}
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        value={value}
        width="100%"
        height="100%"
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2
        }}
      />
      <PreviewFrame
        // frameStyle={{ width: '99vw', height: '48vh' }}
        content={html}
      />
    </div>
  );
};
