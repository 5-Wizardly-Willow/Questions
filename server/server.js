const express = require('express');
const axios = require('axios');

const db = require('../db/database.js');
const {
  getQuestionsByProduct,
  getAnswersByQuestion,
} = require('../db/queries');

const app = express();
const PORT = 3000;

app.use(express.urlencoded());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/test', (req, res) => {
  db.query('SELECT * FROM questions;')
    .then(([rows, fields]) => {
      console.log(rows);
      res.send(200);
    });
});


app.get('/api/products/:product_id/questions', (req, res) => {
  const { product_id } = req.params;
  const { page = 1, count = 5 } = req.query;

  getQuestionsByProduct(product_id, parseInt(page), parseInt(count))
    .catch((err) => {
      console.log(err);
      return res.status(400).send(err);
    })
    .then(([rows, fields]) => {
      const result = {
        product_id,
        results: []
      };

      const questions = rows.reduce((acc, current) => {
        const {
          question_id,
          question_body,
          question_date,
          asker_name,
          question_helpfulness,
          reported,
          answer_id,
          answer_body,
          answer_date,
          answerer_name,
          answer_helpfulness,
          photo_id,
          photo_url
        } = current;

        if (acc[question_id] === undefined) {
          acc[question_id] = {
            question_id,
            question_body,
            question_date,
            asker_name,
            question_helpfulness,
            reported,
            answers: {}
          };
        }
        let thisQuestion = acc[question_id];

        if (answer_id) {
          if (thisQuestion.answers[answer_id] === undefined) {
            thisQuestion.answers[answer_id] = {
              id: answer_id,
              body: answer_body,
              date: answer_date,
              answerer_name,
              helpfulness: answer_helpfulness,
              photos: [],
            }
          }

          let thisAnswer = thisQuestion.answers[answer_id];

          if (photo_url) {
            thisAnswer.photos.push(photo_url);
          }
        }

        return acc;
      }, {});

      result.results = Object.values(questions).sort((a, b) => b.question_helpfulness - a.question_helpfulness);

      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
});

app.get('/api/questions/:question_id/answers', (req, res) => {
  const { question_id } = req.params;
  const { page = 1, count = 5 } = req.query;

  getAnswersByQuestion(question_id, parseInt(page), parseInt(count))
    .catch((err) => {
      return res.status(400).send(err);
    })
    .then(([rows, fields]) => {
      const answers = rows.map(({
        id,
        question_id,
        body,
        answer_date,
        answerer_name,
        helpfulness,
        photos,
      }) => {
        return {
          answer_id: id,
          body,
          date: answer_date,
          answerer_name,
          helpfulness,
          photos: Object.entries(photos || {}).map(([id, url]) => {
            return {
              id,
              url
            };
          }),
        };
      });

      const responseObj = {
        question: question_id,
        page,
        count,
        results: answers,
      };

      res.status(200).send(responseObj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.listen(PORT, () => {
  console.log(`Questions Service listening at http://localhost:${PORT}`)
})
