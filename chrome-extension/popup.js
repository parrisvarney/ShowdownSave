// Load your teams
$('document').ready(() => {
    $('#load-section').css('display', 'block');
    $('#login-tab').addClass('nav-menu-active');
    chrome.storage.sync.get(null, (options) => {
        $.ajax({
            "url": `https://8duqbw8p14.execute-api.us-east-1.amazonaws.com/one/teams?username=${options.username}&password=${options.password}`,
            "method": "GET",
        }).done((teams) => {
            $('.teams-loading-section').hide();
            if (teams.length > 0) {
                $('.teams-section').show();
                for (let team of teams) {
                    const row = `
                        <tr id="team-row-${team}">
                        <td>${team}</td>
                        <td><a class="copy-team-link link" data-team="${team}">Clipboard Copy</a></td>
                        <td><a class="load-team-link link" data-team="${team}">Load to import screen</td>
                        </tr>`;
                    $("#teams-table").append(row);
                }
            } else {
                $('.no-teams-section').show()
            }
        });
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action == "getSource") {
            const source = $(request.source);

            if (source.find('.teamedit').length) {
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

$('.nav-menu > li').on('click', (event) => {
    $('.nav-menu > li').removeClass('nav-menu-active');
    $(event.target).addClass('nav-menu-active');

    $('.main-section').hide();
    const activeSection = $(event.target).data('section');

    $(`#${activeSection}`).show()
})

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
            $('.teams-section').show();
            $('.no-teams-section').hide()

            const row = `
                <tr id="team-row-${teamName}">
                <td>${teamName}</td>
                <td><a class="copy-team-link link" data-team="${teamName}">Clipboard Copy</a></td>
                <td><a class="load-team-link link" data-team="${teamName}">Load to import screen</td>
                </tr>`;
            
            if ($("#teams-table").find(`#team-row-${teamName}`).length) {
                $(`#teams-table #team-row-${teamName}`).replaceWith(row);
            } else {
                $("#teams-table").append(row);
            }
        });
    })
});

$('.open-config-link').on('click', () => {
    chrome.runtime.openOptionsPage();   
});