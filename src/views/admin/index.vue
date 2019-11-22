<template>
  <div id="admin">
    <div class="left-memu">
      <el-menu
        :default-active="activeIndex"
        active-text-color="#409EFF"
        class="el-menu-vertical-demo"
        @select="handleOpen"
      >
        <el-menu-item index="/admin/query">
          <i class="el-icon-menu"></i>
          <span slot="title">目录规则设置</span>
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
    href = href.split("/admin")[1];
    self.activeIndex = "/admin" + href;
    // console.log(self.activeIndex)
    this.$bus.$emit("on-click", "/admin");
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
#admin {
  padding-left: 150px;
  .left-memu {
    width: 150px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    // border-right: 1px solid #2969ff;
    background: rgb(10, 35, 103);
  }
   .line {
    width: 100%;
    height: 1px;
    background: #061b54;
    position: absolute;
    bottom: 148px;
    left: 0;
    z-index: 99;
    // display: none;
  }
}
</style>
<style>
#admin .el-menu-item {
  position: relative;
  text-align: center;
  padding-top: 10px;
  height: 60px;
}
#admin .el-menu-item span {
  color: #fff;
  display: inline-block;
  /* margin-top: 7px; */
}
#admin .el-menu {
   background: rgb(10, 35, 103);
  border: none;
}
#admin .el-menu-item i {
  color: #fff;
}
#admin .el-menu-item.is-active i {
  color: #409eff;
}
#admin .el-menu-item.is-active span {
  color: #409eff;
}
#admin .el-menu-item:focus,
.el-menu-item:hover {
  background: #1e3caf;
}
#admin .el-menu-item [class^="el-icon-"] {
  /* display: block;
  position: absolute;
  width: 22px;
  height: 22px;
  margin-left: 17px;
  margin-bottom: 5px; */
  /* background: url("../../assets/imgs/jiceng_icon.png");
  font-family: initial !important; */
}
.el-menu-item [class^=el-icon-]{
  margin-right: 0px;
}
</style>
