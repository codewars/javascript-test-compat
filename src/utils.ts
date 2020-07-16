export const randomNumber = () => Math.floor(Math.random() * 101);

export const randomToken = () => Math.random().toString(36).substr(8);

export const randomize = (array: any[]) => {
  const arr = array.slice();
  let i = arr.length;
  let j, x;
  while (i) {
    j = (Math.random() * i) | 0;
    x = arr[--i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
};

export const sample = (array: any[]) => array[~~(array.length * Math.random())];

export const escapeHtml = (html: any) =>
  String(html)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
