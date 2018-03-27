// Load your teams
$('document').ready(() => {
    $('#login-section').css('display', 'block');
    $('#login-tab').addClass('nav-menu-active');
    chrome.storage.sync.get(null, (options) => {
        if (options.username) {
            $('#login-tab').removeClass('nav-menu-active');
            $('#load-tab').addClass('nav-menu-active');
            $('#load-section').css('display', 'block');
            $('#login-section').css('display', 'none');
        }

        $('#header-username').html(options.username);
        $.ajax({
            "url": `https://8duqbw8p14.execute-api.us-east-1.amazonaws.com/one/teams?username=${options.username}&password=${options.password}`,
            "method": "GET",
        }).done((teams) => {
            $('#teams-loading-div').hide();
            if (teams.length > 0) {
                $('.teams-section').show();
                for (let team of teams) {
                    const row = `
                        <p class="team-row" id="team-row-${team}">${team}
                            <img src='copy-icon.png' class='load-team-icon' data-team="${team}">
                        </p>`;
                    $("#teams-div").append(row);
                }
            } else {
                $('#no-teams-div').show()
            }
        });
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action == "getSource") {
            const source = $(request.source);

            if (source.find('.teamedit').length) {
                $("#save-team-name").html(source.find('.teamnameedit').val());
                $("#save-team-contents").val(source.find('.teamedit').text());
            } else {
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

$("#teams-div").on('click', '.copy-team-link', (data) => {
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

$("#teams-div").on('click', '.load-team-icon', (data) => {
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
                <p class="team-row" id="team-row-${teamName}">${teamName}
                    <img src='copy-icon.png' class='load-team-icon' data-team="${teamName}">
                </p>`;
            
            if ($("#teams-div").find(`#team-row-${teamName}`).length) {
                $(`#teams-div #team-row-${teamName}`).replaceWith(row);
            } else {
                $("#teams-div").append(row);
            }
        });
    })
});

$('.open-config-link').on('click', () => {
    chrome.runtime.openOptionsPage();   
});