import { createSignal, createEffect } from 'solid-js';
import React, { useState, useEffect } from "react";

function getCents(bal) {
  if (typeof bal !== "number") { return '00' }

  bal = Math.abs(bal)
  let cents = Math.floor(Math.round(bal % 1 * 100))
  if (cents < 10) { return '0' + cents }
  return cents
}

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const Countup = ({ end2, gray2}) => {

    const [prev, setPrev] = useState(null)
    const [number, setNumber] = useState(0);

    useEffect(() => {
        if (!prev) {
            setPrev(end2 || 0);
            setNumber(end2 || 0);
            return;
        }

        let end = end2 || 0;
        let start = prev || 0;
        let steps = 50;
        let duration = 500;

        if (start === end) return;

        let step = (end - start) / steps; 
        let currentNumber = start;
        let currentStep = 0;

        const interval = Math.floor(duration / steps);

        async function x() {
          let count = 0;
          const intervalId = setInterval(() => {
            currentNumber += step;
            count++
            setNumber(currentNumber);
            if(count >= steps) {}
          }, 100);

          await delay(500);
          clearInterval(intervalId);

          setNumber(end);
          setPrev(end);


        }

        x();


        const intervalId = setInterval(() => {

        }, 25);

        
    });

    function properlyRoundNumber() {
        if (gray2) {
            if (number < 0) return Math.ceil(number * 100 / 100)?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
            return Math.floor(number * 100 / 100)?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
        }
        return number.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    }

    return (
      <span>{properlyRoundNumber()}</span>
    )
}

export default Countup;
