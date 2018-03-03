// Saves options to chrome.storage
function save_options() {
    const username = $('#username').val();
    const password = $('#password').val();

    chrome.storage.sync.set({username, password}, function() {
      alert("Creds Saved");
      console.log(username, password);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  // function restore_options() {
  //   // Use default value color = 'red' and likesColor = true.
  //   chrome.storage.sync.get({
  //     favoriteColor: 'red',
  //     likesColor: true
  //   }, function(items) {
  //     document.getElementById('color').value = items.favoriteColor;
  //     document.getElementById('like').checked = items.likesColor;
  //   });
  // }
  // document.addEventListener('DOMContentLoaded', restore_options);
  $('#save-button').on('click', save_options);