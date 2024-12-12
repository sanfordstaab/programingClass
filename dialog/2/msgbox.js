// msgbox.js

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

/*
 * This static class uses the HTML dialog element to implement
 * an asynchronous API that pops up the dialog, collects any data
 * and when closed, submits the collected data to the caller.
 */

class MsgBox {
  static aElSavedDialog = [];

  /**
   * Call to open and wait for a modal dialog to be closed
   * elDialog is a <dialog> element which calls
   * MsgBox.close(rv) at the appropriate time.
   * Note that this will work recursively in that a modal
   * dialog can be created within the context of another
   * modal dialog - BUT you must not use the same instance
   * of dialog within itself.  elDialog must thus be
   * a new element, distinct from its parent.
   * @param {element} elDialog 
   * @param {function+} fnCallbackOnShown (if supplied, is called after dialog is rendered)
   * @returns whatever value was passed to MsgBox.close() by the dialog.
   */
  static async open(elDialog, fnCallbackOnShown = null) {
    // we push the elDialog onto a stack so we can recurse.
    MsgBox.aElSavedDialog.push(elDialog);
    elDialog.showModal();
    await as_delay(1);
    if (fnCallbackOnShown) {
      fnCallbackOnShown(elDialog);
    }
    return new Promise(
      (resolve) => {
        // close event handler
        const closeDialogEventListener = () => {
          const el = MsgBox.aElSavedDialog.pop();
          el.removeEventListener('close', closeDialogEventListener);
          resolve(el.returnValue); 
          // returns from await on MsgBox.open()
        }
        MsgBox.aElSavedDialog.at(-1).addEventListener('close', closeDialogEventListener);
      }
    );
  }

  static close(returnValue) {
    // attach the returnValue to the elDialog
    MsgBox.aElSavedDialog.at(-1).returnValue = returnValue;
    // fire elDialog.close event -> closeDialogEventListener()
    MsgBox.aElSavedDialog.at(-1).close();  // fires close event
  }

  /**
   * This allows for customizing an existing dialog for different purposes
   * @param {string} html to render into the innerDivId element
   * @param {string} id - the <dialog> id
   * @param {string} innerDivId - the id of a <div> located within the <dialog> 
   * This is the customizable part of the dialog.
   * @param {boolean} fWide - changes whether the dialog width class is "wideDlg"
   * or "stdDlg".
   * @param {function+} fnCallbackOnShown - is passed on to MsgBox.open().
   * @returns {string} whatever value was passed into MsgBox.close().
   */
  static async stdDlg(
    html, 
    id, 
    innerDivId, 
    fWide=false, 
    fnCallbackOnShown = null
  ) {
    const elDlg = ge(id);
    if (fWide) {
      elDlg.classList.remove('stdDlg');
      elDlg.classList.add('wideDlg');
    } else {
      elDlg.classList.remove('wideDlg');
      elDlg.classList.add('stdDlg');      
    }
    if (html && innerDivId) {
      ge(innerDivId).innerHTML = html;
    }
    return await MsgBox.open(elDlg, fnCallbackOnShown);
  }  

  /*
   * Fancy form of window.alert();
   * Usage:
   * await MsgBox.alert(elDialog);
   * Handler:
   * onclick="MsgBox.close();"
   */
  static async alert(html, fWide=false) {
    return await MsgBox.stdDlg(html, 'dlgAlert', 'divAlert', fWide);
  }

  /*
   * Fancy form of window.confirm
   * Usage:
   * await MsgBox.confirm(elDialog);
   * Handler:
   * onclick="MsgBox.close();" after having set elDialog.returnValue
   */
  static async confirm(html, fWide=false) {
    return await MsgBox.stdDlg(html, 'dlgConfirm', 'divConfirm', fWide);
  }

  static async warning(html, fWide=false) {
    return await MsgBox.stdDlg(html, 'dlgWarning', 'divWarning', fWide);
  }
}

function eh_onConfirmClose(fOk) {
  MsgBox.close(fOk);
}