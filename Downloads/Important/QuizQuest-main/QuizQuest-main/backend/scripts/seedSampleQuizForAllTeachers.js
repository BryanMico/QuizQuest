const Quiz = require('../models/quizModel');
const Teacher = require('../models/teacherModel');
require('../config/db');

async function seedQuizForAllTeachers() {
  const teachers = await Teacher.find({});
  if (!teachers.length) {
    console.log('No teachers found.');
    process.exit();
  }

  const sampleQuizData = {
    title: 'Sample Mixed Quiz',
    introduction: 'A quiz with all types for demo.',
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
    ],
    status: 'Current'
  };

  const moreTypesQuizData = {
    title: 'More Types Quiz',
    introduction: 'A quiz with even more question types!',
    questions: [
      {
        type: 'identification',
        text: 'What is the largest planet in our solar system?',
        correctAnswer: 'Jupiter',
        points: 10
      },
      {
        type: 'matching',
        text: 'Match the animals to their sounds.',
        pairs: [
          { left: 'Dog', right: 'Bark' },
          { left: 'Cat', right: 'Meow' },
          { left: 'Cow', right: 'Moo' }
        ],
        points: 15
      },
      {
        type: 'dragdrop',
        text: 'Arrange the seasons in order.',
        items: ['Spring', 'Summer', 'Autumn', 'Winter'],
        correctOrder: ['Spring', 'Summer', 'Autumn', 'Winter'],
        points: 20
      },
      {
        type: 'multiple',
        text: 'Which is the fastest land animal?',
        choices: ['Cheetah', 'Lion', 'Tiger', 'Leopard'],
        correctAnswer: 'Cheetah',
        points: 10
      }
    ],
    status: 'Current'
  };

  for (const teacher of teachers) {
    // Seed the original sample quiz
    const quiz = new Quiz({
      ...sampleQuizData,
      teacherId: teacher._id
    });
    await quiz.save();
    teacher.quizzes.push(quiz._id);
    // Seed the new 'More Types Quiz'
    const moreQuiz = new Quiz({
      ...moreTypesQuizData,
      teacherId: teacher._id
    });
    await moreQuiz.save();
    teacher.quizzes.push(moreQuiz._id);
    await teacher.save();
    console.log(`Seeded quizzes for teacher: ${teacher.name}`);
  }

  console.log('Sample quiz seeded for all teachers!');
  process.exit();
}

seedQuizForAllTeachers(); 