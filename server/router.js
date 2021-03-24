const express = require('express');
const {
  getQuestions,
  markQuestionHelpful,
  markQuestionReported,
  postQuestion,
} = require('../controllers/questions');
const {
  getAnswers,
  markAnswerHelpful,
  markAnswerReported,
  postAnswer,
} = require('../controllers/answers');

const router = express.Router();

router.get('/products/:product_id/questions', getQuestions);
router.post('/questions', postQuestion);
router.put('/questions/:question_id/helpful', markQuestionHelpful)
router.put('/questions/:question_id/report', markQuestionReported)

router.get('/questions/:question_id/answers', getAnswers);
router.post('/questions/:question_id/answers', postAnswer);
router.put('/answers/:answer_id/helpful', markAnswerHelpful)
router.put('/answers/:answer_id/report', markAnswerReported)

module.exports = router;
