const {
  insertAnswerForQuestion,
  insertPhotosForAnswer,
  selectAnswersByQuestion,
  updateAnswerHelpfulness,
  updateAnswerReported,
} = require('../../models/answers');

const getAnswers = (req, res) => {
  const { question_id } = req.params;
  const { page = 1, count = 5 } = req.query;

  selectAnswersByQuestion(question_id, parseInt(page), parseInt(count))
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

  insertAnswerForQuestion(question_id, body, name, email)
    .catch((err) => {
      err.position = "On POST Answer INSERT answer";
      throw err;
    })
    .then(([results, fields]) => {
      if (!photos || photos.length < 1) {
        return;
      }

      const answer_id = results.insertId;

      return insertPhotosForAnswer(answer_id, photos)
        .catch((err) => {
          err.position = "On POST Answer INSERT photos";
          throw err;
        });
    })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const markAnswerReported = (req, res) => {
  const { answer_id } = req.params;

  if (!answer_id) {
    return res.sendStatus(400);
  }

  updateAnswerReported(answer_id)
    .then(() => {
      console.log('reported');
      res.sendStatus(204);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

const markAnswerHelpful = (req, res) => {
  const { answer_id } = req.params;

  if (!answer_id) {
    return res.sendStatus(400);
  }

  updateAnswerHelpfulness(answer_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}


module.exports = {
  getAnswers,
  markAnswerHelpful,
  markAnswerReported,
  postAnswer,
};
