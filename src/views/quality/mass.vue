<template>
  <div id="mass">
    <el-row
      :gutter="10"
      style="margin:0;background: rgb(8,45,111);padding-bottom:20px;padding:20px"
    >
      <p class="r_header_title">
        <span class="y_line"></span>质量查询
      </p>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple">
          <el-form :inline="true" :model="params" class="demo-form-inline">
            <el-form-item label="时间：">
              <el-select
                v-model="timeStr"
                placeholder="请选择"
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
            <el-form-item label="法院：" v-if="courtShowFlag">
              <el-select
                v-model="params.courtId"
                placeholder="请选择"
                class="search_select"
                @change="selCourt"
              >
                <el-option
                  v-for="item in courtList"
                  :key="item.courtId"
                  :label="item.courtName"
                  :value="item.courtId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="庭室：" v-if="roomShowFlag">
              <el-select
                v-model="params.courtRoomId"
                placeholder="请选择"
                class="search_select"
                clearable
                @change="selRoom"
              >
                <el-option
                  v-for="item in courtRoomList"
                  :key="item.courtRoomId"
                  :label="item.courtRoomName"
                  :value="item.courtRoomId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="承办人：" v-if="cbrShowFlag">
              <el-select
                v-model="params.cbrId"
                placeholder="请选择"
                class="search_select"
                clearable
                @change="selCbr"
              >
                <el-option
                  v-for="item in cbrList"
                  :key="item.userCode"
                  :label="item.userFullName"
                  :value="item.userCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否合格：">
              <el-select
                v-model="params.checkCaseResult"
                placeholder="请选择"
                class="search_select"
                clearable
              >
                <el-option
                  v-for="item in checkList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="案号：">
              <el-input placeholder="请输入案号" v-model="params.caseName" clearable></el-input>
            </el-form-item>
            <el-form-item label="案件类型：">
              <el-select
                v-model="params.caseTypeId"
                placeholder="请选择"
                class="search_select"
                clearable
                @change="selCaseTpye"
              >
                <el-option
                  v-for="item in allCaseTypeList"
                  :key="item.caseTypeId"
                  :label="item.caseTypeName"
                  :value="item.caseTypeId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审判程序：">
              <el-select v-model="params.spcxId" placeholder="请选择" class="search_select" clearable>
                <el-option
                  v-for="item in spcxList"
                  :key="item.spcxId"
                  :label="item.spcxName"
                  :value="item.spcxId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="案件阶段：">
              <el-select
                v-model="params.caseStatus"
                placeholder="请选择"
                class="search_select"
                clearable
              >
                <el-option
                  v-for="item in anJianJieDuanList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                round
                icon="el-icon-search"
                style="margin-left:85px"
                v-preventReClick="1000"
                @click="onSearch"
              >搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <div class="content">
      <div>
        <div class="msg">
          <span>{{msgClone.time}}</span>
          <span>{{msgClone.courtName}}</span>
          <span>{{msgClone.roomName}}</span>
          <span>{{msgClone.cbrName}}</span>
        </div>
        <div class="btns">
          <el-button type="warning" round @click="exportExcel">导出</el-button>
          <!-- <download-excel
            class="export-excel-wrapper"
            :data="tableData"
            :fields="tableHead"
            name="excel.xls"
          >
            <el-button type="primary" size="small" round>导出EXCEL</el-button>
          </download-excel>-->
          <!-- <el-button type="info" round v-print="'#printTest'">打印</el-button> -->
          <el-button type="info" round @click="printContent">打印</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        height="520"
        :stripe="true"
        style="width: 100%;margin-bottom:20px"
        id="printTest"
        ref="print"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="caseName" label="案号" width="220"></el-table-column>
        <el-table-column prop="caseTypeName" label="案件类型" width></el-table-column>
        <el-table-column prop="spcxName" label="审判程序"></el-table-column>
        <el-table-column prop label="经办法院" width="220">
          <template slot-scope="scope">
            <span
              style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
              :title="scope.row.courtName"
            >{{scope.row.courtName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="courtRoomName" label="庭室"></el-table-column>
        <el-table-column prop="cbrName" label="承办人"></el-table-column>
        <el-table-column prop="caseStatusName" label="案件阶段"></el-table-column>
        <el-table-column prop="uploadIndex" label="上传批次"></el-table-column>
        <el-table-column prop="totalFileNum" label="页数"></el-table-column>
        <el-table-column label="是否合格">
          <template slot-scope="scope">
            <span v-if="scope.row.checkCaseResult ==1" style="color:#ffb400">不合格</span>
            <span v-else>合格</span>
          </template>
        </el-table-column>
        <el-table-column prop="failReason" width="200" label="不合格原因"></el-table-column>
        <el-table-column label="批注内容">
          <template slot-scope="scope">
            <span
              style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
              :title="scope.row.dealCaseMessage"
            >{{scope.row.dealCaseMessage}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="isPrint" type="text" size="small" @click="examination(scope.row)">阅卷</el-button>
            <el-button v-if="isPrint" type="text" size="small" @click="postilCase(scope.row)">批注</el-button>
            <el-button
              type="text"
              size="small"
              v-if="scope.row.checkCaseResult == 1&&userInfo.roleMenus[0] == 1"
              @click="checkCase(scope.row)"
            >核实</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="line"></div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      title="自定义选择时间"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <el-date-picker
          v-model="params.laDateStart"
          type="date"
          format="yyyy-MM-dd"
          placeholder="选择开始日期"
          :clearable="false"
          @change="selStart"
        ></el-date-picker>
        <el-date-picker
          v-model="params.laDateEnd"
          type="date"
          format="yyyy-MM-dd"
          placeholder="选择结束日期"
          :clearable="false"
          @change="selEnd"
        ></el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveTime">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="批注" :visible.sync="postilDialog" width="30%" :before-close="handleClose">
      <el-input placeholder="请输入批注内容" v-model="postilParam.dealCaseMessage" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="postilDialog = false">取 消</el-button>
        <el-button type="primary" @click="savePostil">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="核实" :visible.sync="checkDialog" width="30%" :before-close="handleClose">
      <el-form ref="form" label-width="80px">
        <el-form-item label="合格状态：" width="120">
          <el-select v-model="checkResult" placeholder="请选择" class="search_select" clearable>
            <el-option v-for="item in checkList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="不合格原因：" width="120">
          <span>{{failMsg}}</span>
        </el-form-item>
        <el-form-item label="批注内容：" width="120">
          <span>{{postiMsg}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveCheck">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const style =
  "@page { margin: 0 } @media *{text-align:left;width:90%} print { } table{}.el-table__fixed-right{display:none}"; //自定义样式
import Print from "print-js";
import { mapGetters } from "vuex";
import {
  parseTime,
  getWeekStartAndEnd,
  getCurrentMonthFirst,
  getFirstDayOfWeek,
  getLastMonth,
  getLastSixMonthYestdy,
  getLastYearYestdy,
  statesList,
  timeList
} from "@/utils";
import {
  getAllArea,
  getCourtList,
  getAllCaseType,
  getRoomsByCourtId,
  getCbrsByRoomId,
  getSpcxByCasetypeId,
  getCaseStatistics,
  getAllCaseInfo,
  getFailCaseList,
  exportCaseList,
  getAllCourtList,
  postilCase,
  checkCase
} from "@/api/quality";
import { anJianJieDuanList } from "./tableHead";
export default {
  data() {
    return {
      isPrint: true,
      anJianJieDuanList: anJianJieDuanList,
      checkList: [{ id: 0, name: "合格" }, { id: 1, name: "不合格" }],
      total: 0,
      user: {},
      dialogVisible: false,
      postilDialog: false,
      postilParam: {
        caseId: "",
        courtId: "",
        dealCaseMessage: ""
      },
      checkParam: {
        caseId: "",
        courtId: ""
      },
      checkResult: "",
      postiMsg: "",
      failMsg: "",
      checkDialog: false,
      msg: {
        time: "2017-01-01 至 " + parseTime(new Date(), "{y}-{m}-{d}"),
        courtName: "",
        roomName: "",
        cbrName: ""
      },
      msgClone: {
        time: "2017-01-01 至 " + parseTime(new Date(), "{y}-{m}-{d}"),
        courtName: "",
        roomName: "",
        cbrName: ""
      },
      areaFlag: 1,
      timeList: timeList,
      timeStr: "2017-01-01 至 " + parseTime(new Date(), "{y}-{m}-{d}"),
      params: {
        courtId: "",
        courtRoomId: "",
        cbrId: "",
        caseTypeId: "",
        spcxId: "",
        caseStatus: "",
        checkCaseResult: "",
        caseName: "",
        queryAreaFlag: false,
        checkCaseMessageFlag: true,
        laDateStart: "2017-01-01",
        laDateEnd: parseTime(new Date(), "{y}-{m}-{d}"),
        currentPage: 1,
        pageSize: 20
      },
      allAreaList: [],
      courtList: [],
      courtRoomList: [],
      cbrList: [],
      caseTypeList: [],
      spcxList: [],
      caseStateList: statesList,
      qualifiedList: [
        { name: "全部", id: "" },
        { name: "合格", id: 0 },
        { name: "不合格", id: 1 }
      ],
      // 表格数据
      tableData: [],
      allCaseTypeList: [],
      courtIds: "",
      startStr: new Date("2017-01-01").getTime() / 1000,
      endStr: new Date().getTime() / 1000,
      searchFlag: true,
      courtShowFlag: false,
      roomShowFlag: false,
      cbrShowFlag: false
    };
  },
  computed: {
    ...mapGetters(["token", "userInfo"])
  },
  created() {
    let params = sessionStorage.getItem("params");
    params = JSON.parse(params);
    if (params) {
      if (params.shijiao == 1) {
        this.params = params;
        this.params.queryAreaFlag = false;
      } else if (params.shijiao == 2) {
        this.params = params;
      } else if (params.shijiao == 3) {
        this.params = params;
      } else if (params.shijiao == 4) {
        this.params = params;
      }
    }
    this.getAllCaseType();
    this.getAllCourtList();
    this.getCaseStatistics();
    this.getCourtRoomList(this.user.courtId);
    this.msg.courtName = this.user.courtName;
    this.msgClone.courtName = this.user.courtName;
  },
  mounted() {
    this.changeData();
    this.$bus.$emit("on-click", "/quality");
  },
  watch: {},
  methods: {
    async savePostil(row) {
      try {
        const { code } = await postilCase(this.postilParam);
        if (code == 0) {
          this.postilDialog = false;
          this.$message({
            message: "批注成功",
            type: "success"
          });
          this.getCaseStatistics();
        }
      } catch (err) {
        console.log(err);
      }
    },
    async saveCheck() {
      if (this.checkResult == 1) {
        this.$message({
          message: "该案件已为不合格",
          type: "warning"
        });
      } else {
        try {
          const { code } = await checkCase(this.checkParam);
          if (code == 0) {
            this.checkDialog = false;
            this.$message({
              message: "核实成功",
              type: "success"
            });
            this.getCaseStatistics();
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    examination(row) {
      //阅卷
      window.open(
        row.serverIp +
          "/viewer/model/common_filespreview/page.html?zjflag=true&caseInfoId=" +
          row.caseId
      );
    },
    postilCase(row) {
      //批注
      this.postilParam.caseId = row.caseId;
      this.postilParam.courtId = row.courtId;
      this.postilParam.dealCaseMessage = row.dealCaseMessage;
      this.postilDialog = true;
    },
    checkCase(row) {
      //核实
      this.checkParam.caseId = row.caseId;
      this.checkParam.courtId = row.courtId;
      this.postiMsg = row.dealCaseMessage;
      this.failMsg = row.failReason;
      this.checkDialog = true;
    },
    async getAllCourtList() {
      try {
        const { data } = await getAllCourtList();
        this.courtList = data;
      } catch (err) {}
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getCaseStatistics();
    },
    handleCurrentChange(val) {
      this.params.currentPage = val;
      this.getCaseStatistics();
    },
    handleClose() {
      this.dialogVisible = false;
      this.params.laDateStart = "2017-01-01";
      this.params.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
      this.timeStr = "2017-01-01 至 " + this.params.laDateEnd;
      this.msg.time = this.timeStr;
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
      this.timeStr = this.params.laDateStart + " 至 " + this.params.laDateEnd;
      this.msg.time = this.timeStr;
    },
    selStart() {
      this.startStr = this.params.laDateStart.getTime() / 1000; //时间戳
      this.endStr = new Date(this.params.laDateEnd).getTime() / 1000; //时间戳
      if (this.startStr > this.endStr) {
        this.$message({
          message: "开始时间不能大于结束时间",
          type: "warning"
        });
        return;
      }

      this.params.laDateStart = parseTime(
        this.params.laDateStart,
        "{y}-{m}-{d}"
      );
    },
    selEnd() {
      this.endStr = this.params.laDateEnd.getTime() / 1000; //时间戳
      this.startStr = new Date(this.params.laDateStart).getTime() / 1000; //时间戳
      if (this.startStr > this.endStr) {
        this.$message({
          message: "结束时间不能小于开始时间",
          type: "warning"
        });
        return;
      }

      this.params.laDateEnd = parseTime(this.params.laDateEnd, "{y}-{m}-{d}");
    },
    exportExcel() {
      let curl =
        "/caseCheck/export/exportCaseList?courtId=" +
        this.params.courtId +
        "&courtRoomId=" +
        this.params.courtRoomId +
        "&cbrId=" +
        this.params.cbrId +
        "&caseTypeId=" +
        this.params.caseTypeId +
        "&spcxId=" +
        this.params.spcxId +
        "&caseStatus=" +
        this.params.caseStatus +
        "&checkCaseResult=" +
        this.params.checkCaseResult +
        "&queryAreaFlag=" +
        this.params.queryAreaFlag +
        "&checkCaseMessageFlag=" +
        this.params.checkCaseMessageFlag +
        "&laDateStart=" +
        this.params.laDateStart +
        "&laDateEnd=" +
        this.params.laDateEnd +
        "&caseName=" +
        this.params.caseName;
      window.location.href = curl;
      // require.ensure([], () => {
      //   const { export_json_to_excel } = require("@/excel/Export2Excel");
      //   let tHeader = [
      //     "案号",
      //     "案件类型",
      //     "审判程序",
      //     "经办法院",
      //     "庭室",
      //     "承办人",
      //     "案件阶段",
      //     "上传批次",
      //     "页数",
      //     "是否合格",
      //     "不合格原因"
      //   ]; // 上面设置Excel的表格第一行的标题
      //   let filterVal = [
      //     "caseName",
      //     "caseTypeName",
      //     "spcxName",
      //     "courtName",
      //     "courtRoomName",
      //     "cbrName",
      //     "caseStatusName",
      //     "uploadIndex",
      //     "totalFileNum",
      //     "checkCaseResult",
      //     "failReason"
      //   ]; // 上面是tableData里对象的属性
      //   // this.tableHead.forEach(element => {
      //   //   tHeader.push(element.column_comment);
      //   //   filterVal.push(element.column_name);
      //   // });
      //   const list = this.tableData; //把data里的tableData存到list
      //   const data = this.formatJson(filterVal, list);
      //   // console.log(data);
      //   export_json_to_excel(tHeader, data, "质量查询excel");
      // });
    },
    printContent() {
      this.isPrint = false;
      document.querySelector(
        ".el-table__body-wrapper.is-scrolling-left~.el-table__fixed, .el-table__body-wrapper.is-scrolling-none~.el-table__fixed, .el-table__body-wrapper.is-scrolling-none~.el-table__fixed-right, .el-table__body-wrapper.is-scrolling-right~.el-table__fixed-right"
      ).style.display = "none";
      setTimeout(() => {
        Print({
          printable: "printTest",
          type: "html",
          // 继承原来的所有样式
          // targetStyles: ["*"],
          style: style
          // scanStyles: false
        });
      }, 1000);
      setTimeout(() => {
        // this.isPrint = true;
        window.location.reload();
      }, 5000);
      // setTimeout(() => {
      //   this.$Print0(this.$refs.print);
      // }, 500);
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => {
        // console.log(v);
        if (v.checkCaseResult === 0) {
          v.checkCaseResult = "合格";
        } else if (v.checkCaseResult === 1) {
          v.checkCaseResult = "不合格";
        }
        return filterVal.map(j => v[j]);
      });
    },
    tagClick(row) {
      this.$router.push({
        path: "/quality/mass"
      });
    },
    async courtClick(row) {
      await this.selCourt(row.courtId);
      this.getCaseStatistics();
    },
    async roomClick(row) {
      await this.selRoom(row.courtRoomId);
      this.getCaseStatistics();
    },
    async cbrClick(row) {
      // await this.selCbr(row.cbrId);
      // this.getCaseStatistics();
      this.$router.push({
        path: "/quality/mass"
      });
    },
    getMsgTime(id) {
      let self = this;
      timeList.forEach(element => {
        if (element.id == id) {
          self.msg.time = element.name;
        }
      });
    },
    selTime(id) {
      if (id == 1) {
        this.params.laDateStart = parseTime(
          getCurrentMonthFirst(),
          "{y}-{m}-{d}"
        );
        this.params.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == 2) {
        this.params.laDateStart = getLastMonth().start;
        this.params.laDateEnd = getLastMonth().end;
        this.getMsgTime(id);
      } else if (id == 3) {
        this.params.laDateStart = getFirstDayOfWeek(new Date());
        this.params.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == "4") {
        this.params.laDateStart = getWeekStartAndEnd(-1)[0];
        this.params.laDateEnd = getWeekStartAndEnd(-1)[1];
        this.getMsgTime(id);
      } else if (id == "5") {
        this.params.laDateStart = parseTime(new Date(), "{y}-{m}-{d}");
        this.params.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == "6") {
        this.params.laDateStart = parseTime(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          "{y}-{m}-{d}"
        );
        this.params.laDateEnd = parseTime(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          "{y}-{m}-{d}"
        );
        this.getMsgTime(id);
      } else if (id == "7") {
        this.params.laDateStart = getLastSixMonthYestdy(new Date());
        this.params.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == "8") {
        this.params.laDateStart = getLastYearYestdy(new Date());
        this.params.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == "9") {
        this.dialogVisible = true;
      }
    },
    getMsgCourt(id) {
      this.courtList.forEach(element => {
        if (element.courtId == id) {
          this.msg.courtName = element.courtName;
        }
      });
    },
    async getCourtRoomList(id) {
      try {
        const { data } = await getRoomsByCourtId({ courtId: id });
        this.courtRoomList = data;
      } catch (err) {}
    },
    async selCourt(id) {
      this.msg.roomName = "";
      this.msg.cbrName = "";
      this.params.cbrId = "";
      this.cbrList = [];
      this.courtRoomList = [];
      this.params.courtId = id;
      this.getCourtRoomList(id);
    },
    getMsgRoom(id) {
      this.courtRoomList.forEach(element => {
        if (element.courtRoomId == id) {
          this.msg.roomName = element.courtRoomName;
        }
      });
    },
    async selRoom(id) {
      this.msg.cbrName = "";
      this.cbrList = [];
      if (id === "") {
        return;
      }
      try {
        const { data } = await getCbrsByRoomId({
          courtId: this.params.courtId,
          courtRoomId: id
        });
        if (data.length == 0) {
          this.$message({
            message: "该庭室下暂无法官信息",
            type: "warning"
          });
          this.params.cbrId = "";
          return;
        }
        this.cbrList = data;
        this.getMsgRoom(id);
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询承办人列表失败",
          type: "warning"
        });
      }
    },
    getMsgCbr(id) {
      this.cbrList.forEach(element => {
        if (element.userCode == id) {
          this.msg.cbrName = element.userFullName;
        }
      });
    },
    selCbr(id) {
      this.params.cbrId = id;
      this.getMsgCbr(id);
    },
    async getSpcxList(id) {
      try {
        const { data } = await getSpcxByCasetypeId({ caseTypeId: id });
        this.spcxList = data;
      } catch (err) {
        console.log(err);
      }
    },
    selCaseTpye(id) {
      this.spcxList = [];
      if (id === "") {
        return;
      }
      this.getSpcxList(id);
    },
    async getCaseStatistics() {
      let t = typeof this.token;
      if (t == "string") {
        this.user = JSON.parse(this.token);
      } else if (t == "object") {
        this.user = this.token;
      }
      this.params.courtId = this.user.courtId;

      if (this.searchFlag) {
        if (this.userInfo.roleMenus[0] == 1) {
          this.areaShowFlag = true;
          this.courtShowFlag = true;
          this.roomShowFlag = true;
          this.cbrShowFlag = true;
        } else if (this.userInfo.roleMenus[0] == 2) {
          this.params.courtId = this.userInfo.courtId;
          // this.courtShowFlag = true;
          this.roomShowFlag = true;
          this.cbrShowFlag = true;
          this.params.queryAreaFlag = false;
          this.msgClone.courtName = this.userInfo.courtName;
          this.msgClone.roomName = this.userInfo.courtRoomName;
          this.msgClone.cbrName = this.userInfo.userFullName;
          let ids = [];
          try {
            const { data } = await getRoomsByCourtId({
              courtId: this.userInfo.courtId
            });
            this.courtRoomList = data;
            this.courtRoomList.forEach(element => {
              ids.push(element.courtRoomId);
            });
            this.params.courtId = this.userInfo.courtId;
            this.courtRoomList.unshift({
              courtRoomId: ids.join("-"),
              courtRoomName: "全部庭室"
            });
            this.getMsgCourt(this.userInfo.courtId);
          } catch (err) {
            console.log(err);
            // this.$message({
            //   message: "查询庭室列表失败",
            //   type: "warning"
            // });
          }
        } else if (this.userInfo.roleMenus[0] == 3) {
          // this.roomShowFlag = true;
          this.cbrShowFlag = true;
          this.params.courtId = this.userInfo.courtId;
          this.params.courtRoomId = this.userInfo.courtRoomId;
          // console.log(this.params);
          let ids = [];
          this.params.queryAreaFlag = false;
          try {
            const { data } = await getCbrsByRoomId({
              courtId: this.userInfo.courtId,
              courtRoomId: this.userInfo.courtRoomId
            });
            if (data.length == 0) {
              this.$message({
                message: "该庭室下暂无法官信息",
                type: "warning"
              });
              this.params.cbrId = "";
              return;
            }
            this.cbrList = data;
            this.cbrList.forEach((element, index) => {
              if (element.userCode) {
                ids.push(element.userCode);
              } else {
                this.cbrList.splice(index, 1);
              }
            });
            this.params.courtId = this.userInfo.courtId;
            this.params.courtRoomId = this.userInfo.courtRoomId;
            this.cbrList.unshift({
              userCode: ids.join("-"),
              userFullName: "全部法官"
            });
            this.getMsgRoom(this.userInfo.courtId);
          } catch (err) {
            console.log(err);
            this.$message({
              message: "查询承办人列表失败",
              type: "warning"
            });
          }
        } else if (this.userInfo.roleMenus[0] == 4 && this.userInfo.userCode) {
          // this.cbrShowFlag = true;
          this.params.courtId = this.userInfo.courtId;
          this.params.courtRoomId = this.userInfo.courtRoomId;
          this.params.cbrId = this.userInfo.userCode;
          this.msgClone.courtName = this.userInfo.courtName;
          this.msgClone.roomName = this.userInfo.courtRoomName;
          this.msgClone.cbrName = this.userInfo.userFullName;
        }
      }

      try {
        if (this.params.shijiao) {
          delete this.params.shijiao;
        }
        const { data, total } = await getFailCaseList(this.params);
        this.tableData = data;
        this.total = total;
        this.msgClone.time = this.msg.time;
        this.msgClone.courtName = this.msg.courtName;
        this.msgClone.roomName = this.msg.roomName;
        this.msgClone.cbrName = this.msg.cbrName;
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询统计信息失败",
          type: "warning"
        });
      }
    },
    async getAllCaseType() {
      try {
        const { data } = await getAllCaseType();
        this.allCaseTypeList = data;
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询地区列表失败",
          type: "warning"
        });
      }
    },
    changeData() {
      this.$emit("changeData", "/quality/mass");
    },
    onSearch() {
      // console.log(this.params);
      this.searchFlag = false;
      this.getCaseStatistics();
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
#mass {
  background: rgb(6, 27, 84);
  // position: relative;
  //   margin-top: 0px;
  //   padding-top: 10px;
  //   overflow: hidden;
  // padding: 20px;
  .r_header_title {
    margin: 0;
    font-family: MicrosoftYaHei;
    font-size: 20px;
    letter-spacing: 4px;
    // color: #ffffff;
    height: 35px;
    line-height: 30px;
    padding-left: 30px;
    position: relative;
    margin-bottom: 20px;
    .y_line {
      width: 4px;
      height: 20px;
      background-color: #02a3ff;
      display: inline-block;
      margin-right: 15px;
      position: absolute;
      top: 5px;
      left: 0px;
    }
  }
  .el-tag {
    background: transparent;
    border: none;
  }
  .msg {
    padding: 0 50px;
    height: 36px;
    line-height: 36px;
    border-radius: 18px;
    border: solid 1px #4295cb;
    margin-left: 20px;
    float: left;
    margin-bottom: 20px;
  }
  .btns {
    float: right;
    margin-right: 50px;
  }
  .el-button--info {
    color: #fff;
    background-color: rgb(147, 147, 243);
    border-color: rgb(147, 147, 243);
  }
  .content {
    margin-top: 0px;
    padding-top: 10px;
    position: relative;
    // background: rgb(17,62,140);
    overflow: hidden;
    padding: 20px;
    .line {
      position: absolute;
      width: 97.8%;
      height: 1px;
      background: rgb(17, 62, 140);
      top: 595px;
      z-index: 99;
    }
  }
}
</style>
<style>
.el-input__inner {
  background-color: transparent;
  color: #fff;
  border-color: #4295cb;
}
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #fff;
  font-size: 14px;
}

::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #fff;
  font-size: 14px;
}
:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #fff;
  font-size: 14px;
}
.el-table th,
.el-table tr,
.el-table thead,
.el-table__empty-block,
.el-table__empty-text,
.el-table--border td,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  background: rgb(17, 62, 140);
  color: #fff;
  font-weight: 500;
  border-right: none;
  font-size: 14px;
}
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: rgb(8, 48, 118);
}
.el-table td,
.el-table th.is-leaf {
  border-bottom: none;
  font-size: 14px;
  text-align: center;
}
.el-table--border,
.el-table--group .el-table__body,
.el-table__footer,
.el-table__header {
  /* border-bottom: 1px solid #4295cd;
  border-right: 1px solid #4295cd; */
  font-size: 14px;
  border-color: #4295cb;
}
.el-tag {
  font-size: 14px;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #0c1f7f !important;
}
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
.el-table__body tr.current-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row > td {
  background: #0c1f7f !important;
}
/* #mass ::-webkit-scrollbar {
    width: 18px;
    height: 12px;
    background-color: #fff;
}
#mass ::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 6px #409eff;
    background-color: #409eff;
} */
#mass .el-pagination__total,
#mass .el-pagination__jump {
  color: #fff;
}
/* .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #0c1f7f !important;
}
.has-gutter .el-table thead,
.has-gutter  .el-table th,
.has-gutter .el-table tr {
  background: rgb(10, 35, 103) !important;
}
.el-table__body-wrapper {
  background: #061b54;
} */

