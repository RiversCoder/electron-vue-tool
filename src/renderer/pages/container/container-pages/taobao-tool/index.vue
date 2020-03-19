<template>
  <section class="toutiao-svideo">
    <!-- 框架布局 -->
    <h3>淘宝商品内容生成工具</h3><br />
    <el-button type="primary" @click="alertFolderSelect">选择项目存放路径</el-button>
    <span class="line-box"></span>
    <el-input v-model="fileStorepath" placeholder="请输入项目存放的地址" disabled></el-input>
    <span class="line-box"></span>

    <!-- Tab 选项卡选择功能 -->
    <el-tabs v-model="activeTabName" @tab-click="handleClick" type="border-card">
        <el-tab-pane name="first">
            <span slot="label"><i class="el-icon-picture-outline"></i> 淘宝主图生成</span>
            <section class="taobao-tool__picture">
                <el-row>
                    <el-col :span="15">
                        <!-- 淘宝主图窗口 -->
                        <div class="grid-content bg-purple taobao-tool__picture-box">
                            <!-- 主图渲染框 -->
                            <div class="ttpb__picture" :style="{backgroundColor:bgColorValue}"></div>
                        </div>
                    </el-col>
                    <el-col :span="9">
                        <div class="grid-content bg-purple-light taobao-tool__picture-operate">
                            <h3 class="ttpo__title">选择背景颜色</h3>
                            <el-color-picker v-model="bgColorValue"></el-color-picker>
                        </div>
                    </el-col>
                </el-row>
            </section>
        </el-tab-pane>
        <el-tab-pane name="second">
            <span slot="label"><i class="el-icon-s-shop"></i> 淘宝内容生成</span>
        </el-tab-pane>
    </el-tabs>
    

    <!-- 悬浮框 回到首页 -->
    <div class="fixedToHome" @click="$router.push('/container')" style="cursor:pointer;position:fixed;bottom:30px;right:10px;background-color:#409EFF;color:#fff;z-index:999;width:50px;height:50px;text-align:center;line-height:50px;font-size:15px;">
        主页
    </div>

   
  </section>
</template>


<script scoped>
    import { urlFormat, mkdir, downliu, sleep, downliuWithHeader } from  '@/common/scripts/common.js';
    import { ipcRenderer } from 'electron';
    const request = require('request');

    export default {
        name: 'taobao-tool',
        data(){
            return {
                activeTabName: 'first', // 当前的Tab选项卡菜单导航 
                bgColorValue: '#ff6369', // 主图背景颜色
            } 
        },
        created(){
            
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
        },
        components: {}
    }

</script>

<style lang="css" scoped>
    .toutiao-svideo{ width:80%; margin:0 auto;margin-top:30px; }
    /* 商品主图渲染样式 */
    .ttpb__picture{width:500px;height:500px;border:1px solid #333;position:relative;}
    /* 商品主图操作样式 */
    .taobao-tool__picture-operate{box-sizing: border-box;padding-left:15px;}
    .ttpo__title{width:100%;font-size:15px;font-weight:normal;color:#999;height:30px;line-height:30px;}
    .line-box{ width:100%;height:20px;display:block; }
    .line-box-2{width:100%;height:40px;display:block;}
    .video-box{width:100%;height:auto;margin-top: 20px;}
    .videoItem .grid-content{height:60px;overflow: hidden;margin-top:2px;}
</style>