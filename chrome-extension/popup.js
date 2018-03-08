// Load your teams
$('document').ready(() => {
    chrome.storage.sync.get(null, (options) => {
        $.ajax({
            "url": `https://8duqbw8p14.execute-api.us-east-1.amazonaws.com/one/teams?username=${options.username}&password=${options.password}`,
            "method": "GET",
        }).done((teams) => {
            for (let team of teams) {
                const row = `
                    <tr>
                    <td>${team}</td>
                    <td><a class="copy-team-link link" data-team="${team}">Clipboard Copy</a></td>
                    <td><a class="load-team-link link" data-team="${team}">Load to import screen</td>
                    </tr>`;
                $("#teams-table").append(row);
            }
        });
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action == "getSource") {
            const source = $(request.source);

            if (source.find('.teamnameedit').length) {
                $("#save-team-name").html(source.find('.teamnameedit').val());
                $("#save-team-contents").val(source.find('.teamedit').text());
                $('.import-screen-toggle').show()
            } else {
                $('.import-screen-toggle').hide()
                $("#save-team-name").html('');
                $("#save-team-contents").val('');
            }

            sendResponse("done getting team");
        }
    });

    chrome.tabs.executeScript(null, {
        file: "showdown-page-get.js"
    }, function () {
        if (chrome.runtime.lastError) {
            // $("#save-team-contents").val('There was an error loading your team script : ' + chrome.runtime.lastError.message);
        }
    });
});

$("#teams-table").on('click', '.copy-team-link', (data) => {
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

$("#teams-table").on('click', '.load-team-link', (data) => {
    const teamName = $(data.target).data('team');

    chrome.storage.sync.get(null, (options) => {
        $.ajax({
            "url": `https://8duqbw8p14.execute-api.us-east-1.amazonaws.com/one/team?username=${options.username}&password=${options.password}&team=${teamName}`,
            "method": "GET",
        }).done(teamData => {
            console.log(teamData);

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "setTeam",
                    data: { teamName, teamData },
                }, (response) => {
                    const testT = tabs;
                    console.log(chrome.runtime.lastError);
                });
            });
        });
    });
});

$('#save-team-button').on('click', () => {
    chrome.storage.sync.get(null, (options) => {
        const teamName = $("#save-team-name").html();
        const teamData = $("#save-team-contents").val();

        $.ajax({
            "url": "https://8duqbw8p14.execute-api.us-east-1.amazonaws.com/one/team",
            "type": "PUT",
            "data": JSON.stringify({
                "username": options.username,
                "password": options.password,
                "team":     teamName,
                "data":     teamData,
            })
        }).done((result) => {
            console.log(result);

            const row = `
                <tr>
                <td>${teamName}</td>
                <td><a class="copy-team-link link" data-team="${teamName}">Clipboard Copy</a></td>
                <td><a class="load-team-link link" data-team="${teamName}">Load to import screen</td>
                </tr>`;
            $("#teams-table").append(row);
        });
    })
});

$('.open-config-link').on('click', () => {
    chrome.runtime.openOptionsPage();   
});