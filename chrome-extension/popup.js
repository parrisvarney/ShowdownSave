// Load your teams
chrome.storage.sync.get(null, (options) => {
    $.ajax({
        "url": `https://8duqbw8p14.execute-api.us-east-1.amazonaws.com/one/team?username=${options.username}&password=${options.password}`,
        "method": "GET",
    }).done(function (teams) {
        for (let team of teams) {
            const row = `<li>${team}</li>`;
            $("#teams-list").append(row);
        }
    });
});

$('#save-team-button').on('click', () => {
    chrome.storage.sync.get(null, (options) => {
        console.log(options);

        $.ajax({
            "url": "https://8duqbw8p14.execute-api.us-east-1.amazonaws.com/one/team",
            "type": "PUT",
            "data": JSON.stringify({
                "username": options.username,
                "password": options.password,
                "team":     $("#save-team-name").val(),
                "data":     $("#save-team-contents").val(),
            })
        })
    })
});

$('#open-config-link').on('click', () => {
    chrome.runtime.openOptionsPage();
});