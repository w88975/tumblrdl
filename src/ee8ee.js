var co=require('co')
const request = require('./request');
require('./lib/logs');
var Parser = require('./parser')
var db = require('./db/connect')
var downloader = require('./download')
var Iconv = require('iconv-lite');

// base url 
var base_url = "http://www.77tvtv.com";

var queryDetail = function(url,post,title,type,cb){
    var trueUrl = `${base_url}/${url}`;
    request(trueUrl,function(err,res,body){
        body = Iconv.decode(body, 'gb2312').toString();
        try {
            var mp4Url = body.match('<a href="http://(.*)">D')[0].replace('<a href="','').replace('">D','')
        } catch(e) {
            return cb()
        }
        
        console.log(title)
        db.count('videos',{fileId: mp4Url},function(err,count){
            if (count <= 0) {
                db.insert('videos',{
                    filename: '',  // 文件名
                    posterFile: '', //封面图片
                    insert_time: new Date(Date.now() + (8 * 60 * 60 * 1000)), // 插入时间
                    video_url: mp4Url, // 视频文件地址
                    origin_url: trueUrl, // post地址
                    title: title, // 描述
                    poster: post, // 封面
                    hasDownload: false, //是否已经下载
                    fileId: mp4Url,
                    type: (()=>{
                        switch(type){
                            case 27:
                            return '乱伦';
                            break;
                            case 28:
                            return '人妻';
                            break;
                            case 29:
                            return '偷拍';
                            break;
                            case 34:
                            return '学生';
                            break;
                            case 54:
                            return '巨乳';
                            break;
                            case 55:
                            return '日韩';
                            break;
                            case 56:
                            return '欧美';
                            break;
                            case 57:
                            return '国产';
                            break;
                            case 58:
                            return '动漫';
                            break;
                        }
                    })()
                })
            }
            // console.log(mp4Url + '入库成功!')
        })
        // console.log(mp4Url)
        cb(mp4Url)
    })
}

var queryOne = function(type,cb){
    var page = 1;
    console.log(`抓取分类:${type}`)
    db.update('continues',{},{
        type: type,
        page: page
    },true)
    var queryFenye = function(spage, fenyecb){
        request(`${base_url}/diao/se${spage=== 1 ? type: type + '_' + spage}.html`,function(err,res,body) {
            console.log(`${base_url}/diao/se${spage=== 1? type: type + '_' + spage}.html`)
            body = Iconv.decode(body, 'gb2312').toString();
            if (body.indexOf('无法找到该页') > -1) {
                return cb()
            }
            var o_url_list = body.match(/video\/(.*)\/(\d{0,5}).html/g)
            var o_title_list = body.match(/title="(.*)" class="async">/g)
            var o_post_list = body.match(/src="(.*)" \/><span class="time">/g)
            var title_list = [];
            var post_list = [];
            var url_list = [];
            o_post_list.map(function(item){
                post_list.push(item.replace('src="','').replace('" /><span class="time">',''))
            })
            for(var i = 0; i < o_title_list.length; i+=2) {
                url_list.push(o_url_list[i])
                title_list.push(o_title_list[i].replace('title="','').replace('" class="async">',''))
            }
            // 视频详情页
            var u_idx = -1;
            var detail_cb = function(){
                u_idx++;
                if (u_idx+1 >= url_list.length) {
                    console.log(`分类:${type}:  第${spage}页抓取完成`)
                    page++;
                    return fenyecb()
                }
                // 检查是否下载过
                db.count('videos',{origin_url: `${base_url}/${url_list[u_idx]}`},function(err,count){
                    if (count > 0) {
                        console.log('==========该视频已存在: skip=========')
                        detail_cb()
                    } else {
                        queryDetail(url_list[u_idx],post_list[u_idx],title_list[u_idx],type,detail_cb)
                    }
                })
            }
            detail_cb()
        })
    }

    var fenye_cb = function(){
        queryFenye(page,fenye_cb)
    }
    queryFenye(page,fenye_cb)
}

var spider = function(cb){
    var types = [];
    db.find('types',{},function(err,result){
        result.map(function(i){
            types.push(i.type)
        })
        var idx = 0;
        var callback = function() {
            idx ++;
            if (idx+1 > types.length) {
                console.log('抓取完成')
                return cb();
            }
            queryOne(types[idx],callback)
        }
        queryOne(types[idx],callback)
    })
}

spider();