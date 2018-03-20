import { checkMoveDown, getMoveDownValue } from './utils'
import * as constant from './constant'

const randomCloudImg = (instance) => {
  const { count } = instance
  const clouds = ['c1', 'c2', 'c3']
  const stones = ['c4', 'c5', 'c6', 'c7', 'c8']
  const randomImg = array => (array[Math.floor(Math.random() * array.length)])
  instance.imgName = count > 6 ? randomImg(stones) : randomImg(clouds)
}

export const cloudAction = (instance, engine) => {
  if (!instance.ready) {
    instance.ready = true
    randomCloudImg(instance)
    instance.width = engine.getVariable(constant.cloudSize)
    instance.height = engine.getVariable(constant.cloudSize)
    const engineW = engine.width
    const engineH = engine.height
    const positionArr = [
      { x: engineW * 0.1, y: -engineH * 0.66 },
      { x: engineW * 0.65, y: -engineH * 0.33 },
      { x: engineW * 0.1, y: 0 },
      { x: engineW * 0.65, y: engineH * 0.33 }
    ]
    const position = positionArr[instance.index - 1]
    instance.x = engine.utils.random(position.x, (position.x * 1.2))
    instance.originX = instance.x
    instance.ax = engine.pixelsPerFrame(instance.width * engine.utils.random(0.05, 0.08)
      * engine.utils.randomPositiveNegative())
    instance.y = engine.utils.random(position.y, (position.y * 1.2))
  }
  instance.x += instance.ax
  if (instance.x >= instance.originX + instance.width
    || instance.x <= instance.originX - instance.width) {
    instance.ax *= -1
  }
  if (checkMoveDown(engine)) {
    instance.y += getMoveDownValue(engine) * 1.2
  }
  if (instance.y >= engine.height) {
    instance.y = -engine.height * 0.66
    instance.count += 4
    randomCloudImg(instance)
  }
}

export const cloudPainter = (instance, engine) => {
  const { ctx } = engine
  const cloud = engine.getImg(instance.imgName)
  ctx.drawImage(cloud, instance.x, instance.y, instance.width, instance.height)
}

