<template>
  <div class="navbar">
    <div id="header" class="clearfix no-print" :class="{fixed:istabBar}">
      <div class="fl logo">
        <!-- <img src="../../assets/imgs/favicon.png" alt /> -->
        河北省高级人民法院电子卷宗管理平台
      </div>
      <div class="fl logoicon"></div>
      <div class="fl menu_box">
        <ul class="clearfix">
          <li
            v-for=" (item,index) in menuList"
            :key="item.index"
            @click="handleSelect(item,index)"
            :class="{'active':activeMenu === item.path}"
            v-show="item.mainMenuShow"
          >{{item.name}}</li>
        </ul>
      </div>
      <div class="fr user_box clearfix">
        <div class="fl">
          <span id="current-time" class="clearfix" style="display: inline-block">
            <div class="fl" style="font-size:32px;margin-right:8px;">{{nowTime}}</div>
            <div class="fl" style="margin-top:12px;">
              <p style="height:18px;line-height:18px;margin:0">{{weekDay}}</p>
              <p style="height:18px;line-height:18px;margin:0">{{dateTime}}</p>
            </div>
          </span>
        </div>
        <div class="fl my-drop-menu">
          <span class="dropdown">
            <div
              class="dropdown-toggle user-text user_icon"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
              @click="menuShow = !menuShow"
            ></div>
            <!-- <ul
              class="dropdown-menu"
              aria-labelledby="dropdownMenu1"
              style="margin: 0"
              v-show="menuShow"
            >
              <li>
                <a href="javascript:void(0) " @click="logout()">退出登录</a>
              </li>
            </ul>-->
          </span>
          <!-- 
          <span class="court_name ng-binding">{{user.courtName}}</span>
          <span class="user_name ng-binding">{{user.userFullName}}</span>-->
          <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
              <span class="court_name ng-binding">{{user.courtName}}</span>
              <span class="user_name ng-binding">{{user.userFullName}}</span>
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown" style="width:160px">
              <!-- <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
              </router-link>-->
              <el-dropdown-item divided>
                <span style="display:block;" @click="logout">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger";
