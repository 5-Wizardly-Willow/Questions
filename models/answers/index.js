const db = require('../../db/database.js');

/**
 * Queries Answers records, for a question, into the database.
 * @function
 * @param {string} question_id - id (foreign key) of the related question record
 * @param {string} page - page number of answers, default 1
 * @param {int} count - number of answers in a page, default 5
 */
const selectAnswersByQuestion = (question_id, page, count) => {
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

/**
 * INSERTS an answer, for a question, into the database.
 * @function
 * @param {string} question_id - id (foreign key) of the related question record
 * @param {string} body - text of answer
 * @param {string} name - name of the person posting the answer
 * @param {string} email - email of the person posting the answer
 */
const insertAnswerForQuestion = (question_id, body, name, email) => {
  return db.query(`
    INSERT INTO answers (question_id, body, answerer_name, email)
      VALUES (?, ?, ?, ?)
  `, [question_id, body, name, email]);
};

/**
 * INSERTS photo records into database.
 * @function
 * @param {string} answer_id - id (foreign key) of the related answer record
 * @param {string[]} photos - array of urls for photos
 */
const insertPhotosForAnswer = (answer_id, photos) => {
  const photosSQL = photos.map(url => `(${db.escape(answer_id)}, ${db.escape(url)})`);

  return db.query(`
    INSERT INTO photos (answer_id, url) VALUES
    ${photosSQL.join(', ')}
  `);
};

/**
 * UPDATES answer record setting reported to 1.
 * @function
 * @param {string} answer_id - id (foreign key) of the related answer record
 */
const updateAnswerReported = (answer_id) => {
  return db.query(`
    UPDATE answers SET reported = 1 WHERE id = ?;
  `, [answer_id]);
};

/**
 * UPDATES answer record, increments the helpfulness column.
 * @function
 * @param {string} answer_id - id (foreign key) of the related answer record
 */
const updateAnswerHelpfulness = (answer_id) => {
  return db.query(`
    UPDATE answers SET helpfulness = helpfulness + 1 WHERE id = ?;
  `, [answer_id]);
};

module.exports = {
  insertAnswerForQuestion,
  insertPhotosForAnswer,
  selectAnswersByQuestion,
  updateAnswerHelpfulness,
  updateAnswerReported,
};
