import React, { useEffect, useRef, useState } from "react";
// import style from "./games.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import scoreIcon from "../img/score.svg";

export function Games({ user }) {
  const canvasRef = useRef(null);
  const scoreRef = useRef(null);
  const inputRef = useRef(null);
  const scoreRefVal = useRef(0); 
  const [score, setScore] = useState(0);
  const [showStart, setShowStart] = useState(true); // Controls visibility of Start button

  // const socket = io(); 
  const gameWidth = 500;
  const gameHeight = 500;
  const boardBackground = "#f5dce1";
  const snakeColor = "#7D059A";
  const snakeBorder = "#D3D3D3";
  const foodColor = "#F4274E";
  const unitSize = 25;

  let ctx;
  const ctxRef = useRef(null);
  let running = false;
  let xVelocity = unitSize;
  let yVelocity = 0;
  let foodX;
  let foodY;

  let snake = [ // body parts 
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
  ];

  useEffect(() => {
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
  {/* Score display */}
  <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "1rem" }}>
    {/* Score: <span ref={scoreRef}>{score}</span> */}
  </div>

  <canvas
    id="gameBoard"
    ref={canvasRef}
    width={gameWidth}
    height={gameHeight}
    style={{ border: "2px solid black", backgroundColor: boardBackground }}
  />
</div>
    // ctx = canvasRef.current.getContext("2d"); //was throwin error when starting game
    window.addEventListener("keydown", changeDirection); //making the listeners
    const resetBtn = document.querySelector(".btn-primary");
    resetBtn.addEventListener("click", resetGame);

    return () => {
      window.removeEventListener("keydown", changeDirection); //calling the listeners
      resetBtn.removeEventListener("click", resetGame);
    };
  }, []);

  function gameStart() {
    ctx = canvasRef.current.getContext("2d");
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
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
  }

  function createFood() {
    function randomFood(min, max) {
      const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
      return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize); 
  }

  function drawFood() {
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
      console.error( error);
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
  
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2rem",
        gap: "2rem", 
      }}>
        {/* Score display
        <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "1rem" }}>
          Score: <span ref={scoreRef}>{score}</span>
        </div> */}
  
        {/* Game canvas */}
        <canvas
        id="gameBoard"
        ref={canvasRef}
        width={gameWidth}
        height={gameHeight}
        style={{
          border: "2px solid black",
          backgroundColor: boardBackground,
        }}
      />
  
      {/* Score display */}
      {/* <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Score<br /> <span ref={scoreRef}>{score}</span>
            </div> */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "10vh",
            maxHeight: "80px",
          }}
        >
          <img
            src={scoreIcon}
            alt="Score"
            style={{
              height: "auto",
              width: "11vw",
              maxHeight: "100%",
            }}
          />
          <span
            ref={scoreRef}
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginTop: "0.5rem",
            }}
          >
            {score}
          </span>
        </div>


        </div>

        {/* Buttons */}
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
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
  
      <input type="hidden" id="hiddenInput" ref={inputRef} />
    </>
  );
  
}
