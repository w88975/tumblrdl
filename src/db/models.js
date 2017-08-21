var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const videos = new Schema({ 
    video_url: String, // 视频文件地址
    origin_url: String, // post地址
    filename: String,  // 文件名
    posterFile: String, //封面图片
    insert_time: Date, // 插入时间
    title: String, // 描述
    poster: String, // 封面
    hasDownload: Boolean, //是否已经下载
    fileId: String, // 文件唯一标识 用来去重
    type: String, // 视频分类
});

// const ee8ees = new Schema({
//     filename: String,  // 文件名
//     posterFile: String, //封面图片
//     insert_time: Date, // 插入时间
//     video_url: String, // 视频文件地址
//     origin_url: String, // post地址
//     title: String, // 描述
//     poster: String, // 封面
//     fileId: String, // 文件唯一标识 用来去重
//     hasDownload: Boolean, //是否已经下载,
//     type: String, // 视频分类
// });

// 汤不热账号
const tumblrs = new Schema({
    name: String, // 博主
});
// 保存当前分类 页数
const continues = new Schema({
    type: String,
    page: String
})

const types = new Schema({
    type: String
})

module.exports = {
    videos: videos,
    tumblrs: tumblrs,
    continues: continues,
    types: types
}
