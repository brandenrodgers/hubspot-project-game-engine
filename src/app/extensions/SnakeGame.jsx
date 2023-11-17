import React, { useState } from "react";
import { hubspot, Link } from "@hubspot/ui-extensions";
import Controls from "./Controls";
import Board from "./Board";
import BossView from "./BossView";

hubspot.extend(() => <SnakeGame />);

const SnakeGame = ({}) => {
  const [bossIsAround, setBossIsAround] = useState(false);
  const [lastInput, setLastInput] = useState(null);
  const [active, setActive] = useState(false);

  const renderContent = () => {
    if (bossIsAround) {
      return <BossView />;
    }
    return (
      <>
        <Controls
          onInput={(value) => setLastInput(value)}
          onStart={() => setActive(true)}
          onPause={() => setActive(false)}
        />
        <Board active={active} lastInput={lastInput} />
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
