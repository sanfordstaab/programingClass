// tictactoe javascript

// globals

// cell position is dictated by the bit position: 
const g = {};
g.nXWinners = [
  //876543210
  0b111000000, // across
  0b000111000,
  0b000000111,

  0b100100100, // top to bottom
  0b010010010,
  0b001001001,

  0b100010001, // diagonal 3 in a row
  0b001010100,
];

g.fGameOver = false;

/**
 * alias for document.getElementById()
 * @param {string} id 
 * @returns {element}
 */
function ge(id) {
  return document.getElementById(id);
}

/**
 * Delays the execution of subsequent code for a specified amount of time.
 * @param {number} time The amount of time to delay in milliseconds.
 * @returns {Promise} A promise that resolves after the specified time has passed.
 */
async function as_delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

async function as_eh_onCellClick(event) {
  if (g.fGameOver) {
    return; // no clicks allow till game is being played
  }
  const eCell = event.target;
  if (eCell.innerText.trim() == '') { // is blank square?
    eCell.innerText = 'X'; // make our move
    await as_delay(1000); // let UI catch up
    const nState = getBoardState('X', 'none'); // 1s on X squares
    const nWinner = checkForWinState(nState);
    if (nWinner) {
      ge('youWon').innerText = 'You Won!!!';
      setCellsColor(nWinner, 'green');
      g.fGameOver = true;
      waitAndClearBoard();
    } else {
      makeAMove(); // lets UI catch up
    }
  }
}

function waitAndClearBoard() {
  g.fGameOver = true;
  setTimeout(() => {
    // this function will be called 5 seconds after the
    // You Won!!! message is shown.
    // clear any win message
    ge('youWon').innerText = '';

    // clear the board
    setBoardState(0b000000000, 'none', '&nbsp;')
    setBoardCellClasses(0b11111111, 'black');
    g.fGameOver = false; // new game
  }, 
  2000);
}

/**
 * Applies the nState to the board UI.
 * This can be used to set the contents of 1 or 0 squares or both and 
 * @param {number} nState - binary state of board, 1s might mean X, O or blank
 * @param {string} setValue - string value for 1 squares or 'none' to 
 * not change 1 cells.  Use '&nbsp;' for blank cells
 * @param {string} clearValue - string value for 0 squares or 'none' to 
 * not change 0 cells.  Use '&nbsp;' for blank cells
 */
function setBoardState(
  nState, 
  setValue, 
  clearValue
) {
  for (let i = 0; i < 9; i++) {
    const cellId = 'c' + (i + 1).toString();
    const elCell = ge(cellId);
    const checkBit = 2 ** i;
    if ((checkBit & nState) && (setValue != 'none')) {
      elCell.innerHTML = setValue
    } else if (clearValue != 'none') {
      elCell.innerHTML = clearValue;
    }
  }
}

/**
 * Sets the class for 1 cells based on nState.
 * @param {number} nState - currnet board state
 * @param {*} className - class to set 1 cells to
 */
function setBoardCellClasses(nState, className) {
  for (let i = 0; i < 9; i++) {
    const checkBit = 2 ** i;
    if (checkBit && nState) {
      const cellId = 'c' + (i + 1).toString();
      const elCell = ge(cellId);
      elCell.className = className;
    }
  }
}

/**
 * Sets the class for nState 1 cells.
 * @param {number} nWinner - binary board state
 */
function setCellsColor(nWinner, className) {
  setBoardCellClasses(nWinner, className);
}

/**
 * Checks to see if 3-in-a-row squares are set and
 * returns the winning squares state
 * @param {number} nMyState - 1s for each cell played.
 * @returns nXWinner if won, else 0
 */
function checkForWinState(nMyState) {
  let fMatch = false;
  for (const nXWinner of g.nXWinners) {
    let intersection = (nXWinner & nMyState);
    fMatch = (intersection == nXWinner); // binary & operator
    // console.log(`Comparing ${nXCells.toString(2)} with ${nXWinner.toString(2)} => ${fMatch}  &= ${intersection.toString(2)}`)
    // Truth table for & binary operator
    //   0 1
    // 0 0 0
    // 1 0 1 -> a 1 results only if both inputs are 1

    // nXWinners is a binary number that has a 1 where a 
    // sSide (X or O) character is at.
    if (fMatch) {
      return nXWinner; // winner was found
    }
  }
  return 0;
}


