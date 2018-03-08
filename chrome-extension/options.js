// Saves options to chrome.storage
function save_options() {
    const username = $('#username').val();
    const password = $('#password').val();

    chrome.storage.sync.set({username, password}, function() {
      alert("Creds Saved");
      console.log(username, password);
    });
  }

  $('#save-button').on('click', save_options);