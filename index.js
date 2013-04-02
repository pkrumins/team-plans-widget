var hyperglue = require('hyperglue');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

var html = fs.readFileSync(__dirname + '/static/team-plans-widget.html');
var css = fs.readFileSync(__dirname + '/static/team-plans-widget.css');

var insertedCss = false;

module.exports = TeamPlansWidget;
TeamPlansWidget.prototype = new EventEmitter;

function TeamPlansWidget () {
    if (!(this instanceof TeamPlansWidget)) return new TeamPlansWidget();
    EventEmitter.call(this);
    var self = this;

    if (!insertedCss) {
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(css));

        if (document.head.childNodes.length) {
            document.head.insertBefore(style, document.head.childNodes[0]);
        }
        else {
            document.head.appendChild(style);
        }
        insertedCss = true;
    }

    var root = hyperglue(html);
    var newTeam = root.querySelector('#create-new-team');
    var newTeamForm = newTeam.querySelector('form[name="new-team"]');
    var teamMembers = root.querySelector('#edit-team-members');
    var teamMembersList = teamMembers.querySelector('#team-members');
    var teamMembersForm = teamMembers.querySelector('form[name="add-new-member"]');

    newTeam.style.display = 'visible';
    newTeam.style.visibility = 'visible';
    teamMembers.style.display = 'hidden';
    teamMembers.style.visibility = 'hidden';

    newTeamForm.addEventListener('submit', function (ev) {
        var team = newTeamForm.querySelector('input[type="text"]').value;
        if (team.length) {
            self.emit('newTeam', team);
            newTeam.style.display = 'hidden';
            newTeam.style.visibility = 'hidden';
            teamMembers.style.display = 'visible';
            teamMembers.style.visibility = 'visible';
            teamMembers.querySelector('#team-name').innerHTML = team;
        }
        ev.preventDefault();
        return false;
    });

    teamMembersForm.addEventListener('submit', function (ev) {
        var member = teamMembersForm.querySelector('input[type="text"]').value;
        if (member.length) {
            if (/\S+@\S+\.\S+/.test(member)) {
                self.emit('newTeamMember', member);
                var div = document.createElement('div');
                div.appendChild(document.createTextNode(member));
                teamMembersList.appendChild(div);
            }
        }
        ev.preventDefault();
        return false;
    });

    self.on('existingTeam', function (team) {
        newTeam.style.display = 'hidden';
        newTeam.style.visibility = 'hidden';
        teamMembers.style.display = 'visible';
        teamMembers.style.visibility = 'visible';
        teamMembers.querySelector('#team-name').innerHTML = team;
    });

    self.on('existingTeamMember', function (member) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(member));
        teamMembersList.appendChild(div);
    });

    self.appendTo = function (target) {
        if (typeof target === 'string') {
            target = document.querySelector(target);
        }
        target.appendChild(root);
    }
}
