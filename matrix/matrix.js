
function ge(id) {
  return document.getElementById(id);
}

function eh_onPageLoad(event) {
  alert(`This project was designed to work in the Chrome Browser.
    Other browsers may not work correctly.`);
}

function eh_processInput(event) {
  const elOutput = ge('divOutput');
  const elInput = ge('txtaInput');
  try {
    // ------------ try block start
    // Everything in this block will fall into the catch
    // area if an error occurrs.  Use throw('error text')
    // to generate your own errors.
    let sText = elInput.value;
    if (!sText.trim()) {
      throw new Error('No input found.');
    }
    sText = `()=>{
      ${sText}
      return([A, B, Operation]);
    }`;
    console.log(sText);
  
    let aValues = [];
    let fn = null;
    try {
      fn = eval(sText);
    } catch (e) {
      // You can re-throw an error within a nested try/catch
      // block to handle sub-errors specially.
      throw new Error(improveJSONErrorMsg(e.message, sText));
    }
    aValues = fn();
    console.log(aValues);
    if (!aValues) {
      throw new Error('Your input did not parse properly.');
    }
    
    if (!Array.isArray(aValues) ||
        3 != aValues.length) {
      // Note that to quote a ' within ''s you can "escape" the inner ' with a \.
      // You could also just use outer "s instead.
      throw new Error('We didn\'t get back all the values for A, B, and Operator.')
    }

    const A = aValues[0];
    const B = aValues[1];
    const op = aValues[2];

    validateArrays(A, B);
  
    switch (op) {
      case '+':
        aAnswer = addVectors(A, B);
        break;

      case '-':
        aAnswer = subtractVectors(A, B);
        break;

      default:
        throw new Error(`The operator "${op}" was not recognized.`)
    }

    elOutput.innerText = JSON.stringify(aAnswer);
    elOutput.className = 'black';
    // --------------- try block end
  } catch(error) {
    if (error.message == "Cannot access 'B' before initialization") {
      error.message = 'Vector B is not defined.';
    } else if (error.message == "Cannot access 'A' before initialization") {
      error.message = 'Vector A is not defined.';
    } else if (error.message == 'Operation is not defined') {
      error.message = 'The "Operator" variable is not defined.';
    }
    elOutput.innerText = error.message;
    elOutput.className = 'red';
  }
}

function validateVector(v, sVectorName) {
  let sError = '';
  if (!v.length) {
    sError = `Vector ${sVectorName} must have at least one item.`;
  } else for (let i = 0; i < v.length; i++) {
    if ('number' != typeof(v[i]) || Number.isNaN(v[i])) {
      sError = `Vector item ${
          sVectorName
        }[${
          i
        }] is not a number. (${
          JSON.stringify(v[i])
        }).`;
    }
  }

  if (sError) {
    throw new Error(sError);
  }
}

function validateArrays(A, B) {
  if (!Array.isArray(A)) {
    throw new Error(`Vector A is not an array.`);
  }
  if (!Array.isArray(B)) {
    throw new Error(`Vector B is not an array.`);
  }  
  validateVector(A,'A');
  validateVector(B,'B');
  if (A.length != B.length) {
    throw new Error('The A and B vectors are not the same length.');
  }
}


/**
 * Extra credit function to help the user see where a JSON
 * parse error happened
 * @param {string} msg - eval() error message
 * @param {string} json - string input into eval()
 * @returns {string} - a better error message for the parsing error.
 */
function improveJSONErrorMsg(msg, json) {
  const aMatches = (/ at position (\d+)/gm).exec(msg);
  if (aMatches) {
    let charPos = Number(aMatches[1]);
    let len = 40;
    if (charPos < len / 2) {
      charPos = len / 2;
      if (len > json.length) {
        len = json.length;
      }
    }
    return `${aMatches.input} [ ${json.substr(charPos - len / 2, len)} ]`;
  }
  return msg;
}

function addVectors(aV1, aV2) {
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