#mass .has-gutter tr,
#mass .has-gutter th {
  background: rgb(10, 35, 103) !important;
}

#mass .el-table__fixed-header-wrapper th {
  background: rgb(10, 35, 103) !important;
}
#mass .el-form--inline .el-form-item__label {
  width: 85px;
}

.el-select-dropdown__list {
  background-color: #0c1f7f;
}
.el-select-dropdown__list li {
  color: #fff;
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
/* .el-select-dropdown__empty{
   background-color: #0c1f7f;
    color: #fff;
} */
.el-input__inner {
  background-color: transparent;
  color: #fff;
  border-color: #4295cb;
}
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #fff;
  font-size: 14px;
}

::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #fff;
  font-size: 14px;
}
:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #fff;
  font-size: 14px;
}

#mass .el-pagination {
  color: #fff;
}
#mass .el-pager li {
  background: transparent;
  border: 1px solid #4295cb;
  margin: 0 12px;
  color: #fff;
}
#mass .el-pagination .btn-next,
#mass .el-pagination .btn-prev {
  border: 1px solid #4295cb;
  color: #fff;
  background: transparent;
}
#mass .el-pager li {
  padding: 0 4px;
  font-size: 13px;
  min-width: 28px;
  line-height: 25px;
}
#mass .el-pager li.active {
  color: #fff;
  cursor: default;
  background: rgb(0, 210, 255);
}
#mass .el-pagination__editor.el-input {
  margin: 0 10px;
}
#mass el-table__footer-wrapper,
#mass .el-table__header-wrapper {
  background: rgb(10, 35, 103) !important;
}
/* 全局 */
.el-pagination {
  color: #fff;
}
.el-pager li {
  background: transparent;
  border: 1px solid #4295cb;
  margin: 0 12px;
  color: #fff;
}
.el-pagination .btn-next,
.el-pagination .btn-prev {
  border: 1px solid #4295cb;
  color: #fff;
  background: transparent;
}
.el-pager li {
  padding: 0 4px;
  font-size: 13px;
  min-width: 28px;
  line-height: 25px;
}
.el-pager li.active {
  color: #fff;
  cursor: default;
  background: rgb(0, 210, 255);
}
.el-pagination__editor.el-input {
  margin: 0 10px;
}

