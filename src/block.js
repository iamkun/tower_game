import {
  getMoveDownValue,
  getLandBlockVelocity,
  getSwingBlockVelocity,
  touchEventHandler,
  addSuccessCount,
  addFailedCount,
  addScore
} from './utils'
import * as constant from './constant'

const checkCollision = (block, line) => {
  // 0 goon 1 drop 2 rotate left 3 rotate right 4 ok 5 perfect
  if (block.y + block.height >= line.y) {
    if (block.x < line.x - block.calWidth || block.x > line.collisionX + block.calWidth) {
      return 1
    }
    if (block.x < line.x) {
      return 2
    }
    if (block.x > line.collisionX) {
      return 3
    }
    if (block.x > line.x + (block.calWidth * 0.8) && block.x < line.x + (block.calWidth * 1.2)) {
      // -10% +10%
      return 5
    }
    return 4
  }
  return 0
}
const swing = (instance, engine, time) => {
  const ropeHeight = engine.getVariable(constant.ropeHeight)
  if (instance.status !== constant.swing) return
  const i = instance
  const initialAngle = engine.getVariable(constant.initialAngle)
  i.angle = initialAngle *
    getSwingBlockVelocity(engine, time)
  i.weightX = i.x +
    (Math.sin(i.angle) * ropeHeight)
  i.weightY = i.y +
    (Math.cos(i.angle) * ropeHeight)
}

const checkBlockOut = (instance, engine) => {
  if (instance.status === constant.rotateLeft) {
    // 左转 要等右上角消失才算消失
    if (instance.y - instance.width >= engine.height) {
      instance.visible = false
      instance.status = constant.out
      addFailedCount(engine)
    }
  } else if (instance.y >= engine.height) {
    instance.visible = false
    instance.status = constant.out
    addFailedCount(engine)
  }
}

