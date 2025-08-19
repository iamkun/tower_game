import { getMoveDownValue, getLandBlockVelocity } from './utils'
import * as constant from './constant'
import { Engine, LineInstance } from './types'
import { Instance } from 'cooljs'

export const lineAction = (instance: InstanceType<typeof Instance>, engine: Engine, time: number): void => {
  const i = instance
  if (!i.ready) {
    i.y = engine.getVariable(constant.lineInitialOffset)
    i.ready = true
    i.collisionX = engine.width - engine.getVariable(constant.blockWidth)
  }
  engine.getTimeMovement(
    constant.moveDownMovement,
    [[instance.y, instance.y + (getMoveDownValue(engine, { pixelsPerFrame: s => s / 2 }))]],
    (value: number) => {
      instance.y = value
    },
    {
      name: 'line'
    }
  )
  const landBlockVelocity = getLandBlockVelocity(engine, time)
  instance.x += landBlockVelocity
  instance.collisionX += landBlockVelocity
}

export const linePainter = (instance: LineInstance, engine: Engine): void => {
  const { ctx, debug } = engine
  if (!debug) {
    return
  }
  ctx.save()
  ctx.beginPath()
  ctx.strokeStyle = 'red'
  ctx.moveTo(instance.x, instance.y)
  ctx.lineTo(instance.collisionX, instance.y)
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()
}

