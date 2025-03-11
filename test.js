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
  if (op === "func") return 4; // Functions have highest precedence
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
    default:
      return value;
  }
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
        if (op === "func") {
          let func = functions.pop();
          let value = values.pop();
          values.push(applyFunction(func, value));
        } else {
          let b = values.pop();
          let a = values.pop();
          values.push(operate(op, a, b));
        }
      }
      operators.pop(); // Remove '('
      // If a function was pending, apply it
      if (functions.length > 0) {
        let func = functions.pop();
        let value = values.pop();
        values.push(applyFunction(func, value));
      }
    } else if (/[a-z]/.test(expression[i])) {
      // Detect function names
      let func = "";
      while (i < expression.length && /[a-z]/.test(expression[i])) {
        func += expression[i];
        i++;
      }
      i--; // Step back once
      functions.push(func);
      operators.push("func");
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
  /*
  console.log(values);
  console.log(functions);
  console.log(operators);
  */

  while (operators.length > 0) {
    let op = operators.pop();
    if (op === "func") {
      let func = functions.pop();
      let value = values.pop();
      values.push(applyFunction(func, value));
    } else {
      let b = values.pop();
      let a = values.pop();
      values.push(operate(op, a, b));
    }
  }

  return values[0];
}

//console.log(evaluate("sin(log(100) + tan(45))")); // Example usage
//console.log(evaluate("ln(10) + cos(60) * 2"));
console.log(evaluate("sin(45)"));