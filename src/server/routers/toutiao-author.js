const app = require('express');
const router = app.Router();
const path = require('path');
const request = require('request');
const async = require("async");
const fs = require('fs');
const mkdirp =require('mkdirp');


// 公共方法
async function sleep(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
};

// 验证文件夹是否存在，如果不存在创建该文件夹
async function mkdir(path) {
    console.log('准备创建目录：%s', path);
    if (fs.existsSync(path)) {
        console.log('目录：%s 已经存在', path);
    }else {
        return mkdirp(path, function (err) {
            console.log('目录：%s 创建成功'.info, path);
        });
    }
}

// 下载视频
async function downliu(FolderPath, video) {
    // console.log('发现%d张图片，准备开始下载...', links.length);
    //eachLimits 控制下载视频并行上限 第二个参数 options.downLimit 就是配置
    //获取url最后的名字
    video = JSON.parse(video)
    var fileName = video.name ? video.name : Math.floor((Math.random()*100000));
    //去掉/
    var toPath = path.join(FolderPath, fileName);
    // var toPath = FolderPath +'\\'+fileName;

    // console.log('开始下载视频：%s，保存到：%s', fileName, FolderPath);
    request(encodeURI(video.url)).on('error', function(err) {
        console.log(err)
    }).pipe(fs.createWriteStream(toPath+".mp4")).on('finish',()=>{
        console.log('视频下载成功：%s', video.url);
    })
}

router.get('/donwload-svideo', async (req, res, next) => {
    const {video, storePath} = req.query;

    // 创建目录
    await mkdir(storePath);
    
    // 下载视频
    await downliu(storePath, video);

    res.json({msg:'success',data: []});
    next();
})  


// module.exports = router;
export default router;