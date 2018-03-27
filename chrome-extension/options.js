// Saves options to chrome.storage
function save_options() {
    const username = $('#login-section #username').val();
    const password = $('#login-section #password').val();
    const yesTerms = $('#login-section #agree-to-terms');

    chrome.storage.sync.set({username, password}, function() {
      if (yesTerms.prop("checked")) {
        alert("Creds Saved");
        console.log(username, password);
      } else {
        alert("Must acknowledge terms");
      }
    });
  }

  $('#login-button').on('click', save_options);