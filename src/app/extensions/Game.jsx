import React, { useState } from "react";
import { hubspot } from "@hubspot/ui-extensions";
import Controls from "./Controls";
import Board from "./Board";

hubspot.extend(() => <GameEngine />);

const GameEngine = ({}) => {
  const [lastInput, setLastInput] = useState(null);
  const [inputCount, setInputCount] = useState(0);
  const [active, setActive] = useState(false);

  const handleInput = (value) => {
    setLastInput(value);
    setInputCount(inputCount + 1);
  };

  return (
    <>
      <Controls
        onInput={handleInput}
        onStart={() => setActive(true)}
        onPause={() => setActive(false)}
      />
      <Board active={active} lastInput={lastInput} inputCount={inputCount} />
    </>
  );
};
