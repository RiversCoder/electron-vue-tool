<template>
  <section class="media-tool">

      <dl class="media-box" @click="goTopage('/container/qutoutiao-svideo-author')">
        <dt class="media-img"><img src="./qutoutiao.png" /></dt>
        <dd class="media-txt">趣头条短视频批量下载</dd>
    </dl>

    <dl class="media-box" @click="goTopage('/container/toutiao-svideo-author')">
        <dt class="media-img"><img src="./toutiao.png" /></dt>
        <dd class="media-txt">今日头条小视频批量下载</dd>
    </dl>

    <dl class="media-box" @click="goTopage('/container/douyin-svideo-author')">
        <dt class="media-img"><img src="./douyin.jpg" /></dt>
        <dd class="media-txt">抖音小视频批量下载</dd>
    </dl>
    
  </section>
</template>

<script>
    export default {
        methods:{
            goTopage(routePath){
                this.$router.push(routePath);
            }
        }
    }
</script>

<style>
    .media-tool{width:100%;height:100%;display: flex;}
    .media-box{width:200px;height:200px;margin-left:10px;margin-top:10px;cursor:pointer;border-radius:5px;}
    .media-box:hover{box-shadow:0 0 3px rgba(0,0,0,0.2);background-color:rgba(177, 177, 177, 0.1);}
    .media-box dt{width:100%;height:100px;text-align: center;}
    .media-box dt img{width:70px;margin-top:5px;position: relative;top:30px;}
    .media-box dd{width:100%;height:100px;text-align:center;font-size: 16px;line-height: 100px;margin-left:0; }
</style>