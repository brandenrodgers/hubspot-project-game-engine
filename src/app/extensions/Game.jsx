import React, { useState } from "react";
import { hubspot, Link } from "@hubspot/ui-extensions";
import Controls from "./Controls";
import Board from "./Board";
import BossView from "./BossView";

hubspot.extend(() => <GameEngine />);

const GameEngine = ({}) => {
  const [bossIsAround, setBossIsAround] = useState(false);
  const [lastInput, setLastInput] = useState(null);
  const [inputCount, setInputCount] = useState(0);
  const [active, setActive] = useState(false);

  const handleInput = (value) => {
    setLastInput(value);
    setInputCount(inputCount + 1);
  };

  const renderContent = () => {
    if (bossIsAround) {
      return <BossView />;
    }
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

  return (
    <>
      {renderContent()}
      <Link onClick={() => setBossIsAround(!bossIsAround)}>
        {bossIsAround ? "Back to game" : "Boss view"}
      </Link>
    </>
  );
};
