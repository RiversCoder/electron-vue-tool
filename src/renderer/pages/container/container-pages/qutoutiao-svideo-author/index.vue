<template>
  <section class="toutiao-svideo">
    <!-- 框架布局 -->
    <h3>批量下载趣头条短视频（无水印）</h3><br />
    <el-input v-model="fileStorepath" placeholder="请输入视频存放的地址" disabled></el-input>
    <span class="line-box"></span>
    <el-button type="info" @click="alertFolderSelect">选择视频存放路径</el-button>
     <span class="line-box"></span>
    <el-input v-model="value" placeholder="请输入作者的主页分享链接"></el-input>
    <span class="line-box"></span>
    <!-- 页码限制 -->
    <el-form label-position="left" label-width="80px" >
        <el-form-item label="页码范围" >
            <el-input placeholder="开始页码 默认第1页" style="width:20%" v-model="startPage"></el-input> --
            <el-input placeholder="结束页码 默认第2页" style="width:20%" v-model="endPage"></el-input>
        </el-form-item>
    </el-form>

    <el-button type="primary" @click="searchAuthor">搜索该作者所有短视频【页码范围段】</el-button>
    <!-- <el-button type="primary" @click="downloadOneSToutiaoVideo" >下载小视频</el-button> -->

    <!-- 消息提示 -->
    <span class="line-box"></span>



    <!-- video 展示框 -->
    <el-card class="box-card">
    <div slot="header" class="clearfix">
        <span>视频列表 当前第 {{ this.startPage + '-' + this.page }} 页 总页数 <b>{{ this.totalPage }}</b> 页</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="downloadAll">下载当前列表所有视频</el-button>
    </div>
    <div class="text item">
        <el-row :gutter="20" class="videoItem">
            <el-col :span="4"><div class="grid-content bg-purple"><b>视频图片预览</b></div></el-col>
            <el-col :span="13"><div class="grid-content bg-purple"><b>视频昵称</b></div></el-col>
            <el-col :span="3"><div class="grid-content bg-purple">在线播放</div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple"><b>操作</b></div></el-col>
        </el-row>
    </div>
    <div v-for="(v,index) in videoList" :key="index" class="text item">
        <el-row :gutter="20" class="videoItem">
            <el-col :span="4"><div class="grid-content bg-purple"><img :src="v.cover" style="width:50px;"/></div></el-col>
            <el-col :span="13"><div class="grid-content bg-purple">{{v.name?v.name:'无视频标题'}}</div></el-col>
            <el-col :span="3"><div class="grid-content bg-purple">
                <el-button type="primary" round @click="playVideoByUrl(v)">播放</el-button>
            </div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple">
                <el-button type="primary" round @click="donwloadVideoByUrl(v)">下载该视频</el-button>
            </div></el-col>
        </el-row>
    </div>
    </el-card>

    <el-dialog title="在线视频播放" :visible.sync="videoModal.status" width="80%" center>
        <video :src="videoModal.url" autoplay width="90%" controls style="position:relative;left:5%;"></video>
    </el-dialog>

    <div class="fixedToHome" @click="$router.push('/container')" style="cursor:pointer;position:fixed;bottom:30px;right:10px;background-color:#409EFF;color:#fff;z-index:999;width:50px;height:50px;text-align:center;line-height:50px;font-size:15px;">
        主页
    </div>

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
    // const requestSync = require('sync-request');
    // const fs = require('fs');

    // console.log(fs);
    //

    export default {
        name: 'toutiao-svideo-author',
        data(){
            return {
                value: 'http://h5ssl3.1sapp.com/qukan_new2/dest/zmt_home/read/zmt_home/index.html?id=1639638',
                apiValue: 'http://api.1sapp.com/wemedia/content/videoList?token=&dtu=200&version=0&os=android&id=1639638&page=1&_=1573289356607',
                searchApiAttr:{
                    token:'', dtu:'', version:0,os:'andriod',id: '',page:'',_:0
                },
                startPage: 1,
                page: 1, // 翻页
                endPage: 2,
                totalPage: 0, // 总页数
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

                // 校验
                if(this.startPage >= this.endPage){
                    this.$message({message:'当前页不能大于等于后一页',type:'error'});
                    return
                }

                this.page = this.startPage;
                this.searchAuthorAllToutiaoVideos();
            },
            // 获取所有小视频
            searchAuthorAllToutiaoVideos(){

                // 获取基本的接口方法
                let apiUrl = 'http://api.1sapp.com/wemedia/content/videoList'
                // 解析URL成 需要的视频资源定位
                let attr = urlFormat(this.value);
                // 拼接参数
                this.searchApiAttr = {
                    token:'', dtu:'200', version:0, os:'andriod', id: attr.id, page: this.page, _: (new Date()).getTime()
                };
                // console.log(this.searchApiAttr)

                request({
                    method:'GET', url: apiUrl, qs: this.searchApiAttr
                },(err,res,body) => {
                    let response = JSON.parse(body).data;
                    this.totalPage = response.total_page;
                    this.page = response.page;

                    response.list.forEach(v => {
                        this.videoList.push({
                            name: v.title.replace(/(<|>|\\|\/|:|\"|\*|\?)/g,'') +'('+v.tag.join('、')+')',
                            cover: v.cover[0],
                            url: v.video_info.hd.url,
                            size: v.video_info.hd.size,
                        })
                    });

                    if(this.endPage - this.page > 1 && this.endPage <= this.totalPage){
                        let timer = setTimeout(v=> {
                            this.page++;
                            this.searchAuthorAllToutiaoVideos();
                            clearTimeout(timer);
                        }, 300+Math.ceil(Math.random()*500) );
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
                    this.$message({ message: '名称为《'+videoObject.name+'》的视频下载成功！', type: 'success' });
                })
            },
            // 下载所有的视频
            async downloadAll(){
                console.log(this.videoList)
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
