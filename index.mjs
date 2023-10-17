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
let displayNumber = "";
let haveDot = false;

class BasicCalculator {
  constructor() {
    if (BasicCalculator.instance == null) {
      BasicCalculator.instance = this;
    }
    this._memoryValue = 0; // Initialize _memoryValue
    this._currentValue = 0;
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
memoryRecall(){
  return this.memory
}
  memoryClear() {
    this.memory = 0;
  }
  memoryPlus(value) {
    if (this.memory === 0) {
      this.memory = value;
    } else {
      this.memory += value;
    }
  }

  calculate(expression) {
    const operators = ["+", "-", "x", "÷", ".", "%"];
    const operatorPrecedence = {
      "+": 1,
      "-": 1,
      x: 2,
      "÷": 2,

      "%": 1,
    };

    const expressionTokens = expression
      .split(/([\+\-\x÷%])/g)
      .filter((token) => token.trim() !== "");
    const outputQueue = [];
    const operatorQueue = [];
    let valueQueue = [];

    expressionTokens.forEach((token) => {
      if (!operators.includes(token)) {
        valueQueue.push(parseFloat(token));
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

    while (operatorQueue.length > 0) {
      outputQueue.push(operatorQueue.shift());
    }

    valueQueue = valueQueue.reverse(); // Reverse to maintain correct order
    while (outputQueue.length > 0) {
      const token = outputQueue.shift();
      if (!operators.includes(token)) {
        valueQueue.push(parseFloat(token));
      } else {
        if (valueQueue.length < 2) {
          throw new Error("Invalid expression");
        }
        const operand2 = valueQueue.shift();
        const operand1 = valueQueue.shift();
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
        valueQueue.unshift(result);
      }
    }

    if (valueQueue.length !== 1) {
      throw new Error("Invalid expression");
    }
    return valueQueue[0];
  }
}

const newBasicCalculator = new BasicCalculator();

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


opeRator.forEach((operation) => {
  operation.addEventListener("click", (e) => {
    haveDot = false;
    displayNumber += e.target.innerText;
    displayOne.innerText = displayNumber;
  });
});

equal.addEventListener("click", (e) => {
  let result = newBasicCalculator.calculate(displayNumber);
  if (result.toString().includes(".")) {
    result = result.toFixed(3);
  }
  displayOne.innerText = displayNumber;
  finalResult.innerText = result;
});

clear.addEventListener("click", () => {
  displayOne.innerText = "";
  finalResult.innerText = "";
  displayNumber = "";
  haveDot = false;
});

del.addEventListener("click", () => {
  displayNumber = displayNumber.toString().slice(0, -1);
  displayOne.innerText = displayNumber;
  finalResult.innerText = "";
});

memoryPlusButton.addEventListener("click", () => {
  newBasicCalculator.memoryPlus(parseFloat(displayNumber));
  displayOne.innerText = newBasicCalculator.memory;
});

memoryRecall.addEventListener("click", () => {
let memVal = newBasicCalculator.memoryRecall()
displayOne.innerText = memVal
});

memoryClearButton.addEventListener("click", () => {
  newBasicCalculator.memoryClear();
  displayOne.innerText = "";
  finalResult.innerText = "";
  displayNumber = "";
});

//Add keyboard functionality
const numKeys =(key) => {
  numberButton.forEach((button) => {
    if (button.innerText === key) {
      button.click();
    }
  });
}
const operationKeys = (key) => {
  opeRator.forEach((operation) => {
    if (operation.innerText === key) {
      operation.click();
    }
  });
}
const clickEqual =() => {
  equal.click();
}
const clickDel =()=> {
  del.click();
}


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
