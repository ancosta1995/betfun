import React from 'react';

// Renk türü
const interpolateRgbColors = (from, to, length) => {
  return Array.from({ length }, (_, i) => ({
    r: Math.round(from.r + ((to.r - from.r) / (length - 1)) * i),
    g: Math.round(from.g + ((to.g - from.g) / (length - 1)) * i),
    b: Math.round(from.b + ((to.b - from.b) / (length - 1)) * i),
  }));
};

// Bin renklerini al
const getBinColors = (rowCount) => {
  const binCount = rowCount + 1;
  const isBinsEven = binCount % 2 === 0;
  const redToYellowLength = Math.ceil(binCount / 2);

  const redToYellowBg = interpolateRgbColors(
    { r: 255, g: 0, b: 63 }, // rgb(255, 0, 63)
    { r: 255, g: 192, b: 0 }, // rgb(255, 192, 0)
    redToYellowLength
  ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);

  const redToYellowShadow = interpolateRgbColors(
    { r: 166, g: 0, b: 4 }, // rgb(166, 0, 4)
    { r: 171, g: 121, b: 0 }, // rgb(171, 121, 0)
    redToYellowLength
  ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);

  return {
    background: [...redToYellowBg, ...redToYellowBg.slice().reverse().slice(isBinsEven ? 0 : 1)],
    shadow: [...redToYellowShadow, ...redToYellowShadow.slice().reverse().slice(isBinsEven ? 0 : 1)],
  };
};

const BinColors = ({ rowCount }) => {
  const { background, shadow } = getBinColors(rowCount);

  return (
    <div>
      <h2>Bin Colors for {rowCount} Rows</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {background.map((color, index) => (
          <div
            key={index}
            style={{
              width: 50,
              height: 50,
              backgroundColor: color,
              boxShadow: `0 4px 8px ${shadow[index]}`,
              margin: 5,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default BinColors;
