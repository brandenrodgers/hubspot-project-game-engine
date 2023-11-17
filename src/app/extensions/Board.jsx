import React, { useEffect, useState, useRef } from "react";
import { Flex, Image, Text } from "@hubspot/ui-extensions";
import { convertToGameAction, isCollided, useMove } from "./gameUtils";
import { GAME_ACTIONS } from "./constants";

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 300;
const PLAYER_SIZE = 10;
const ENEMY_SIZE = 10;

const PLAYER_SPEED = 10;
const ENEMY_SPEED = 5;
const GAME_FRAME_SPEED = 250;

const Board = ({
  active,
  canvasWidth = DEFAULT_WIDTH,
  canvasHeight = DEFAULT_HEIGHT,
  inputCount,
  lastInput,
}) => {
  const [src, setSrc] = useState(null);
  const board = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const gameInterval = useRef(null);

  const playerCoords = useRef({ x: PLAYER_SIZE, y: PLAYER_SIZE });
  const enemyCoords = useRef({ x: canvasWidth / 2, y: canvasHeight / 2 });
  const move = useMove(canvasWidth, canvasHeight);

  useEffect(() => {
    const canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
    board.current = canvas;
    resetBoard();
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    if (active && !gameOver) {
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

  useEffect(() => {
    const action = convertToGameAction(lastInput);

    move(playerCoords.current, action, PLAYER_SPEED);

    draw();
  }, [lastInput, inputCount]);

  const resetGame = () => {
    setGameOver(false);

    // Reset player position
    playerCoords.current.x = PLAYER_SIZE;
    playerCoords.current.y = PLAYER_SIZE;

    // Reset enemy position
    enemyCoords.current.x = canvasWidth / 2;
    enemyCoords.current.y = canvasHeight / 2;
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
      playerCoords.current.x,
      playerCoords.current.y,
      PLAYER_SIZE,
      PLAYER_SIZE
    );

    // Draw enemy
    context.beginPath();
    context.fillStyle = "green";
    context.arc(
      enemyCoords.current.x,
      enemyCoords.current.y,
      ENEMY_SIZE / 2, // radius
      0,
      2 * Math.PI
    );
    context.fill();

    renderFrame();
    detectCollision();
  };

  const advanceGame = () => {
    // Move enemy closer to the player
    const xDiff = Math.abs(playerCoords.current.x - enemyCoords.current.x);
    const yDiff = Math.abs(playerCoords.current.y - enemyCoords.current.y);

    if (xDiff > yDiff) {
      move(
        enemyCoords.current,
        playerCoords.current.x > enemyCoords.current.x
          ? GAME_ACTIONS.RIGHT
          : GAME_ACTIONS.LEFT,
        ENEMY_SPEED
      );
    } else {
      move(
        enemyCoords.current,
        playerCoords.current.y > enemyCoords.current.y
          ? GAME_ACTIONS.DOWN
          : GAME_ACTIONS.UP,
        ENEMY_SPEED
      );
    }
    draw();
  };

  const detectCollision = () => {
    // Detect if the player and the enemy have collided
    if (
      isCollided(playerCoords.current, enemyCoords.current, PLAYER_SIZE / 2)
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
