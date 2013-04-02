// browserify -t brfs ./main.js > bundle.js
//
var teamPlansWidget = require('../');
var teamPlansWidget = teamPlansWidget();
teamPlansWidget.appendTo('#teamplans');

document.querySelector('#createTeamForm').addEventListener('submit', function (ev) {
    teamPlansWidget.emit('existingTeam', 'Google');
    ev.preventDefault();
    return false;
});

document.querySelector('#addMembersForm').addEventListener('submit', function (ev) {
    teamPlansWidget.emit('existingTeamMember', 'peteris@browserling.com');
    teamPlansWidget.emit('existingTeamMember', 'james@browserling.com');
    teamPlansWidget.emit('existingTeamMember', 'rudolph@browserling.com');
    teamPlansWidget.emit('existingTeamMember', 'arnold@browserling.com');
    teamPlansWidget.emit('existingTeamMember', 'obama@browserling.com');
    ev.preventDefault();
    return false;
});

teamPlansWidget.on('newTeam', function (team) {
    document.querySelector('#output').appendChild(
        document.createElement('div').appendChild(
            document.createTextNode('New team: ' + team)
        )
    );
});

teamPlansWidget.on('newTeamMember', function (member) {
    document.querySelector('#output').appendChild(
        document.createElement('div').appendChild(
            document.createTextNode('New team member: ' + member)
        )
    );
});