/**
 * Returns a number that shows which squares have 
 * sSide1 or sSide2 in them.
 * View in binary, 1s match the given side(s).
 * @param {string} sSide1 - can be 'X', 'O', '&nbsp;', or 'none'
 * @param {string} sSide2 - can be 'X', 'O', '&nbsp;', or 'none'
 */
 function getBoardState(sSide1, sSide2) {
  // console.log(`Entering getBoardState(${sSide1}, ${sSide2})`)
  let nXCells = 0b0; // binary number
  for (let nBit = 0; nBit < 9; nBit++) {
    const cellId = 'c' + (nBit + 1).toString();
    const eCell = ge(cellId);
    const sCell = eCell.innerHTML.trim();
    // console.log(`${cellId}=${sCell}`);
    if (sCell == sSide1 || sCell == sSide2) {
      nXCells |= 2 ** nBit;
    }
  }
  // dumpBits(nXCells, `getBoardState(${sSide1}, ${sSide2})=> 0b`)
  return nXCells;
}

/**
 * Moves for the computer by placing an 'O' in the best place
 * it can find.
 * @returns null
 */
async function makeAMove() {
  // console.log('makeAMove();');
  aRndCellOrder = makeRndCellOrderArray();
  const sComputerSide = 'O';
  const nBlankState = getBoardState('&nbsp;', 'none'); // 1s on blank squares
  // dumpBits(nBlankState, 'nBlankState=0b');

  if (nBlankState == 0b0) {
    // no blanks found.
    // we are done and the board full so we have a tie
    // because we never got a win or loss yet.
    ge('youWon').innerText = 'Tie Game!!!';
    waitAndClearBoard();
    return;
  }

  const nXState = getBoardState('X', 'none'); // 1 on X squares.
  // dumpBits(nXState, 'nXState=0b');
  const nOState = getBoardState('O', 'none'); // 1 on O squares.
  // dumpBits(nOState, 'nOState=0b');

  let nAfterMoveState;
  let fMoved = false;
  for (let i = 0; i < 9; i++) {
    const nThisBit = 2 ** aRndCellOrder[i];
    // dumpBits(nThisBit, 'nThisBit=0b');
    // Empty squares that will win the game if played 
    if (nBlankState & nThisBit) {
      nAfterMoveState = nOState | nThisBit;
      // dumpBits(nAfterMoveState, 'nAfterMoveState=0b');
      // blank cell is at thisBit
      let nOWinner = checkForWinState(nAfterMoveState);
      if (nOWinner) {
        // ah if we played here we WIN!  Do it!
        setBoardState(nAfterMoveState, sComputerSide, 'none');
        setCellsColor(nOWinner, 'red');
        ge('youWon').innerText = 'You Lost!!!';
        // console.log(`Moved to win at ${nThisBit.toString(2)}.`)
        waitAndClearBoard();
        return;
      }
    } 
  } // for each cell

  if (!fMoved) {
    for (let i = 0; i < 9; i++) {
      const nThisBit = 2 ** aRndCellOrder[i];
      // Empty squares that will prevent the opponent 
      // from winning on the next move.
      // dumpBits(nBlankState, 'nBlankState=0b');
      // dumpBits(nThisBit, 'nThisBit=0b');
      if (nBlankState & nThisBit) { // blank square
        nAfterMoveState = nXState | nThisBit;  // pretend there is an X at this square
        // dumpBits(nAfterMoveState, 'nAfterMoveState=0b');
        let nXWinner = checkForWinState(nAfterMoveState);
        if (nXWinner) {
          // opponent will win if we don't play at nThisBit.
          setBoardState(nThisBit, 'O', 'none');
          fMoved = true;
          // console.log(`Moved to stop loss at 0b${nThisBit.toString(2)}.`)
          break;
        }
      }
    } // for each cell
  }

  if (!fMoved) {
    for (let i = 0; i < 9; i++) {
      const nThisBit = 2 ** aRndCellOrder[i];
      // Empty squares that will create 2 in a row for the computer.
      if (nBlankState & nThisBit) {
        let nO2 = checkFor2InARowState(nOState, nThisBit);
        if (nO2) {
          // ok, let's play here!
          nAfterMoveState = nOState | nThisBit;
          // dumpBits(nAfterMoveState, 'nAfterMoveState=0b');
          setBoardState(nThisBit, 'O', 'none');
          fMoved = true;
          // console.log(`Moved for 2 in a row at ${nThisBit.toString(2)}.`)
          break;
        }
      }
    } // for each cell
  }
  
  if (!fMoved) {
    for (let i = 0; i < 9; i++) {
      const nThisBit = 2 ** aRndCellOrder[i];
      if (nBlankState & nThisBit) { // empty square
        nAfterMoveState = nOState | nThisBit;
        // dumpBits(nAfterMoveState, 'nAfterMoveState=0b');
        // Make our move - mark that cell with a 'O'
        setBoardState(nThisBit, 'O', 'none');
        fMoved = true;  // redundant but consistent
        // console.log(`Moved randomly at 0b${nThisBit.toString(2)}.`);
        break;  // moved
      }
    }
  }  

  console.assert(fMoved);
}

