import { getSwingBlockVelocity } from './utils'
import * as constant from './constant'
import { Engine } from './types'
import { Instance } from 'cooljs'

export const hookAction = (instance: InstanceType<typeof Instance>, engine: Engine, time: number): void => {
  const ropeHeight: number = engine.getVariable(constant.ropeHeight)
  if (!instance.ready) {
    instance.x = engine.width / 2
    instance.y = ropeHeight * -1.5
    instance.ready = true
  }
  engine.getTimeMovement(
    constant.hookUpMovement,
    [[instance.y, instance.y - ropeHeight]],
    (value: number) => {
      instance.y = value
    },
    {
      after: () => {
        instance.y = ropeHeight * -1.5
      }
    }
  )
  engine.getTimeMovement(
    constant.hookDownMovement,
    [[instance.y, instance.y + ropeHeight]],
    (value: number) => {
      instance.y = value
    },
    {
      name: 'hook'
    }
  )
  const initialAngle: number = engine.getVariable(constant.initialAngle)
  instance.angle = initialAngle *
    getSwingBlockVelocity(engine, time)
  instance.weightX = instance.x +
    (Math.sin(instance.angle) * ropeHeight)
  instance.weightY = instance.y +
    (Math.cos(instance.angle) * ropeHeight)
}

export const hookPainter = (instance: InstanceType<typeof Instance>, engine: Engine): void => {
  const { ctx } = engine
  const ropeHeight: number = engine.getVariable(constant.ropeHeight)
  const ropeWidth = ropeHeight * 0.1
  const hook = engine.getImg('hook')
  ctx.save()
  ctx.translate(instance.x, instance.y)
  ctx.rotate((Math.PI * 2) - instance.angle)
  ctx.translate(-instance.x, -instance.y)
  engine.ctx.drawImage(hook, instance.x - (ropeWidth / 2), instance.y, ropeWidth, ropeHeight + 5)
  ctx.restore()
}

