const {
  getAnswersByQuestion,
  postAnswerForQuestion,
  postPhotosForAnswer,
} = require('../../models/answers');

const getAnswers = (req, res) => {
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
};

const postAnswer = (req, res) => {
  const question_id = req.params.question_id;
  const {
    body,
    name,
    email,
    photos
  } = req.body;

  postAnswerForQuestion(question_id, body, name, email)
    .then(([results, fields]) => {
      const answer_id = results.insertId;
      return postPhotosForAnswer(answer_id, photos);
    })
    .then(([rows, fields]) => {

      res.sendStatus(201);
    })
    .catch((err) => res.status(400).send);
};

module.exports = {
  getAnswers,
  postAnswer,
};
