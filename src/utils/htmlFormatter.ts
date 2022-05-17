import { br, whichTag } from './helper';

export const prettifyHtml = (html: string): string => {
  let indent = 0,
    mode = 'IDLE',
    inTag = false,
    tag = '',
    tagToCome = '',
    shouldBreakBefore = false,
    shouldBreakAfter = false,
    breakBefore = ['p', 'ul', 'li'],
    breakAfter = ['div', 'h1', 'h2', 'h3', 'h4', 'p', 'ul', 'li'];

  return html.split('').reduce((output, char, index) => {
    if (char === '<') {
      tagToCome = whichTag(html, index);
      if (tagToCome && breakBefore.indexOf(tagToCome) >= 0) {
        shouldBreakBefore = true;
      } else {
        shouldBreakBefore = false;
      }
      mode = 'TAG';
      inTag = true;
      output += (shouldBreakBefore ? br(indent) : '') + '<';
    } else if (char === '/' && mode == 'TAG') {
      mode = 'CLOSING_TAG';
      inTag = true;
      output += '/';
    } else if (char === ' ') {
      inTag = false;
      output += ' ';
    } else if (char === '>') {
      if (mode === 'TAG' || mode === 'CLOSING_TAG') {
        indent += mode === 'TAG' ? +1 : -1;

        shouldBreakAfter = breakAfter.indexOf(tag) >= 0;
        inTag = false;
        tag = '';
      }
      output += '>';
      output += shouldBreakAfter ? br(indent) : '';
    } else {
      output += char;

      if (inTag) {
        tag += char;
      }
    }

    return output;
  }, '');
};
