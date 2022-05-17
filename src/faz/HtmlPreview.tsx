import EmailFrame from './EmailFrame';
import { useEffect, useRef, useState } from 'react';
import { Box, Button, makeStyles, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import {
  IDomEditor,
  IEditorConfig,
  i18nChangeLanguage
} from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';
import AceEditor from 'react-ace';
import 'brace/mode/handlebars';
import 'brace/theme/monokai';
import 'brace/ext/searchbox';
import 'brace/ext/language_tools';
import { prettifyHtml } from '../utils/htmlFormatter';

export const HtmlPreview = () => {
  const [value, setValue] = useState<string>('');
  const [html, setHtml] = useState<string>('');
  const [newhtml, setNewHtml] = useState<string>('');
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [editContent, setEditContent] = useState<Record<string, string>>({
    inner: '',
    outer: ''
  });
  const [textEditValue, setTextEditValue] = useState<string>('');
  const [htmlEditValue, setHtmlEditValue] = useState<string>('');
  const [changeContent, setChangeContent] = useState<Record<string, string>>({
    inner: '',
    outer: ''
  });
  const [tab, setTab] = useState<string>('text-editor');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
    if (newhtml) {
      setHtml(newhtml);
    }
  };

  const handleChange = (editor: IDomEditor) => {
    // selected text
    const selectionText = editor.getSelectionText();
    const content = editor.children;
    const contentStr = JSON.stringify(content);
    console.log('editor on change', editor.getHtml());
    if (editor.getHtml()) {
      const html = editor
        .getHtml()
        .replace(/<\/p>$/, '')
        .replace(/^<p>/, '')
        .replace(/[&]nbsp[;]/gi, ' ');
      console.log('---------- after replaces ', html);
      setChangeContent({ outer: '', inner: html });
    }
  };
  const handleHtmlChange = (val: string) => {
    // setEditContent(val);
    setHtmlEditValue(val);
    const html = val
      .trim()
      .replace(/(\r\n|\n|\r|\t)/gm, '')
      .replace(/[<]br[^>]*[>]/gi, '');
    setChangeContent({ inner: '', outer: html });
  };
  const saveChange = () => {
    console.log('new html content is :', newhtml);
    alert('new html content is :' + newhtml);
  };

  const cancel = () => {
    reset();
    alert('reset and exist editing');
  };

  const reset = () => {
    console.log('reset content');
    setNewHtml('');
    setHtml(value + new Date().getTime());
  };

  useEffect(() => {
    const readTemplateFile = async () => {
      const content = await fetch('faz-tmp.html').then(result => result.text());
      setValue(content);
      setHtml(content);
    };
    readTemplateFile()
      .then(() => {})
      .catch(console.error);
  }, []);

  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  useEffect(() => {
    setHtml(value);
  }, [value]);

  useEffect(() => {
    if (editContent.outer || editContent.inner) {
      // for the textEditor, it need outerHtml to get the inner content itself
      setTextEditValue(editContent.outer);
      const html = prettifyHtml(editContent.outer);
      setHtmlEditValue(html);
    }
    console.log('editContent update', editContent);
  }, [editContent]);

  const toolbarConfig = {};
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: 'click preview to begin editing...'
  };
  i18nChangeLanguage('en');

  return (
    <div className="wrapper">
      <div className="previewContainer">
        <div className="editor">
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleTabChange}
                aria-label="lab API tabs example"
                // unmountOnExit={false}
              >
                <Tab
                  label="Text Editor"
                  value="text-editor"
                  sx={{ textTransform: 'none' }}
                />
                <Tab
                  label="HTML Editor"
                  value="html"
                  sx={{ textTransform: 'none' }}
                />
              </TabList>
            </Box>
            <TabPanel value="text-editor">
              <div className="text-editor">
                <Toolbar
                  editor={editor}
                  defaultConfig={toolbarConfig}
                  mode="simple"
                  style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                  defaultConfig={editorConfig}
                  value={textEditValue}
                  onCreated={setEditor}
                  onChange={handleChange}
                  mode="simple"
                  style={{ minHeight: '100px', height: '100%' }}
                />
              </div>
            </TabPanel>
            <TabPanel
              value="html"
              sx={{
                height: 'calc( 100% - 50px)',
                padding: '0'
              }}
            >
              <AceEditor
                mode="html"
                theme="monokai"
                name="my_editer_id"
                //onLoad={this.onLoad}
                onChange={handleHtmlChange}
                fontSize={14}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={true}
                value={htmlEditValue}
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
            </TabPanel>
          </TabContext>
        </div>
        <EmailFrame
          content={html}
          setNewContent={setNewHtml}
          setEditContent={setEditContent}
          changeContent={changeContent}
        />
      </div>
      <div className="control-btns">
        <Button
          sx={{ margin: '10px 20px', textTransform: 'unset' }}
          variant="outlined"
          onClick={() => {
            console.log('button clicked');
            cancel();
          }}
        >
          {'Cancle'}
        </Button>

        <Button
          sx={{ margin: '10px 20px', textTransform: 'unset' }}
          variant="outlined"
          onClick={() => {
            console.log('button clicked');
            reset();
          }}
        >
          {'Reset'}
        </Button>

        <Button
          sx={{ margin: '10px 20px', textTransform: 'unset' }}
          variant="outlined"
          onClick={() => {
            console.log('button clicked');
            saveChange();
          }}
        >
          {'Save'}
        </Button>
      </div>
    </div>
  );
};
