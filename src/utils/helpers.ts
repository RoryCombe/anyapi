import { format } from 'date-fns';

export const getMeta = (
  count: number,
  page: string,
  pageSize: number,
  baseUrl: string,
  collection: string
) => ({
  count,
  pages: Math.ceil(count / pageSize),
  next: `${baseUrl}/${collection}?page=${parseInt(page, 10) + 1}`,
  prev: `${baseUrl}/${collection}?page=${parseInt(page, 10) - 1}`,
});

export const getDateNow = () => format(new Date(), 'yyyy-MM-dd HH:mm:ss');

/*
// Array helper to retrieve the last element
export const getLastElementInArray = (array) => {
  if (array.length > 0) return array[array.length - 1];
  else return undefined;
};

// Array Remove - By John Resig (MIT Licensed)
export const arrayRemove = (array, from, to) => {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

export const getDateNow = () => {
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth() + 1;
  var y = date.getFullYear();
  var h = date.getHours();
  var min = date.getMinutes();
  var s = date.getSeconds();
  return (
    '' +
    y +
    '' +
    (m <= 9 ? '0' + m : m) +
    '' +
    (d <= 9 ? '0' + d : d) +
    ' ' +
    (h <= 9 ? '0' + h : h) +
    ':' +
    (min <= 9 ? '0' + min : min) +
    ':' +
    (s <= 9 ? '0' + s : s)
  );
};
*/
