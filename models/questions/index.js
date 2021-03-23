const db = require('../../db/database.js');

/**
 * SELECTS questions for a specific product
 * @function
 * @param {string} product_id - id (foreign key) of the product
 * @param {int} page - page number of results beginning with 1
 * @param {int} count - number of questions in page beginning with 1
 */
const selectQuestionsByProduct = (product_id, page, count) => {
  return db.query(`
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
    WHERE product_id = ?
    ORDER BY questions.question_helpfulness DESC
    LIMIT ?, ?;
    `, [product_id, (page - 1) * count, count]);
};

/**
 * UPDATES question record, sets reported column to 1.
 * @function
 * @param {string} question_id - id (foreign key) of the related question record
 */
const reportQuestion = (question_id) => {
  return db.query(`
    UPDATE questions SET reported = 1 WHERE question_id = ?;
  `, [question_id]);
};

/**
 * UPDATES question record, increments the helpfulness column.
 * @function
 * @param {string} question_id - id (foreign key) of the related question record
 */
const incrementQuestionHelpfulness = (question_id) => {
  return db.query(`
    UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ?;
  `, [question_id]);
};

module.exports = {
  incrementQuestionHelpfulness,
  reportQuestion,
  selectQuestionsByProduct,
};
