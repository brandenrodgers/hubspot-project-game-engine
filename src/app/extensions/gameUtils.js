import { useCallback } from "react";
import { GAME_ACTIONS } from "./constants";

export const convertToGameAction = (value) => {
  if (value === "w") {
    return GAME_ACTIONS.UP;
  }
  if (value === "d") {
    return GAME_ACTIONS.RIGHT;
  }
  if (value === "s") {
    return GAME_ACTIONS.DOWN;
  }
  if (value === "a") {
    return GAME_ACTIONS.LEFT;
  }
  return null;
};

export const isCollided = (object1, object2, buffer = 1) => {
  return (
    Math.abs(object1.x - object2.x) <= buffer &&
    Math.abs(object1.y - object2.y) <= buffer
  );
};

export function useMove(canvasWidth, canvasHeight) {
  const move = useCallback(
    (object, direction, distance) => {
      switch (direction) {
        case GAME_ACTIONS.UP:
          if (object.y > distance) {
            object.y -= 10;
          }
          break;
        case GAME_ACTIONS.RIGHT:
          if (object.x < canvasWidth) {
            object.x += 10;
          }
          break;
        case GAME_ACTIONS.DOWN:
          if (object.y < canvasHeight) {
            object.y += 10;
          }
          break;
        case GAME_ACTIONS.LEFT:
          if (object.x > distance) {
            object.x -= 10;
          }
          break;
        default:
          break;
      }
    },
    [canvasWidth, canvasHeight]
  );

  return move;
}
