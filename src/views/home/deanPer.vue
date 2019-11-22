<template>
  <div id="deanPer">
    <div class="top">
      <div class="left fl">
        <p class="title">
          电子卷宗制作与质检总体统计报表
          <span
            class="fr ckdgbtn"
            @click="searchMore(1)"
            v-if="tableData.length>10"
          >查看更多</span>
        </p>
        <div id="xcchart1"></div>
      </div>
      <div class="center fl">
        <div class="topmenu clearfix">
          <ul>
            <li
              v-for="(item,index) in shijiaoList"
              :key="index"
              class="fl"
              :class="{active:item.active}"
              @click="menuClick(item)"
            >{{item.name}}</li>
          </ul>
        </div>
        <div class="botSearch">
          <el-form :inline="true" :model="xcparam" class="demo-form-inline">
            <el-form-item label>
              <el-select
                v-model="timeStr"
                placeholder="请选择时间"
                class="search_select"
                @change="selTime"
              >
                <el-option
                  v-for="item in timeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-button type="primary" @click="search" style="margin:0 30px" v-preventReClick="3000">搜索</el-button> <el-button type="primary" @click="printOut">生成报告</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="botlist">
          <ul>
            <li class="fl">
              <span></span>
              <!-- <span  class="dom-attribute2">{{totalMsg.totalCaseCount}}</span> -->
              <span class="dom-attribute1"></span>
            </li>
            <li class="fl">
              <span></span>
              <!-- <span  class="dom-attribute2">{{totalMsg.totalUploadCaseCount}}</span> -->
              <span class="dom-attribute2"></span>
            </li>
            <li class="fl">
              <span></span>
              <!-- <span class="dom-attribute3">{{totalMsg.totalUnPassCaseCount}}</span> -->
              <span class="dom-attribute3"></span>
            </li>
            <li class="fl">
              <span></span>
              <!-- <span class="dom-attribute4">{{totalMsg.totalUnPassCaseCount||"待统计"}}</span> -->
              <span class="dom-attribute4"></span>
            </li>
          </ul>
        </div>
      </div>
      <div class="right fr">
        <p class="title">
          问题案号
          <span style="margin-right: 25px;" class="ckdgbtn fr" @click="failSearchMore">查看更多</span>
        </p>
        <div class="failCaseList">
          <p class="head">问题案号动态信息</p>
          <div class="scroll">
            <vue-seamless-scroll
              :data="failCaseList"
              :class-option="classOption"
              class="warp"
              v-if="failCaseList.length != 0"
            >
              <ul class="item">
                <li
                  v-for="(item,index) in failCaseList"
                  :key="index"
                  class="clearfix"
                >{{item.caseName}}</li>
              </ul>
            </vue-seamless-scroll>
            <p
              v-if="failCaseList.length == 0"
              style="padding-left:25px;
            padding-top:15px;
            letter-spacing: 1px;"
            >暂无问题案号</p>
          </div>
        </div>
      </div>
    </div>
    <div class="center clearfix">
      <div class="left fl">
        <p class="title">
          电子卷宗质量情况统计图
          <span
            class="fr ckdgbtn"
            style="height:30px;line-height:48px;margin-right:10px"
            @click="searchMore(2)"
            v-if="tableData.length>10"
          >查看更多</span>
        </p>
        <div id="xcchart2"></div>
        <div id="xcchart3"></div>
      </div>
      <div class="center fl">
        <p class="title">
          电子卷宗随案生成制作情况统计图
          <span
            class="fl ckdgbtn"
            style="height:30px;line-height:48px"
            @click="searchMore(3)"
            v-if="tableData.length>10"
          >查看更多</span>
        </p>
        <div id="xcchart4"></div>
        <div id="xcchart5"></div>
      </div>
      <div class="right fr">
        <p class="title">电子卷宗制作与质检情况排行榜</p>
        <div class="failCaseList">
          <div class="subleft fl">
            <p class="subtitle">电子卷宗制作数量排行榜</p>
            <ul class="fl">
              <li v-for="(item,index) in zhTop10List" :key="index" v-if="index < 10">
                <span class="icon">
                  <span v-show="index !=0&&index !=1&&index !=2">{{index+1}}</span>
                </span>
                <span class="areaname">{{item.courtRoomName}}</span>
                <span class="num">{{item.uploadCaseCount}}</span>
              </li>
            </ul>
          </div>
          <div class="subright fr">
            <p class="subtitle">电子卷宗合格数量排行榜</p>
            <ul class="fl">
              <li v-for="(item,index) in hgTop10List" :key="index" v-if="index < 10">
                <span class="icon">
                  <span v-show="index !=0&&index !=1&&index !=2">{{index+1}}</span>
                </span>
                <span class="areaname">{{item.courtRoomName}}</span>
                <span class="num">{{item.passCaseCount}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <p class="title">本年电子卷宗制作与质检趋势图</p>
        <div id="xcchart6"></div>
      </div>
      <div class="right fr">
        <p class="title">法院不合格案件数</p>
        <div class="failCaseList-body">
          <p class="head">
            <span>庭室</span>
            <span>不合格数</span>
          </p>
          <div class="failCaseList">
            <vue-seamless-scroll :data="failListNum" :class-option="classOption" class="warp">
              <ul class="item">
                <li v-for="(item,index) in failListNum" :key="index">
                  <span class="title">{{item.courtRoomName}}</span>
                  <span class="date">{{item.unPassCaseCount}}</span>
                </li>
              </ul>
            </vue-seamless-scroll>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="自定义选择时间"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <el-date-picker
          v-model="xcparam.laDateStart"
          type="date"
          format="yyyy-MM-dd"
          :clearable="false"
          placeholder="选择开始日期"
          @change="selStart"
        ></el-date-picker>
        <el-date-picker
          v-model="xcparam.laDateEnd"
          type="date"
          format="yyyy-MM-dd"
          :clearable="false"
          placeholder="选择结束日期"
          @change="selEnd"
        ></el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveTime">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="moreeTile"
      :visible.sync="searchMorevisible"
      width="98%"
      :before-close="handleCloseMore"
      class="mydialog"
    >
      <div id="chart1More" v-show="moreChart1Flag" style="1780px;height:550px"></div>
      <div id="chart3More" v-show="moreChart3Flag" style="1780px;height:550px"></div>
      <div id="chart5More" v-show="moreChart5Flag" style="1780px;height:550px"></div>
    </el-dialog>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";
import { mapGetters } from "vuex";
import html2canvas from "html2canvas";
import {
  getCaseStatistics,
  getCountTrend,
  getFailCaseList
} from "@/api/quality";
import vueSeamlessScroll from "vue-seamless-scroll";
import {
  xcDrawChart1,
  xcDrawChart1More,
  xcDrawChart3More,
  xcDrawChart5More,
  xcDrawChart2,
  xcDrawChart3,
  xcDrawChart4,
  xcDrawChart5,
  xcDrawChart6
} from "./drawchart/bydrawchart";
import {
  parseTime,
  getWeekStartAndEnd,
  getCurrentMonthFirst,
  getFirstDayOfWeek,
  getLastMonth,
  getLastSixMonthYestdy,
  getLastYearYestdy,
  insertStr,
  compare,
  timeList,
  getMaxSort
} from "@/utils";
export default {
  props: {},
  data() {
    return {
      moreChart1Flag: false,
      moreChart3Flag: false,
      moreChart5Flag: false,
      searchMorevisible: false,
      dialogVisible: false,
      shijiaoList: [],
      timeStr: "",
      timeList: timeList,
      animate: true,
      activeIndex: "/deanPer",
      routerCon: true,
      xcparam: {
        courtIdStrings: "",
        courtRoomIdStrings: "",
        cbrIdStrings: "",
        queryFlag: "",
        indexFlag: 1,
        laDateStart: "2017-01-01",
        laDateEnd: parseTime(new Date(), "{y}-{m}-{d}")
      },
      cxchatrparam6: {
        courtId: "",
        courtRoomId: "",
        cbrId: "",
        flag: false
      },
      tableData: [],
      failListNum: [],
      zhTop10List: [],
      hgTop10List: [],
      totalMsg: {
        totalCaseCount: 0,
        totalUploadCaseCount: 0,
        totalUnPassCaseCount: 0,
        wati: 0
      },
      xcChart1Datas: [],
      xcBuHeGeDatas: [],
      xcChart2Datas: [
        { value: 0, name: "合格数量" },
        { value: 0, name: "不合格数量" }
      ],
      xcChart3Datas: {
        cityNames: [],
        citySource: []
      },
      xcChart4Datas: [
        { value: 0, name: "上传案件数量" },
        { value: 0, name: "未上传案件数量" }
      ],
      xcChart5Datas: {
        cityNames: [],
        citySource: []
      },
      xcChart6datas: {
        times: [],
        allCaseNum: [],
        upLoadCaseNum: [],
        passCaseCount: []
      },
      failCaseList: [],
      failCaseListParam: {
        courtId: "",
        courtRoomId: "",
        cbrId: "",
        caseTypeId: "",
        spcxId: "",
        caseStatus: "",
        checkCaseResult: 1,
        caseName: "",
        queryAreaFlag: false,
        checkCaseMessageFlag: true,
        laDateStart: "2017-01-01",
        laDateEnd: parseTime(new Date(), "{y}-{m}-{d}"),
        currentPage: 1,
        pageSize: 100
      },
      startStr: new Date("2017-01-01").getTime() / 1000,
      endStr: new Date().getTime() / 1000,
      user: {},
      busy: false,
      xcChart1DatasMore: [],
      xcChart3DatasMore: [],
      xcChart5DatasMore: [],
      moreeTile: ""
    };
  },
  computed: {
    ...mapGetters(["token", "userInfo"]),
    classOption() {
      return {
        step: 0.3,
        limitMoveNum: 5
      };
    }
  },
  created() {},
  mounted() {
    this.timeStr = this.xcparam.laDateStart + " 至 " + this.xcparam.laDateEnd;
    this.search();
    this.getCountTrend();
    this.shijiaoList = [];
    for (let index = 0; index < this.userInfo.roleMenus.length; index++) {
      const element = this.userInfo.roleMenus[index];
      if (element == 1) {
        this.shijiaoList.push({
          name: "巡查视角",
          path: "/home/patrolPer",
          active: false
        });
      } else if (element == 2 && this.userInfo.courtId) {
        this.shijiaoList.push({
          name: "本院视角",
          path: "/home/deanPer",
          active: true
        });
      } else if (element == 3 && this.userInfo.courtRoomId) {
        this.shijiaoList.push({
          name: "庭长视角",
          path: "/home/chiefPer",
          active: false
        });
      } else if (element == 4 && this.userInfo.userCode) {
        this.shijiaoList.push({
          name: "法官视角",
          path: "/home/judgePer",
          active: false
        });
      }
    }
    //  window.location.reload()
    this.$router.push({ path: "/home/deanPer" });
    this.$bus.$emit("on-click", "/");
  },
  watch: {},
  methods: {
     anime() {
      var objPropLogEl = document.querySelector(".dom-attribute1");
      var objPropLogE2 = document.querySelector(".dom-attribute2");
      var objPropLogE3 = document.querySelector(".dom-attribute3");
      var objPropLogE4 = document.querySelector(".dom-attribute4");
      var myObject = {
        prop1: 0
      };
      anime({
        targets: myObject,
        prop1: this.totalMsg.totalCaseCount,
        // prop1: 10000,
        easing: "linear",     
        round: 1,
        update: function() {
          objPropLogEl.innerHTML = JSON.stringify(myObject)
            .split(":")[1]
            .split("}")[0];
        }
      });
      anime({
        targets: myObject,
        prop1: this.totalMsg.totalUploadCaseCount,
        // prop1: 10000,
        easing: "linear",
        round: 1,
        update: function() {
          objPropLogE2.innerHTML = JSON.stringify(myObject)
            .split(":")[1]
            .split("}")[0];
        }
      });
      anime({
        targets: myObject,
        prop1: this.totalMsg.totalUnPassCaseCount,
        // prop1: 10000,
        easing: "linear",
        round: 1,
        update: function() {
          objPropLogE3.innerHTML = JSON.stringify(myObject)
            .split(":")[1]
            .split("}")[0];
        }
      });
      anime({
        targets: myObject,
        prop1: this.totalMsg.totalUnPassCaseCount,
        // prop1: 10000,
        easing: "linear",
        round: 1,
        update: function() {
          objPropLogE4.innerHTML = JSON.stringify(myObject)
            .split(":")[1]
            .split("}")[0];
        }
      });
    },
     dataURLToBlob(dataurl) {
      //ie 图片转格式
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    downloadResult(name) {
      let canvasID = document.body;
      let a = document.createElement("a");
      html2canvas(canvasID).then(canvas => {
        let dom = document.body.appendChild(canvas);
        dom.style.display = "none";
        a.style.display = "none";
        document.body.removeChild(dom);
        let blob = this.dataURLToBlob(dom.toDataURL("image/png"));
        a.setAttribute("href", URL.createObjectURL(blob));
        a.setAttribute("download", name + ".png");
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(blob);
        document.body.removeChild(a);
      });
    },
    printOut(name) {
      // 个人观察只是截取可见范围以及以下的区域，所以先将滚动条置顶
      document.body.scrollTop = 0; // IE的
      document.documentElement.scrollTop = 0; // 其他
      this.downloadResult(name);
    },
    handleCloseMore() {
      this.searchMorevisible = false;
    },
    async searchMore(id) {
      this.searchMorevisible = true;
      if (id == 1) {
        this.moreeTile = "电子卷宗制作与质检总体统计报表";
        this.moreChart1Flag = true;
        this.moreChart3Flag = false;
        this.moreChart5Flag = false;
        this.xcChart1DatasMore = [];
        const { data } = await getCaseStatistics(this.xcparam);
        let lsdatas = data;
        lsdatas.pop();
        for (let index = 0; index < lsdatas.length; index++) {
          const element = lsdatas[index];
          this.xcChart1DatasMore[index] = {
            product: element.courtRoomName,
            总案件量: element.caseCount,
            制作数量: element.uploadCaseCount,
            合格数量: element.passCaseCount
          };
        }
        xcDrawChart1More(this.xcChart1DatasMore);
      } else if (id == 2) {
        this.moreeTile = "电子卷宗质量情况统计图";
        this.moreChart3Flag = true;
        this.moreChart1Flag = false;
        this.moreChart5Flag = false;
        this.xcChart3DatasMore = [];
        const { data } = await getCaseStatistics(this.xcparam);
        let lsdatas = data;
        lsdatas.pop();
        for (let index = 0; index < lsdatas.length; index++) {
          const element = lsdatas[index];
          this.xcChart3DatasMore[index] = {
            product: element.courtRoomName,
            制作率: element.uploadRate.substring(
              0,
              element.uploadRate.length - 1
            )
          };
        }
        xcDrawChart3More(this.xcChart3DatasMore);
      } else if (id == 3) {
        this.moreeTile = "电子卷宗随案生成制作情况统计图";
        this.moreChart5Flag = true;
        this.moreChart1Flag = false;
        this.moreChart3Flag = false;
        this.xcChart5DatasMore = [];
        const { data } = await getCaseStatistics(this.xcparam);
        let lsdatas = data;
        lsdatas.pop();
        for (let index = 0; index < lsdatas.length; index++) {
          const element = lsdatas[index];
          this.xcChart5DatasMore[index] = {
            product: element.courtRoomName,
            合格率: element.passRate.substring(0, element.uploadRate.length - 1)
          };
        }
        xcDrawChart5More(this.xcChart5DatasMore);
      }
    },
    failSearchMore() {
      let params = this.failCaseListParam;
      params.pageSize = 20;
      params.shijiao = 2;
      params = JSON.stringify(params);
      sessionStorage.setItem("params", params);
      this.$router.push({
        name: "Mass"
      });
      this.$bus.$emit("on-click", "/quality");
    },
    getMsgTime(id) {
      let self = this;
      timeList.forEach(element => {
        if (element.id == id) {
          self.msg.time = element.name;
        }
      });
    },
    search() {
      this.changeData();
      this.getCaseStatistics();
      this.getFailCaseList();
    },
    saveTime() {
      if (this.startStr > this.endStr) {
        this.$message({
          message: "开始时间不能大于结束时间",
          type: "warning"
        });
        return;
      }

      this.dialogVisible = false;
      this.timeStr = this.xcparam.laDateStart + " 至 " + this.xcparam.laDateEnd;
      this.failCaseListParam.laDateStart = this.xcparam.laDateStart;
      this.failCaseListParam.laDateStart = this.xcparam.laDateEnd;
    },
    selStart() {
      this.startStr = this.xcparam.laDateStart.getTime() / 1000; //时间戳
      this.endStr = new Date(this.xcparam.laDateEnd).getTime() / 1000; //时间戳
      if (this.startStr > this.endStr) {
        this.$message({
          message: "开始时间不能大于结束时间",
          type: "warning"
        });
        return;
      }

      this.xcparam.laDateStart = parseTime(
        this.xcparam.laDateStart,
        "{y}-{m}-{d}"
      );
    },
    selEnd() {
      this.endStr = this.xcparam.laDateEnd.getTime() / 1000; //时间戳
      this.startStr = new Date(this.xcparam.laDateStart).getTime() / 1000; //时间戳
      if (this.startStr > this.endStr) {
        this.$message({
          message: "结束时间不能小于开始时间",
          type: "warning"
        });
        return;
      }

      this.xcparam.laDateEnd = parseTime(this.xcparam.laDateEnd, "{y}-{m}-{d}");
    },
    selTime(id) {
      if (id == "1") {
        this.xcparam.laDateStart = parseTime(
          getCurrentMonthFirst(),
          "{y}-{m}-{d}"
        );
        this.xcparam.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.failCaseListParam.laDateStart = parseTime(
          getCurrentMonthFirst(),
          "{y}-{m}-{d}"
        );
        this.failCaseListParam.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == "2") {
        this.xcparam.laDateStart = getLastMonth().start;
        this.xcparam.laDateEnd = getLastMonth().end;
        this.failCaseListParam.laDateStart = getLastMonth().start;
        this.failCaseListParam.laDateEnd = getLastMonth().end;
        this.getMsgTime(id);
      } else if (id == "3") {
        this.xcparam.laDateStart = getFirstDayOfWeek(new Date());
        this.xcparam.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.failCaseListParam.laDateStart = getFirstDayOfWeek(new Date());
        this.failCaseListParam.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == "4") {
        this.xcparam.laDateStart = getWeekStartAndEnd(-1)[0];
        this.xcparam.laDateEnd = getWeekStartAndEnd(-1)[1];
        this.failCaseListParam.laDateStart = getWeekStartAndEnd(-1)[0];
        this.failCaseListParam.laDateEnd = getWeekStartAndEnd(-1)[1];
        this.getMsgTime(id);
      } else if (id == "5") {
        this.xcparam.laDateStart = parseTime(new Date(), "{y}-{m}-{d}");
        this.xcparam.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.failCaseListParam.laDateStart = parseTime(
          new Date(),
          "{y}-{m}-{d}"
        );
        this.failCaseListParam.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == "6") {
        this.xcparam.laDateStart = parseTime(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          "{y}-{m}-{d}"
        );
        this.xcparam.laDateEnd = parseTime(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          "{y}-{m}-{d}"
        );
        this.failCaseListParam.laDateStart = parseTime(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          "{y}-{m}-{d}"
        );
        this.failCaseListParam.laDateEnd = parseTime(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          "{y}-{m}-{d}"
        );
        this.getMsgTime(id);
      } else if (id == "7") {
        this.xcparam.laDateStart = getLastSixMonthYestdy(new Date());
        this.xcparam.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.failCaseListParam.laDateStart = getLastSixMonthYestdy(new Date());
        this.failCaseListParam.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == "8") {
        this.xcparam.laDateStart = getLastYearYestdy(new Date());
        this.xcparam.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.failCaseListParam.laDateStart = getLastYearYestdy(new Date());
        this.failCaseListParam.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == "9") {
        this.dialogVisible = true;
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.xcparam.laDateStart = "2017-01-01";
      this.xcparam.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
      this.timeStr = "2017-01-01 至 " + this.xcparam.laDateEnd;
      // console.log(this.xcparam);
    },

    async getFailCaseList() {
      let t = typeof this.token;
      if (t == "string") {
        this.user = JSON.parse(this.token);
      } else if (t == "object") {
        this.user = this.token;
      }
      let self = this;
      self.failCaseListParam.courtId = this.user.courtId;
      self.failCaseListParam.queryAreaFlag = false;
      try {
        const { data } = await getFailCaseList(self.failCaseListParam);
        self.failCaseList = data;
        if (self.failCaseList.length % 2 != 0) {
          self.failCaseList.push(self.failCaseList[0]);
        }
      } catch (err) {
        console.log(err);
      }
    },
    changeData() {
      this.$emit("changeData", "/home/deanPer");
    },
    async getHgTop10() {
      let self = this;
      self.xcparam.indexFlag = 2;
      try {
        const { data } = await getCaseStatistics(self.xcparam);
        self.hgTop10List = data;
        self.hgTop10List.pop();
        self.xcparam.indexFlag = 1;
      } catch (err) {
        console.log(err);
      }
    },
    async getCaseStatistics() {
      this.xcparam.courtIdStrings = this.userInfo.courtId;
      this.xcparam.queryFlag = 1;
      this.xcChart1Datas = [];
      this.xcBuHeGeDatas = [];
      this.xcChart2Datas = [
        { value: 0, name: "合格数量" },
        { value: 0, name: "不合格数量" }
      ];
      this.xcChart3Datas = {
        cityNames: [],
        citySource: []
      };
      this.xcChart4Datas = [
        { value: 0, name: "上传案件数量" },
        { value: 0, name: "未上传案件数量" }
      ];
      this.xcChart5Datas = {
        cityNames: [],
        citySource: []
      };
      let self = this;
      try {
        const { data } = await getCaseStatistics(self.xcparam);
        if (data.length == 0) {
          return;
        }
        self.totalMsg = data[data.length - 1];
        self.tableData = data;
        self.failListNum = JSON.parse(JSON.stringify(data));
        self.tableData.pop();
        self.failListNum.pop();
        self.xcChart2Datas[0].value = self.totalMsg.totalPassCaseCount;
        self.xcChart2Datas[1].value = self.totalMsg.totalUnPassCaseCount;
        self.xcChart4Datas[0].value = self.totalMsg.totalUploadCaseCount;
        self.xcChart4Datas[1].value = self.totalMsg.totalUnUploadCaseCount;
        self.zhTop10List = self.tableData;
        self.tableData.forEach((element, index) => {
          if (index > 9) {
            return;
          }
          self.xcChart1Datas[index] = {
            product: element.courtRoomName,
            总案件量: element.caseCount,
            制作数量: element.uploadCaseCount,
            合格数量: element.passCaseCount
          };
          self.xcChart3Datas.citySource.push(
            element.passRate.substring(0, element.passRate.length - 1) * 100
          );
          self.xcChart3Datas.cityNames.push(element.courtRoomName);
          self.xcChart5Datas.citySource.push(
            element.uploadRate.substring(0, element.uploadRate.length - 1) * 100
          );
          self.xcChart5Datas.cityNames.push(element.courtRoomName);
          self.xcBuHeGeDatas[index] = {
            name: element.courtRoomName,
            value: element.unPassCaseCount
          };
        });
        getMaxSort(self.xcChart3Datas.citySource);
        getMaxSort(self.xcChart5Datas.citySource);
        self.xcChart3Datas.citySource.forEach((element, index) => {
          element = element / 100;
          self.xcChart3Datas.citySource[index] = element;
        });
        self.xcChart5Datas.citySource.forEach((element, index) => {
          element = element / 100;
          self.xcChart5Datas.citySource[index] = element;
        });
        xcDrawChart1(self.xcChart1Datas);
        xcDrawChart2(self.xcChart2Datas);
        xcDrawChart3(self.xcChart3Datas);
        xcDrawChart4(self.xcChart4Datas);
        xcDrawChart5(self.xcChart5Datas);
        this.getHgTop10();
        this.anime();
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询统计信息失败",
          type: "warning"
        });
      }
    },
    async getCountTrend() {
      this.cxchatrparam6.courtId = this.userInfo.courtId;
      this.cxchatrparam6.flag = true;
      this.xcChart6datas = {
        times: [],
        allCaseNum: [],
        upLoadCaseNum: [],
        passCaseCount: []
      };
      try {
        const { data } = await getCountTrend(this.cxchatrparam6);
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          element.months = insertStr(element.months, 4, "-");
          this.xcChart6datas.times.push(element.months);
          this.xcChart6datas.allCaseNum.push(element.caseCount);
          this.xcChart6datas.upLoadCaseNum.push(element.uploadCaseCount);
          this.xcChart6datas.passCaseCount.push(element.passCaseCount);
        }
        xcDrawChart6(this.xcChart6datas);
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询统计信息失败",
          type: "warning"
        });
      }
    },
    menuClick(item) {
      this.$router.push({
        path: item.path
      });
    }
  },
  components: { vueSeamlessScroll }
};
</script>

