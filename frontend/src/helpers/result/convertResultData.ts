import { ModeName } from '@/common/enums/types/result.type';
import { v4 as uuid } from 'uuid';

type RawWord = any;

const normalizeWord = (raw: RawWord) => {
  return {
    id: uuid(),
    word: raw.word,
    translate: raw.translate ?? raw.translateWord ?? raw.translateword ?? '',
    mistakesAmount: Number(raw.mistakesAmount ?? 0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const buildMode = (modeName: ModeName, words: RawWord[], resultId: string) => {
  const modeId = uuid();
  const now = new Date().toISOString();

  return {
    id: modeId,
    mode: modeName,
    resultId,
    createdAt: now,
    updatedAt: now,
    words: words.map((w) => ({
      ...normalizeWord(w),
      resultModeId: modeId,
    })),
  };
};

const transformResult = (raw: any) => {
  const resultId = uuid();
  const now = new Date().toISOString();

  return {
    id: resultId,
    title: raw.title ?? '',
    userId: raw.userId,
    startedLearn: raw.startedLearn,
    completionTime: raw.completionTime,
    createdAt: now,
    updatedAt: now,
    mode: [
      buildMode('flashCards', raw.flashCards ?? [], resultId),
      buildMode('quiz', raw.quiz ?? [], resultId),
      buildMode('guessWord', raw.guessWord ?? [], resultId),
      buildMode('checkTranslate', raw.checkTranslate ?? [], resultId),
    ],
  };
};

export { transformResult };
