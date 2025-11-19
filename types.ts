export enum GameState {
  MENU = 'MENU',
  STORY = 'STORY',
  PLAYING = 'PLAYING',
  SUCCESS = 'SUCCESS'
}

export interface Level {
  id: number;
  title: string;
  story: string;
  mission: string;
  concept: string;
  initialCode: string;
  solutionPattern: string; // A regex or simple check backup
  previewBaseStyles?: string; // CSS to make the preview look okay before user edits
}

export interface CodeValidationResult {
  success: boolean;
  feedback: string;
}

export interface UserState {
  unlockedLevels: number[]; // IDs of unlocked levels
  completedLevels: number[];
  currentLevelId: number;
}