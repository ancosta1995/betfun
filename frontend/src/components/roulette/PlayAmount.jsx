
import React, { useState, useEffect } from "react";
import { getRouletteSchema } from "../../services/api.service";
import { rouletteSocket } from "../../services/websocket.service";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import coin from "../../assets/icons/coin.png";

export const PlayAmount = () => {
  const [playAmount, setPlayAmount] = useState(0);

  // Fetch roulette schema from API
  const fetchData = async () => {
    try {
      const schema = await getRouletteSchema();

      // Update state
      setPlayAmount(schema.current.players.reduce((a, b) => a + b.betAmount, 0));
    } catch (error) {
      console.log("There was an error while loading roulette schema:", error);
    }
  };

  useEffect(() => {
    fetchData();

    rouletteSocket.on("new-player", fetchData);
    rouletteSocket.on("new-round", fetchData);

    // componentDidUnmount
    return () => {
      // Remove listeners
      rouletteSocket.off("new-player", fetchData);
      rouletteSocket.off("new-round", fetchData);
    };
  });

  return (
    <div style={{ color: "#9E9FBD", fontSize: "10px", margin: "auto", marginLeft: "0px", display: "flex", alignItems: "center", gap: "0.25rem" }}>
      <img src={coin} style={{ height: 10, width: 10}} /> {parseCommasToThousands(parseFloat(playAmount.toFixed(0)))}
    </div>
  );
};
