const fs = require('fs');
const path = require('path');

// List of all quiz files
const quizFiles = [
  'javascript.json',
  'typescript.json',
  'python.json',
  'react.json',
  'css-html.json',
  'data-structures.json',
  'ui-ux.json',
  'databases.json',
  'git.json',
  'general-cs.json',
  'dotnet.json',
  'aws.json'
];

const quizDir = __dirname;

// Fisher-Yates shuffle for uniform random distribution
function fisherYatesShuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomizeAnswers(questions) {
  return questions.map(question => {
    const { options, correctAnswer: currentCorrectAnswer, ...rest } = question;

    if (!options || options.length === 0) {
      return question;
    }

    // Get the current correct answer text
    const correctAnswerText = options[currentCorrectAnswer];

    // Shuffle options using Fisher-Yates algorithm
    const shuffledOptions = fisherYatesShuffle(options);

    // Find the new index of the correct answer
    const newCorrectAnswerIndex = shuffledOptions.indexOf(correctAnswerText);

    return {
      ...rest,
      options: shuffledOptions,
      correctAnswer: newCorrectAnswerIndex
    };
  });
}

// Process each file
quizFiles.forEach(file => {
  const filePath = path.join(quizDir, file);

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const randomized = randomizeAnswers(data);
    fs.writeFileSync(filePath, JSON.stringify(randomized, null, 2));
    console.log(`✓ Randomized ${file}`);
  } catch (error) {
    console.error(`✗ Error processing ${file}: ${error.message}`);
  }
});

console.log('Done! All quiz files have been randomized.');
