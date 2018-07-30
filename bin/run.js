'use strict';

const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);

const witToken = 'NVCOIJYZKHKS43NHEYLMAEJM256L2FWI';
const witClient = require("../server/witClient")(witToken);
const slackToken = 'xoxb-331044129858-406541948145-I7KyN4DwVxfjoYbYVa1zIpJ8';
const slackLogLevel = 'info';

const rtm = slackClient.init(slackToken, slackLogLevel, witClient);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

server.on('listening', function() {
    console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')} mode.`);
});