const express = require('express');
const axios = require('axios');

const db = require('../db/database.js');

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
  db.query(`
    SELECT
      questions.*,
      answers.id AS answer_id,
      answers.body AS answer_body,
      answers.answer_date,
      answers.answerer_name,
      answers.helpfulness AS answer_helpfulness,
      photos.id AS photo_id,
      photos.url AS photo_url
    FROM questions
    LEFT JOIN answers USING (question_id)
    LEFT JOIN photos ON answers.id=photos.answer_id
    WHERE product_id = ?;`, [product_id])
    .catch((err) => {
      console.log(err);
      return res.status(400).send(err);
    })
    .then(([rows, fields]) => {
      console.log('questions for ', req.params.product_id);

      const result = {
        product_id,
        results: []
      };
      console.log(1);
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

      console.log(2);
      console.log(questions);
      result.results = Object.values(questions);
      console.log(result);

      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
});

app.listen(PORT, () => {
  console.log(`Questions Service listening at http://localhost:${PORT}`)
})
