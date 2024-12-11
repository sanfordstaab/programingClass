# Dialog Assignment 1
- [1] Create a "dialog" folder at the root of the programingClass repo.
```
cd \repos\programingClass
md dialog
```
---
- [2] Create a basic .html page called dialog.html in the dialog folder.
Remember that you can use "html" and hit tab to create basic HTML boiler plate text.
---
- [3] Give it a title of "duakig"
---
- [4] reference the dialog.js and dialog.css files from your html and 
---
- [5]create these files as empty in the dialog directory.
---
- [6] add a button like this:
```
  <textarea id="txtMessage" cols="50" rows="4" preview="Enter your message here."/>
  <button onclick="eh_showAlert();">
    Show Alert
  </button>
  <button onclick="eh_showConfirm();">
    Show Confirm
  </button>
  <br>
  <span id="spnResult"></span>
```
---
- [7] Add an onclick event handlers eh_showAlert() and eh_showConfirm() in your dialog.js file.
---
- [8] add the standard ge() function to your .js file
---
- [9] In the Alert event handler, simply call:
```
alert('This is an Alert Message');
```
---
- [10] In the Confirm event handler, read the txtMessage control's value
and call the confirm function using that value.
Then have the return value of the confirm method displayed in the spnResult
control.
```
  const msg = ge('txtMessage').value'
  const result = confirm(msg);
  ge('spnResult').innerText = JSON.stringify(result);
```
- [11] Add some css to your project to make it look better.