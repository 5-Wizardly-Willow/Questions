import mongoose from 'mongoose';
const { Schema } = mongoose;


const Photos = new Schema({
  id: {
    type: Number,
    unique: true,
    index: true,
    required: true,
  },
  url: String,
});

const Answers = new Schema({
  id: {
    type: Number,
    unique: true,
    index: true,
    required: true,
  },
  bdody: String,
  date: Date,
  answerer_name: String,
  helpfulness: Number,
  photos: [Photos],
});

const ReviewSchema = new Schema({
  question_id: {
    type: Number,
    unique: true,
    index: true,
    required: true,
  },
  question_body: String,
  question_date: { type: Date, default: Date.now },
  asker_name: String,
  question_helpfulness: Number,
  reported: Boolean
  answers: [Answers],
});