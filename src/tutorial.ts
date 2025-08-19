import { getHookStatus } from './utils'
import * as constant from './constant'
import { Engine } from './types'
import { Instance } from 'cooljs'

export const tutorialAction = (instance: InstanceType<typeof Instance>, engine: Engine, time: number): void => {
  const { width, height } = engine
  const { name } = instance
  if (!instance.ready) {
    instance.ready = true
    const tutorialWidth = width * 0.2
    instance.updateWidth(tutorialWidth)
    instance.height = tutorialWidth * 0.46
    instance.x = width / 2 - instance.width / 2
    instance.y = height * 0.45
    if (name !== 'tutorial') {
      instance.y += instance.height * 1.2
    }
  }
  if (name !== 'tutorial') {
    instance.y += Math.cos(time / 200) * instance.height * 0.01
  }
}

export const tutorialPainter = (instance: InstanceType<typeof Instance>, engine: Engine): void => {
  if (engine.checkTimeMovement(constant.tutorialMovement)) {
    return
  }
  if (getHookStatus(engine) !== constant.hookNormal) {
    return
  }
  const { ctx } = engine
  const { name } = instance
  const t = engine.getImg(name)
  ctx.drawImage(t, instance.x, instance.y, instance.width, instance.height)
}

