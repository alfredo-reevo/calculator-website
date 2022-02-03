let a = document.getElementById("a")
let b = document.getElementById("b")
let c = document.getElementById("c")
let calcBtn = document.getElementById("calcBtn")
let resultDisplay = document.getElementById("resultDisplay")
let plusMinus_1 = document.getElementById("plus-minus-1")
let plusMinus_2 = document.getElementById("plus-minus-2")


calcBtn.addEventListener("click", calculate);

function calculate() {
    
    /* For my self-diagnosed OCD - I had to ensure that the polynomial did not have any double operations.
        i.e. (2x^2 + 5x + -3); so I decided to give myself unnecessary extra work.

        So now the user can input a "+" or "-" operator, to allow the polynomial to be formatted as:
        (2x^2 + 5x - 3) instead.
    */

    // Plus-Minus logic
    let pm_1 = plusMinus_1.value;
    let pm_2 = plusMinus_2.value;
    
    let a_1 = a.value;

    if (pm_1.trim() == "-") {
        b_1 = (b.value * -1);
    }
    else {
        b_1 = b.value
    }
    if (pm_2.trim() == "-") {
        c_1 = (c.value * -1);
    }
    else {
        c_1 = c.value
    }
        
    // Actual quadratic solver

    a_1 = parseFloat(a_1);
    b_1 = parseFloat(b_1);
    c_1 = parseFloat(c_1);

    let exp = Math.pow(b_1, 2);
    let fourAC = (4 * a_1 * c_1);
    let discriminant = exp - fourAC;
    
    complex = false;

    if (discriminant < 0) {
        discriminant *= -1;
        complex = true;
    }
    
    sqrRoot = Math.sqrt(discriminant);

    let twoA = (2 * a_1);
    

    // If the roots will possess an imaginary component, ensure that the imaginary parts can be presented
    if (complex == true) {
        resultOne_a = (-b_1) / twoA
        resultOne_b = (sqrRoot) / twoA
        resultOne = (`${resultOne_a} + ${resultOne_b}i`)
        
        resultTwo_a = (-b_1) / twoA
        resultTwo_b = (sqrRoot) / twoA
        resultTwo = (`${resultOne_a} - ${resultOne_b}i`)

        resultDisplay.innerHTML = "x = " + resultOne + " or x = " + resultTwo;
    }
    // Otherwise continue the calculation as normal
    else {
        resultOne = (-b_1 - sqrRoot) / twoA
        resultTwo = (-b_1 + sqrRoot) / twoA
        resultDisplay.innerHTML = "x = " + resultOne + " or x = " + resultTwo;
    }
}