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

function operate(operator, a, b) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    case "^":
      return Math.pow(a, b);
    default:
      return 0;
  }
}

function precedence(op) {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  if (op === "^") return 3;
  if (op === "func") return 4;
  return 0;
}

function applyFunction(func, value) {
  switch (func) {
    case "sin":
      return Math.sin((value * Math.PI) / 180);
    case "cos":
      return Math.cos((value * Math.PI) / 180);
    case "tan":
      return Math.tan((value * Math.PI) / 180);
    case "log":
      return Math.log10(value);
    case "ln":
      return Math.log(value);
    case "asin":
      return Math.asin(value) * (180 / Math.PI);
    case "acos":
      return Math.acos(value) * (180 / Math.PI);
    case "atan":
      return Math.atan(value) * (180 / Math.PI);
    default:
      return value;
  }
}

function extractExpression(expr, index) {
  let subExpr = "";
  let openBrackets = 1;

  for (let i = index; i < expr.length; i++) {
    if (expr[i] === "(") openBrackets++;
    if (expr[i] === ")") openBrackets--;

    subExpr += expr[i];

    if (openBrackets === 0) {
      return [subExpr.slice(0, -1), i];
    }
  }
  return ["", index];
}

function evaluate(expression) {
  let values = [];
  let operators = [];
  let functions = [];

  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === " ") continue;

    if (!isNaN(expression[i]) || expression[i] === ".") {
      let num = "";
      while (
        i < expression.length &&
        (!isNaN(expression[i]) || expression[i] === ".")
      ) {
        num += expression[i];
        i++;
      }
      i--;
      values.push(parseFloat(num));
    } else if (expression[i] === "(") {
      operators.push(expression[i]);
    } else if (expression[i] === ")") {
      while (operators.length > 0 && operators[operators.length - 1] !== "(") {
        let op = operators.pop();
        let b = values.pop();
        let a = values.pop();
        values.push(operate(op, a, b));
      }
      operators.pop();
    } else if (/[a-z]/.test(expression[i])) {
      let func = "";
      while (i < expression.length && /[a-z]/.test(expression[i])) {
        func += expression[i];
        i++;
      }
      i++;

      let [subExpr, endIdx] = extractExpression(expression, i);
      let result = evaluate(subExpr);

      values.push(applyFunction(func, result));
      i = endIdx;
    } else {
      while (
        operators.length > 0 &&
        precedence(operators[operators.length - 1]) >= precedence(expression[i])
      ) {
        let b = values.pop();
        let a = values.pop();
        let op = operators.pop();
        values.push(operate(op, a, b));
      }
      operators.push(expression[i]);
    }
  }

  while (operators.length > 0) {
    let op = operators.pop();
    let b = values.pop();
    let a = values.pop();
    values.push(operate(op, a, b));
  }

  return values[0];
}

console.log(evaluate("sin(log(100) + tan(45))"));
console.log(evaluate("ln(10) + cos(60) * 2"));
console.log(evaluate("sin(30) + tan(45) - ln(5)"));
console.log(evaluate("asin(0.5) + acos(0.5) + atan(1)"));
console.log(evaluate("sin(30) + asin(sin(30))"));

/*
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
*/
/*
function toggleTrig() {
  inverseMode = !inverseMode;
  document.getElementById("sin-btn").innerText = inverseMode ? "sin⁻¹" : "sin";
  document.getElementById("cos-btn").innerText = inverseMode ? "cos⁻¹" : "cos";
  document.getElementById("tan-btn").innerText = inverseMode ? "tan⁻¹" : "tan";
  document.getElementById("inv-btn").innerText = inverseMode ? "trig" : "inv";
}
  */
function toggleTrig() {
  let sinBtn = document.getElementById("sin-btn");
  let cosBtn = document.getElementById("cos-btn");
  let tanBtn = document.getElementById("tan-btn");
  let invBtn = document.getElementById("inv-btn");

  if (!inverseMode) {
    sinBtn.innerHTML = "sin<sup>-1</sup>";
    cosBtn.innerHTML = "cos<sup>-1</sup>";
    tanBtn.innerHTML = "tan<sup>-1</sup>";

    sinBtn.setAttribute("onclick", "appendToDisplay('asin(')");
    cosBtn.setAttribute("onclick", "appendToDisplay('acos(')");
    tanBtn.setAttribute("onclick", "appendToDisplay('atan(')");
    invBtn.innerHTML = "trig";

    inverseMode = true;
  } else {
    sinBtn.innerHTML = "sin";
    cosBtn.innerHTML = "cos";
    tanBtn.innerHTML = "tan";

    sinBtn.setAttribute("onclick", "appendToDisplay('sin(')");
    cosBtn.setAttribute("onclick", "appendToDisplay('cos(')");
    tanBtn.setAttribute("onclick", "appendToDisplay('tan(')");
    invBtn.innerHTML = "inv";

    inverseMode = false;
  }
}

/*
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
  */

function evaluateExpression() {
  let expression = document.getElementById("display").value;
  let precision = document.getElementById("precision").value;
  display.classList.add("fade-out");

  setTimeout(() => {
    let result = evaluate(expression);

    if (isNaN(result) || !Number.isFinite(result)) {
      display.value = "Error!";
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
