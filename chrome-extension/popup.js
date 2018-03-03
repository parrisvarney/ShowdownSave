$('#save-team-button').on('click', () => {
    chrome.storage.sync.get(null, (options) => {
        console.log(options);

        $.ajax({
            "url":  "https://iyw78xe6g2.execute-api.us-east-1.amazonaws.com/Test/PokemonShowdownSave",
            "type": "PUT",
            "data": JSON.stringify({
                "username": options.username,
                "password": options.password,
                "team": "Got Help2",
                "data": "all sorts of ddddd"
              })
        })
    })
});

$('#open-config-link').on('click', () => {
    chrome.runtime.openOptionsPage();
});