import { parseTime, getWeekDay } from "@/utils";
const menusAll = [
  {
    name: "首页",
    path: "/",
    mainMenuShow: true
  },
  {
    name: "质量查询",
    path: "/quality",
    mainMenuShow: true
  },
  {
    name: "统计报表",
    path: "/statistics",
    mainMenuShow: true
  },
  {
    name: "用户管理",
    path: "/users",
    mainMenuShow: true
  },
  {
    name: "系统设置",
    path: "/admin",
    mainMenuShow: true
  },
  {
    name: "配置管理",
    path: "/configs",
    mainMenuShow: true
  }
];
const menusPer = [
  {
    name: "首页",
    path: "/",
    mainMenuShow: true
  },
  {
    name: "质量查询",
    path: "/quality",
    mainMenuShow: true
  },
  {
    name: "统计报表",
    path: "/statistics",
    mainMenuShow: true
  }
];
export default {
  data() {
    return {
      menuList: menusPer,
      activeMenu: "/",
      routerCon: true,
      nowTime: parseTime(new Date(), "{h}:{i}"),
      weekDay: getWeekDay(),
      dateTime: parseTime(new Date(), "{y}/{m}/{d}"),
      timer: null,
      menuShow: false,
      user: {},
      istabBar: false
    };
  },
  components: {
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "token", "userInfo"])
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      this.$router.push(`/login`);
    },
    handleSelect(item, index) {
      this.$router.push({
        path: item.path
      });
      this.activeMenu = item.path;
      self.activeIndex = item.path;
    },
    // 添加一个方法 兼容
    handleScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop; // 固定导航栏
      let topBar = document.querySelector("#header");
      if (scrollTop > topBar.offsetHeight) {
        this.istabBar = true;
      } else {
        this.istabBar = false;
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll); // Dom树加载完毕
    // console.log(this.userInfo)
    if (this.userInfo.userId === 1 || this.userInfo.userId === 2) {
      this.menuList = menusAll;
    } else {
      this.menuList = menusPer;
    }
    let t = typeof this.token;
    if (t == "string") {
      this.user = JSON.parse(this.token);
    } else if (t == "object") {
      this.user = this.token;
    }
    let self = this;
    let href = window.location.href;
    href = href.split("#")[1];
    href = href.split("/")[1];
    let infoType = typeof this.token;

    if (href == "home") {
      self.activeMenu = "/"; //解决刷新后导航高亮样式丢失
    } else {
      self.activeMenu = "/" + href; //解决刷新后导航高亮样式丢失
    }
    this.$bus.$on("on-click", msg => {
      self.activeMenu = msg;
    });
    this.timer = setInterval(() => {
      self.nowTime = parseTime(new Date(), "{h}:{i}"); // 修改数据date
    }, 60000);
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll); // 销毁页面时清除
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  // overflow: hidden;
  position: relative;
  background: url("../../assets/imgs/bg_body.png") !important;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .el-dropdown {
    color: #fff;
  }
  #header {
    width: 100%;
    width: 1903px;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid rgb(41, 105, 255);
    border-top: 1px solid rgb(41, 105, 255);
    // /* background: rgb(18, 51, 144); */
    background: url('../../assets/headerbg.jpg');
    margin-top: 1px;
    // background: url("../../assets/imgs/bg_body.png");
  }

  .logo {
    width: 377px;
    height: 60px;
    line-height: 60px;
    background: url("../../assets/imgs/logobg.png");
    background-repeat: no-repeat;
    /* padding-left: 50px; */
    color: #fff;
    /* color: #00ffff; */
    font-size: 18px;
    text-align: left;
    padding-left: 32px;
    padding-left: 20px;
  }

  .logo img {
    /* margin-top: 10px;  */
  }

  .menu_box {
    margin-top: 8px;
  }

  .menu_box li {
    width: 165px;
    /* width: 182px; */
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-family: MicrosoftYaHei;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 2px;
    color: #fff;
    background: url("../../assets/imgs/t_menu_bg.png") no-repeat;
    cursor: pointer;
    background-size: 100% 100%;
  }

  .menu_box li a {
    color: #b6c2cc;
    width: 185px;
    height: 52px;
    line-height: 52px;
    display: inline-block;
  }

  .menu_box li.active {
    color: #ffffff;
    background: url("../../assets/imgs/t_menu_bg_active.png") no-repeat;
    background-size: 100% 100%;
    /* background-size: contain;
    margin-top: -5px;
    line-height: 44px; */
    height: 48px;
    line-height: 48px;
    margin-top: -5px;
    color: #00ffff;
  }

  .menu_box li.active a {
    color: #b6c2cc;
  }

  .user_box {
    color: #fff;
    margin-right: 15px;
  }

  .user_box span {
    display: inline-block;
  }

  .user_box .court_name {
    margin-right: 10px;
  }

  .user_box .user_icon {
    width: 14px;
    height: 14px;
    background: url("../../assets/imgs/user_icon.png");
    margin-right: 8px;
    margin-left: 40px;
    cursor: pointer;
  }

  .user_box .down_icon {
    width: 16px;
    height: 10px;
    margin-right: 8px;
    background: url("../../assets/imgs/doun.png");
    cursor: pointer;
  }

  body .form-group {
    float: left;
    width: 100%;
  }
  .dropdown {
    position: relative;
  }
  .menu_box li {
    float: left;
  }
  .dropdown-menu {
    position: absolute;
    top: 30px;
    left: 0;
    z-index: 1000;
    float: left;
    min-width: 150%;
    padding: 0;
    margin: 2px 0 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    background-color: darkslateblue;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  }
  .dropdown-menu li {
    height: 26px;
    line-height: 26px;
    text-align: center;
  }
  .dropdown-menu li a {
    display: inline-block;
    height: 26px;
    line-height: 26px;
  }
  .user_box span {
    display: inline-block;
  }
  .user_box .down_icon {
    width: 16px;
    height: 10px;
    margin-right: 8px;
    background: url "../../assets/imgs/doun.png";
    cursor: pointer;
  }
  #header img {
    width: 26px;
    height: 26px;
    margin-top: 16px;
    position: absolute;
    left: 2px;
  }
  .fixed {
    position: fixed;
    top: -1px;
    z-index: 999;
    background: url('../../assets/headerbg.jpg')
  }
  // @media screen and (max-width: 1735px) {
  //   #current-time {
  //     display: none !important;
  //   }
  // }
  // @media screen and (max-width: 1680px) {
  //   .court_name {
  //     display: none !important;
  //   }
  // }
  // @media screen and (max-width: 1495px) {
  //   .logo {
  //     display: none !important;
  //   }
  //   .menu_box {
  //     margin-left: 180px;
  //   }
  //   #header  img{
  //     display: inline-block;
  //   }
  // }
}
</style>
