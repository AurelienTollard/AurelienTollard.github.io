import { Bodies, Body, Engine, Events, World } from 'matter-js'
import { RefObject, useEffect, useState } from 'react';

const MovingDom = (engine: Engine, button: RefObject<HTMLElement>, spawn?: boolean) => {
  const [movingButton, setMovingButton] = useState<Body | undefined>(undefined);
  useEffect(() => {
    if (button.current) {
      console.log("spawning");
      const { top, left, width, height } = button.current.getBoundingClientRect();
      console.log(top, left, height, width);
      const buttonBox = Bodies.rectangle(left + width / 2, top + height / 2, width, height, {
        render: {
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
        restitution: 1.0,
        frictionAir: 0.03,
      });
      Events.on(engine, "afterUpdate", () => {
        if (button.current) {
          button.current.style.transform = 'translate(' + (buttonBox.position.x - left - width / 2) + 'px, ' + (buttonBox.position.y - top - height / 2) + 'px) rotate(' + buttonBox.angle * 180 / Math.PI + 'deg)';
        }
      });
      if (!spawn) {
        World.add(engine.world, [buttonBox]);
      }
      setMovingButton(buttonBox);
    }
  }, [button]);

  return movingButton;
}

export { MovingDom };
