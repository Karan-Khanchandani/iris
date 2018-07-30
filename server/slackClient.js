'use strict';
let rtm = null;
const {
    RTMClient
} = require('@slack/client');
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
let nlp = null;


function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on('authenticated', handler);
}

function handleOnMessage(message) {

    if (message.text.toLowerCase().includes('karan-bot')) {
        nlp.ask(message.text, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            try {
                if(!res.intent || !res.intent[0] ||  !res.intent[0].value){
                    throw new Error('Could not extract intent.')
                }

                const intent = require('./intents' + res.intent[0].value + 'Intent');

                intent.process(res, function (err, response){
                    if(error){
                        console.log(error.message);
                        return;
                    }

                    return rtm.sendMessage(response, 'C9QEDGP5F', function messageSend() {

                    });
                })
            } catch (error) {
                console.log(error);
                console.log(response);
                return rtm.sendMessage("Sorry, I don't know what you're talking about.", 'C9QEDGP5F', function messageSend() {

                });
            }
            if (!res.intent) {
                return rtm.sendMessage('Sorry, I did not understand.', 'C9QEDGP5F', function messageSend() {

                });
            } else if (res.intent[0].value == 'time' && res.location) {
                return rtm.sendMessage(`I don't yet know the time in ${res.location[0].value}`, 'C9QEDGP5F', function messageSend() {

                });
            } else {
                console.log(res);
                rtm.sendMessage('Sorry, I did not understand.', 'C9QEDGP5F', function messageSend() {

                })
            }
        });
    }

}

module.exports.init = function slackClient(token, logLevel, nlpClient) {
    rtm = new RTMClient(token, {
        logLevel: logLevel
    });
    nlp = nlpClient;
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on('message', handleOnMessage);
    return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;