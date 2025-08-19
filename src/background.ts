import { checkMoveDown, getMoveDownValue } from './utils'
import * as constant from './constant'
import { Engine } from './types'

export const backgroundImg = (engine: Engine): void => {
  const bg = engine.getImg('background')
  const bgWidth = bg.width
  const bgHeight = bg.height
  const zoomedHeight = (bgHeight * engine.width) / bgWidth
  let offsetHeight: number = engine.getVariable(constant.bgImgOffset, engine.height - zoomedHeight)
  if (offsetHeight > engine.height) {
    return
  }
  engine.getTimeMovement(
    constant.moveDownMovement,
    [[offsetHeight, offsetHeight + (getMoveDownValue(engine, { pixelsPerFrame: s => s / 2 }))]],
    (value: number) => {
      offsetHeight = value
    },
    {
      name: 'background'
    }
  )
  engine.getTimeMovement(
    constant.bgInitMovement,
    [[offsetHeight, offsetHeight + (zoomedHeight / 4)]],
    (value: number) => {
      offsetHeight = value
    }
  )
  engine.setVariable(constant.bgImgOffset, offsetHeight)
  engine.setVariable(constant.lineInitialOffset, engine.height - (zoomedHeight * 0.394))
  engine.ctx.drawImage(
    bg,
    0, offsetHeight,
    engine.width, zoomedHeight
  )
}

const getLinearGradientColorRgb = (colorArr: number[][], colorIndex: number, proportion: number): string => {
  const currentIndex = colorIndex + 1 >= colorArr.length ? colorArr.length - 1 : colorIndex
  const colorCurrent = colorArr[currentIndex]
  const nextIndex = currentIndex + 1 >= colorArr.length - 1 ? currentIndex : currentIndex + 1
  const colorNext = colorArr[nextIndex]
  const calRgbValue = (index: number): number => {
    const current = colorCurrent[index]
    const next = colorNext[index]
    return Math.round(current + ((next - current) * proportion))
  }
  return `rgb(${calRgbValue(0)}, ${calRgbValue(1)}, ${calRgbValue(2)})`
}

export const backgroundLinearGradient = (engine: Engine): void => {
  const grad = engine.ctx.createLinearGradient(0, 0, 0, engine.height)
  const colorArr: number[][] = [
    [200, 255, 150],
    [105, 230, 240],
    [90, 190, 240],
    [85, 100, 190],
    [55, 20, 35],
    [75, 25, 35],
    [25, 0, 10]
  ]
  const offsetHeight: number = engine.getVariable(constant.bgLinearGradientOffset, 0)
  if (checkMoveDown(engine)) {
    engine.setVariable(
      constant.bgLinearGradientOffset
      , offsetHeight + (getMoveDownValue(engine, null) * 1.5)
    )
  }
  const colorIndex = parseInt(String(offsetHeight / engine.height), 10)
  const calOffsetHeight = offsetHeight % engine.height
  const proportion = calOffsetHeight / engine.height
  const colorBase = getLinearGradientColorRgb(colorArr, colorIndex, proportion)
  const colorTop = getLinearGradientColorRgb(colorArr, colorIndex + 1, proportion)
  grad.addColorStop(0, colorTop)
  grad.addColorStop(1, colorBase)
  engine.ctx.fillStyle = grad
  engine.ctx.beginPath()
  engine.ctx.rect(0, 0, engine.width, engine.height)
  engine.ctx.fill()

  // lightning
  const lightning = (): void => {
    engine.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    engine.ctx.fillRect(0, 0, engine.width, engine.height)
  }
  engine.getTimeMovement(
    constant.lightningMovement, [], () => {},
    {
      before: lightning,
      after: lightning
    }
  )
}

export const background = (engine: Engine): void => {
  backgroundLinearGradient(engine)
  backgroundImg(engine)
}

