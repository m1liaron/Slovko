import { Section } from '@/common/enums/types/learn.types';

const getSectionDisplayName = (section: Section): string => {
  const sectionNames: Record<Section, string> = {
    cards: 'Flashcards',
    quiz: 'Quiz',
    word: 'Guess Word',
    check: 'Check Translation',
  };

  return sectionNames[section] || section;
};

const calculateProgress = (
  currentIndex: number,
  totalSections: number,
): number => {
  return totalSections > 0 ? ((currentIndex + 1) / totalSections) * 100 : 0;
};

export { getSectionDisplayName, calculateProgress };
