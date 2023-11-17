import React, { useState } from "react";
import { Input } from "@hubspot/ui-extensions";

const Controls = ({ onInput, onStart, onPause }) => {
  const [focused, setFocused] = useState(false);

  const handleInput = (value) => {
    const lastInput = value.charAt(value.length - 1).toLowerCase();
    onInput(lastInput);
  };

  const handleFocus = () => {
    setFocused(true);
    onStart();
  };

  const handleBlur = () => {
    setFocused(false);
    onPause();
  };

  return (
    <Input
      label="Use WASD keys to control the player"
      description={focused ? null : "Focus the input to start playing"}
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

export default Controls;