export const blockAction = (instance, engine, time) => {
  const i = instance
  const ropeHeight = engine.getVariable(constant.ropeHeight)
  if (!i.visible) {
    return
  }
  if (!i.ready) {
    i.ready = true
    i.status = constant.swing
    instance.updateWidth(engine.getVariable(constant.blockWidth))
    instance.updateHeight(engine.getVariable(constant.blockHeight))
    instance.x = engine.width / 2
    instance.y = ropeHeight * -1.5
  }
  const line = engine.getInstance('line')
  switch (i.status) {
    case constant.swing:
      engine.getTimeMovement(
        constant.hookDownMovement,
        [[instance.y, instance.y + ropeHeight]],
        (value) => {
          instance.y = value
        },
        {
          name: 'block'
        }
      )
      swing(instance, engine, time)
      break
    case constant.beforeDrop:
      i.x = instance.weightX - instance.calWidth
      i.y = instance.weightY + (0.3 * instance.height) // add rope height
      i.rotate = 0
      i.ay = engine.pixelsPerFrame(0.0003 * engine.height) // acceleration of gravity
      i.startDropTime = time
      i.status = constant.drop
      break
    case constant.drop:
      const deltaTime = time - i.startDropTime
      i.startDropTime = time
      i.vy += i.ay * deltaTime
      i.y += (i.vy * deltaTime) + (0.5 * i.ay * (deltaTime ** 2))
      const collision = checkCollision(instance, line)
      const blockY = line.y - instance.height
      const calRotate = (ins) => {
        ins.originOutwardAngle = Math.atan(ins.height / ins.outwardOffset)
        ins.originHypotenuse = Math.sqrt((ins.height ** 2)
          + (ins.outwardOffset ** 2))
        engine.playAudio('rotate')
      }
      switch (collision) {
        case 1:
          checkBlockOut(instance, engine)
          break
        case 2:
          i.status = constant.rotateLeft
          instance.y = blockY
          instance.outwardOffset = (line.x + instance.calWidth) - instance.x
          calRotate(instance)
          break
        case 3:
          i.status = constant.rotateRight
          instance.y = blockY
          instance.outwardOffset = (line.collisionX + instance.calWidth) - instance.x
          calRotate(instance)
          break
        case 4:
        case 5:
          i.status = constant.land
          const lastSuccessCount = engine.getVariable(constant.successCount)
          addSuccessCount(engine)
          engine.setTimeMovement(constant.moveDownMovement, 500)
          if (lastSuccessCount === 10 || lastSuccessCount === 15) {
            engine.setTimeMovement(constant.lightningMovement, 150)
          }
          instance.y = blockY
          line.y = blockY
          line.x = i.x - i.calWidth
          line.collisionX = line.x + i.width
          // 作弊检测 超出左边或右边1／3
          const cheatWidth = i.width * 0.3
          if (i.x > engine.width - (cheatWidth * 2)
            || i.x < -cheatWidth) {
            engine.setVariable(constant.hardMode, true)
          }
          if (collision === 5) {
            instance.perfect = true
            addScore(engine, true)
            engine.playAudio('drop-perfect')
          } else {
            addScore(engine)
            engine.playAudio('drop')
          }
          break
        default:
          break
      }
      break
    case constant.land:
      engine.getTimeMovement(
        constant.moveDownMovement,
        [[instance.y, instance.y + (getMoveDownValue(engine, { pixelsPerFrame: s => s / 2 }))]],
        (value) => {
          if (!instance.visible) return
          instance.y = value
          if (instance.y > engine.height) {
            instance.visible = false
          }
        },
        {
          name: instance.name
        }
      )
      instance.x += getLandBlockVelocity(engine, time)
      break
    case constant.rotateLeft:
    case constant.rotateRight:
      const isRight = i.status === constant.rotateRight
      const rotateSpeed = engine.pixelsPerFrame(Math.PI * 4)
      const isShouldFall = isRight ? instance.rotate > 1.3 : instance.rotate < -1.3// 75度
      const leftFix = isRight ? 1 : -1
      if (isShouldFall) {
        instance.rotate += (rotateSpeed / 8) * leftFix
        instance.y += engine.pixelsPerFrame(engine.height * 0.7)
        instance.x += engine.pixelsPerFrame(engine.width * 0.3) * leftFix
      } else {
        let rotateRatio = (instance.calWidth - instance.outwardOffset)
          / instance.calWidth
        rotateRatio = rotateRatio > 0.5 ? rotateRatio : 0.5
        instance.rotate += rotateSpeed * rotateRatio * leftFix
        const angle = instance.originOutwardAngle + instance.rotate
        const rotateAxisX = isRight ? line.collisionX + instance.calWidth
          : line.x + instance.calWidth
        const rotateAxisY = line.y
        instance.x = rotateAxisX -
          (Math.cos(angle) * instance.originHypotenuse)
        instance.y = rotateAxisY -
          (Math.sin(angle) * instance.originHypotenuse)
      }
      checkBlockOut(instance, engine)
      break
    default:
      break
  }
}

const drawSwingBlock = (instance, engine) => {
  const bl = engine.getImg('blockRope')
  engine.ctx.drawImage(
    bl, instance.weightX - instance.calWidth
    , instance.weightY
    , instance.width, instance.height * 1.3
  )
  const leftX = instance.weightX - instance.calWidth
  engine.debugLineY(leftX)
}

const drawBlock = (instance, engine) => {
  const { perfect } = instance
  const bl = engine.getImg(perfect ? 'block-perfect' : 'block')
  engine.ctx.drawImage(bl, instance.x, instance.y, instance.width, instance.height)
}

const drawRotatedBlock = (instance, engine) => {
  const { ctx } = engine
  ctx.save()
  ctx.translate(instance.x, instance.y)
  ctx.rotate(instance.rotate)
  ctx.translate(-instance.x, -instance.y)
  drawBlock(instance, engine)
  ctx.restore()
}

export const blockPainter = (instance, engine) => {
  const { status } = instance
  switch (status) {
    case constant.swing:
      drawSwingBlock(instance, engine)
      break
    case constant.drop:
    case constant.land:
      drawBlock(instance, engine)
      break
    case constant.rotateLeft:
    case constant.rotateRight:
      drawRotatedBlock(instance, engine)
      break
    default:
      break
  }
}
