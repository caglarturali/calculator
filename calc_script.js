let runningTotal = 0;
let buffer = "0";
let lastOperator;
let isLastOperationComplete = false;
const mainScreen = document.querySelector(".main-display");
const secondaryScreen = document.querySelector(".secondary-display");

function buttonClick(value) {
    if (isNaN(parseInt(value))) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    rerender();
}

function handleNumber(value) {
    if (buffer === "0") {
        buffer = value;
    } else {
        buffer += value;
    }
}

function handleMath(value) {
    if (buffer === "0") {
        // do nothing
        return;
    }

    const intBuffer = parseInt(buffer);
    if (runningTotal === 0) {
        runningTotal = intBuffer;
    } else {
        flushOperation(intBuffer);
    }

    lastOperator = value;
    buffer = "0";
}

function flushOperation(intBuffer) {
    if (lastOperator === "+") {
        runningTotal += intBuffer;
    } else if (lastOperator === "-") {
        runningTotal -= intBuffer;
    } else if (lastOperator === "×") {
        runningTotal *= intBuffer;
    } else {
        runningTotal /= intBuffer;
    }
}

function handleSymbol(value) {
    switch (value) {
        case "C":
            buffer = "0";
            runningTotal = 0;
            break;
        case "=":
            if (lastOperator === null) {
                // need two numbers to do math
                return;
            }
            flushOperation(parseInt(buffer));
            lastOperator = null;
            buffer = runningTotal;
            runningTotal = 0;
            isLastOperationComplete = true;
            break;
        case "←":
            if (buffer.length === 1) {
                buffer = "0";
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }
            break;
        case "+":
        case "-":
        case "×":
        case "÷":
            handleMath(value);
            break;
    }
}

function rerender() {
    // Main screen
    mainScreen.innerText = Number(buffer).toLocaleString();

    let charCount = mainScreen.innerText.length;
    if (charCount < 12)
        mainScreen.style.fontSize = '60px';
    else if (charCount < 15)
        mainScreen.style.fontSize = '48px';
    else if (charCount < 20)
        mainScreen.style.fontSize = '36px';
    else
        mainScreen.style.fontSize = '24px';

    // Secondary screen
    if (runningTotal != 0)
        secondaryScreen.innerText = `${runningTotal.toLocaleString()} ${lastOperator}`;
    else
        secondaryScreen.innerHTML = "&nbsp;";

    // Clear buffer after '='
    if (isLastOperationComplete) {
        buffer = "0";
        isLastOperationComplete = false;
    }
}

function init() {
    document.querySelector(".calc-buttons").addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            buttonClick(event.target.innerText);
        }
        event.stopPropagation();
    });
}

init();