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



// {
//       "answer_id": 8,
//       "body": "What a great question!",
//       "date": "2018-01-04T00:00:00.000Z",
//       "answerer_name": "metslover",
//       "helpfulness": 8,
//       "ph

// body: 'Only if you want to ruin it!',
//     answer_date: 2018-03-08T08:00:00.000Z,
//     answerer_name: 'ceasar',
//     email: 'first.last@gmail.com',
//     reported: 0,
//     helpfulness: 5

// SELECT
// 	answers.id,
//     answers.body,
//     JSON_OBJECTAGG(photos.id, photos.url)
// FROM answers, photos
// WHERE answers.id = 5 AND photos.answer_id = 5;

/*

SELECT
      answers.id AS answer_id,
      answers.body,
      answers.answer_date AS date,
      answers.answerer_name,
      answers.helpfulness,
      JSON_OBJECTAGG(photos.id, photos.url)
    FROM answers, photos
    WHERE question_id = 5 AND reported = 0 AND photos.answer_id = answers.id

SELECT
	answers.id AS answer_id,
  answers.body,
  answers.answer_date AS date,
  answers.answerer_name,
  answers.helpfulness,
  JSON_OBJECTAGG(photos.id, photos.url)
FROM answers
LEFT JOIN photos ON photos.answer_id = answers.id
WHERE answers.id = 5;




SELECT
  answers.id AS answer_id,
  answers.body,
  answers.answer_date AS date,
  answers.answerer_name,
  answers.helpfulness
FROM answers
WHERE answers.question_id = 28;




SELECT
  answers.id AS answer_id,
  answers.body,
  answers.answer_date AS date,
  answers.answerer_name,
  answers.helpfulness,
  photos.url
FROM answers
LEFT JOIN photos ON answers.id = photos.answer_id
WHERE answers.question_id = 28;


SELECT
  answers.id AS answer_id,
  answers.body,
  answers.answer_date AS date,
  answers.answerer_name,
  answers.helpfulness,
  GROUP_CONCAT(photos.id, photos.url)
FROM answers
LEFT JOIN photos ON answers.id = photos.answer_id
AND WHERE answers.question_id = 28
GROUP BY answers.id;



WITH top_reviews AS (
    SELECT *
    FROM reviews
    WHERE product_id = 51
    ORDER BY reviews.r_date DESC, reviews.helpfulness DESC
    LIMIT 5
  ), review_photos AS (
    SELECT
      GROUP_CONCAT(photos.url) AS photo_list,
      photos.review_id AS extra,
      GROUP_CONCAT(photos.photo_id) AS photo_ids
    FROM photos
      JOIN top_reviews
      ON photos.review_id = top_reviews.review_id
    GROUP BY photos.review_id
  )
  SELECT *
  FROM review_photos
    RIGHT JOIN top_reviews
    ON review_photos.extra = top_reviews.review_id;

WITH top_answers AS (
  SELECT *
  FROM answers
  WHERE question_id = 28
), answer_photos AS (
  SELECT
    GROUP_CONCAT(photos.url) AS photo_list,
    photos.answer_id AS ap_id,
    GROUP_CONCAT(photos.photo_id) AS photo_ids,
  FROM photos
    JOIN top_answers
    ON top_answers.id = photos.answer_id
  GROUP BY photos.answer_id
)
SELECT *
FROM answer_photos
  RIGHT JOIN top_answers
  ON answer_photos.ap_id = top_answers.id;


SELECT
  GROUP_CONCAT(photos.url) AS photo_urls,
  GROUP_CONCAT(photos.id) AS photo_ids,
  photos.answer_id AS pa_id
FROM photos
  JOIN answers ON answers.id = photos.answer_id
WHERE answers.question_id = 28
GROUP BY photos.answer_id;



///------------------------------------------------------------
WITH top_answers AS (
  SELECT *
  FROM answers
  WHERE answers.question_id = 28
), answers_photos AS (
  SELECT
    photos.answer_id,
    GROUP_CONCAT(photos.url) AS photo_urls,
    GROUP_CONCAT(photos.id) AS photo_ids
  FROM top_answers
    JOIN photos
    ON photos.answer_id = top_answers.id
  GROUP BY photos.answer_id
)
SELECT *
FROM top_answers
LEFT JOIN answers_photos
  ON answers_photos.answer_id = top_answers.id;
///------------------------------------------------------------


WITH top_answers AS (
  SELECT *
  FROM answers
  WHERE answers.question_id = 6
), answers_photos AS (
  SELECT
    photos.answer_id,
    JSON_OBJECTAGG(photos.id, photos.url) AS photos
  FROM top_answers
    JOIN photos
    ON photos.answer_id = top_answers.id
  GROUP BY photos.answer_id
)
SELECT *
FROM top_answers
LEFT JOIN answers_photos
  ON answers_photos.answer_id = top_answers.id;






  SELECT
    photos.answer_id,
    GROUP_CONCAT(photos.url) AS photo_urls,
    GROUP_CONCAT(photos.id) AS photo_ids
  FROM answers
    JOIN photos
    ON photos.answer_id = answers.id
  WHERE answers.question_id = 28
  GROUP BY photos.answer_id


*/


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

  // return db.query(`
  //   SELECT
  //     answers.id AS answer_id,
  //     answers.body,
  //     answers.answer_date AS date,
  //     answers.answerer_name,
  //     answers.helpfulness,
  //     JSON_OBJECTAGG(photos.id, photos.url)
  //   FROM answers, photos
  //   WHERE question_id = ? AND reported = 0 AND photos.answer_id = answer.id
  //   ORDER BY
  //     FIELD(answerer_name, "Seller") DESC,
  //     helpfulness DESC
  //   LIMIT ?, ?;
  //   `, [question_id, (page - 1) * count, count]);
};