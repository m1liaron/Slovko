const LEARN_MODE_ICONS = {
  cards: 'cards',
  quiz: 'quiz',
  word: 'wordpress',
  check: 'checklist',
} as const;

const MIN_CARDS_FOR_CHECK_MODE = 4;

const SCORE_MULTIPLIER = 10;

export { LEARN_MODE_ICONS, MIN_CARDS_FOR_CHECK_MODE, SCORE_MULTIPLIER };
