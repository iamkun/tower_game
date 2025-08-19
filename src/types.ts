export interface Engine {
  checkTimeMovement(name: string): boolean;
  getVariable(name: string, defaultValue?: any): any;
  setVariable(name: string, value: any): void;
  pixelsPerFrame(pixels: number): number;
  removeInstance(name: string): void;
  getInstance(name: string): any;
  setTimeMovement(name: string, duration: number): void;
  getTimeMovement(
    name: string,
    movements: [number, number][],
    callback: (value: number) => void,
    options?: {
      name?: string;
      before?: () => void;
      after?: () => void;
    }
  ): void;
  pauseAudio(name: string): void;
  playAudio(name: string, loop?: boolean): void;
  addInstance(instance: any): void;
  getImg(name: string): HTMLImageElement;
  addImg(name: string, src: string): void;
  addAudio(name: string, src: string): void;
  addLayer(name: string): void;
  swapLayer(a: number, b: number): void;
  addKeyDownListener(key: string, callback: () => void): void;
  togglePaused(): void;
  height: number;
  width: number;
  utils: {
    random(min: number, max: number): number;
    randomPositiveNegative(): number;
  };
  ctx: CanvasRenderingContext2D;
  debug: boolean;
  paused: boolean;
  paintUnderInstance: (engine: Engine) => void;
  startAnimate: (engine: Engine) => void;
  endAnimate: (engine: Engine) => void;
  touchStartListener: () => void;
}

import { Engine } from 'cooljs'

export interface TowerGameInstance extends Engine {
  playBgm(): void;
  pauseBgm(): void;
  start(): void;
  init(): void;
  load(callback: () => void, updateLoading: (status: { success: number, total: number, failed: number }) => void): void;
}

export interface TowerGameOption {
  width: number;
  height: number;
  canvasId: string;
  soundOn: boolean;
  setGameScore?: (score: number) => void;
  setGameSuccess?: (success: number) => void;
  setGameFailed?: (failed: number) => void;
}

export interface LineInstance {
  x: number;
  y: number;
  collisionX: number;
}

export interface GameUserOption {
  hookAngle?: (successCount: number, gameScore: number) => number;
  hookSpeed?: (successCount: number, gameScore: number) => number;
  landBlockSpeed?: (successCount: number, gameScore: number) => number;
  setGameSuccess?: (success: number) => void;
  setGameFailed?: (failed: number) => void;
  setGameScore?: (score: number) => void;
  successScore?: number;
  perfectScore?: number;
}

export interface Store {
  pixelsPerFrame: (pixels: number) => number;
}

export interface DrawYellowStringOption {
  string: string;
  size: number;
  x: number;
  y: number;
  textAlign?: 'left' | 'center' | 'right';
  fontName?: string;
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
}
