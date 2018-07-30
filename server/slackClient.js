'use strict';
let rtm = null;
const { RTMClient } = require('@slack/client');
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
let nlp = null;


function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on('authenticated', handler);
}

function handleOnMessage(message){
    nlp.ask(message.text, (err, res) => {
        if(err){
            console.log(err);
            return;
        }

        if(!res.intent) {
            return  rtm.sendMessage('Sorry, I did not understand.', 'C9QEDGP5F', function messageSend(){

            });
        }else if(res.intent[0].value == 'time' && res.location){
            return  rtm.sendMessage(`I don't yet know the time in ${res.location[0].value}`, 'C9QEDGP5F', function messageSend(){

            });
        }else{
            console.log(res);
            rtm.sendMessage('Sorry, I did not understand.', 'C9QEDGP5F', function messageSend(){

            } )
        }
    });
}

module.exports.init = function slackClient(token, logLevel, nlpClient) {
    rtm = new RTMClient(token, {logLevel: logLevel});
    nlp = nlpClient;
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on('message', handleOnMessage);
    return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;