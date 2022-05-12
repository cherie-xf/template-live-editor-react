import * as Handlebars from 'handlebars';
import PreviewFrame from './PreviewFrame';
import AceEditor from 'react-ace';
import { useEffect, useState } from 'react';
import data from './data.json';

import 'brace/mode/handlebars';
import 'brace/theme/monokai';
import 'brace/ext/searchbox';
import 'brace/ext/language_tools';

export const HandleBarPreview = () => {
  const [value, setValue] = useState<string>('');
  const [html, setHtml] = useState<string>('');
  const handleChange = (val: string) => {
    setValue(val);
  };

  const getHtmlFromValue = () => {
    let html = '';
    const template = Handlebars.compile(value);
    console.log('data', data[0]);
    html = template({
      name: 'Tobias',
      surname: 'Piskula',
      action_url: 'jg.or.at/xxx',
      year: new Date().getFullYear(),
      dataObj: data[0]
    });
    setHtml(html);
  };
  useEffect(() => {
    const readTemplateFile = async () => {
      const content = await fetch('edr-privision-tmp.hbs').then(result =>
        result.text()
      );
      setValue(content);
    };
    readTemplateFile()
      .then(() => {
        getHtmlFromValue();
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getHtmlFromValue();
  }, [value]);

  return (
    <div className="previewContainer">
      <AceEditor
        mode="handlebars"
        theme="monokai"
        name="my_editer_id"
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
