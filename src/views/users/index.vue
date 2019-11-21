<template>
  <div id="users">
    <div class="left-memu">
      <el-menu
        :default-active="activeIndex"
        active-text-color="#409EFF"
        class="el-menu-vertical-demo"
        @select="handleOpen"
      >
        <el-menu-item index="/users/query">
          <i class="el-icon-user-solid"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="/users/zj_jg">
          <!-- <i class="el-icon-menu"></i> -->
          <i class="icon iconfont">&#xe62b;</i>
          <span slot="title">组织架构</span>
        </el-menu-item>
        <el-menu-item index="/users/role">
          <!-- <i class="el-icon-document"></i> -->
          <i class="icon iconfont">&#xe66c;</i>
          <span slot="title">角色管理</span>
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
    href = href.split("/users")[1];
    self.activeIndex = "/users" + href;
    // console.log(self.activeIndex)
    this.$bus.$emit("on-click", "/users");
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
  // padding-left: 150px;
  margin-left: 150px;
  .line {
    width: 100%;
    height: 1px;
    background: #061b54;
    position: absolute;
    bottom: 143px;
    left: 0;
    z-index: 99;
    // display: none;
  }
  .el-menu {
    border: none;
  }
  .left-memu {
    width: 150px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    // border-right: 1px solid #ccc;
  }
  .left-memu,
  .el-menu {
    background: #0a2367;
  }

  .el-menu-item {
    color: #fff;
  }

  .el-menu li:hover {
    background: #0c1f7f !important;
  }
}
.el-icon-menu,
.el-icon-document {
  color: #fff;
}
#user .iconfont {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
  display: inline-block;
}
#users .el-menu-item i {
  color: #fff;
  font-size: 16px;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
  display: inline-block;
}

#users .el-menu-item.is-active i {
  color: #409eff;
}
</style>