<style scoped lang="scss">
#deanPer {
  width: 100%;
  width: 1903px;
  height: 100%;
  background: url("../../assets/imgs/bg-body.png") no-repeat;
  // background-size:100% 100%;
  background-size: cover;
  width: 100%;
  height: 100%;
  margin-top: 2px;
  .top {
    // width: 100%;
    .left {
      // width: 30%;
      margin-left: 30px;
      .title {
        font-size: 14px;
        height: 30px;
        line-height: 38px;
        padding-left: 35px;
        margin-top: 6px;
      }
      #xcchart1 {
        width: 590px;
        // width: 100%;
        height: 280px;
        margin: 0 auto;
        margin-top: 10px;
      }
    }
    .center {
      width: 580px;
      height: 300px;
      margin-left: 45px;
      margin-top: 15px;
      .topmenu {
        // margin-top: 15px;
        li {
          width: 100px;
          height: 17px;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 30px;
          height: 30px;
          letter-spacing: 0px;
          cursor: pointer;
          text-align: center;
          margin-left: 40px;
        }
        .active {
          background-color: #132792;
          border-radius: 4px;
          border: solid 1px #2c69ff;
          color: #00ffff;
        }
      }
      .botSearch {
        width: 540px;
        margin-top: 15px;
        margin-left: 40px;
        .el-select,
        .el-input {
          width: 250px;
          height: 30px;
          border-radius: 4px;
        }
        .el-input {
          width: 286px;
          height: 30px;
          border-radius: 4px;
        }
        .el-form-item:nth-child(2) {
          margin-left: 0px;
          .el-button {
            padding: 0;
            width: 80px;
            height: 30px;
            background-color: #0c1f7f;
            border-radius: 4px;
            border: solid 1px #2c69ff;
          }
          .el-button:hover {
            color: #00f0ff;
            opacity: 0.8;
          }
        }
      }
      .botlist {
        // margin-top: 30px;
        li {
          width: 100px;
          position: relative;
          margin-left: 55px;
          span:nth-child(1) {
            display: inline-block;
            width: 100px;
            height: 111px;
            background: url("../../assets/imgs/case.png") no-repeat center;
          }
          span:nth-child(2) {
            display: inline-block;
            width: 90px;
            color: #f6ff00;
            font-size: 22px;
            text-align: center;
            margin-top: 5px;
          }
        }
        li:nth-child(1) {
          margin-left: 5px;
        }
        li:nth-child(2) span:nth-child(1) {
          display: inline-block;
          width: 100px;
          height: 111px;
          background: url("../../assets/imgs/saomiao.png") no-repeat center;
        }
        li:nth-child(3) span:nth-child(1) {
          display: inline-block;
          width: 100px;
          height: 111px;
          background: url("../../assets/imgs/fail.png") no-repeat center;
        }
        li:nth-child(4) span:nth-child(1) {
          display: inline-block;
          width: 100px;
          height: 111px;
          background: url("../../assets/imgs/waiting.png") no-repeat center;
        }
      }
    }
    .right {
      margin-top: -13px;
      .title {
        height: 32px;
        line-height: 32px;
        padding-left: 15px;
      }
      .failCaseList {
        width: 562px;
        height: 258px;
        background-color: #0a3480;
        border: solid 1px #2370d6;
        margin-right: 38px;
        margin-top: 12px;
        .head {
          width: 562px;
          height: 30px;
          line-height: 30px;
          background-color: #0a3480;
          border: solid 1px #2370d6;
          color: #ffb400;
          text-align: center;
        }
        .scroll {
          width: 560px;
          overflow: hidden;
          height: 226px;
          li {
            width: 280px;
            border: 1px solid #2370d6;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 30px;
            line-height: 30px;
            white-space: nowrap;
            border-left: none;
            border-right: none;
            span {
              height: 30px;
              line-height: 30px;
            }
          }
        }
        .scroll li {
          float: right;
        }
        .scroll li:nth-child(2n-1) {
          float: left;
          border-right: 1px solid #2370d6;
          border-top: none;
        }
      }
    }
  }
  .center {
    .left {
      position: relative;
      margin-left: 20px;
      margin-top: 15px;
      .title {
        height: 32px;
        line-height: 38px;
        padding-left: 38px;
      }
      #xcchart2 {
        width: 220px;
        height: 280px;
        display: inline-block;
      }
      #xcchart3 {
        width: 360px;
        height: 280px;
        display: inline-block;
        margin-left: 10px;
      }
    }
    .center {
      margin-left: 55px;
      position: relative;
      margin-top: 15px;
      .title {
        height: 32px;
        line-height: 38px;
        padding-right: 30px;
        text-align: right;
      }
      #xcchart4 {
        width: 220px;
        height: 280px;
        display: inline-block;
      }
      #xcchart5 {
        width: 345px;
        height: 280px;
        display: inline-block;
        margin-left: 10px;
      }
    }
    .right {
      width: 600px;
      height: 312px;
      margin-top: 27px;
      padding-right: 50px;
      .title {
        padding-left: 15px;
        margin-top: -2px;
      }
      .failCaseList {
        margin-top: 18px;
        li {
          margin-bottom: 4px;
          font-size: 14px;
        }
        li span:nth-child(1) {
          margin-right: 20px;
          width: 15px;
          height: 18px;
          display: inline-block;
          margin-left: 1px;
        }
        li:nth-child(1) span:nth-child(1) {
          margin-right: 20px;
          width: 15px;
          height: 18px;
          display: inline-block;
          background: url("../../assets/imgs/top1.png") no-repeat center;
          margin-left: 0px;
        }
        li:nth-child(2) span:nth-child(1) {
          margin-right: 20px;
          width: 15px;
          height: 18px;
          display: inline-block;
          background: url("../../assets/imgs/top2.png") no-repeat center;
          margin-left: 0px;
        }
        li:nth-child(3) span:nth-child(1) {
          margin-right: 20px;
          width: 15px;
          height: 18px;
          background: url("../../assets/imgs/top3.png") no-repeat center;
          margin-left: 0px;
          display: inline-block;
        }
      }
      .subtitle {
        margin-left: 5px;
        width: 198px;
        height: 26px;
        line-height: 26px;
        color: #ff7800;
        text-align: center;
        background-color: #0f46a9;
        margin-bottom: 10px;
      }
      .num {
        margin-left: 35px;
        width: 80px;
        display: inline-block;
        float: right;
      }
      .areaname {
        width: 100px;
        display: inline-block;
      }
      .subleft {
      }
      .subright {
      }
    }
  }
  .bottom {
    margin-left: 10px;
    position: relative;
    .left {
      float: left;
      .title {
        height: 32px;
        line-height: 28px;
        margin-top: 15px;
        padding-left: 48px;
      }
      #xcchart6 {
        width: 1250px;
        height: 280px;
        display: inline-block;
      }
    }
    .right {
      width: 600px;
      height: 310px;
      margin-top: 20px;
      padding-right: 50px;
      .title {
        padding-left: 15px;
        margin-top: -2px;
      }
      .failCaseList-body {
        margin: 0 auto;
        margin-top: 20px;
        height: 250px;
        overflow: hidden;
        width: 470px;
        border-bottom: solid 1px #2370d6;
        margin-left: 50px;
        .head {
          width: 470px;
          background-color: #0a3480;
          border: solid 1px #2370d6;
          height: 35px;
          line-height: 35px;
          text-align: center;
          span:nth-child(1) {
            border-right: solid 1px #2370d6;
          }
          span {
            display: inline-block;
            width: 49%;
            height: 30px;
            line-height: 30px;
            color: #ffb400;
          }
        }
      }
      .failCaseList {
        margin: 0 auto;
        margin-top: 0px;
        height: 220px;
        overflow: hidden;
        width: 470px;

        ul {
          border: solid 1px #2370d6;
          background-color: #0a3480;
          width: 470px;
          border-top: none;
          border-bottom: none;
        }
        li {
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-bottom: solid 1px #2370d6;
          .title {
            margin: 0;
          }
          span:nth-child(1) {
            border-right: solid 1px #2370d6;
          }
          span {
            display: inline-block;
            width: 49%;
            height: 35px;
            line-height: 35px;
          }
        }
      }
    }
  }
}
</style>
<style>
#home .el-dialog {
  /* background-color: #0c1f7f; */
  margin-top: 22vh !important;
}
#home .el-dialog__body {
  padding: 20px 15px;
}
#deanPer .botSearch .el-input__inner {
  background-color: #0c1f7f;
  height: 30px;
  line-height: 30px;
  border: 1px solid #2c69ff;
  color: #fff;
}
#deanPer .botSearch .el-input {
  height: 30px;
  line-height: 30px;
}
#deanPer .botSearch .el-input__icon {
  line-height: 25px;
}
.el-select-dropdown__list {
  background-color: #0c1f7f;
}
.el-select-dropdown__list li {
  color: #fff;
}
.el-select-dropdown__empty {
  /* background-color: #0c1f7f;
   color: #fff; */
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #1e3caf;
  color: #00ffff;
}
.el-select-dropdown__list li {
}
.el-select-dropdown {
  border-color: #2c69ff;
}
</style>
