const app = require('express');
const router = app.Router();
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
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


// 01. 根据头条小视频分享链接 获取无水印小视频下载链接
router.get('/svideo-one',async (req,res,next) => {
    // 接收分享链接的参数
    const { surl } = req.query;
    // 获取真实视频的 ID 6755797314666876164
    // https://www.ixigua.com/i6755797314666876164/
    // https://m.toutiaoimg.cn/group/6755797314666876164/?app=news_article&timestamp=1573006787
    let cid = 0;
    surl.replace(/group\/(\d+)\//g, (...args) => {
        cid = args[1];
    });
    let newPageUrl = 'https://www.ixigua.com/i'+cid+'/';

    // 获取页面数据
    const getHtml = async (url) => {
        const browser = await puppeteer.launch({
            headless: false,
            timeout: 60,
            pipe: true
        });
        
        const page = await browser.newPage();
        // await page.emulate(iPhone);
        page.setViewport({width:1920,height:1080})
        await page.goto(url);
        let videoHTML = '';
        let videoInfo = {title: '', url: ''};
        // 开始捕获vs元素
        while(!videoHTML){
            try {
                videoHTML = await page.$eval('#vs', v => v.innerHTML);
            } catch (error) {
                console.log('error')
            }
        }
        let videoSrc = "";
        videoHTML.replace(/<video[^>]*src=\"([^\"|>]+)\"[^>]*>\s*<\/video>/g, (...args) => {
            videoSrc = 'https:'+ args[1];
        });
        console.log(videoSrc)
        videoInfo.title = await page.title();
        videoInfo.url = videoSrc;
        
        return {videoInfo, browser};
    };

    // 获取播放页面数据
    let {videoInfo, browser} = await getHtml(newPageUrl);
    await res.json({msg:'success', info: videoInfo});
    await browser.close();
    next();
});


router.get('/donwload-svideo', async (req, res, next) => {
    const {video, storePath} = req.query;

    // 创建目录
    await mkdir(storePath);
    
    // 下载视频
    await downliu(storePath, video);

    res.json({msg:'success',data: []});
    next();
})  


export default router;
// console.log(router);
// export default  router;