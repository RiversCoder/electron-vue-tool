<template>
  <section class="toutiao-svideo">
    <!-- 框架布局 -->
    <h3>批量下载头条小视频（无水印）</h3><br />
    <el-input v-model="fileStorepath" placeholder="请输入视频存放的地址" disabled></el-input>
    <span class="line-box"></span>
    <el-button type="info" @click="alertFolderSelect">选择视频存放路径</el-button>
     <span class="line-box"></span>
    <el-input v-model="value" placeholder="请输入作者的主页分享链接"></el-input>
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

    <div class="fixedToHome" @click="$router.push('/container')" style="cursor:pointer;position:fixed;bottom:30px;right:10px;background-color:#409EFF;color:#fff;z-index:999;width:50px;height:50px;text-align:center;line-height:50px;font-size:15px;">
        主页
    </div>

    <!-- <el-dialog title="视频播放" :visible.sync="videoModal.status" width="30%" center>
        <video :src="videoModal.url" autoplay width="300" controls></video>
    </el-dialog> -->

    <!-- <div class="video-box" >
        <el-row>
            <el-col :span="8" v-for="(o, index) in videoArr" :key="o" :offset="index > 0 ? 2 : 0">
                <el-card :body-style="{ padding: '0px' }">
                <img :src="o.cover" class="image" width="100%">
                <div style="padding: 14px;">
                    <span>{{o.title}}</span>
                    <div class="bottom clearfix">
                    <time class="time">{{ currentDate.format("yyyy-MM-dd hh:mm:ss") }}</time>
                    <el-button type="text" class="button" @click="downloadOneSToutiaoVideo">下载视频</el-button>
                    </div>
                </div>
                </el-card>
            </el-col>
        </el-row>
    </div>  -->

  </section>
</template>


<script scoped>
    import { urlFormat, mkdir, downliu, sleep, downliuWithHeader } from  '@/common/scripts/common.js';
    import { ipcRenderer } from 'electron';
    const request = require('request');
    // const fs = require('fs');

    // console.log(fs);
    // 

    export default {
        name: 'toutiao-svideo-author',
        data(){
            return {
                value: 'https://i.snssdk.com/rogue/ugc/profile/?version_code=6.9.8&version_name=60908&user_id=52654717138&media_id=52655017991&request_source=1&active_tab=dongtai&device_id=65&app_name=news_article',
                apiValue: 'https://i.snssdk.com/api/feed/profile/v1/?category=profile_short_video&visited_uid=109127257045&stream_api_version=82&offset=1567519982089&version_code=6.9.8&version_name=60908&user_id=109127257045&media_id=0&request_source=1&active_tab=dongtai&device_id=65&app_name=news_article',
                searchApiAttr:{
                    active_tab: "", app_name: "",
                    category: "profile_short_video", device_id: "", 
                    media_id: "", offset: "", // 第二次接口会带上
                    request_source: "", stream_api_version: "82",
                    user_id: "", version_code: "", version_name: "", visited_uid: "",
                },
                offset: '', // 翻页
                videoModal: { status: false, url: '' }, // 是否在线播放视频
                videoUrl: '',
                // allDownload:{ downloadCount: 0, status: false }, // 下载到第几个
                videoList: [/*{ url: 'xxxx', name: '西瓜头条小视频', cover: 'https://element.eleme.cn/2.0/static/hamburger.50e4091.png' }*/],
                videoArr:[],
                fileStorepath: "/Users/a123/Downloads/", // 默认视频存放路径
                currentDate: new Date(),
                alertCount: 0
            } 
        },
        created(){
            if(localStorage.getItem('videoFolderPath')){
                this.fileStorepath = localStorage.getItem('videoFolderPath');
            }
        },
        mounted(){
            // this.searchAuthorAllToutiaoVideos();
        },
        methods:{
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
                
                if(!this.value){
                    this.$message({ message: '作者的主页链接不能为空', type: 'warning' });
                    return
                }

                this.offset = '';
                this.videoList = [];

                this.searchAuthorAllToutiaoVideos();

            },
            // 获取所有小视频
            searchAuthorAllToutiaoVideos(){
               // 获取基本的接口方法
               let apiUrl = 'https://i.snssdk.com/api/feed/profile/v1/'
               // 解析URL成 需要的视频资源定位
               let attr = urlFormat(this.value);
               // 拼接参数
               this.searchApiAttr = {
                    active_tab: attr.active_tab,
                    app_name: attr.app_name,
                    category: "profile_short_video",
                    device_id: attr.device_id,
                    media_id: attr.media_id,
                    offset: this.offset, // 第二次接口会带上
                    request_source: attr.request_source,
                    stream_api_version: "82",
                    user_id: attr.user_id,
                    version_code: attr.version_code,
                    version_name: attr.version_name,
                    visited_uid: attr.user_id,
                };
                // console.log(this.searchApiAttr)
                
                request({
                    method:'GET', url: apiUrl, qs: this.searchApiAttr
                },(err,res,body) => {
                    let response = JSON.parse(body);
                    // 获取视频偏移量 翻页
                    this.offset = response.offset;

                    // 获取视频列表
                    let videoInfos = {url:'',cover:'',name:''};
                    let videoInfo = '';
                    response.data.forEach(v => {
                       videoInfo = JSON.parse(v.content).raw_data;
                       this.videoList.push({
                           url: videoInfo.video.play_addr.url_list[0],
                           cover: videoInfo.video.origin_cover.url_list[0],
                           name: videoInfo.title
                       })
                    });

                    if(response.has_more){
                        let timer = setTimeout(v=> {
                            this.searchAuthorAllToutiaoVideos();
                            clearTimeout(timer);
                        }, 1500+Math.ceil(Math.random()*500) );
                    }

                })
                // this.axios.get(apiUrl,{params:this.searchApiAttr}).then(res => {
                //     console.log(res);
                // })
            },
            // 在线播放该小视频
            playVideoByUrl(videoObject){
                console.log(videoObject)
                this.videoModal.status = true;
                this.videoModal.url = videoObject.url;
            },
            // 根据小视频的url 下载该小视频
            async donwloadVideoByUrl(videoObject){
                // 验证且创建目录
                await mkdir(this.fileStorepath);
                // 开始下载
                await downliu(this.fileStorepath, videoObject, () => {
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
    .video-box{width:100%;height:auto;margin-top: 20px;}
    .videoItem .grid-content{height:60px;overflow: hidden;margin-top:2px;}
</style>