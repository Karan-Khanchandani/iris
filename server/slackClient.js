'use strict';
let rtm = null;
const { RTMClient } = require('@slack/client');
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on('authenticated', handler);
}

function handleOnMessage(message){
    console.log(message);
    rtm.sendMessage('This is a test msg', 'C9QEDGP5F', function messageSend(){

    } )
}

module.exports.init = function slackClient(token, logLevel) {
    rtm = new RTMClient(token, {logLevel: logLevel});
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on('message', handleOnMessage);
    return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;