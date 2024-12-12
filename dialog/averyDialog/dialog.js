function ge(id) {
    return document.getElementById(id);
}
async function eh_showAlert(event) {
   alert('This is an Alert message.');
}
async function eh_showConfirm() {
    const msg = ge('txtMessage').value
    const result = confirm(msg);
    ge('spnResult').innerText = JSON.stringify(result);
}