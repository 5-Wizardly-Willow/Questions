const {
  incrementQuestionHelpfulness,
  insertQuestionForProduct,
  reportQuestion,
  selectQuestionsByProduct,
} = require('../../models/questions');

const getQuestions = (req, res) => {
  const { product_id } = req.params;
  const { page = 1, count = 5 } = req.query;
  const promise = selectQuestionsByProduct(product_id, parseInt(page), parseInt(count))
    .then(([rows, fields]) => {
      console.log('selectQuestionsByProduct');
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
      return result;
    })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send(err);
      });
};


const markQuestionReported = (req, res) => {
  const { question_id } = req.params;

  if (!question_id) {
    return res.sendStatus(400);
  }

  reportQuestion(question_id)
    .then(() => {
      console.log('reported');
      res.sendStatus(204);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

const markQuestionHelpful = (req, res) => {
  const { question_id } = req.params;

  if (!question_id) {
    return res.sendStatus(400);
  }

  incrementQuestionHelpfulness(question_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

const postQuestion = (req, res) => {
  const {
    body,
    name,
    email,
    product_id,
  } = req.body;

  if (!(parseInt(product_id) > 0)) {
    return res.sendStatus(400);
  }

  insertQuestionForProduct(product_id, body, name, email)
    .then(([result, fields]) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = {
  getQuestions,
  markQuestionHelpful,
  markQuestionReported,
  postQuestion,
};
