<template>
  <div id="hierarchy">
    <el-row
      :gutter="10"
      style="margin:0;background: rgb(8,45,111);padding-bottom:20px;padding:20px"
    >
      <p class="r_header_title">
        <span class="y_line"></span>层级查询
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
                style="width:235px"
              >
                <el-option
                  v-for="item in timeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地区：" v-if="areaShowFlag">
              <el-select v-model="areaId" placeholder="请选择" class="search_select" @change="selArea">
                <el-option
                  v-for="item in allAreaList"
                  :key="item.courtId"
                  :label="item.courtAreaName"
                  :value="item.courtId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="法院：" v-if="courtShowFlag">
              <el-select
                v-model="params.courtIdStrings"
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
                v-model="params.courtRoomIdStrings"
                placeholder="请选择"
                class="search_select"
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
                v-model="params.cbrIdStrings"
                placeholder="请选择"
                class="search_select"
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
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                style="margin-left:30px;"
                v-preventReClick="1000"
                round
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
          <span v-if="areaShowFlag">{{msgClone.areaName}}</span>
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
      <el-table :data="tableData" :stripe="true" :height="iintheight" id="printTest" ref="print">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <template v-for="(item,index) in tableHead">
          <el-table-column
            :prop="item.column_name"
            :label="item.column_comment"
            :key="index"
            v-if="item.column_name != 'areaName'&&item.column_name != 'courtName'&&item.column_name != 'courtRoomName'&&item.column_name != 'cbrName'&&item.column_name != 'unPassCaseCount'"
          ></el-table-column>
          <el-table-column
            v-if="item.column_name==='areaName'"
            :prop="item.column_name"
            :label="item.column_comment"
          >
            <template scope="scope">
              <el-tag
                style="cursor: pointer;"
                type
                v-if="areaFlag == 1"
                @click="areaClick(scope.row)"
              >{{ scope.row.areaName }}</el-tag>
              <span v-else>{{ scope.row.areaName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="item.column_name==='courtName'"
            :prop="item.column_name"
            :label="item.column_comment"
          >
            <template scope="scope">
              <el-tag
                style="cursor: pointer;"
                type
                v-if="areaFlag == 2"
                @click="courtClick(scope.row)"
              >{{ scope.row.courtName }}</el-tag>
              <span v-else>{{ scope.row.courtName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="item.column_name==='courtRoomName'"
            :prop="item.column_name"
            :label="item.column_comment"
          >
            <template scope="scope">
              <el-tag
                style="cursor: pointer;"
                type
                v-if="areaFlag == 3"
                @click="roomClick(scope.row)"
              >{{ scope.row.courtRoomName }}</el-tag>
              <span v-else>{{ scope.row.courtRoomName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="item.column_name==='unPassCaseCount'"
            :prop="item.column_name"
            :label="item.column_comment"
          >
            <template scope="scope">
              <el-tag
                style="cursor: pointer;"
                type="danger"
                @click="tagClick(scope.row)"
              >{{ scope.row.unPassCaseCount }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="item.column_name==='cbrName'"
            :prop="item.column_name"
            :label="item.column_comment"
          >
            <template scope="scope">
              <el-tag
                style="cursor: pointer;"
                type
                @click="cbrClick(scope.row)"
              >{{ scope.row.cbrName }}</el-tag>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="line"></div>
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
  </div>
</template>

<script>
const style =
  "@page { margin: 0 } @media *{text-align:center} print { text-align:center} table{text-align:center}"; //自定义样式

import Print from "print-js";
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
  getAllCaseInfo
} from "@/api/quality";
import { tableHead } from "./tableHead";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      iintheight: 520,
      dialogVisible: false,
      msg: {
        time: "2017-01-01 至 " + parseTime(new Date(), "{y}-{m}-{d}"),
        areaName: "全部地区",
        courtName: "",
        roomName: "",
        cbrName: ""
      },
      msgClone: {
        time: "2017-01-01 至 " + parseTime(new Date(), "{y}-{m}-{d}"),
        areaName: "全部地区",
        courtName: "",
        roomName: "",
        cbrName: ""
      },
      areaFlag: 1,
      timeList: timeList,
      areaId: "",
      timeStr: "2017-01-01 至 " + parseTime(new Date(), "{y}-{m}-{d}"),
      params: {
        courtIdStrings: "",
        courtRoomIdStrings: "",
        cbrIdStrings: "",
        queryFlag: "",
        // laDateStart: thisMonthFirsrDay,
        laDateStart: "2017-01-01",
        laDateEnd: parseTime(new Date(), "{y}-{m}-{d}")
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
      // 表头数据
      tableHead: [],
      // 表格数据
      tableData: [],
      courtIds: "",
      startStr: "",
      endStr: "",
      areaShowFlag: false,
      courtShowFlag: false,
      roomShowFlag: false,
      cbrShowFlag: false,
      searchFlag: true
    };
  },
  computed: {
    ...mapGetters(["token", "userInfo"])
  },
  created() {
    this.getAllArea();
    this.getCaseStatistics();
  },
  mounted() {
    this.changeData();
    this.$bus.$emit("on-click", "/quality");
  },
  watch: {},
  methods: {
    //打印页面内容
    printContent() {
      Print({
        printable: "printTest",
        type: "html",
        // 继承原来的所有样式
        // targetStyles: ["*"],
        style: style
        // scanStyles: false
      });
      // setTimeout(() => {
      //   this.$Print0(this.$refs.print);
      // }, 500);
    },

    //导出的方法
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/excel/Export2Excel");
        let tHeader = []; // 上面设置Excel的表格第一行的标题
        let filterVal = []; // 上面是tableData里对象的属性
        this.tableHead.forEach(element => {
          tHeader.push(element.column_comment);
          filterVal.push(element.column_name);
        });
        const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "层级查询excel");
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
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
    tagClick(row) {
      let checkRes = this.failCaseListParam;
      checkRes.result = 1;
      checkRes = JSON.stringify(checkRes);
      sessionStorage.setItem("checkRes", checkRes);
      this.$router.push({
        name: "Mass"
      });
    },
    async areaClick(row) {
      this.areaId = row.areaId;
      await this.selArea(row.areaId);
      // this.params.courtId = row.areaId;
      this.getCaseStatistics();
    },
    async courtClick(row) {
      await this.selCourt(row.courtId);
      this.getCaseStatistics();
    },
    async roomClick(row) {
      await this.selRoom(row.courtRoomId);
      this.params.courtRoomId = row.courtRoomId;
      this.getCaseStatistics();
    },
    async cbrClick(row) {
      // await this.selCbr(row.cbrId);
      // this.getCaseStatistics();
      console.log(row);
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
    async getAllArea() {
      try {
        const { data } = await getAllArea();
        this.allAreaList = data;
        this.allAreaList.unshift({
          courtId: "",
          courtAreaName: "全部地区"
        });
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询地区列表失败",
          type: "warning"
        });
      }
    },
    getMsgArea(id) {
      this.allAreaList.forEach(element => {
        if (element.courtId == id) {
          this.msg.areaName = element.courtAreaName;
        }
      });
    },
    async selArea(id) {
      this.msg.courtName = "";
      this.msg.roomName = "";
      this.msg.cbrName = "";
      this.courtRoomList = [];
      this.cbrList = [];
      this.params.courtRoomIdStrings = "";
      this.params.cbrIdStrings = "";
      if (id === "") {
        this.params.queryFlag = "";
        this.params.courtIdStrings = "";
        this.courtList = [];
        this.msg.areaName = "全部地区";
      } else {
        this.courtList = [];
        let ids = [];
        this.params.queryFlag = 0;
        try {
          const { data } = await getCourtList({ courtId: id });
          this.courtList = data.children;
          this.courtList.unshift(data);
          this.courtList.forEach(element => {
            ids.push(element.courtId);
          });
          this.courtIds = ids.join("-");
          this.params.courtIdStrings = this.courtIds;
          this.courtList.unshift({
            courtId: this.courtIds,
            courtName: "全部法院"
          });
          this.getMsgArea(id);
        } catch (err) {
          console.log(err);
          this.$message({
            message: "查询法院列表失败",
            type: "warning"
          });
        }
      }
    },
    getMsgCourt(id) {
      this.courtList.forEach(element => {
        if (element.courtId == id) {
          this.msg.courtName = element.courtName;
        }
      });
    },
    async selCourt(id) {
      this.msg.roomName = "";
      this.msg.cbrName = "";
      this.params.cbrIdStrings = "";
      this.cbrList = [];
      if (typeof id == "string") {
        this.params.queryFlag = 0;
        this.params.courtRoomIdStrings = "";
        this.courtRoomList = [];
        this.msg.courtName = "全部法院";
        return;
      }
      this.courtRoomList = [];
      let ids = [];
      this.params.courtIdStrings = id;
      this.params.queryFlag = 1;
      try {
        const { data } = await getRoomsByCourtId({ courtId: id });
        this.courtRoomList = data;
        this.courtRoomList.forEach(element => {
          ids.push(element.courtRoomId);
        });
        this.params.courtRoomIdStrings = ids.join("-");
        this.courtRoomList.unshift({
          courtRoomId: ids.join("-"),
          courtRoomName: "全部庭室"
        });
        this.getMsgCourt(id);
      } catch (err) {
        console.log(err);
        // this.$message({
        //   message: "查询庭室列表失败",
        //   type: "warning"
        // });
      }
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
      if (typeof id == "string") {
        this.params.queryFlag = 1;
        this.params.cbrIdStrings = "";
        this.msg.roomName = "全部庭室";
        return;
      }
      let ids = [];
      this.params.queryFlag = 2;
      try {
        const { data } = await getCbrsByRoomId({
          courtId: this.params.courtIdStrings,
          courtRoomId: id
        });
        if (data.length == 0) {
          this.$message({
            message: "该庭室下暂无法官信息",
            type: "warning"
          });
          this.params.cbrIdStrings = "";
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
        this.params.cbrIdStrings = ids.join("-");
        this.cbrList.unshift({
          userCode: ids.join("-"),
          userFullName: "全部法官"
        });
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
      this.params.cbrIdStrings = id;
      this.getMsgCbr(id);
    },
    async getCaseStatistics() {
      if (this.params.queryFlag === "") {
        this.tableHead = tableHead.area;
        this.areaFlag = 1;
      } else if (this.params.queryFlag === 0) {
        this.tableHead = tableHead.court;
        this.areaFlag = 2;
      } else if (this.params.queryFlag == 1) {
        this.areaFlag = 3;
        this.tableHead = tableHead.room;
      } else if (this.params.queryFlag == 2) {
        this.areaFlag = 4;
        this.tableHead = tableHead.cbr;
      }
      if (this.searchFlag) {
        if (this.userInfo.roleMenus[0] == 1) {
          this.areaShowFlag = true;
          this.courtShowFlag = true;
          this.roomShowFlag = true;
          this.cbrShowFlag = true;
          this.tableHead = tableHead.area;
        } else if (this.userInfo.roleMenus[0] == 2) {
          this.params.courtIdStrings = this.userInfo.courtId;
          // this.courtShowFlag = true;
          this.roomShowFlag = true;
          this.cbrShowFlag = true;
          this.params.queryFlag = 1;
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
            this.params.courtRoomIdStrings = ids.join("-");
            this.courtRoomList.unshift({
              courtRoomId: ids.join("-"),
              courtRoomName: "全部庭室"
            });
            this.tableHead = tableHead.room;
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
          this.params.courtIdStrings = this.userInfo.courtId;
          this.params.courtRoomIdStrings = this.userInfo.courtRoomId;
          // console.log(this.params);
          let ids = [];
          this.params.queryFlag = 2;
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
              this.params.cbrIdStrings = "";
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
            this.params.cbrIdStrings = ids.join("-");
            this.cbrList.unshift({
              userCode: ids.join("-"),
              userFullName: "全部法官"
            });
            this.tableHead = tableHead.cbr;
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
          this.params.courtIdStrings = this.userInfo.courtId;
          this.params.courtRoomIdStrings = this.userInfo.courtRoomId;
          this.params.cbrIdStrings = this.userInfo.userCode;
          // console.log(this.params);
          this.msgClone.courtName = this.userInfo.courtName;
          this.msgClone.roomName = this.userInfo.courtRoomName;
          this.msgClone.cbrName = this.userInfo.userFullName;
        }
      }
      try {
        const { data } = await getCaseStatistics(this.params);
        this.tableData = data;
        this.tableData.pop();
        this.msgClone.time = this.msg.time;
        if (!this.searchFlag) {
          this.msgClone.areaName = this.msg.areaName;
          this.msgClone.courtName = this.msg.courtName;
          this.msgClone.roomName = this.msg.roomName;
          this.msgClone.cbrName = this.msg.cbrName;
        }
        // this.getMsg(this.areaId, this.params);
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询统计信息失败",
          type: "warning"
        });
      }
    },
    // async getAllCaseType() {
    //   try {
    //     const { data } = await getAllCaseType();
    //     this.allAreaList = data;
    //   } catch (err){
    //     console.log(err)
    //     this.$message({
    //       message: "查询地区列表失败",
    //       type: "warning"
    //     });
    //   }
    // },
    changeData() {
      this.$emit("changeData", "/quality/hierarchy");
    },
    onSearch() {
      this.searchFlag = false;
      this.getCaseStatistics();
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
#hierarchy {
  padding: 0px;
  padding-left: 0;
  height: 870px;
  background: rgb(6, 27, 84);
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
    color: #00ffff;
  }
  .el-tag--danger {
    color: #ffb400;
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
    .el-button.is-round {
      border-radius: 20px;
      padding: 8px 30px;
    }
  }
  .content {
    position: relative;
    margin-top: 0px;
    padding-top: 10px;
    overflow: hidden;
    padding: 20px;
    .line {
      height: 1px;
      background: #061b54;
      position: absolute;
      top: 595px;
      z-index: 99;
      width: 100%;
    }
  }
  .el-button--info {
    color: #fff;
    background-color: rgb(147, 147, 243);
    border-color: rgb(147, 147, 243);
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
.el-table th {
  padding: 7px 0;
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
  background: rgb(10, 35, 103) !important;
}
.el-tag {
  font-size: 14px;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #0c1f7f !important;
}
/* .el-table thead,
.el-table th,
.el-table tr {
  background: rgb(10, 35, 103) !important; */
/* } */
.el-table__body-wrapper {
  background: #061b54;
}
.has-gutter tr,
.has-gutter th {
  background: rgb(10, 35, 103) !important;
}
.el-select-dropdown__empty {
  /* background-color: rgb(14, 50, 116);
   color: #fff; */
}
.el-select-dropdown__list {
  background-color: rgb(14, 50, 116);
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
#hierarchy .el-form--inline .el-form-item__label {
  width: 85px;
}
#hierarchy el-table__footer-wrapper,
#hierarchy .el-table__header-wrapper {
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