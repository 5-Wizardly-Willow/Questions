DROP DATABASE IF EXISTS questionanswers;

CREATE DATABASE questionanswers;

use questionanswers;

CREATE TABLE questions (
  question_id INT NOT NULL AUTO_INCREMENT,
  question_body TEXT(1000),
  question_date DATETIME,
  asker_name VARCHAR(60),
  question_helpfulness SMALLINT UNSIGNED,
  reported BOOLEAN,

  UNIQUE KEY (question_id),
  PRIMARY KEY (question_id)
);

CREATE TABLE answers (
  id INT NOT NULL AUTO_INCREMENT,
  question_id INT NOT NULL,
  body TEXT(1000),
  answer_date DATETIME,
  answerer_name VARCHAR(60),
  helpfulness SMALLINT UNSIGNED,

  UNIQUE KEY (id),
  PRIMARY KEY (id),
  FOREIGN KEY (question_id) REFERENCES questions (question_id)
);

CREATE TABLE photos (
  id INT NOT NULL AUTO_INCREMENT,
  answer_id INT NOT NULL,
  url VARCHAR(300),

  UNIQUE KEY (id),
  PRIMARY KEY (id),
  FOREIGN KEY (answer_id) REFERENCES answers (id)
);




-- GET questions

-- response:

-- {
--     "question_id": 75643,
--     "question_body": "What fabric is the top made of?",
--     "question_date": "2018-02-12T00:00:00.000Z",
--     "asker_name": "mrmrs",
--     "question_helpfulness": 6,
--     "reported": false,
--     "answers": {
--         "718462": {
--             "id": 718462,
--             "body": "Something pretty soft but I can't be sure",
--             "date": "2018-02-12T00:00:00.000Z",
--             "answerer_name": "mrmrs",
--             "helpfulness": 0,
--             "photos": []
--         },
--         "718473": {
--             "id": 718473,
--             "body": "Its the best! Seriously magic fabric",
--             "date": "2018-03-12T00:00:00.000Z",
--             "answerer_name": "mrmrs",
--             "helpfulness": 1,
--             "photos": []
--         },
--         "718478": {
--             "id": 718478,
--             "body": "Supposedly suede, but I think its synthetic",
--             "date": "2018-03-12T00:00:00.000Z",
--             "answerer_name": "mrmrs",
--             "helpfulness": 2,
--             "photos": []
--         },
--         "718502": {
--             "id": 718502,
--             "body": "Suede",
--             "date": "2018-03-12T00:00:00.000Z",
--             "answerer_name": "mrmrs",
--             "helpfulness": 9,
--             "photos": []
--         }
--     }
-- },




-- GET answers to question
-- response:

-- {
--     "question": "153654",
--     "page": 1,
--     "count": 5,
--     "results": [
--         {
--             "answer_id": 1444517,
--             "body": "It fits this one but he's pretty small for a dino",
--             "date": "2021-03-16T00:00:00.000Z",
--             "answerer_name": "Barney",
--             "helpfulness": 1,
--             "photos": [
--                 {
--                     "id": 1260706,
--                     "url": "https://en.wikipedia.org/wiki/File:Dino_from_%22The_Flintstones%22.gif#/media/File:Dino_from_\"The_Flintstones\".gif"
--                 }
--             ]
--         }
--     ]
-- }