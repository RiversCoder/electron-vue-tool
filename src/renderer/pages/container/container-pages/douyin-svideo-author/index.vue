<template>
  <section class="toutiao-svideo">
    <!-- 框架布局 -->
    <h3>批量下载抖音小视频（无水印）</h3><br />
    <el-input v-model="fileStorepath" placeholder="请输入视频(插件)存放的地址" disabled></el-input>
    <span class="line-box"></span>
    <el-button type="info" @click="alertFolderSelect">选择视频及插件存放路径</el-button>

    <span class="line-box"></span>
    <span class="line-box-label"><font style="color:red;">*</font> 如果谷歌浏览器未安装插件，请下载插件安装至浏览器： </span>
    <el-button type="primary" @click="downloadPlugin" icon="el-icon-download" circle></el-button>

    <span class="line-box"></span>
    <span class="line-box-label"><font style="color:red;">*</font> 插件安装使用视频教程，在线播放 （全屏播放效果更好）： </span>
    <el-button type="primary" @click="playTutorialVideo" icon="el-icon-caret-right" circle></el-button>

    <span class="line-box"></span>
    <span class="line-box-label"><font style="color:red;">*</font> 请输入抖音作者的视频列表的URL: </span>
    <el-input v-model="playListUrl" placeholder="请输入当前作者的视频列表URL （去浏览器输入该作者的抖音APP分享地址，需要安装浏览器插件）"></el-input>

    <span class="line-box"></span>
    <span class="line-box-label"><font style="color:red;">*</font> 请输入当前使用的设备及其型号: </span>
    <el-input v-model="userAgent" placeholder="请输入当前使用的设备及其型号 （去浏览器复制）"></el-input>
    
    <span class="line-box"></span>
    <el-button type="primary" @click="searchAuthor">搜索该作者所有小视频</el-button>
    <!-- <el-button type="primary" @click="downloadOneSToutiaoVideo" >下载小视频</el-button> -->

    <!-- 消息提示 -->
    <span class="line-box"></span>
    <!-- <el-alert :title="loading.msg" :type="loading.type" v-if="loading.status"></el-alert> -->

    <!-- video 展示框 -->
    <el-card class="box-card">
    <div slot="header" class="clearfix">
        <span>视频列表</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="downloadAll">下载当前列表所有视频</el-button>
    </div>
    <div class="text item">
        <el-row :gutter="20" class="videoItem">
            <el-col :span="4"><div class="grid-content bg-purple"><b>视频图片预览</b></div></el-col>
            <el-col :span="16"><div class="grid-content bg-purple"><b>视频昵称</b></div></el-col>
            <!-- <el-col :span="4"><div class="grid-content bg-purple">在线播放</div></el-col> -->
            <el-col :span="4"><div class="grid-content bg-purple"><b>操作</b></div></el-col>
        </el-row>
    </div>
    <div v-for="(v,index) in videoList" :key="index" class="text item">
        <el-row :gutter="20" class="videoItem">
            <el-col :span="4"><div class="grid-content bg-purple"><img :src="v.cover" style="width:50px;"/></div></el-col>
            <el-col :span="16"><div class="grid-content bg-purple">{{v.name?v.name:'无视频标题'}}</div></el-col>
            <!-- <el-col :span="4"><div class="grid-content bg-purple">
                <el-button type="primary" round @click="playVideoByUrl(v)">播放</el-button>
            </div></el-col> -->
            <el-col :span="4"><div class="grid-content bg-purple">
                <el-button type="primary" round @click="donwloadVideoByUrl(v)">下载该视频</el-button>
            </div></el-col>
        </el-row>
    </div>
    </el-card>

    <!--视频播放-->
    <el-dialog title="在线视频播放" :visible.sync="videoModal.status" width="80%" center>
        <video :src="videoModal.url" autoplay width="90%" controls style="position:relative;left:5%;"></video>
    </el-dialog>

    <!--回到主页-->
    <div class="fixedToHome" @click="$router.push('/container')" style="cursor:pointer;position:fixed;bottom:30px;right:10px;background-color:#409EFF;color:#fff;z-index:999;width:50px;height:50px;text-align:center;line-height:50px;font-size:15px;">
        主页
    </div>

  </section>
</template>