.el-pagination__total {
  color: #fff;
}
.el-pagination__jump {
  color: #fff;
}
.el-pager li.btn-quicknext,
.el-pager li.btn-quickprev {
  color: #fff;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
.content ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
.content ::-webkit-scrollbar-thumb {
  /*  border-radius:5px; */
  -webkit-box-shadow: inset 0 0 6px #409eff;
  background-color: #409eff;
}
/*定义滚动条轨道 内阴影+圆角*/
.content ::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  width: 8px;
  background-color: #f5f5f5;
}
.content .el-table__fixed-right-patch {
  background: rgb(10, 35, 103) !important;
  border: none;
}
.el-dialog {
  background: rgb(14, 50, 116);
}
.el-dialog__body {
  padding: 0;
}
.el-dialog .el-input {
  width: 80%;
}
.el-dialog .el-form-item__label {
  width: 125px !important;
}
.el-dialog .el-form-item__content {
  margin-left: 125px !important;
}
.el-dialog .el-input__inner {
  /* background: #1e3caf; */
  /* color: #000; */
}
.el-dialog__title,
.el-dialog__headerbtn .el-dialog__close,
.el-dialog__body {
  color: #fff;
}
.el-form-item {
}
.el-table--border,
.el-table--group .el-table__body,
.el-table__footer,
.el-table__header {
  /* border-bottom: 1px solid #4295cd;
  border-right: 1px solid #4295cd; */
  font-size: 14px;
  border-color: #4295cb;
  background: rgb(10, 35, 103) !important;
}
.el-table,
.el-table__expanded-cell {
  background: rgb(10, 35, 103);
}
/* 全局 */
</style>
<style>
</style>