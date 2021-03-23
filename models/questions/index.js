const db = require('../../db/database.js');

module.exports.getQuestionsByProduct = (product_id, page, count) => {
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
