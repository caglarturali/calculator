let runningTotal = 0;
let buffer = "0";
let lastOperator = null;
let isSubTotalCalculated = false;
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
    // Clear buffer if last operator was '='
    // and not being followed by another operator.
    if (isSubTotalCalculated) {
        buffer = "0";
        isSubTotalCalculated = false;
    }

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
    switch (lastOperator) {
        case "+":
            runningTotal += intBuffer;
            break;
        case "-":
            runningTotal -= intBuffer;
            break;
        case "×":
            runningTotal *= intBuffer;
            break;
        case "÷":
            runningTotal /= intBuffer;
            break;
    }
}

function handleSymbol(value) {
    switch (value) {
        case "C":
            lastOperator = null;
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
            buffer = runningTotal.toString();
            runningTotal = 0;
            isSubTotalCalculated = true;
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