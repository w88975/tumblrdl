var db = require('./db/connect')
const xml2js = require('xml2js');
var parseString = require('xml2js').parseString;
// 返回 
var r = { 
    origin_url: '',
    video_url: '', 
    poster: '',
    title: '',
    tumblr: '', //博主账号
    tumblr_name: '',
}
var _PARSER = {
    posts: [],

    parse(xml,tumblr,cb){
        var t = this;
        parseString(xml,function(err, result){
            if (!err) {
                if (!result.tumblr.posts[0].post) {
                    return cb()
                }
                result.tumblr.posts[0].post.map(function(item){
                    // console.log(item['video-player'])
                    if (!item['video-player'][0].match(/\"https:\/\/(.*).(.*).com\/video_file\/(.*)(\" )/)) {
                        return
                    }
                    var video_url = item['video-player'][0].match(/\"https:\/\/(.*).(.*).com\/video_file\/(.*)(\" )/)[0].replace(/\"/g,'').replace(/ /g,'')
                    var fileId = video_url.match(/tumblr_\w{0,17}/)[0];
                    t.posts.push({
                        origin_url: item.$.url,
                        title: item.$.slug,
                        // tumblr: tumblr,
                        // tumblr_name: result.tumblr.tumblelog[0].$.title,
                        video_url: video_url,
                        poster: item['video-player'][0].match(/(https:\/\/)(.*)(.jpg' preload)/)[0].replace('\' preload',''),
                        hasDownload: false,
                        insert_time: new Date(Date.now() + (8 * 60 * 60 * 1000)),
                        filename: '',
                        fileId: fileId,
                        posterFile: '',
                        type: 'tumblr'

                    })
                })
                t.posts.map(function(item){
                    db.count('videos',{fileId: item.fileId},function(err, count){
                        if (count <= 0){
                            db.insert('videos',item)
                        }
                    })
                })
                t.posts = [];
            }
            cb()
        })
    },

    getTotal(xml,cb){
         parseString(xml,function(err, result){
            var total = 0;
            try {
                total = result.tumblr.posts[0].$.total;
            } catch(e) {
                console.log(result)
            }
            
            cb(Number(total))
        })
    },
}

module.exports = _PARSER;