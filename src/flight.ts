import { Engine } from './types'
import * as constant from './constant'
import { Instance } from 'cooljs'

type ActionType = 'bottomToTop' | 'leftToRight' | 'rightToLeft' | 'rightTopToLeft';

interface ActionConfig {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const getActionConfig = (engine: Engine, type: ActionType): ActionConfig => {
  const {
    width, height, utils
  } = engine
  const { random } = utils
  const size: number = engine.getVariable(constant.cloudSize)
  const actionTypes: Record<ActionType, ActionConfig> = {
    bottomToTop: {
      x: width * random(0.3, 0.7),
      y: height,
      vx: 0,
      vy: engine.pixelsPerFrame(height) * 0.7 * -1
    },
    leftToRight: {
      x: size * -1,
      y: height * random(0.3, 0.6),
      vx: engine.pixelsPerFrame(width) * 0.4,
      vy: engine.pixelsPerFrame(height) * 0.1 * -1
    },
    rightToLeft: {
      x: width,
      y: height * random(0.2, 0.5),
      vx: engine.pixelsPerFrame(width) * 0.4 * -1,
      vy: engine.pixelsPerFrame(height) * 0.1
    },
    rightTopToLeft: {
      x: width,
      y: 0,
      vx: engine.pixelsPerFrame(width) * 0.6 * -1,
      vy: engine.pixelsPerFrame(height) * 0.5
    }
  }
  return actionTypes[type]
}


export const flightAction = (instance: InstanceType<typeof Instance>, engine: Engine): void => {
  const { visible, ready, type } = instance
  if (!visible) return
  const size: number = engine.getVariable(constant.cloudSize)
  if (!ready) {
    const action = getActionConfig(engine, type as ActionType)
    instance.ready = true
    instance.width = size
    instance.height = size
    instance.x = action.x
    instance.y = action.y
    instance.vx = action.vx
    instance.vy = action.vy
  }
  instance.x += instance.vx
  instance.y += instance.vy
  if (instance.y + size < 0
    || instance.y > engine.height
    || instance.x + size < 0
    || instance.x > engine.width) {
    instance.visible = false
  }
}

export const flightPainter = (instance: InstanceType<typeof Instance>, engine: Engine): void => {
  const { ctx } = engine
  const flight = engine.getImg(instance.imgName)
  ctx.drawImage(flight, instance.x, instance.y, instance.width, instance.height)
}

export const addFlight = (engine: Engine, number: number, type: ActionType): void => {
  const flightCount: number = engine.getVariable(constant.flightCount)
  if (flightCount === number) return
  const flight = new Instance({
    name: `flight_${number}`,
    action: flightAction,
    painter: flightPainter
  })
  flight.imgName = `f${number}`
  flight.type = type
  engine.addInstance(flight)
  engine.setVariable(constant.flightCount, number)
}
