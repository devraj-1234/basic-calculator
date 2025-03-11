function operate(operator, a, b) {
    switch(operator) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        case '^': return Math.pow(a, b);
        default: return 0;
    }
}

function precedence(op) {
    if(op === '+' || op === '-') return 1;
    if(op === '*' || op === '/') return 2;
    if(op === '^') return 3;
    if(op === 'func') return 4;
    return 0;
}

function applyFunction(func, value) {
    switch(func) {
        case 'sin': return Math.sin(value * Math.PI / 180);
        case 'cos': return Math.cos(value * Math.PI / 180);
        case 'tan': return Math.tan(value * Math.PI / 180);
        case 'log': return Math.log10(value);
        case 'ln': return Math.log(value);
        default: return value;
    }
}

function extractExpression(expr, index) {
    let subExpr = "";
    let openBrackets = 1;

    for (let i = index; i < expr.length; i++) {
        if (expr[i] === '(') openBrackets++;
        if (expr[i] === ')') openBrackets--;

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

    for(let i = 0; i < expression.length; i++) {
        if(expression[i] === ' ') continue;

        if(!isNaN(expression[i]) || expression[i] === '.') {
            let num = "";
            while(i < expression.length && (!isNaN(expression[i]) || expression[i] === '.')) {
                num += expression[i];
                i++;
            }
            i--;
            values.push(parseFloat(num));
        }
        else if(expression[i] === '(') {
            operators.push(expression[i]);
        }
        else if(expression[i] === ')') {
            while(operators.length > 0 && operators[operators.length - 1] !== '(') {
                let op = operators.pop();
                let b = values.pop();
                let a = values.pop();
                values.push(operate(op, a, b));
            }
            operators.pop();
        }
        else if(/[a-z]/.test(expression[i])) {
            let func = "";
            while(i < expression.length && /[a-z]/.test(expression[i])) {
                func += expression[i];
                i++;
            }
            i++;

            let [subExpr, endIdx] = extractExpression(expression, i);
            let result = evaluate(subExpr);

            values.push(applyFunction(func, result));
            i = endIdx;
        }
        else {
            while(operators.length > 0 && precedence(operators[operators.length - 1]) >= precedence(expression[i])) {
                let b = values.pop();
                let a = values.pop();
                let op = operators.pop();
                values.push(operate(op, a, b));
            }
            operators.push(expression[i]);
        }
    }

    while(operators.length > 0) {
        let op = operators.pop();
        let b = values.pop();
        let a = values.pop();
        values.push(operate(op, a, b));
    }

    return values[0];
}

console.log(evaluate("sin(log(100) + tan(45))")); // ✅ Fixed
console.log(evaluate("ln(10) + cos(60) * 2"));    // ✅ Fixed
console.log(evaluate("sin(30) + tan(45) - ln(5)")); // ✅ Fixed
console.log(evaluate("sin(log(100) + ln(10) + tan(30))")); // ✅ Fully Nested Fixed