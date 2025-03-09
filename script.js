let inverseMode = false;

function appendToDisplay(value) {
  let display = document.getElementById("display");

  if (display.value.length == 18) {
    display.value = "Limit!";
    setTimeout(() => (display.value = "0"), 2000);
  } else {
    if (display.value === "0") {
      display.value = value;
    } else {
      display.value += value;
    }
  }
}

function clearDisplay() {
  document.getElementById("display").value = "";
  setTimeout(() => (document.getElementById("display").value = "0"), 70);
}

function clearOneChar() {
  let display = document.getElementById("display");
  if (display.value.length > 1) {
    display.value = display.value.slice(0, -1);
  } else {
    display.value = "0";
  }
}

function calculateExpression() {
  try {
    return eval(document.getElementById("display").value);
  } catch (e) {
    return NaN;
  }
}

function loge() {
  let value = calculateExpression();
  let display = document.getElementById("display");
  if (isNaN(value) || value <= 0) {
    display.value = "Error";
  } else {
    display.value = Math.log(value).toFixed(5);
  }
}

function log10() {
  let value = calculateExpression();
  let display = document.getElementById("display");
  if (isNaN(value) || value <= 0) {
    display.value = "Error";
  } else {
    display.value = Math.log10(value).toFixed(5);
  }
}

function toggleTrig() {
  inverseMode = !inverseMode;
  document.getElementById("sin-btn").innerText = inverseMode ? "sin⁻¹" : "sin";
  document.getElementById("cos-btn").innerText = inverseMode ? "cos⁻¹" : "cos";
  document.getElementById("tan-btn").innerText = inverseMode ? "tan⁻¹" : "tan";
  document.getElementById("inv-btn").innerText = inverseMode ? "trig" : "inv";
}

function sine() {
  let precision = document.getElementById("precision").value;
  let value = calculateExpression();
  let display = document.getElementById("display");

  if (inverseMode) {
    let result = Math.asin(value) * (180 / Math.PI);
    let roundedResult = Number(result.toFixed(precision));
    if (Math.abs(Math.round(result) - result) < Math.pow(10, -precision)) {
      display.value = Math.round(result);
    } else {
      display.value = roundedResult;
    }
  } else {
    let result = Math.sin(value * (Math.PI / 180));
    let roundedResult = Number(result.toFixed(precision));
    if (Math.abs(Math.round(result) - result) < Math.pow(10, -precision)) {
      display.value = Math.round(result);
    } else {
      display.value = roundedResult;
    }
  }
}

function cosine() {
  let precision = document.getElementById("precision").value;
  let value = calculateExpression();
  let display = document.getElementById("display");

  if (inverseMode) {
    let result = Math.acos(value) * (180 / Math.PI);
    let roundedResult = Number(result.toFixed(precision));
    if (Math.abs(Math.round(result) - result) < Math.pow(10, -precision)) {
      display.value = Math.round(result);
    } else {
      display.value = roundedResult;
    }
  } else {
    let result = Math.cos(value * (Math.PI / 180));
    let roundedResult = Number(result.toFixed(precision));
    if (Math.abs(Math.round(result) - result) < Math.pow(10, -precision)) {
      display.value = Math.round(result);
    } else {
      display.value = roundedResult;
    }
  }
}

function tangent() {
  let precision = document.getElementById("precision").value;
  let value = calculateExpression();
  let display = document.getElementById("display");

  if (inverseMode) {
    let result = Math.atan(value) * (180 / Math.PI);
    let roundedResult = Number(result.toFixed(precision));
    if (Math.abs(Math.round(result) - result) < Math.pow(10, -precision)) {
      display.value = Math.round(result);
    } else {
      display.value = roundedResult;
    }
  } else {
    let result = Math.tan(value * (Math.PI / 180));
    let roundedResult = Number(result.toFixed(precision));
    if (Math.abs(Math.round(result) - result) < Math.pow(10, -precision)) {
      display.value = Math.round(result);
    } else {
      display.value = roundedResult;
    }
  }
}

function operate(ch, a, b) {
  if (ch == "+") return a + b;
  else if (ch == "-") return a - b;
  else if (ch == "*") return a * b;
  else if (ch == "/") return a / b;
  else return a ** b;
}

function intopostfix(infix) {
  let stack = [];
  let output = "";
  let precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3,
  };

  let num = "";
  for (let i = 0; i < infix.length; i++) {
    let char = infix[i];

    if (char == " ") continue;

    if (!isNaN(char) || char == ".") {
      num += char;
    } else {
      if (num !== "") {
        output += num + " ";
        num = "";
      }

      if (char == "(") {
        stack.push(char);
      } else if (char == ")") {
        while (stack.length > 0 && stack[stack.length - 1] != "(") {
          output += stack.pop() + " ";
        }
        stack.pop();
      } else if (char in precedence) {
        while (
          stack.length > 0 &&
          stack[stack.length - 1] in precedence &&
          precedence[stack[stack.length - 1]] >= precedence[char]
        ) {
          output += stack.pop() + " ";
        }
        stack.push(char);
      }
    }
  }

  if (num !== "") {
    output += num + " ";
  }

  while (stack.length > 0) {
    output += stack.pop() + " ";
  }

  return output.trim();
}

function evalexp(exp) {
  let stack = [];
  let tokens = exp.split(" ");

  for (let i = 0; i < tokens.length; i++) {
    let char = tokens[i];

    if (
      char == "+" ||
      char == "-" ||
      char == "*" ||
      char == "/" ||
      char == "^"
    ) {
      let num2 = stack.pop();
      let num1 = stack.pop();
      let num = operate(char, num1, num2);
      stack.push(num);
    } else {
      stack.push(parseFloat(char));
    }
  }
  return stack[0];
}

function evaluateExpression() {
  let expression = document.getElementById("display").value;
  let precision = document.getElementById("precision").value;
  display.classList.add("fade-out");

  setTimeout(() => {
    let exp = intopostfix(expression);
    let result = evalexp(exp);

    if (isNaN(result)) {
      display.value = "NaN";
      setTimeout(() => {
        document.getElementById("display").value = "0";
      }, 1500);
    } else {
      let roundedResult = Number(result.toFixed(precision));
      if (Math.abs(Math.round(result) - result) < Math.pow(10, -precision)) {
        display.value = Math.round(result);
      } else {
        display.value = roundedResult;
      }
    }

    display.classList.remove("fade-out");
    display.classList.add("fade-in");
  }, 300);
}

/*
let exp = "(3^2+4^2)^0.5";
let final_exp = intopostfix(exp);
console.log("Postfix Expression:", final_exp);
let ans = evalexp(final_exp);
console.log(`Answer = ${ans}`);
*/
