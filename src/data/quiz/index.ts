import javascriptQuestions from './javascript.json';
import typescriptQuestions from './typescript.json';
import pythonQuestions from './python.json';
import reactQuestions from './react.json';
import cssHtmlQuestions from './css-html.json';
import dataStructuresQuestions from './data-structures.json';
import uiUxQuestions from './ui-ux.json';
import databasesQuestions from './databases.json';
import gitQuestions from './git.json';
import generalCsQuestions from './general-cs.json';
import dotnetQuestions from './dotnet.json';
import awsQuestions from './aws.json';

export const QUESTIONS_BY_CATEGORY = {
  javascript: javascriptQuestions,
  typescript: typescriptQuestions,
  python: pythonQuestions,
  react: reactQuestions,
  'css-html': cssHtmlQuestions,
  'data-structures': dataStructuresQuestions,
  'ui-ux': uiUxQuestions,
  databases: databasesQuestions,
  git: gitQuestions,
  'general-cs': generalCsQuestions,
  dotnet: dotnetQuestions,
  aws: awsQuestions,
} as const;

export type CategoryKey = keyof typeof QUESTIONS_BY_CATEGORY;

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  react: 'React',
  'css-html': 'CSS / HTML',
  'data-structures': 'Data Structures',
  'ui-ux': 'UI / UX',
  databases: 'Databases',
  git: 'Git',
  'general-cs': 'General CS',
  dotnet: '.NET',
  aws: 'AWS',
};

export const getQuestionsByCategory = (category: CategoryKey) => {
  return QUESTIONS_BY_CATEGORY[category];
};

export const getAllQuestions = () => {
  return Object.values(QUESTIONS_BY_CATEGORY).flat();
};
