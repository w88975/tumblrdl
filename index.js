// var downloader = require('./src/download')
// downloader('tumblr_o69ud8q7mv1u8ncgr')
var request = require('request')
const Agent = require('socks5-http-client/lib/Agent');
const AgentSSL = require('socks5-https-client/lib/Agent');
var express = require('express')
var app = express()

app.get('/test1',function(req,res){
    request({
        url: 'http://101.110.118.40/201606mp4.11bubu.com/e/20170327/24/1/xml/91_27d07adcf1eb48c8a26bffeede1b707e.mp4',
        strictSSL: true,
        // agentClass:  AgentSSL,
        // agentOptions: {
        //     socksHost: '127.0.0.1', // Defaults to 'localhost'.
        //     socksPort: 1080, // Defaults to 1080.
        // },
    }).pipe(res).on('close',function(){
        console.log('完成')
    });
})
app.listen(8888)
// var db = require('./src/db/connect')
// db.insert('tumblrs',{name:'m37536034'})
// // db.update('videos',{poster: 'https://31.media.tumblr.com/tumblr_nzv81c76mO1unn0bq_frame1.jpg'},{posterFile: '///////////'},false)