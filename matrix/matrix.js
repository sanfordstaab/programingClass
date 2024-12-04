function ge(id) {
  return document.getElementById(id);
}

function eh_processInput() {
  const elOut = ge('spnOutput');
  try {
    const elTA = ge('txtaInput');
    let sText = elTA.value;
    console.log(sText);
  
    sText = `()=>{
      ${sText}
      return([A, B, Operation]);
    }`;
    console.log(sText);
  
    const aValues = eval(sText)();
    console.log(aValues);
  
    if (aValues[2] == '+') {
      aAnswer = addVectors(aValues[0], aValues[1]);
    } else if (aValues[2] == '-') {
      aAnswer = subtractVectors(aValues[0], aValues[1]);
    }
    elOut.innerText = JSON.stringify(aAnswer);
    elOut.className = 'black';
  } catch(error) {
    elOut.innerText = error.message;
    elOut.className = 'red';
  }
};

function addVectors(aV1, aV2) {
  if (aV1.length != aV2.length) {
    throw new Error('Both arrays must be of the same length!');
  }
  const aAnswer = [];
  for (let i = 0; i < aV1.length && i < aV2.length; i++) {
    aAnswer.push(aV1[i] + aV2[i]);
  }
  return aAnswer;
}

function subtractVectors(aV1, aV2) {
  const aAnswer = [];
  for (let i = 0; i < aV1.length && i < aV2.length; i++) {
    aAnswer.push(aV1[i] - aV2[i]);
  }
  return aAnswer;
}