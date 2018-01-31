// A general helper class for basic Javascript helper functions
//
//-----------------------------------------------------------

export const getQueryOptions = req => {
  var options = {};
  for (var q in req.query) {
    options[q] = req.query[q].indexOf(':') > -1 ? [req.query[q].split(':')] : req.query[q];
  }
  return options;
};

// Array helper to retrieve the last element
export const getLastElementInArray = array => {
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
