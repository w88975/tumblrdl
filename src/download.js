const db = require('./db/connect');
const request = require('request');
const Agent = require('socks5-http-client/lib/Agent');
const AgentSSL = require('socks5-https-client/lib/Agent');
var fs = require('fs');
var config = require('../config.json')

function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

var downloadOne = function(fileId,callback){
    console.log(`开始下载: ${fileId}`);
    db.find('videos',{fileId: fileId},function(err, result){
        if (result[0].hasDownload) {
            console.log(`${fileId} 已经下载过, 跳过此步`)
            console.log(callback)
            callback&&callback()
        }
        var obj = {
            video: result[0].video_url,
            poster: result[0].poster,
            fileId: fileId
        }
        var fileName = randomString(32);
        var videoStream = fs.createWriteStream(`${config.fileDir}/video/${fileName}.mp4.download`);
        var posterStream = fs.createWriteStream(`${config.fileDir}/poster/${fileName}.jpg.download`);
        request({
            url: obj.video,
            strictSSL: true,
            agentClass: (obj.video.substring(0, 5) === "https") ? AgentSSL :Agent,
            agentOptions: {
                socksHost: '127.0.0.1',
                socksPort: 1080,
            },
            headers: { Connection: 'keep-alive'}
        }).pipe(videoStream).on('close', function(){
            request({
                    url: obj.poster,
                    strictSSL: true,
                    agentClass: (obj.poster.substring(0, 5) === "https") ? AgentSSL :Agent,
                        agentOptions: {
                        socksHost: '127.0.0.1',
                        socksPort: 1080,
                    },
                    headers: { Connection: 'keep-alive'}
            }).pipe(posterStream).on('close', function(){
                console.log(`下载完成: ${fileId}`);
                fs.rename(`${config.fileDir}/video/${fileName}.mp4.download`,`${config.fileDir}/video/${fileName}.mp4`)
                fs.rename(`${config.fileDir}/poster/${fileName}.jpg.download`,`${config.fileDir}/poster/${fileName}.jpg`)
                db.update('videos',{fileId: fileId},{filename: `${fileName}.mp4`,posterFile: `${fileName}.jpg`, hasDownload: true},false)
                return callback()
            });
        });
    })
}

module.exports = downloadOne