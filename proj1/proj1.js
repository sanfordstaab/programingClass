/**
 * This is the event handler to calculate the answer based on
 * which button was pressed in the event.target.id value.
 * @param {object} event
 */
function eh_calc(event) {
    const In1 = Number(document.getElementById("In1").value);
    const In2 = Number(document.getElementById("In2").value);
    const eOut = document.getElementById("out");
    switch (event.target.id) {
      case 'sub':
        eOut.innerText = In1 - In2;
        console.log('HI. You pressed the subtract button.');
        break;
        
      case 'add':
        eOut.innerText = In1 + In2; 
        console.log('HI. You pressed the add button.');
        break;
        
      case 'mult':
        eOut.innerText = In1 * In2; 
        console.log('HI. You pressed the mult button.');
        break;
       
      case 'div':
        eOut.innerText = (In1 / In2).toFixed(5); 
        console.log('HI. You pressed the div button.');
        break;
    }
  }