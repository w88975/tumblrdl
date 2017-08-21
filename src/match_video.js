const request = require('./request');
require('./lib/logs');
var Parser = require('./parser')
var db = require('./db/connect')
var downloader = require('./download')
var RemoveCache = require('./removecache')
// Setting timeout
var TIMEOUT = 10;
// Retry times
var RETRY = 5;
//Numbers of posts/videos per page
var MEDIA_NUM = 50; 
// Medium Index Number that Starts from
var START = 0;
// Medium type: video or photo
var MEDIA_TYPE = 'video';
// Numbers of downloading threads concurrently
var THREADS = 10
// base url 
var base_url = "https://{0}.tumblr.com/api/read?type={1}&num={2}&start={3}";

var pageQuery = function(name,tnum,total,cb){
    console.log(`正在抓取第${tnum}条,一共${total}条`)
    request(`https://${name}.tumblr.com/api/read?type=video&num=50&start=${tnum}`,function(err,res,body){
        Parser.parse(body,name,function(){
            cb()
        })
    })
}

var queryOne = function(name,cb) {
    console.log(`开始抓取: "${name}": `);
    request(`https://${name}.tumblr.com/api/read?type=video&num=50&start=0`,function(err,res,body){
        Parser.getTotal(body,function(total) {
            var tnum = 0;
            var pageQueryCallBack = function() { 
                if (tnum >= total) {
                    console.log('抓取完成')
                    tnum = 0; 
                    return cb()
                }
                tnum += 50;
                pageQuery(name,tnum,total,pageQueryCallBack)
            }
            console.log(`"${name}" 共有: ${total} 条视频`)
            pageQuery(name,tnum,total,pageQueryCallBack)
        })
    })
}

var spider = function(cb){
    // 先查询db该博主的所有数据
    // var tumblrs = ['codesama','caobi92xiaosaohuo',];
    var tumblrs = ['m37536034','new-aidemilan'];
    var idx = 0;
    var callback = function(){
        idx ++;
        if (!!!tumblrs[idx]) {
            return cb&&cb()
        }
        queryOne(tumblrs[idx],callback)
    }
    queryOne(tumblrs[idx],callback)
}

var mulit = function(){
    RemoveCache()
    db.find('videos',{hasDownload: false},function(err, results){
        var len = results.length;
        var idx = 0;
        var threads = 2;
        var callback = function(){
            idx++;
            if (idx+1 >= results.length) {
                console.log('🙄🙄🙄🙄🙄🙄🙄🙄🙄🙄所有任务下载完成🙄🙄🙄🙄🙄🙄🙄🙄🙄🙄')
                return;
            }
            if (results.length <= 0) {
                return;
            }
            try{
                downloader(results.shift().fileId,callback)
            }catch(e) {
                console.log('出错了🤡')
            }
            
        }
        if (results.length <=0) {
            return callback()
        }

        for(var i = 0; i < threads; i++){
            try {
                downloader(results.shift().fileId,callback)
            } catch(e){
                console.log('出错了🤡')
            }
            
        }
    })
}

spider()
// mulit();