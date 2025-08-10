const Quiz = require('../models/quizModel');
require('../config/db');

async function seedSampleQuiz() {
  const sampleQuiz = new Quiz({
    title: 'Sample Mixed Quiz',
    introduction: 'A quiz with all types for demo.',
    teacherId: '000000000000000000000000', // Replace with a valid teacherId
    questions: [
      {
        type: 'identification',
        text: 'What is the capital of Japan?',
        correctAnswer: 'Tokyo',
        points: 10
      },
      {
        type: 'matching',
        text: 'Match the countries to their capitals.',
        pairs: [
          { left: 'Italy', right: 'Rome' },
          { left: 'Germany', right: 'Berlin' },
          { left: 'Spain', right: 'Madrid' }
        ],
        points: 15
      },
      {
        type: 'dragdrop',
        text: 'Arrange the colors of the rainbow in order.',
        items: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'],
        correctOrder: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'],
        points: 20
      },
      {
        type: 'multiple',
        text: 'Which planet is known as the Red Planet?',
        choices: ['Earth', 'Mars', 'Jupiter', 'Venus'],
        correctAnswer: 'Mars',
        points: 10
      }
    ]
  });
  await sampleQuiz.save();
  console.log('Sample quiz seeded!');
}

seedSampleQuiz().then(() => process.exit()); 