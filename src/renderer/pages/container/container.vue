<template>
  <section>
    <!-- 公共菜单导航 -->
    <!-- <nav></nav> -->
    <!-- 内容展示 -->
    <main class="container-box">
        <router-view></router-view>
    </main>
  </section>
</template>


<script scoped>

export default {
  data(){
    return {} 
  },
  created(){},
  mounted(){},
  components: {}
}

</script>

<style lang="scss" scoped>
    .container-box{
        width:100%;height:100%;
    }
</style>