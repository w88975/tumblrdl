const _request = require('request');
const Agent = require('socks5-http-client/lib/Agent');
const AgentSSL = require('socks5-https-client/lib/Agent');
const config = require('../config.json')
// inject request
const request = (url,callback) => {
    var params = {
        url: url,
        strictSSL: true,
        headers: { Connection: 'keep-alive'},
        encoding: null,
    }
    // if (config.proxy) {
    //     params.agentClass = (url.substring(0, 5) === "https") ? AgentSSL :Agent;
    //     params.agentOptions = {
    //         socksHost: '127.0.0.1', // Defaults to 'localhost'.
    //         socksPort: 1080, // Defaults to 1080.
    //     }
    // }
    _request(params, callback);
}

module.exports = request;