const fs = require('fs');
const readline = require('readline');
const {
  cleanQuestions,
  cleanAnswers,
  cleanAnswersPhotos,
} = require('./cleaners');

const fileArg = process.argv.slice(2)[0];

let filename = 'questions';
let cleaner = cleanQuestions;

if (fileArg === 'questions') {
  // is default
}
if (fileArg === 'answers') {
  filename = 'answers';
  cleaner = cleanAnswers;
}
if (fileArg === 'answers_photos') {
  filename = 'answers_photos';
  cleaner = cleanAnswersPhotos;
}

const readLineInterface = readline.createInterface({
  input: fs.createReadStream(`../data/${filename}.csv`),
  output: fs.createWriteStream(`../data/${filename}_clean.csv`),
  crlfDelay: Infinity
});

readLineInterface.ouputError = fs.createWriteStream(`../data/${filename}_invalid.csv`);

let count = 0;
const invalidLines = [];

console.time("parse");

readLineInterface
  .on('line', (line) => {
    const result = cleaner(line);

    if (result) {
      readLineInterface.output.write(result + '\n');
    } else {
      readLineInterface.ouputError.write(`${line}\n`);
    }

    count++;
  })
  .on('close', () => {
    console.log('Parsed ', count, ' lines of CSV from', filename, ' in... ');
    console.timeEnd("parse");
  });