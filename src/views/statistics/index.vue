<template>
  <div id="statistics">
    <div class="left-memu">
      <p class="left_title">
        <span class="left_title_icon"></span>统计报表
      </p>
      <el-menu
        :default-active="activeIndex"
        active-text-color="#409EFF"
        class="el-menu-vertical-demo"
        @select="handleOpen"
      >
        <el-menu-item index="/statistics/make">
          <i class="el-icon-menu"></i>
          <span slot="title">电子卷宗制作情况统计报表</span>
        </el-menu-item>
        <el-menu-item index="/statistics/query">
          <i class="el-icon-document"></i>
          <span slot="title">电子卷宗制作与质检总体统计报表</span>
        </el-menu-item>
        <el-menu-item index="/statistics/uploadrote">
          <i class="el-icon-document"></i>
          <span slot="title">电子卷宗随案生成制作率统计报表</span>
        </el-menu-item>
        <el-menu-item index="/statistics/passrote">
          <i class="el-icon-document"></i>
          <span slot="title">电子卷宗随案生成合格率统计报表</span>
        </el-menu-item>
        <el-menu-item index="/statistics/uploadrank">
          <i class="el-icon-document"></i>
          <span slot="title">电子卷宗随案生成制作数量排行榜</span>
        </el-menu-item>
        <el-menu-item index="/statistics/passrank">
          <i class="el-icon-document"></i>
          <span slot="title">电子卷宗随案生成合格数量排行榜</span>
        </el-menu-item>
        <el-menu-item index="/statistics/tendency">
          <i class="el-icon-document"></i>
          <span slot="title">年度电子卷宗制作与质检总体趋势报表</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="line"></div>
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
    href = href.split("/statistics")[1];
    self.activeIndex = "/statistics" + href;
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
#statistics {
  margin-top: 0px;
  padding-top: 10px;
  padding: 0px;
  padding-left: 290px;
  background: #061b54;
  .line {
    width: 1585px;
    height: 2px;
    background: #061b54;
    position: absolute;
    bottom: 92px;
    left: 0;
    z-index: 99;
    margin-left: 300px;
    // display: none;
  }
  .left-memu {
    width: 290px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    // border-right: 1px solid #2969ff;
    background: rgb(10, 35, 103);
  }
  .left_title {
    margin-top: 30px;
    text-align: left;
    padding-left: 48px;
    letter-spacing: 3px;
    color: #02a3ff;
    position: relative;
    margin-bottom: 10px;
    .left_title_icon {
      position: absolute;
      display: inline-block;
      width: 23px;
      height: 20px;
      top: 38pxs;
      left: 12px;
      background: url("../../assets/imgs/tjbb_titile.png") no-repeat center;
    }
  }
  .el-menu {
    background: rgb(10, 35, 103);
    border: none;
  }
  .el-menu-item {
    height: 32px;
    line-height: 32px;
    color: #fff;
    margin-bottom: 5px;
    border-left: 5px solid transparent;
  }
  .el-menu-item:focus,
  .el-menu-item:hover {
  }
  .el-menu-item:focus,
  .el-menu-item:hover {
    background-color: transparent;
    color: #409eff;
    background-image: linear-gradient(
      90deg,
      rgba(2, 163, 255, 0.4) 0%,
      rgba(31, 59, 76, 0.1) 100%
    );
    border-left: 5px solid #02a3ff;
  }
  .el-menu-item i {
    color: #fff;
    display: none;
  }
  .el-menu-item.is-active {
    color: #409eff;
    background-image: linear-gradient(
      90deg,
      rgba(2, 163, 255, 0.4) 0%,
      rgba(31, 59, 76, 0.1) 100%
    );
    border-left: 5px solid #02a3ff;
  }
}
</style>
