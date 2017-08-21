var redis = require('redis');
var config = require('./../config.json');
var client = redis.createClient(config.redis_host);

module.exports = {
    s: JSON.stringify,
    client: client
}
