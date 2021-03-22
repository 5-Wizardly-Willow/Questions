const { URL } = require('url');


const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

const isDigits = (str) => {
  const regex = /[\D]/;
  return !regex.test(str);
}

function isValidURL(url) {
  let str = url;
  // remove surrounding double quotes
  if (url[0] === '"' && url[0] === url[url.length - 1]) {
    str = url.substring(1, url.length - 1);
  }

  return !!urlPattern.test(str);
}

// or can be done in this one line ('-___-)
// let productInfo =  result[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
const parseLine = (line) => {
  const values = [];
  let terminatingSymbol = ',';
  let i = 0;
  let temp = '';

  while(i < line.length) {
    if (line[i] !== terminatingSymbol) {
      if (line[i] === '"') {
        terminatingSymbol = '"';
      } else {
        temp += line[i];
      }
    } else {
      values.push(temp);
      temp = '';
      if (terminatingSymbol === '"') {
        terminatingSymbol = ',';
        i++;
      }
    }
    i++;
  }
  if (temp.length > 0) {
    values.push(temp); //last
  }

  return values;
}

const cleanQuestions = (line) => {
  const fields = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);  // parse: 6.263s
  // const fields = parseLine(line);  // parse: 12.060s
  let isValid = true;
  let output;

  if (fields.length === 8) {
    // id - 0
    isValid = isDigits(fields[0]) ? isValid : false;
    // product_id -1
    isValid = isDigits(fields[1]) ? isValid : false;
    // body - 2
      // escape string?

    // date_written - 3
    // asker_name - 4
      // escape string?

    // asker_email - 5
      // escape email

    // reported - 6
    fields[6] = ['0', 'false'].includes(`${fields[6]}`.toLowerCase()) ? 0 : 1;

    // helpful - 7
    isValid = isDigits(fields[7]) ? isValid : false;
  } else {
    isValid = false;
  }

  if (isValid) {
    return fields.join(',');
  } else {
    return false;
  }
};

const cleanAnswers = (line) => {
  const fields = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);  // parse: 6.263s
  let isValid = true;
  let output;

  if (fields.length === 8) {
    // id - 0
    isValid = isDigits(fields[0]) ? isValid : false;
    // question_id -1
    isValid = isDigits(fields[1]) ? isValid : false;
    // body - 2
      // escape string?

    // date_written - 3
    // answerer_name - 4
      // escape string?

    // answerer_email - 5
      // escape email

    // reported - 6
    fields[6] = ['0', 'false'].includes(`${fields[6]}`.toLowerCase()) ? 0 : 1;

    // helpful - 7
    isValid = isDigits(fields[7]) ? isValid : false;
  } else {
    isValid = false;
  }

  if (isValid) {
    return fields.join(',');
  } else {
    return false;
  }
};

//6.847s
const cleanAnswersPhotos = (line) => {
  const fields = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
  let isValid = true;
  let output;
  let url;

  if (fields.length === 3) {
    // id - 0
    isValid = isDigits(fields[0]) ? isValid : false;
    // answer_id -1
    isValid = isDigits(fields[1]) ? isValid : false;
    // url - 2
    isValid = isValidURL(fields[2]) ? isValid : false;

  } else {
    isValid = false;
  }

  if (isValid) {
    return line;
  } else {
    return false;
  }
};

module.exports = {
  cleanQuestions,
  cleanAnswers,
  cleanAnswersPhotos,
};