function makeRndCellOrderArray() {
  const nEmptyCell = -1;
  let aCellsInOrder = new Array(9);
  aCellsInOrder = aCellsInOrder.fill(nEmptyCell);
  for (let i = 0; i < 9; i++) {
    let iRnd = Math.floor(Math.random() * 10);
    console.assert(iRnd >= 0 && iRnd <= 9);
    while (aCellsInOrder[iRnd] != nEmptyCell) {
      iRnd++;
      if (iRnd > 8) {
        iRnd = 0;
      }
    } 
    aCellsInOrder[iRnd] = i;
  }

  for (let i = 0; i < 9; i++) {
    console.assert(aCellsInOrder[i] >= 0 && aCellsInOrder[i] <= 8);
  }
  console.assert(!aCellsInOrder.includes(nEmptyCell));

  return aCellsInOrder;
}

/**
 * Returns true if after the nThisBit move is played, we will have 
 * 2 in a row.
 * @param {number} nPlayerState - 1s wherever we are before our move
 * @param {number} nThisBit - the proposed play bit we want to test
 * return {boolean} fWillHave2InARow
 */
function checkFor2InARowState(
  nPlayerState, 
  nThisBit
) {

  // 0 1 2 -- bit position for cell
  // 3 4 5
  // 6 7 8
  const aaHas2InARow = [
    //  876543210
    [ 0b000000001,  // upper-left cell 0 played
      0b000011010 ],// cells 1, 3, 4
    [ 0b000000010,  // upper-middle cell 1 played
      0b000010101 ],// cells 0, 2, 4
    [ 0b000000100,  // upper-right cell 2 played
      0b000110010 ],// cells 1, 4, 5
    [ 0b000001000,  // middle-left cell 3 played
      0b001010001 ],// cells 0, 4, 6
    [ 0b000010000,  // middle-center cell 4 played
      0b001010101 ],// cells 1, 3, 5, 7
    [ 0b000100000,  // middle-right cell 5 played
      0b100010100 ],// cells 2, 4, 8     
    [ 0b000100000,  // bottom-left cell 6 played
      0b010011000 ],// cells 3, 4, 7         
    [ 0b000100000,  // bottom-middle cell 7 played
      0b101010000 ],// cells 4, 6, 8          
    [ 0b000100000,  // bottom=right cell 8 played
      0b010110000 ],// cells 4, 5, 7    
  ];    
  console.assert(aaHas2InARow.length == 9);

  const aa2InARowApart = [
    //  876543210
    [ 0b000000001,  // upper-left cell 0 played
      0b000001010,  // blank cells 1,3
      0b101000100 ],// cells 2, 6, 8
    [ 0b000000010,  // upper-middle cell 1 played
      0b000010000,  // blank cells 4
      0b010000000 ],// cells 7
    [ 0b000000100,  // upper-right cell 2 played
      0b000110010,  // blank cells 1, 4. 5
      0b000110010 ],// cells 1, 4, 5
    [ 0b000001000,  // middle-left cell 3 played
      0b00010000,   // blank cells 4
      0b00100000 ], // cells 5
    [ 0b00010000,   // middle-right cell 4 played
      0b00000000,   // blank cells none
      0b00000000 ], // cells none
    [ 0b00010000,   // middle-right cell 5 played
      0b00010000,   // blank cells 4
      0b00001000 ], // cells 3  
    [ 0b001000000,  // bottom-left cell 6 played
      0b010011000,  // blank cells 3, 4, 7
      0b100000101 ],// cells 0, 2, 8  
    [ 0b010000000,  // bottom-middle cell 7 played
      0b000010000,  // blank cells 4
      0b000000010 ],// cells 1        
    [ 0b100000000,  // bottom=right cell 8 played
      0b010110000,  // blank cells 4, 5, 7
      0b001000101 ],// cells 0, 2, 6 
  ];
  console.assert(aa2InARowApart.length == 9);

  let fWillHave2InARow = false;
  for (let iBit = 0; iBit < 9; iBit++) {
    const aRndCellOrder = makeRndCellOrderArray();
    iRnd = aRndCellOrder[iBit];
    if (nThisBit && (2 ** iRnd)) {
      if (nPlayerState & aaHas2InARow[iRnd][1]) {
        fWillHave2InARow = true;
        break;
      }
      if (nThisBit & aa2InARowApart[iRnd][0] && // test cell
          !nPlayerState & aa2InARowApart[iRnd][1] && // is blank
          nPlayerState & aa2InARowApart[iRnd][2] // is not blank
      ) {
        fWillHave2InARow = true;
        break;
      }
    }
  }

  // console.log(`checkFor2InARowState(): 
  //   nPlayerState=${nPlayerState.toString(2)}, 
  //   nThisBit=${nThisBit}, 2 in a row: ${fWillHave2InARow}`);

  return fWillHave2InARow;
}

function dumpBits(nBits, prefix='') {
  console.log(prefix + nBits.toString(2));
}