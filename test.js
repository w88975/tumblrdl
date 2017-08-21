const request = require('request');
const Agent = require('socks5-http-client/lib/Agent');
const AgentSSL = require('socks5-https-client/lib/Agent');


var express = require('express');
var app = express()
var proxy = require('express-http-proxy');
var mime = require('mime');

var pipeStream = (req,res,url)=>{
    var isHTTPS = (url.substring(0,5) === 'https')
    // var Reg = /(?<=\/|)((\w)+\.)+\w+/;
    // var hostName = Reg.exec(url)
    req.headers.host = 'wsqncdn.miaopai.com';
    request({
        url: url,
        method: 'get',
        // agentClass: isHTTPS ? AgentSSL : Agent,
        //     agentOptions: {
        //     socksHost: '127.0.0.1',
        //     socksPort: 1080,
        // },
        headers: req.headers
    })
    .on('response', function(response) {
        for (var key in response.headers) {
            res.setHeader(key,response.headers[key])
        }
        res.statusCode = response.statusCode;
        // if (res.statusCode !== 200) {
        //     res.end()
        // }
    })
    .on('data', function(data) {
        res.write(data) 
    })
    .on('done', function(data) {
        res.end()
    })
}

app.get('/:url',function(req,res){
    res.type('.mp4');
    console.log(req.params.url)
    pipeStream(req,res,req.params.url)
   
})


app.listen(8888)