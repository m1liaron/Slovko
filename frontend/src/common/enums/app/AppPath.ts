interface IAppPath {
  Loading: string;
  Group: string;
  SharedGroup: string;
  SharedGroupDetails: string;
  Welcome: string;
  ChooseLanguage: string;
  Home: string;
  Main: string;
  Profile: string;
  Streak: string;
  Learn: string;
  Quiz: string;
  Word: string;
  Study: string;
  Results: string;
  Statistics: string;
  ResultDetails: string;
  Login: string;
  Register: string;
}

const AppPath: IAppPath = {
  Loading: 'loading',
  ChooseLanguage: 'ChooseLanguage',
  Group: 'group',
  SharedGroup: 'shared-group',
  SharedGroupDetails: 'shared-group/sharedGroupId',
  Welcome: 'welcome',
  Home: 'home',
  Main: 'main',
  Profile: 'profile',
  Streak: 'streak',
  Learn: 'learn',
  Quiz: 'quiz',
  Word: 'word',
  Study: 'study',
  Results: 'results',
  Statistics: 'statistics',
  ResultDetails: 'result',
  Login: 'login',
  Register: 'register',
} as const;

export type TypeAppPath = typeof AppPath;
export { AppPath };
