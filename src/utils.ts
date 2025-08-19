import * as constant from './constant'
import { Engine, GameUserOption, Store, DrawYellowStringOption } from './types'

export const checkMoveDown = (engine: Engine): boolean =>
  (engine.checkTimeMovement(constant.moveDownMovement))

export const getMoveDownValue = (engine: Engine, store: Store | null): number => {
  const pixelsPerFrame = store ? store.pixelsPerFrame : engine.pixelsPerFrame.bind(engine)
  const successCount: number = engine.getVariable(constant.successCount)
  const calHeight: number = engine.getVariable(constant.blockHeight) * 2
  if (successCount <= 4) {
    return pixelsPerFrame(calHeight * 1.25)
  }
  return pixelsPerFrame(calHeight)
}

export const getAngleBase = (engine: Engine): number => {
  const successCount: number = engine.getVariable(constant.successCount)
  const gameScore: number = engine.getVariable(constant.gameScore)
  const { hookAngle }: GameUserOption = engine.getVariable(constant.gameUserOption)
  if (hookAngle) {
    return hookAngle(successCount, gameScore)
  }
  if (engine.getVariable(constant.hardMode)) {
    return 90
  }
  switch (true) {
    case successCount < 10:
      return 30
    case successCount < 20:
      return 60
    default:
      return 80
  }
}

export const getSwingBlockVelocity = (engine: Engine, time: number): number => {
  const successCount: number = engine.getVariable(constant.successCount)
  const gameScore: number = engine.getVariable(constant.gameScore)
  const { hookSpeed }: GameUserOption = engine.getVariable(constant.gameUserOption)
  if (hookSpeed) {
    return hookSpeed(successCount, gameScore)
  }
  let hard: number
  switch (true) {
    case successCount < 1:
      hard = 0
      break
    case successCount < 10:
      hard = 1
      break
    case successCount < 20:
      hard = 0.8
      break
    case successCount < 30:
      hard = 0.7
      break
    default:
      hard = 0.74
      break
  }
  if (engine.getVariable(constant.hardMode)) {
    hard = 1.1
  }
  return Math.sin(time / (200 / hard))
}

export const getLandBlockVelocity = (engine: Engine, time: number): number => {
  const successCount: number = engine.getVariable(constant.successCount)
  const gameScore: number = engine.getVariable(constant.gameScore)
  const { landBlockSpeed }: GameUserOption = engine.getVariable(constant.gameUserOption)
  if (landBlockSpeed) {
    return landBlockSpeed(successCount, gameScore)
  }
  const { width } = engine
  let hard: number
  switch (true) {
    case successCount < 5:
      hard = 0
      break
    case successCount < 13:
      hard = 0.001
      break
    case successCount < 23:
      hard = 0.002
      break
    default:
      hard = 0.003
      break
  }
  return Math.cos(time / 200) * hard * width
}

export const getHookStatus = (engine: Engine): string => {
  if (engine.checkTimeMovement(constant.hookDownMovement)) {
    return constant.hookDown
  }
  if (engine.checkTimeMovement(constant.hookUpMovement)) {
    return constant.hookUp
  }
  return constant.hookNormal
}

export const touchEventHandler = (engine: Engine): void => {
  if (!engine.getVariable(constant.gameStartNow)) return
  if (engine.debug && engine.paused) {
    return
  }
  if (getHookStatus(engine) !== constant.hookNormal) {
    return
  }
  engine.removeInstance('tutorial')
  engine.removeInstance('tutorial-arrow')
  const b = engine.getInstance(`block_${engine.getVariable(constant.blockCount)}`)
  if (b && b.status === constant.swing) {
    engine.setTimeMovement(constant.hookUpMovement, 500)
    b.status = constant.beforeDrop
  }
}

export const addSuccessCount = (engine: Engine): void => {
  const { setGameSuccess }: GameUserOption = engine.getVariable(constant.gameUserOption)
  const lastSuccessCount: number = engine.getVariable(constant.successCount)
  const success = lastSuccessCount + 1
  engine.setVariable(constant.successCount, success)
  if (engine.getVariable(constant.hardMode)) {
    engine.setVariable(constant.ropeHeight, engine.height * engine.utils.random(0.35, 0.55))
  }
  if (setGameSuccess) setGameSuccess(success)
}

export const addFailedCount = (engine: Engine): void => {
  const { setGameFailed }: GameUserOption = engine.getVariable(constant.gameUserOption)
  const lastFailedCount: number = engine.getVariable(constant.failedCount)
  const failed = lastFailedCount + 1
  engine.setVariable(constant.failedCount, failed)
  engine.setVariable(constant.perfectCount, 0)
  if (setGameFailed) setGameFailed(failed)
  if (failed >= 3) {
    engine.pauseAudio('bgm')
    engine.playAudio('game-over')
    engine.setVariable(constant.gameStartNow, false)
  }
}

export const addScore = (engine: Engine, isPerfect: boolean): void => {
  const { setGameScore, successScore, perfectScore }: GameUserOption = engine.getVariable(constant.gameUserOption)
  const lastPerfectCount: number = engine.getVariable(constant.perfectCount, 0)
  const lastGameScore: number = engine.getVariable(constant.gameScore)
  const perfect = isPerfect ? lastPerfectCount + 1 : 0
  const score = lastGameScore + (successScore || 25) + ((perfectScore || 25) * perfect)
  engine.setVariable(constant.gameScore, score)
  engine.setVariable(constant.perfectCount, perfect)
  if (setGameScore) setGameScore(score)
}

export const drawYellowString = (engine: Engine, option: DrawYellowStringOption): void => {
  const {
    string, size, x, y, textAlign, fontName = 'wenxue', fontWeight = 'normal'
  } = option
  const { ctx } = engine
  const fontSize = size
  const lineSize = fontSize * 0.1
  ctx.save()
  ctx.beginPath()
  const gradient = ctx.createLinearGradient(0, 0, 0, y)
  gradient.addColorStop(0, '#FAD961')
  gradient.addColorStop(1, '#F76B1C')
  ctx.fillStyle = gradient
  ctx.lineWidth = lineSize
  ctx.strokeStyle = '#FFF'
  ctx.textAlign = textAlign || 'center'
  ctx.font = `${fontWeight} ${fontSize}px ${fontName}`
  ctx.strokeText(string, x, y)
  ctx.fillText(string, x, y)
  ctx.restore()
}
