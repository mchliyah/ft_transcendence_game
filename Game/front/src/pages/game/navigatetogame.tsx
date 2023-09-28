import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NavigateToGame() {
  const navigate = useNavigate();
  const email = "chliyah@student.1337.ma"; // Static email for testing

  useEffect(() => {
    // Navigate to the game route with the static email as a route parameter
    navigate(`/game/${encodeURIComponent(email)}`);
  }, [navigate, email]);

  return (
    <div>
      <p>Game is loading...</p>
    </div>
  );
}

export default NavigateToGame;