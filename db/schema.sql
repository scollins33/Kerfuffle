/*

THIS IS REPLACED BY SEQUELIZE
THIS SHOULD BE WRITTEN AS AN ORM USING SEQUELIZE

*/

CREATE DATABASE kerfuffle;
USE kerfuffle;

CREATE TABLE users (
  user_id int NOT NULL AUTO_INCREMENT,
  user_name varchar(50) NOT NULL,
  user_password varchar(50) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  wins INT NULL,
  losses INT NULL,
  correct INT NULL,
  incorrect INT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE games (
  game_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  round INT NULL,
  user_id INT NULL,
  user_guess INT NULL,
  PRIMARY KEY (game_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE questions (
  question_id INTEGER(10) AUTO_INCREMENT NOT NULL,
  question_text TEXT,
  answer_a VARCHAR(255),
  answer_b VARCHAR(255),
  answer_c VARCHAR(255),
  answer_d VARCHAR(255),
  correct_answer VARCHAR(2),
  PRIMARY KEY (question_id)
);