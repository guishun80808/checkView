<template>
    <div id="users">
    <div class="left-memu">
      <el-menu
        :default-active="activeIndex"
        active-text-color="#409EFF"
        class="el-menu-vertical-demo"
        @select="handleOpen"
      >
        <el-menu-item index="/configs/query">
          <i class="el-icon-setting"></i>
          <span slot="title">配置管理</span>
        </el-menu-item>
        
      </el-menu>
    </div>
      <!-- <div class="line"></div> -->
    <router-view @changeData="changeData"></router-view>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      activeIndex: ""
    };
  },
  computed: {},
  created() {},
  mounted() {
    let self = this;
    let href = window.location.href;
    href = href.split("/configs")[1];
    self.activeIndex = "/configs" + href;
    // console.log(self.activeIndex)
      this.$bus.$emit("on-click", "/configs");
    
  },
  watch: {},
  methods: {
    handleOpen(key, keyPath) {
      this.$router.push({
        path: key
      });
    },
    changeData(key) {
      this.activeIndex = key;
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
#users {
  margin-left: 150px;
  .line {
    width:100%;
    height: 1px;
    background: #061b54;
    position: absolute;
    bottom: 148px;
    left: 0;
    z-index: 99;
    // display: none;
  }
  .el-menu{
    border: none;
  }
  .left-memu {
    width: 150px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    // border-right: 1px solid #ccc;
  }
  .left-memu,.el-menu{
    background: #0a2367;
  }
  
  .el-menu-item{
    color:#fff;
  }
  
  .el-menu li:hover{
     background: #0c1f7f !important;
  }
}
.el-icon-menu,.el-icon-document{
    color: #fff;
  }
</style>