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
