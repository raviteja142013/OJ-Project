const mongoose = require('mongoose');

const problemsSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  constraints: {
    type: String,
    required: true,
  },
  inputFormat: {
    type: String,
    required: true,
  },
  outputFormat: {
    type: String,
    required: true,
  },
  sampleTestCases: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
      },
    },
  ],
  
  inputFile: {
    type: String, 
    required: false, 
  },
  outputFile: {
    type: String, 
    required: false, 
  },
  topicTags: [
    {
      type: String,
      trim: true,
    },
  ],
  companyTags: [
    {
      type: String,
      trim: true,
    }
  ],
  submissionsCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Problem = mongoose.model('Problem', problemsSchema);

module.exports = Problem;
