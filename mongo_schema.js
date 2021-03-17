import mongoose from 'mongoose';
const { Schema } = mongoose;


const PhotoSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    index: true,
    required: true,
  },
  url: String,
});

const AnswerSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    index: true,
    required: true,
  },
  body: String,
  date: Date,
  answerer_name: String,
  email: String,
  helpfulness: { type: Number, default: 0 },
  reported: { type: Boolean, default: false },
  photos: [PhotoSchema],
});

const QuestionSchema = new Schema({
  question_id: {
    type: Number,
    unique: true,
    index: true,
    required: true,
  },
  product_id: { type: Number, required : true },
  question_body: String,
  question_date: { type: Date, default: Date.now },
  asker_name: String,
  email: String,
  question_helpfulness: { type: Number, default: 0 },
  reported: { type: Boolean, default: false },
  answers: [AnswerSchema],
});