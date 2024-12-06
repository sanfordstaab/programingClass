# Matrix Assignment 1
- [1] Create a "matrix" folder at the root of the programingClass repo.
```
cd \repos\programingClass
md matrix
```
---
- [2] Create a basic .html page called matrix.html in the matrix folder.
Remember that you can use "html" and hit tab to create basic HTML boiler plate text.
---
- [3] Give it a title of "matrix"
---
- [4] reference the matrix.js and matrix.css files from your html and 
---
- [5]create these files as empty in the matrix directory. (see the tictactoe assignment4.html for how this is done)
---
- [6] add a textarea element and a button like this:
```
    <textarea 
      id="txtaInput" 
      type="textarea" 
      cols="60" 
      rows="20"
      placeholder="Enter matrix's for A and B and 
what operation you want to perform like this:
const A = [ 3, 7, 91 ];
const B = [ 2, -9, -25 ];
const Operation='+'; // you can use +, -, * or /

Then press the button to perform the operation."
      ></textarea>
    <br>
    <button onclick="eh_processInput();">
      Process Input
    </button>
    <br>
    Answer: <span id="divOutput"></span>
```
---
- [7] Add an onclick event handler eh_processInput() and tie it to the button.
---
- [8] add the standard ge() function to your .js file
---
- [9] In the event handler, read the textarea controls input like this:
```
let sText = ge('txtaInput').value;
console.log(sText);
```
---
- [10] Test this code by entering something into the textarea and pressing the button.
you should see the text you entered in the debugger console.
---
- [11] To save yourself typeing time add an example + operation to the textarea like this:
```
<textarea ...>value="
const A = [...];
const B= [...];
operation='+';"
</textarea>
```
where ... is whatever values you want to test with. 
I would just put 2 values in each array to start.

You should now be able to refresh the page and just press the button.

---
- [12] Encapsulate the sText in code to make it a function like this:
```
sText = `()=>{${sText}\nreturn([A, B, operation]);}`
console.log(sText);
```
---
- [13] use the built-in eval() function to run sText like this:
```
const aValues = eval(sText)() ;
console.log(aValues);
```
---
- [14] Use the returned array values to calculate the sum of the arrays.
note that two horizontal 1 dimensional arrays are added by creating 
an array of the same length as the two given by adding each corresponding
values:
```
function addVectors(aV1, aV2) {
  const aAnswer = [];
  for (let i = 0; i < aV1.length && i < aV2.length; i++) {
    aAnswer.push(aV1[i] + aV2[i]);
  }
  return aAnswer;
}
```
Make sure to only call this function if the + operator is specified.
Take the output of this function, use `JSON.stringify()` to turn it into a string
and place it into the innerText of the `"divOutput"` control.

---
- [14] Implement the '-' operator: same as the '+' one but each value within the vector is subtracted.
---
- [Extra Credit] Implement the cross-product 'X' and the dot-product '.' 
of vectors.  See this video (https://www.youtube.com/watch?v=gPnWm-IXoAY) for what a cross-product is.
See this video (https://www.youtube.com/watch?v=0iNrGpwZwog) for what a dot product is.