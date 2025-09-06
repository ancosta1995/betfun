import React, { useState, useEffect } from "react";
import { getAllcases } from "../../services/api.service";

export const PlayAmount = () => {
  const [playAmount, setPlayAmount] = useState(0);

  // Fetch total cups from API
  const fetchData = async () => {
    try {
      const schema = await getAllcases(); // Assuming this function fetches all cups
      if (typeof schema.totalTables === 'number') {
        setPlayAmount(schema.totalTables);
      } else {
        console.log("Invalid data format for totalTables:", schema.totalTables);
      }
    } catch (error) {
      console.log("There was an error while loading Cases:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run effect only once on mount

  return (
    <div style={{ color: "#b7b7b7", fontSize: "11px", margin: "auto", marginLeft: "0px" }}>
      {parseFloat(playAmount)}/24H
    </div>
  );
};
