<template>
  <div class="zj_jg" ref="zjJg">
    <!-- <el-row>
      <el-col :span="7">
        <div class="grid-content bg-purple">所属单位：</div>
        <div>
          <el-tree :data="allCourtListTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content bg-purple-light">所属部门列表：</div>
        <div>
          <el-table ref="singleTable" :data="courtRoomList" v-if="this.courtRoomList.length>0" highlight-current-row @current-change="handleCurrentChange" style="width: 100%"  height="800">
             <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column prop="courtRoomName" label="部门名称" width align="center"></el-table-column>
            <el-table-column prop="userNum" label="部门人数" width="80" align="center"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content bg-purple">所属用户：</div>
        <ol class="userList">
          <li v-for="item in userList">{{item.userFullName}}</li>
        </ol>
      </el-col>
    </el-row> -->
    <!-- <p></p> -->
    <div class="job tabs">
        <div class="">所属单位：</div>
        <div>
          <el-tree :data="allCourtListTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
    </div>
    <div class="dupt tabs">
        <div class="">所属部门列表：</div>
        <div class="content">
          <!-- highlight-current-row -->
          <el-table ref="singleTable" :data="courtRoomList" stripe v-if="this.courtRoomList.length>0"  
              @current-change="handleCurrentChange"
              highlight-current-row 
              style="width: 100%"  height="800">
             <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column prop="courtRoomName" label="部门名称" width align="center"></el-table-column>
            <el-table-column prop="userNum" label="部门人数" width="80" align="center"></el-table-column>
          </el-table>
        </div>
    </div>
    <div class="userNum tabs" ref="userNum" >
        <div class="">所属用户：</div>
        <ol class="userList content">
          <li v-for="item in userList">{{item.userFullName}}</li>
        </ol>
    </div>
    <!-- <div></div> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import { queryAllCourtList, getCourtRoomById } from "@/api/common";
import { userCourRoomById } from "@/api/userZjjg";
export default {
  props: {},
  data() {
    return {
      allCourtListTree: [],
      courtRoomList: [],
      userList:[],
      defaultProps: {
        children: "children",
        label: function(data, node) {
          return data.courtName + "(" + data.userNum + ")";
        }
        // isLeaf:'leaf'
      }
    };
  },
  computed: {...mapGetters(["userInfo"]),},
  created() {},
  mounted() {
    var zjjgWidth=this.$refs.zjJg.offsetWidth;
    var tabsDiv=this.$refs.userNum.offsetWidth
    this.$refs.userNum.style.width=zjjgWidth-tabsDiv*2+"px";
    var userNumDiv=this.$refs.userNum.style.width
    var width=userNumDiv.substring(0,3)-0
    if(width>tabsDiv){
      this.$refs.userNum.style.width=zjjgWidth-(tabsDiv)*2-100+"px";
    }
    var courtIdParms={
        courtId: this.userInfo.courtId
    }
    this.changeData();
    this.getAllCourtList(courtIdParms);
    this.$bus.$emit("on-click", "/users");
  },
  watch: {},
  methods: {
    changeData() {
      this.$emit("changeData", "/users/zj_jg");
    },
    //选择部门
    handleNodeClick(data) {
      var params = { courtId: data.courtId };
      this.getCourtRoomById(params);
    },
    //选择庭室
    handleCurrentChange(row){
      if(row){
      var params={
        courtId: row.courtId,
        courtRoomId:row.courtRoomId,
      }
      this.userCourRoomById(params)
      }
      

    },
    //所有法院列表
    async getAllCourtList(courtId) {
      try {
        const { data } = await queryAllCourtList(courtId);
        this.allCourtListTree.push(data);
      } catch {
        this.allCourtList = [];
      }
    },
    //根据法院ID查询庭室
    async getCourtRoomById(params) {
      try {
        const { data } = await getCourtRoomById(params);
        this.courtRoomList = data;
        this.userList=[];
      } catch {
        this.courtRoomList = [];
        this.$message({
          message: "当前法院无庭室",
          type: "warning"
        });
      }
    },
    
    async userCourRoomById(params) {
      try {
        const { data } = await userCourRoomById(params);
        this.userList = data;
        if(this.userList.length==0){
          this.$notify({
          title: '警告',
          message: '该部门下暂时没有分配人员',
          type: 'warning'
        });
        }
      } catch {
        this. userList = [];
        this.$message({
          message: "当前庭室下没有下属人员",
          type: "warning"
        });
      }
    },
  },
  components: {}
};
</script>

<style scoped lang="scss">
  .zj_jg p{
    position: relative;
  }
  .zj_jg>div.tabs{
    position: absolute;
    width: 33%;
    border:1px solid #4295cb;
    height:820px;
    overflow: auto;
  }
  .zj_jg>div.dupt{
     margin-left:33%;
  }
  .zj_jg>div.userNum{
    margin-left:66%;
  }
  .el-tree{
    background: transparent;
    color:#fff;
  }
  .userList{
    padding-left:90px;
    color:#fff;
    height: 800px;
    font-size: 14px;
    overflow: auto
  } 
  .userList li{
    padding:5px;
    list-style: decimal;
  } 
  
</style>
<style lang="css">

.app-main{
    background: #061b54;
  }
   .zj_jg .el-tree .el-tree-node__content:hover{
    background-color: #1e3caf;
    color: #00ffff;
  }
  .el-tree-node:focus>.el-tree-node__content{
    background-color:#4295cb;

  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: #0c1f7f !important;
    cursor: pointer;
  }
  
  .is-current>.el-tree-node__content,.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,.el-table__body tr.current-row>td{
    background: #061b54;
    color: #ffb400;
  }
</style>
