// Load your teams
$('document').ready(() => {
    chrome.storage.sync.get(null, (options) => {
        $.ajax({
            "url": `https://8duqbw8p14.execute-api.us-east-1.amazonaws.com/one/teams?username=${options.username}&password=${options.password}`,
            "method": "GET",
        }).done(function (teams) {
            for (let team of teams) {
                const row = `<tr><td>${team}</td><td><a class="import-team-link link" data-team="${team}">Copy to clipboard</a></td></tr>`;
                $("#teams-table").append(row);
            }
        });
    });

    chrome.runtime.onMessage.addListener(function (request, sender) {
        if (request.action == "getSource") {
            const source = $(request.source);
            $("#save-team-name").val(source.find('.teamnameedit').val());
            $("#save-team-contents").val(source.find('.teamedit').text());
        }
    });

    chrome.tabs.executeScript(null, {
        file: "showdown-page.js"
    }, function () {
        if (chrome.runtime.lastError) {
            // $("#save-team-contents").val('There was an error loading your team script : ' + chrome.runtime.lastError.message);
        }
    });
});

$("#teams-table").on('click', '.import-team-link', (data) => {
    const teamName = $(data.target).data('team');
    chrome.storage.sync.get(null, (options) => {
        $.ajax({
            "url": `https://8duqbw8p14.execute-api.us-east-1.amazonaws.com/one/team?username=${options.username}&password=${options.password}&team=${teamName}`,
            "method": "GET",
        }).done(function (teamData) {
            console.log(teamData);
            const clipboard = document.createElement("textarea");
            clipboard.textContent = teamData;

            const body = document.getElementsByTagName('body')[0]
            body.appendChild(clipboard);

            clipboard.select();
            document.execCommand('copy');

            body.removeChild(clipboard);
        });
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
                "team": $("#save-team-name").val(),
                "data": $("#save-team-contents").val(),
            })
        })
    })
});

$('#open-config-link').on('click', () => {
    chrome.runtime.openOptionsPage();
});