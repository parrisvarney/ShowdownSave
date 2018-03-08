chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.action == "setTeam") {
            document.getElementsByClassName('teamnameedit')[0].value = request.data.teamName;

            const teamDataDiv = document.getElementsByClassName('teamedit')[0];
            teamDataDiv.getElementsByClassName('textbox')[0].value = request.data.teamData;

            sendResponse("done setting team");
        }
    }
);