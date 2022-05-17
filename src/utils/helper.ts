const _tabs = (number: number) => {
  let output = '';

  for (let cnt = 0; cnt < number; cnt++) {
    output += '\t';
  }

  return output;
};

export const br = (indent: number) => {
  return '\n' + _tabs(indent);
};

export const whichTag = (html: string, index: number) => {
  let inTag = true,
    tag = '';

  const arr = html.split('');

  for (let i = index + 1; i < index + 10; i++) {
    const char = arr[i];

    if (char >= 'a' && char <= 'z' && inTag) {
      tag += char;
    } else if (char !== '/') {
      inTag = false;
    }
  }

  return tag;
};
