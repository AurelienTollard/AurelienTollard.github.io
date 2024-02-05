
import { Bodies, Body } from 'matter-js'

function CursorObject(size: number): Body {
  const boxA = Bodies.rectangle(0, 0, size, size, { isStatic: true });
  boxA.render.fillStyle = "transparent";
  boxA.render.strokeStyle = "transparent";

  let previousPosition = { x: 0, y: 0 };

  function udpatePosition(event: MouseEvent) {
    const power = 2.5;
    const direction = {
      x: event.clientX - previousPosition.x > 0 ? 1 : -1, y: event.clientY - previousPosition.y > 0 ? 1 : - 1
    };
    previousPosition = { x: event.clientX, y: event.clientY };
    // 7 and 10 are corrector for cursor size
    Body.setPosition(boxA, { x: event.clientX + 4, y: event.clientY + 10 });
    Body.setVelocity(boxA, { x: power * direction.x, y: power * direction.y });
  }

  document.getElementById("root")!.addEventListener("mousemove", udpatePosition);

  return boxA;
}

export default CursorObject;
