import { checkMoveDown, getMoveDownValue } from "./utils";
import * as constant from "./constant";

export const backgroundImg = (engine) => {
  const bg = engine.getImg("background");
  const bgWidth = bg.width;
  const bgHeight = bg.height;
  const zoomedHeight = (bgHeight * engine.width) / bgWidth;
  let offsetHeight = engine.getVariable(
    constant.bgImgOffset,
    engine.height - zoomedHeight
  );
  if (offsetHeight > engine.height) {
    return;
  }
  engine.getTimeMovement(
    constant.moveDownMovement,
    [
      [
        offsetHeight,
        offsetHeight +
          getMoveDownValue(engine, { pixelsPerFrame: (s) => s / 2 }),
      ],
    ],
    (value) => {
      offsetHeight = value;
    },
    {
      name: "background",
    }
  );
  engine.getTimeMovement(
    constant.bgInitMovement,
    [[offsetHeight, offsetHeight + zoomedHeight / 4]],
    (value) => {
      offsetHeight = value;
    }
  );
  engine.setVariable(constant.bgImgOffset, offsetHeight);

  engine.setVariable(
    constant.lineInitialOffset,
    engine.height - zoomedHeight * 0.75
  );
  engine.ctx.drawImage(bg, 0, offsetHeight, engine.width, zoomedHeight);
};

export const background = (engine) => {
  // backgroundLinearGradient(engine);
  backgroundImg(engine);
};
