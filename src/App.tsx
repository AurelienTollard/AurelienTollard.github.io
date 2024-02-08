import CursorObject from './Components/CursorObject';
import { MovingDom } from './Components/MovingButton'
import { Body, Engine, Events, Render, Runner, World } from 'matter-js'
import './App.css'
import { useEffect, useRef, useState } from 'react';
import kidGif from '../assets/kid-meme.gif'

function App() {
  const movingButtonref = useRef<HTMLButtonElement>(null);
  const staticButtonRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gifRef = useRef<HTMLImageElement>(null);
  const [accepted, setAccepted] = useState(false);

  let isStaticButtonTriggered = false;
  const engine = Engine.create({ gravity: { x: 0, y: 0 } });
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: document.body.clientWidth,
      height: document.body.clientHeight,
      background: 'white',
      // showDebug: true,
      wireframes: false,
    },
  });
  const buttonMoving = MovingDom(engine, movingButtonref);
  const buttonStatic = MovingDom(engine, staticButtonRef);
  const staticTitle = MovingDom(engine, titleRef);
  const staticGif = MovingDom(engine, gifRef, false);
  const cursorBody = CursorObject(30);

  useEffect(() => {
    cursorBody.collisionFilter.category = 0x0002; // Cursor category
  }, [cursorBody]);

  useEffect(() => {
    if (buttonMoving) {
      buttonMoving.collisionFilter.mask = 0x0002;
    }
  }, [buttonMoving]);

  useEffect(() => {
    if (staticTitle) {
      staticTitle.isStatic = true;
    }
  }, [staticTitle])

  useEffect(() => {
    if (buttonStatic) {
      buttonStatic.collisionFilter.mask = 0x0001;
    }
  }, [buttonStatic]);

  useEffect(() => {
    if (staticGif) {
      staticGif.isStatic = true;
    }
  }, [staticGif]);

  useEffect(() => {
    if (accepted && staticGif) {
      World.add(engine.world, staticGif);
      console.log("spawning giff");
    } else {
      console.log(accepted, staticGif);
    }
  }, [accepted, staticGif]);

  useEffect(() => {
    console.log("GifRef = ", gifRef);
  }, [gifRef]);

  useEffect(() => {
    if (buttonMoving && buttonStatic) {
      Events.on(engine, "afterUpdate", () => {
        wrapPosition(buttonMoving);
        const distance = Math.sqrt((cursorBody.position.x - buttonStatic.position.x) ** 2 + (cursorBody.position.y - buttonStatic.position.y) ** 2);
        const target = 100;
        if (distance > target && isStaticButtonTriggered) {
          const slope = (cursorBody.position.y - buttonStatic.position.y) / (cursorBody.position.x - buttonStatic.position.x);
          const diff = distance - target;
          const newX = Math.sqrt(diff ** 2 / (1 + slope ** 2));
          const newY = slope * Math.sqrt(diff ** 2 / (1 + slope ** 2));
          const xDir: number = (cursorBody.position.x - buttonStatic.position.x) > 0 ? 1 : -1;
          const yDir: number = xDir == 1 ? 1 : -1;
          Body.setPosition(buttonStatic, {
            x: buttonStatic.position.x + xDir * newX,
            y: buttonStatic.position.y + yDir * newY
          });
        } else if (distance < target) {
          isStaticButtonTriggered = true;
        }
      });
    }
  })

  useEffect(() => {
    World.add(engine.world, [cursorBody]);
    Runner.run(engine);
    Render.run(render);
  })

  function wrapPosition(body: Body) {
    const canvasWidth = render.canvas.width;
    const canvasHeight = render.canvas.height;

    if (body.position.x > canvasWidth) {
      Body.setPosition(body, { x: 0, y: body.position.y });
    } else if (body.position.x < 0) {
      Body.setPosition(body, { x: canvasWidth, y: body.position.y });
    }

    if (body.position.y > canvasHeight) {
      Body.setPosition(body, { x: body.position.x, y: 0 });
    } else if (body.position.y < 0) {
      Body.setPosition(body, { x: body.position.x, y: canvasHeight });
    }
  }


  return (
    <div id="content-body">
      <div id="content">
        {
          accepted ?
            <img src={kidGif} ref={gifRef} style={{ width: "220px", height: "170px" }} />
            :
            <h1 id="title" ref={titleRef}>Title</h1>
        }
        <div id="Buttons">
          <button ref={staticButtonRef} id="staticButton" onClick={function() { return setAccepted(true) }}>Button1</button>
          <button ref={movingButtonref} id="movingButton">Button2</button>
        </div>
      </div>
    </div>
  )
}

export default App