<script scoped>
    import { urlFormat, mkdir, downliu, sleep, downliuWithHeader, downFile } from  '@/common/scripts/common.js';
    import { ipcRenderer } from 'electron';
    const request = require('request');

    export default {
        name: 'toutiao-svideo-author',
        data(){
            return {
                playListUrl: '',
                basePlayListUrl: 'https://www.iesdouyin.com/web/api/v2/aweme/post/?',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36',
                chromePluginDownloadUrl: 'http://riversfrog.gitee.io/network_source/douyin_spider.zip',
                chromePlufinVideoTutorialUrl: 'http://riversfrog.gitee.io/network_source/douyin_spider_teach.mp4',
                hasMore: true, // 是否有下一页
                max_cursor: 0, // 下一页的锚点 默认0
                videoModal: { status: false, url: '' }, // 是否在线播放视频
                videoList: [/*{ url: 'xxxx', name: '西瓜头条小视频', cover: 'https://element.eleme.cn/2.0/static/hamburger.50e4091.png' }*/],
                videoArr:[],
                fileStorepath: "/Users/a123/Downloads/", // 默认视频存放路径
                currentDate: new Date(),
                mobileVideoPlayUrl:'https://www.iesdouyin.com/share/video/6757547224902667532/?region=CN&mid=6744002686875650820&u_code=195dd43dk&titleType=title&timestamp=1573723519&utm_campaign=client_share&app=aweme&utm_medium=ios&tt_from=copy&utm_source=copy&iid=55815484476',
                headers: { 
                    // 设置请求头
                    "authority": "www.iesdouyin.com",
                    "method": "GET",
                    "path": "/share/video/6756876388831087885/?region=CN&mid=6756863443912887044&u_code=195dd43dk&titleType=title&timestamp=1573287338&utm_campaign=client_share&app=aweme&utm_medium=ios&tt_from=copy&utm_source=copy&iid=55815484476",
                    "scheme": "https",
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                    "accept-encoding": "gzip, deflate, br",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "max-age=0",
                    "cookie":"_ga=GA1.2.451683853.1573285182; _gid=GA1.2.685326156.1573285182; tt_webid=6757217750135866894; _ba=BA0.2-20191109-5199e-xo2daQ5rXPzPOxU6mYRm",
                    "referer": "https://www.iesdouyin.com/share/user/58884971755?u_code=195dd43dk&sec_uid=MS4wLjABAAAAXoEoTxT87AdniErGMo6jr9B3NDELNQ6KiAB2gQ2z_aY&utm_campaign=client_share&app=aweme&utm_medium=ios&tt_from=copy&utm_source=copy&iid=55815484476",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "none",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1",
                    "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1"
                }
            } 
        },
        created(){
            if(localStorage.getItem('videoFolderPath')){
                this.fileStorepath = localStorage.getItem('videoFolderPath');
            }
        },
        mounted(){
        },
        methods:{
            // 点击获取当前作者所有视频列表
            async getAuthorAllVideoList(){

                // const realAuthorUrl = '';
                // const pageContent = '';
                // http://www.zxdmrg.com/archives/51727726.html

                // 基础 URL 
                this.basePlayListUrl = 'https://www.iesdouyin.com/web/api/v2/aweme/post/?';

                // 1. 获取重定向的 页面地址
                let res = new Promise((resolve, reject) => {
                    request({ url: this.playListUrl, method: "GET", json:true, headers: {'user-agent':this.userAgent} }, (err, res, body) => {
                        if(err){
                            reject(err);
                        }
                        resolve({res, body});
                    })
                });
                
                // 获取小视频数据
                res.then(({res, body}) => {
                    // console.log(body)
                    if(body.aweme_list&&body.aweme_list.length == 0){
                        this.$message({type:'error',message:'视频播放列表URL过期，请重新刷新谷歌浏览器获取！'})
                        return;
                    }

                    body.aweme_list.forEach(v => {
                        this.videoList.push({
                            url: v.video.play_addr.url_list[0],
                            name: v.desc.replace(/(<|>|\\|\/|:|\"|\*|\?)/g,''),
                            cover: v.video.cover.url_list[0]
                        });
                    });

                    // console.log(this.videoList.length);
                    if(body.has_more){
                        // 修改URL参数再次请求
                        let attr = urlFormat(this.playListUrl);
                        attr.max_cursor = body.max_cursor;
                        
                        for (let key in attr) {
                            this.basePlayListUrl += key+'='+attr[key]+'&'
                        }
                        // 重新获取新的 url
                        this.playListUrl = this.basePlayListUrl.slice(0,-1);
                        setTimeout(() => {
                            this.getAuthorAllVideoList();
                        }, 1500);
                    }
                    console.log(JSON.stringify(this.videoList))
                })
            },
            // 下载插件至本地
            downloadPlugin(){
                downFile(this.fileStorepath, this.chromePluginDownloadUrl, '.zip', '抖音谷歌浏览器插件', () => {
                    this.$message({ message: '插件下载成功！', type: 'success' });
                })
            },
            // 播放插件安装使用视频教程
            playTutorialVideo(){
                this.videoModal.status = true;
                this.videoModal.url = this.chromePlufinVideoTutorialUrl;
            },
            // 打开且选择文件夹
            alertFolderSelect(){
                ipcRenderer.send('open-directory-dialog','openDirectory'); // 打开且选择文件夹
                ipcRenderer.on('selectedItem',(ev,it) => {
                    console.log(ev,it); // 获取选择的文件夹信息
                    this.fileStorepath = it;
                    localStorage.setItem('videoFolderPath',it);
                });
            },
            // 点击作者全部小视频搜索
            searchAuthor(){
                
                this.videoList = [];
                this.getAuthorAllVideoList();
                
            },
            // 根据小视频的url 下载该小视频
            async donwloadVideoByUrl(videoObject){
                // 验证且创建目录
                await mkdir(this.fileStorepath);
                // 开始下载
                await downliuWithHeader(this.fileStorepath, videoObject, this.headers, () => {
                    this.$message({ message: '名称为<'+videoObject.name+'>的视频下载成功！', type: 'success' });
                })
            },
            // 下载所有的视频
            async downloadAll(){
                this.videoList.forEach(async (video,index) => {
                    await this.donwloadVideoByUrl(video);
                    await sleep(Math.ceil(Math.random()*500));
                });
                // console.log('全部下载完成')
            }
        },
        components: {}
    }

</script>

<style lang="css" scoped>
    .toutiao-svideo{ width:80%; margin:0 auto;margin-top:30px; }
    .line-box{ width:100%;height:20px;display:block; }
    .line-box-label{height:50px;line-height: 50px;font-size:14px;}
    .video-box{width:100%;height:auto;margin-top: 20px;}
    .videoItem .grid-content{height:60px;overflow: hidden;margin-top:2px;}
</style>