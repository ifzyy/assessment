// Initialize DOM elements
const displayOne = document.querySelector(".display-1");
const finalResult = document.querySelector(".result");
const numberButton = document.querySelectorAll(".number");
const opeRator = document.querySelectorAll(".operator");
const equal = document.querySelector("#equal");
const clear = document.querySelector(".clear");
const del = document.querySelector(".delete");
const memoryPlusButton = document.querySelector(".memory-plus");
const memoryRecall = document.querySelector(".memory-recall");
const memoryClearButton = document.querySelector(".memory-clear");

// Initialize variables
let displayNumber = "";
let haveDot = false;

// Define the BasicCalculator class
class BasicCalculator {
  constructor() {
    if (BasicCalculator.instance == null) {
      BasicCalculator.instance = this;
    }
    this._memoryValue = 0; // Initialize _memoryValue
    return BasicCalculator.instance;
  }

  // Define a setter method for memory
  set memory(value) {
    this._memoryValue = value;
  }

  // Define a getter method for memory
  get memory() {
    return this._memoryValue;
  }

  // Recall the memory value
  memoryRecall() {
    return this.memory;
  }

  // Clear the memory
  memoryClear() {
    this.memory = 0;
  }

  // Add a value to memory
  memoryPlus(value) {
    if (this.memory === 0) {
      this.memory = value;
    } else {
      this.memory += value;
    }
  }

  // Calculate expressions
  calculate(expression) {
    const operators = ["+", "-", "x", "÷", "%"];
    const operatorPrecedence = {
      "+": 1,
      "-": 1,
      "x": 2,
      "÷": 2,
      "%": 1,
    };

    // Split expression into tokens
    const expressionTokens = expression
      .split(/([\+\-\x÷%])/g)
      .filter((token) => token.trim() !== "");
    const outputQueue = [];
    const operatorQueue = [];
    let valueStack = [];

    // Process tokens
    expressionTokens.forEach((token) => {
      if (!operators.includes(token)) {
        valueStack.push(parseFloat(token));
      } else {
        while (
          operatorQueue.length > 0 &&
          operatorPrecedence[operatorQueue[0]] >= operatorPrecedence[token]
        ) {
          outputQueue.push(operatorQueue.shift());
        }
        operatorQueue.unshift(token);
      }
    });

    // Handle remaining operators
    while (operatorQueue.length > 0) {
      outputQueue.push(operatorQueue.shift());
    }

    // Reverse valueStack to maintain the correct order
    console.log(valueStack)
    valueStack = valueStack.reverse();

    // Calculate the expression
    while (outputQueue.length > 0) {
      const token = outputQueue.shift();
      if (!operators.includes(token)) {
        valueStack.push(parseFloat(token));
      } else {
        if (valueStack.length < 2) {
          throw new Error("Invalid expression");
        }
        const operand2 = valueStack.shift();
        const operand1 = valueStack.shift();
        let result = null;
        switch (token) {
          case "+":
            result = operand1 + operand2;
            break;
          case "-":
            result = operand1 - operand2;
            break;
          case "x":
            result = operand1 * operand2;
            break;
          case "%":
            result = operand1 % operand2;
            break;
          case "÷":
            if (operand2 === 0) {
              throw new Error("Division by zero");
            }
            result = operand1 / operand2;
            break;
          default:
            throw new Error("Invalid operator");
        }
        valueStack.unshift(result);
      }
    }

    // Ensure there is only one value left in the queue
    if (valueStack.length !== 1) {
      throw new Error("Invalid expression");
    }
    return valueStack[0];
  }
}

// Create a new instance of BasicCalculator
const newBasicCalculator = new BasicCalculator();

// Event listeners for number buttons
numberButton.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (e.target.innerText === "." && !haveDot) {
      haveDot = true;
    } else if (e.target.innerText === "." && haveDot) {
      return;
    }
    displayNumber += e.target.innerText;
    displayOne.innerText = displayNumber;
  });
});

// Event listeners for operator buttons
opeRator.forEach((operation) => {
  operation.addEventListener("click", (e) => {
    haveDot = false;
    displayNumber += e.target.innerText;
    displayOne.innerText = displayNumber;
  });
});

// Event listener for the equal button
equal.addEventListener("click", (e) => {
  let result = newBasicCalculator.calculate(displayNumber);
  if (result.toString().includes(".")) {
    result = result.toFixed(3);
  }
  displayOne.innerText = displayNumber;
  finalResult.innerText = result;
});

// Event listener for the clear button
clear.addEventListener("click", () => {
  displayOne.innerText = "";
  finalResult.innerText = "";
  displayNumber = "";
  haveDot = false;
});

// Event listener for the delete button
del.addEventListener("click", () => {
  displayNumber = displayNumber.toString().slice(0, -1);
  displayOne.innerText = displayNumber;
  finalResult.innerText = "";
});

// Event listener for the memory plus button
memoryPlusButton.addEventListener("click", () => {
  newBasicCalculator.memoryPlus(parseFloat(displayNumber));
  displayOne.innerText = newBasicCalculator.memory;
});

// Event listener for the memory recall button
memoryRecall.addEventListener("click", () => {
  let memVal = newBasicCalculator.memoryRecall();
  displayOne.innerText = memVal;
});

// Event listener for the memory clear button
memoryClearButton.addEventListener("click", () => {
  newBasicCalculator.memoryClear();
  displayOne.innerText = "";
  finalResult.innerText = "";
  displayNumber = "";
});

//Add keyboard accesibility
const numKeys = (key) => {
  numberButton.forEach((button) => {
    if (button.innerText === key) {
      button.click();
    }
  });
};
const operationKeys = (key) => {
  opeRator.forEach((operation) => {
    if (operation.innerText === key) {
      operation.click();
    }
  });
};
const clickEqual = () => {
  equal.click();
};
const clickDel = () => {
  del.click();
};

window.addEventListener("keydown", (e) => {
  if (
    e.key === "0" ||
    e.key === "1" ||
    e.key === "2" ||
    e.key === "3" ||
    e.key === "4" ||
    e.key === "5" ||
    e.key === "6" ||
    e.key === "7" ||
    e.key === "8" ||
    e.key === "9" ||
    e.key === "."
  ) {
    numKeys(e.key);
  } else if (e.key === "+" || e.key === "-") {
    operationKeys(e.key);
  } else if (e.key === "x" || e.key === "*") {
    operationKeys("x");
  } else if (e.key == "/") {
    operationKeys("÷");
  } else if (e.key == "Enter" || e.key === "=") {
    clickEqual();
  } else if (e.key == "Backspace" || e.key == "Delete") {
    clickDel();
  }
});



