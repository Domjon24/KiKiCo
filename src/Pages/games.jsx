import React, { useEffect, useRef, useState } from "react";
// import style from "./games.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export function Games({ user }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null); // Use ref to persist canvas context
  const scoreRef = useRef(null);
  const inputRef = useRef(null);
  const scoreRefVal = useRef(0); // Track score separately for logic
  const [score, setScore] = useState(0);
  const [showStart, setShowStart] = useState(true); // Controls visibility of Start button

  // const socket = io(); // not using socket.io anymore
  const gameWidth = 500;
  const gameHeight = 500;
  const boardBackground = "yellow";
  const snakeColor = "green";
  const snakeBorder = "black";
  const foodColor = "pink";
  const unitSize = 25;

  let running = false;
  let xVelocity = unitSize;
  let yVelocity = 0;
  let foodX;
  let foodY;

  let snake = [ // body parts of snake
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext("2d"); // Initialize context
    }

    window.addEventListener("keydown", changeDirection); //making the listeners
    const resetBtn = document.querySelector(".btn-primary");
    if (resetBtn) resetBtn.addEventListener("click", resetGame);

    return () => {
      window.removeEventListener("keydown", changeDirection); //calling the listeners
      if (resetBtn) resetBtn.removeEventListener("click", resetGame);
    };
  }, []);

  function gameStart() {
    running = true;
    scoreRefVal.current = 0;
    setScore(0);
    // scoreRef.current.textContent = "Score: 0";
    createFood();
    drawFood();
    nextTick();
    setShowStart(false); // Hide Start button after it's clicked
  }

  function nextTick() {
    if (running) {
      setTimeout(() => {
        clearBoard();
        drawFood();
        moveSnake();
        drawSnake();
        checkGameOver();
        nextTick();
      }, 100);
    } else {
      inputRef.current.value = "true";
      console.log("Game over. Input value is ", inputRef.current.value);
      displayGameOver();
    }
  }

  function clearBoard() {
    const ctx = ctxRef.current;
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
  }

  function createFood() {
    function randomFood(min, max) {
      const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
      return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize); // Fixed from original typo (was gameWidth)
  }

  function drawFood() {
    const ctx = ctxRef.current;
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
  }

  function moveSnake() {
    const head = {
      x: snake[0].x + xVelocity,
      y: snake[0].y + yVelocity
    };
    snake.unshift(head);
    if (snake[0].x === foodX && snake[0].y === foodY) {
      scoreRefVal.current += 1;
      setScore(scoreRefVal.current);
    //   scoreRef.current.textContent = `Score: ${scoreRefVal.current}`;
      createFood();
    } else {
      snake.pop();
    }
  }

  function drawSnake() {
    const ctx = ctxRef.current;
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
      ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
      ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
  }

  function changeDirection(event) {
    const keypressed = event.keyCode;
    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;
    const goingUp = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;
    const goingRight = xVelocity === unitSize;

    switch (true) {
      case (keypressed === LEFT && !goingRight):
        xVelocity = -unitSize;
        yVelocity = 0;
        break;
      case (keypressed === UP && !goingDown):
        xVelocity = 0;
        yVelocity = -unitSize;
        break;
      case (keypressed === RIGHT && !goingLeft):
        xVelocity = unitSize;
        yVelocity = 0;
        break;
      case (keypressed === DOWN && !goingUp):
        xVelocity = 0;
        yVelocity = unitSize;
        break;
    }
  }

  function checkGameOver() {
    switch (true) {
      case (snake[0].x < 0):
      case (snake[0].x >= gameWidth):
      case (snake[0].y < 0):
      case (snake[0].y >= gameHeight):
        running = false;
        break;
    }

    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        running = false;
      }
    }

    if (!running) {
      // socket.emit('gameOver', score);  // Emit game over event with the score
      displayGameOver();
    }
  }

  function displayGameOver() {
    const ctx = ctxRef.current;
    ctx.font = "40px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;

    // Automatically send game score as a message
    if (user) {
      const messageText = `${user.displayName || "Anonymous"} has finished a game of Snake with a score of ${scoreRefVal.current}!`;
      sendMessageToChat(user, messageText);
    }
  }

  async function sendMessageToChat(user, messageText) {
    try {
      await addDoc(collection(db, "messages"), {
        text: messageText,
        name: user.displayName || "Anonymous",
        avatar: user.photoURL || null,
        createdAt: serverTimestamp(),
        uid: user.uid,
        className: "snake-update-msg"
      });
    } catch (error) {
      console.error(error);
    }
  }

  function resetGame() {
    setScore(0);
    scoreRefVal.current = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
      { x: unitSize * 4, y: 0 },
      { x: unitSize * 3, y: 0 },
      { x: unitSize * 2, y: 0 },
      { x: unitSize, y: 0 },
      { x: 0, y: 0 }
    ];
    gameStart();
  }

  // io.emit(`user ${socket.id} just lost`); // not needed without socket.io

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
        <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "1rem" }}>
          Score: <span ref={scoreRef}>{score}</span>
        </div>

        {/* Game canvas */}
        <canvas
          id="gameBoard"
          ref={canvasRef}
          width={gameWidth}
          height={gameHeight}
          style={{ border: "2px solid black", backgroundColor: boardBackground }}
        />

        {/* Buttons */}
        <div style={{ marginTop: "1rem" }}>
          <button className="btn btn-primary">Reset</button>
          {showStart && (
            <button
              className="btn btn-primary"
              id="startBtn"
              onClick={gameStart}
              style={{ marginLeft: "1rem" }}
            >
              Start
            </button>
          )}
        </div>
      </div>

      <input type="hidden" id="hiddenInput" ref={inputRef} />
    </>
  );
}
