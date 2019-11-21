<template>
  <div id="quality">
    <div class="left-memu">
      <el-menu
        :default-active="activeIndex"
        active-text-color="#409EFF"
        class="el-menu-vertical-demo"
        @select="handleOpen"
      >
        <el-menu-item index="/quality/hierarchy">
          <!-- <i class="el-icon-coin"></i> -->
          <i class="icon iconfont">&#xe606;</i>
          <span slot="title">层级查询</span>
        </el-menu-item>
        <el-menu-item index="/quality/mass">
          <!-- <i class="el-icon-chat-dot-square"></i> -->
          <i class="icon iconfont">&#xe61c;</i>
          <span slot="title">质量查询</span>
        </el-menu-item>
      </el-menu>
    </div>
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
    href = href.split("/quality")[1];
    self.activeIndex = "/quality" + href;
  },
  watch: {},
  methods: {
    handleOpen(key, keyPath) {
      if (window.location.href.split("/quality")[1] != "/mass") {
        sessionStorage.removeItem("params");
      }
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
#quality {
  padding-left: 100px;
  .left-memu {
    width: 100px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    // border-right: 1px solid #2969ff;
    background: rgb(10, 35, 103);
  }
}
</style>
<style>
#quality .el-menu-item {
  position: relative;
  text-align: center;
  padding-top: 10px;
  height: 60px;
}
#quality .el-menu-item span {
  color: #fff;
  display: inline-block;
  margin-top: 7px;
}
#quality .el-menu {
  background: rgb(10, 35, 103);
  border: none;
}
#quality .el-menu-item i {
  color: #fff;
}
#quality .el-menu-item.is-active i {
  color: #409eff;
}
#quality .el-menu-item.is-active span {
  color: #409eff;
}
#quality .el-menu li:nth-child(2) [class^="el-icon-"] {
  /* background: url("../../assets/imgs/anhao_icon.png"); */
}
#quality .el-menu-item:focus,
.el-menu-item:hover {
  background: #1e3caf;
}
#quality .el-menu-item [class^="el-icon-"] {
  display: block;
  position: absolute;
  width: 22px;
  height: 22px;
  margin-left: 17px;
  margin-bottom: 5px;
  /* background: url("../../assets/imgs/jiceng_icon.png");
  font-family: initial !important; */
}

#quality .icon {
  display: block;
  position: absolute;
  width: 23px;
  height: 22px;
  margin-left: 17px;
  margin-bottom: 5px;
  top: -7px;
}
</style>
