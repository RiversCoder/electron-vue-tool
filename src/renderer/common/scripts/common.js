const mkdirp =require('mkdirp');
const fs = require('fs');
const path = require('path');
const request = require('request');

//var time1 = new Date().format("yyyy-MM-dd hh:mm:ss");
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}

// 将url格式化成对象的方式
export const urlFormat = (url) => {
    let search = url.split('?')[1];
    let searchArr = search.split('&');
    let obj = {};

    searchArr.forEach(v => {
        obj[v.split('=')[0]] = v.split('=')[1];
    })
    
    return obj;
}

// 验证文件夹是否存在，如果不存在创建该文件夹
export async function mkdir(path) {
    // console.log('准备创建目录：%s', path);
    if (fs.existsSync(path)) {
        console.log('目录：%s 已经存在', path);
    }else {
        return mkdirp(path, function (err) {
            console.log('目录：%s 创建成功'.info, path);
        });
    }
}

// 睡眠 sleep
export async function sleep(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
};


// 下载视频
export async function downliu(FolderPath, videoObject, callback) {
    // console.log('发现%d张图片，准备开始下载...', links.length);
    //eachLimits 控制下载视频并行上限 第二个参数 options.downLimit 就是配置
    //获取url最后的名字
    let video = videoObject;
    var fileName = video.name ? video.name : ''+ Math.floor((Math.random()*100000));
    //去掉/
    var toPath = path.join(FolderPath, fileName);

    // console.log('开始下载视频：%s，保存到：%s', fileName, FolderPath);
    request(encodeURI(video.url)).on('error', function(err) {
        console.log(err)
    }).pipe(fs.createWriteStream(toPath+".mp4")).on('finish',()=>{
        callback&&callback();
        // console.log('视频下载成功：%s', video.url);
    })
}

// 带请求头下载视频
export async function downliuWithHeader(FolderPath, videoObject, headers, callback) {
    // console.log('发现%d张图片，准备开始下载...', links.length);
    //eachLimits 控制下载视频并行上限 第二个参数 options.downLimit 就是配置
    //获取url最后的名字
    let video = videoObject;
    var fileName = video.name ? video.name : ''+ Math.floor((Math.random()*100000));
    //去掉/
    var toPath = path.join(FolderPath, fileName);

    // console.log('开始下载视频：%s，保存到：%s', fileName, FolderPath);
    request({
        method: 'get',
        url: encodeURI(video.url),
        headers: headers
    }).on('error', function(err) {
        console.log(err)
    }).pipe(fs.createWriteStream(toPath+".mp4")).on('finish',()=>{
        callback&&callback();
        // console.log('视频下载成功：%s', video.url);
    })
}

