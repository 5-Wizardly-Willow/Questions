const db = require('../db/database.js');

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

module.exports.getAnswersByQuestion = (question_id, page, count) => {
  return db.query(`
    WITH top_answers AS (
      SELECT *
      FROM answers
      WHERE answers.question_id = ?
    ), answers_photos AS (
      SELECT
        photos.answer_id AS pa_id,
        JSON_OBJECTAGG(photos.id, photos.url) AS photos
      FROM top_answers
        JOIN photos
        ON photos.answer_id = top_answers.id
      GROUP BY photos.answer_id
    )
    SELECT *
    FROM top_answers
    LEFT JOIN answers_photos
      ON answers_photos.pa_id = top_answers.id
    ORDER BY
      FIELD(answerer_name, "Seller") DESC,
      helpfulness DESC
    LIMIT ?, ?;
  `, [question_id, (page - 1) * count, count]);
};