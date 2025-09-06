// // Parse commas into thousands
// const parseCommasToThousands = value => {
//   return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

// export default parseCommasToThousands;


const parseCommasToThousands = (value) => {
  // Convert value to string and handle cases where there's a decimal point
  let [integerPart, decimalPart] = value.toString().split('.');

  // Add commas to the integer part
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Recombine integer and decimal parts
  return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
};

export default parseCommasToThousands;
