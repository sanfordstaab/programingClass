function ge(id) {
    return document.getElementById(id);
}

function eh_processInput() {
    const elOut = ge('spnOutput');
    try {
            let sValue = ge('txtaInput').value;
            sValue = '()=>{' + sValue + 'return [ A, B ,operation ]}';
            let calc = eval(sValue)();
            console.log(calc);
    
            const op = calc[2];
            let ans = [];
            if (op == '+') {
                ans = addVectors(calc[0], calc[1]);
            } else if (op == '-') {
                ans = subVectors(calc[0], calc[1]);
            }
            console.log(ans);
            elOut.innerText = JSON.stringify(ans);
            elOut.className = 'black';
    } catch(error) {
        elOut.innerText = error.message;
        elOut.className = 'red';
      }
    }

function addVectors(A, B) {
    if (A.length != B.length) {
        throw new Error('Both arrays must be of the same lenght!');
    }
    const result = [];
    for (let i = 0; i < A.length; i++) {
        result[i] = A[i] + B[i];
    }
    return result;
}
function subVectors(A, B) {
    const result = [];
    for (let i = 0; i < A.length; i++) {
        result[i] = A[i] - B[i];
    }
    return result;
}