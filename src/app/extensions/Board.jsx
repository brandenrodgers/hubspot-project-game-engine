import React, { useEffect, useState, useRef } from "react";
import { Flex, Image, Text } from "@hubspot/ui-extensions";
import {
  convertToGameAction,
  isCollided,
  useMove,
  getRandomCoords,
} from "./gameUtils";
import { GAME_ACTIONS } from "./constants";

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 300;
const PLAYER_SIZE = 10;
const ENEMY_SIZE = 10;

const PLAYER_SPEED = 10;
const GAME_FRAME_SPEED = 100;

const Board = ({
  active,
  canvasWidth = DEFAULT_WIDTH,
  canvasHeight = DEFAULT_HEIGHT,
  lastInput,
}) => {
  const [src, setSrc] = useState(null);
  const board = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const gameInterval = useRef(null);
  const moveDirection = useRef(null);

  const player = useRef({ x: PLAYER_SIZE, y: PLAYER_SIZE, tail: [] });
  const food = useRef({ x: canvasWidth / 2, y: canvasHeight / 2 });
  const move = useMove(canvasWidth, canvasHeight);

  useEffect(() => {
    const canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
    board.current = canvas;
    resetBoard();
    renderFrame();
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    if (active && !gameOver) {
      if (!moveDirection.current) {
        moveDirection.current = GAME_ACTIONS.RIGHT;
      }
      gameInterval.current = setInterval(() => {
        advanceGame();
      }, GAME_FRAME_SPEED);
    } else {
      if (gameInterval.current) {
        clearInterval(gameInterval.current);
      }
    }

    // Reset game if game is over and user unfocuses the input
    if (gameOver && !active) {
      resetGame();
    }
  }, [active, gameOver]);

  // Update move direction on user input
  useEffect(() => {
    const action = convertToGameAction(lastInput);
    moveDirection.current = action;
  }, [lastInput]);

  const progressPlayer = (direction) => {
    const newTail = [];

    for (let i = 0; i < player.current.tail.length; i++) {
      const nextTailCoord = i
        ? player.current.tail[i - 1]
        : { x: player.current.x, y: player.current.y };

      newTail[i] = nextTailCoord;
    }

    player.current.tail = newTail;

    move(player.current, direction, PLAYER_SPEED);
  };

  const resetGame = () => {
    setGameOver(false);

    // Reset player position
    player.current.x = PLAYER_SIZE;
    player.current.y = PLAYER_SIZE;

    // Reset enemy position
    food.current.x = canvasWidth / 2;
    food.current.y = canvasHeight / 2;
  };

  const resetBoard = () => {
    var context = board.current.getContext("2d");

    // Clear current content
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    // Draw boarder
    context.strokeRect(0, 0, canvasWidth, canvasHeight);

    return context;
  };

  const draw = () => {
    // Reset board
    const context = resetBoard();

    // Draw player
    context.fillStyle = "black";
    context.fillRect(
      player.current.x,
      player.current.y,
      PLAYER_SIZE,
      PLAYER_SIZE
    );

    player.current.tail.forEach((coord) => {
      context.fillRect(coord.x, coord.y, PLAYER_SIZE, PLAYER_SIZE);
    });

    // Draw enemy
    context.beginPath();
    context.fillStyle = "green";
    context.arc(
      food.current.x,
      food.current.y,
      ENEMY_SIZE / 2, // Radius
      0,
      2 * Math.PI
    );
    context.fill();

    renderFrame();
    detectCollision();
  };

  const advanceGame = () => {
    progressPlayer(moveDirection.current);
    draw();
  };

  const detectCollision = () => {
    // Detect if the player and the enemy have collided
    if (isCollided(player.current, food.current, PLAYER_SIZE)) {
      // Add food to tail (offscreen, it'll get placed accordingly in progressPlayer())
      player.current.tail.push({ x: -50, y: -50 });

      // Spawn new random food
      const validRandomCoords = getRandomCoords(
        [player.current, ...player.current.tail, food.current],
        canvasWidth,
        canvasHeight
      );
      food.current = validRandomCoords;
    } else if (
      player.current.x >= canvasWidth ||
      player.current.y >= canvasHeight
    ) {
      setGameOver(true);
    }
  };

  const renderFrame = () => {
    // Update our image src (draw the next game frame)
    board.current.convertToBlob().then((blob) => {
      const dataURL = new FileReaderSync().readAsDataURL(blob);
      setSrc(dataURL);
    });
  };

  if (!src) {
    return null;
  }
  return (
    <Flex direction="column" align="center">
      {gameOver ? <Text>GAME OVER</Text> : null}
      <Image src={src} />
    </Flex>
  );
};

export default Board;
