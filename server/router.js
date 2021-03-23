const express = require('express');
const { getQuestions } = require('../controllers/questions');
const { getAnswers, postAnswer } = require('../controllers/answers');

const router = express.Router();

router.get('/products/:product_id/questions', getQuestions);

router.get('/questions/:question_id/answers', getAnswers);
router.post('/questions/:question_id/answers', postAnswer);

module.exports = router;
