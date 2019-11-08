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
    <el-button type="primary" @click="searchAuthorAllToutiaoVideos">搜索该作者所有小视频</el-button>
    <!-- <el-button type="primary" @click="downloadOneSToutiaoVideo" >下载小视频</el-button> -->

    <!-- 消息提示 -->
    <span class="line-box"></span>
    <el-alert :title="loading.msg" :type="loading.type" v-if="loading.status"></el-alert>

    <!-- video 展示框 -->
    
    <div class="video-box" >
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
        <!-- <el-table :data="tableData">
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
        </el-table> -->
    </div> 

  </section>
</template>


<script scoped>
    import '@/common/scripts/common.js';
    import { ipcRenderer } from 'electron';
    const fs = require('fs');

    console.log(fs);

    export default {
        name: 'toutiao-svideo',
        data(){
            return {
                value: 'https://m.toutiaoimg.cn/group/6755797314666876164/?app=news_article&timestamp=1573006787',
                videoUrl: '',
                videoInfo: { url: '', name: '西瓜头条小视频', cover: 'https://element.eleme.cn/2.0/static/hamburger.50e4091.png' },
                videoArr:[],
                fileStorepath: "D:\\videos\\toutiao-svideo\\", // 默认视频存放路径
                currentDate: new Date(),
                alertCount: 0,
                loading:{
                    status: false,
                    type: 'warning',
                    msg: '正在拉取资源请稍等……'
                }
            } 
        },
        created(){},
        mounted(){},
        methods:{
            // 打开文件夹
            alertFolderSelect(){
                ipcRenderer.send('open-directory-dialog','openDirectory'); // 打开且选择文件夹
                ipcRenderer.on('selectedItem',(ev,it) => {
                    console.log(ev,it); // 获取选择的文件夹信息
                    this.fileStorepath = it;
                });
            },
            // 请求所有的视频
            searchAuthorAllToutiaoVideos(){
                if(this.alertCount === 0){
                    // 弹出弹窗让用户选择是否重新设置存放路径
                    this.$confirm('确定使用'+this.fileStorepath+'路径存放视频？', '存放路径', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: action => {
                            console.log(action)
                            if(action == 'confirm'){
                                this.loading.status = true;
                                this.loading.msg = '正在下载请稍等……';
                                this.axios.get(this.domain+'toutiao/donwload-svideo',{
                                    params: { video: this.videoInfo, storePath: this.fileStorepath }
                                }).then(res => {
                                    // 打印信息
                                    this.loading.type = 'success';
                                    this.loading.msg = '视频下载成功！';
                                });
                            }else{
                                // 弹出文件夹路径选择
                                this.alertFolderSelect();
                            }
                        }
                    });
                    this.alertCount++;
                }else{
                    this.loading.status = true;
                    this.loading.msg = '正在下载请稍等……';
                    this.axios.get(this.domain+'toutiao/donwload-svideo',{
                        params: { video: this.videoInfo, storePath: this.fileStorepath }
                    }).then(res => {
                        // 打印信息
                        this.loading.type = 'success';
                        this.loading.msg = '视频下载成功！';
                    });
                }
                
            }
        },
        components: {}
    }

</script>

<style lang="css" scoped>
    .toutiao-svideo{ width:80%; margin:0 auto;margin-top:30px; }
    .line-box{ width:100%;height:20px;display:block; }
    .video-box{width:100%;height:auto;margin-top: 20px;}
</style>