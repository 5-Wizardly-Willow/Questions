DROP DATABASE IF EXISTS questionsdb;

CREATE DATABASE questionsdb;

USE questionsdb;

-- 1331 bytes per row
CREATE TABLE questions (
  question_id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  question_body TEXT(1000),
  question_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  asker_name VARCHAR(60),
  email VARCHAR(255),
  question_helpfulness SMALLINT UNSIGNED DEFAULT 0,
  reported BOOLEAN DEFAULT 0,

  UNIQUE KEY (question_id),
  PRIMARY KEY (question_id)
);

-- 1331 bytes per row
CREATE TABLE answers (
  id INT NOT NULL AUTO_INCREMENT,
  question_id INT NOT NULL,
  body TEXT(1000),
  answer_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  answerer_name VARCHAR(60),
  email VARCHAR(255),
  helpfulness SMALLINT UNSIGNED DEFAULT 0,
  reported BOOLEAN DEFAULT 0,

  UNIQUE KEY (id),
  PRIMARY KEY (id),
  FOREIGN KEY (question_id) REFERENCES questions (question_id)
);

-- 263 bytes per row
CREATE TABLE photos (
  id INT NOT NULL AUTO_INCREMENT,
  answer_id INT NOT NULL,
  url VARCHAR(255),

  UNIQUE KEY (id),
  PRIMARY KEY (id),
  FOREIGN KEY (answer_id) REFERENCES answers (id)
);

/*
10k products

on amazon it seemed like reviews and questions were left at a rate of 3:1
If we were to assume all products were modestly popular with 3000 reviews, we could expect...
1000 questions per product = 10,000,000 questions

Amazon gets so many questions that they only show the ones with answers but even then each question only gets below 10 answers. Normally 1-2 answers suffice and then votes on helpfullness validate them. Only controversial questions/answers get more answers.

10 answers per question = 10,000,000 answers

I have no good indicator for how many photos are left for answers so assuming people are very active...
3 photos per answer = 30,000,000 photos


high use, fully utilized case:
10,000,000 * 1076 bytes = 10GB
100,000,000 * 1076 bytes = 107.6GB
30,000,000 * 263 bytes = 7.89 GB

** will re-review once I see data

*/