<template>
  <div id="hierarchy">
    <el-row
      :gutter="10"
      style="margin:0;background: rgb(8,45,111);padding-bottom:20px;padding:20px"
    >
      <p class="r_header_title">
        <span class="y_line"></span>系统设置
      </p>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple">
          <el-form :inline="true" :model="params" class="demo-form-inline">
            <el-form-item label="案件类型：">
              <el-select
                v-model="params.caseTypeId"
                clearable
                placeholder="请选择"
                class="search_select"
                @change="changCaseType"
              >
                <el-option
                  v-for="item in caseTypeList"
                  :key="item.caseTypeId"
                  :label="item.caseTypeName"
                  :value="item.caseTypeId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=" 审判程序：">
              <el-select v-model="params.spcxId" placeholder="请选择" class="search_select">
                <el-option
                  v-for="item in spcxList"
                  clearable
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
                
              >
                <el-option
                  v-for="item in ajjdArr"
                  :key="item.caseStatus"
                  :label="item.ajjdName"
                  :value="item.caseStatus"
                ></el-option>
              </el-select>
            </el-form-item>
             <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSearch" v-preventReClick="1000">搜索</el-button>
              <el-button type="primary" icon="el-icon-plus"   @click="onAddUser">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <div class="content">
      <el-table
              ref="singleTable"
              :data="CaseCheckInfo"
              stripe
              @current-change="handleTableChange"
              style="width: 100%;text-align: center;"
              height="550"
            >
              <el-table-column type="index" width="50" align="center"></el-table-column>
              <el-table-column property="caseTypeName" width label="案件类型" align="center"></el-table-column>
              <el-table-column property="spcxName" width label="审判程序" align="center"></el-table-column>
              <el-table-column property="rootDirectoryName" width="" label="目录所属卷" align="center"></el-table-column>
              <el-table-column property="directoryName" label="目录" align="center"></el-table-column>
              <el-table-column property="" width="" label="案件阶段" align="center">
                <template slot-scope="scope">
                <div
                  v-html="getCaseStatusName(scope.row)"
                  style="text-align:center;white-space:normal;height:auto;"
                  class="datagrid-cell datagrid-cell-c3-cbrList"
                ></div>
              </template>
              </el-table-column>
              <el-table-column label="操作" prop align="center" width="285">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="onEditSystem(scope.$index, scope.row)"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    plain
                    @click="onDelUser(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
      <!-- <div class="line"></div> -->
    </div>
     <!-- 分页 -->
      <el-row class="pageRow">
        <div class="block">
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
    </el-row>
    <el-dialog :title="diaTitle" :visible.sync="dialogFormVisible" width>
        <el-form
          ref="formParams"
          :model="formParams"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="案件类型：">
              <el-select
                v-model="formParams.caseTypeId"
                clearable
                placeholder="请选择"
                class="search_select"
                @change="addchangCaseType"
              >
               <el-option
                  v-for="item in caseTypeList"
                  :key="item.caseTypeId"
                  :label="item.caseTypeName"
                  :value="item.caseTypeId"
                ></el-option>
              </el-select>
            </el-form-item>
          <el-form-item label="审判程序：" >
            <!-- <el-input v-model="formParams.description" placeholder="请输入" class="search_input"></el-input> -->
            <el-select v-model="formParams.spcxId" clearable placeholder="请选择"  @change="addchangSpcx" @focus="spcxOnfocus" >
                  <el-option
                    v-for="item in addSpcxList"
                    :key="item.spcxId"
                    :label="item.spcxName"
                    :value="item.spcxId">
                  </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属卷：">
            <!-- <el-input v-model="formParams.rootDirectoryId"  placeholder="请输入" class="search_input"></el-input> -->
            <el-select v-model="formParams.rootDirectoryId" clearable placeholder="请选择" @change="changRootDir" @focus="rootDirOnfocus">
                  <el-option
                    v-for="item in rootDirectoryList"
                    :key="item.directoryId"
                    :label="item.directoryName"
                    :value="item.directoryId">
                  </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目录：">
              <treeselect
                placeholder="请选择"
                :options="directoryList"
                :disable-branch-nodes="true"
                :show-count="true"
                v-model="formParams.directoryId"
                :normalizer="normalizer"
                @select="deptChange"
                @open="dirOnfocus"
              />
          </el-form-item>
          <el-form-item label="案件阶段：">
            <!-- <el-input v-model="formParams.userFullName" placeholder="请输入" class="search_input"></el-input> -->
            <el-select
                v-model="formParams.caseStatus"
                placeholder="请选择"
                class="search_select"
              >
                <el-option
                  v-for="item in ajjdArr"
                  :key="item.caseStatus"
                  :label="item.ajjdName"
                  :value="item.caseStatus"
                ></el-option>
              </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addResCancel">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
        </div>
      </el-dialog>

  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import{getCaseType ,getSpcxList,getCaseCheckInfo,getDirectory,addCaseCheckInfo,delMuLvRule,editCaseCheckInfo}from"@/api/caseType"
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  data() {
    return {
      total:0,
      currentPage1: 1,
      caseTypeList: [],
      spcxList: [],
      addSpcxList:[],
      rootDirectoryList:[],
      directoryList:[],
      ajjdArr:[
        {caseStatus:1,ajjdName:"新移送"},
        {caseStatus:2,ajjdName:"立案登记"},
        {caseStatus:3,ajjdName:"立案审查"},
        {caseStatus:4,ajjdName:"立案审批"},
        {caseStatus:5,ajjdName:"等待分派"},
        {caseStatus:6,ajjdName:"等待确认"},
        {caseStatus:7,ajjdName:"正在审理"},
        {caseStatus:8,ajjdName:"立案待结"},
        {caseStatus:9,ajjdName:"结案报批"},
        {caseStatus:10,ajjdName:"已经结案"},
        {caseStatus:11,ajjdName:"已经归档"}
      ],
      CaseCheckInfo:[],
      params: {
        currentPage: 1,
        pageSize: 10,
        caseTypeId: null,
        spcxId: null,
        caseStatus: null,
       
      },
      dialogFormVisible:false,
      diaTitle: "",
      formParams: {
        caseStatus: null,
        caseTypeId:null,
        caseTypeName: null,
        directoryId: null,
        directoryName: null,
        rootDirectoryId: null,
        rootDirectoryName: null,
        spcxId: null,
        spcxName: null,
      },
    };
  },
  computed: {...mapGetters(["userInfo"]),},
  created() {
    // this.getAllArea();
    // this.getCaseStatistics();
  },
  mounted() {
    var courtIdParms={
        courtId: this.userInfo.courtId
    }
    this.changeData();
    this.getCaseType();
    this.getCaseCheckInfo(this.params)
    this.$bus.$emit("on-click", "/admin");
  },
  watch: {},
  methods: {
    changeData() {
      this.$emit("changeData", "/admin/system");
    },
    normalizer(node) {
      //去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.directoryId,
        label: node.directoryName,
        children: node.children
      };
    },
    async getCaseType() {
      try {
        const { data } = await getCaseType();
        this.caseTypeList = data;
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询案件类型失败",
          type: "warning"
        });
      }
    },
    async getSpcxList(parms,spcxId,rootDirectoryId) {
      try {
        const { data } = await getSpcxList(parms);
        if(spcxId){
          this.addSpcxList= data;
          this.addSpcxList.forEach(methods=>{
            if(methods.spcxId==spcxId){
              var paramsSpcxId={
                  directoryModelId:methods.directoryModelId
              }
            this.getDirectory(paramsSpcxId,rootDirectoryId);
            // this.changRootDir(row.rootDirectoryId,row.directoryId)
            }
          });
        }else{
          this.spcxList = data;
        }
      } catch (err) {
        this.$message({
          message: "查询审判程序失败",
          type: "warning"
        });
      }
    },
    async getCaseCheckInfo(parms) {
        getCaseCheckInfo(parms)
        .then(response => {
          this.CaseCheckInfo = response.data;
          this.total = response.total;
        })
        .catch((err) => {
            console.log(err);
            this.CaseCheckInfo=[];
            // this.$message({
            //   message: "查询案件信息失败",
            //   type: "warning"
            // });

        });
    },
    changCaseType(id) {
        if(id){
          this.spcxList=[];
          this.params.spcxId="";
          var parms={
            caseTypeId:id
          }
          this.getSpcxList(parms);
        }else{
          this.spcxList=[];
          this.params.spcxId="";
        }
    },
    async getDirectory(parms,rootDirectoryId) {
      try {
        const { data } = await getDirectory(parms);
        data.forEach(methods=>{
            if(methods.parentId==0){
              this.rootDirectoryList.push(methods);
            }
        });
        if(rootDirectoryId){
          this.rootDirectoryList.forEach(methods=>{
            if(methods.directoryId==rootDirectoryId){
              this.directoryList=methods.children;
              this.formParams.rootDirectoryName=methods.directoryName;
            }
          });
        }
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询案件目录失败",
          type: "warning"
        });
      }
    },
    // 新增
    async addCaseCheckInfo(parms) {
      try {
        const { data } = await addCaseCheckInfo(parms);
        this.getCaseCheckInfo(this.params);
        this.dialogFormVisible = false;
        this.$message({
          message: "新增成功",
          type: "warning"
        });
      } catch (err) {
        console.log(err);
        this.$message({
          message: "新增失败",
          type: "success"
        });
      }
    },
    async delMuLvRule(parms) {
      try {
        const { data } = await delMuLvRule(parms);
        this.getCaseCheckInfo(this.params)
      } catch (err) {
        console.log(err);
        this.$message({
          message: "删除失败",
          type: "warning"
        });
      }
    },
    async editCaseCheckInfo(parms) {
      try {
        const { data } = await editCaseCheckInfo(parms);
        this.getCaseCheckInfo(this.params);
        this.dialogFormVisible = false;
        this.$message({
          message: "编辑成功",
          type: "success"
        });
      } catch (err) {
        console.log(err);
        this.$message({
          message: "编辑失败",
          type: "warning"
        });
      }
    },
    getCaseStatusName(scope){
      var str="";
      this.ajjdArr.forEach(methods=>{
        if(methods.caseStatus==scope.caseStatus){
          str=methods.ajjdName
        }
      })
      return str;
    },

    addchangCaseType(id,spcxId) {
        if(id){
          if(spcxId){
            this.formParams.spcxId=spcxId;
          }else{
            this.formParams.spcxId="";
          }
          this.formParams.rootDirectoryId="";
          if(this.formParams.directoryId){
            this.formParams.directoryId=null;
          }
          this.directoryList=[];
          var parms={
            caseTypeId:id
          };
          this.getSpcxList(parms,id);
          let obj = {};
          obj = this.caseTypeList.find((item)=>{//这里的userList就是上面遍历的数据源
              return item.caseTypeId === id;//筛选出匹配数据
          });
          this.formParams.caseTypeName=obj.caseTypeName;
        }else{
          this.addSpcxList=[];
          // this.spcxList=[];
          this.params.spcxId="";
        }
    },
    spcxOnfocus(){
      if(!this.formParams.caseTypeId){
        this.$message({
          message: "请选择案件类型",
          type: "warning"
        });
      }
    },
    addchangSpcx(SpcxId,rootDirectoryId){
      this.rootDirectoryList=[];
      if(rootDirectoryId){
        this.formParams.rootDirectoryId=rootDirectoryId;
      }else{
        this.formParams.rootDirectoryId="";
      }
      if(this.formParams.directoryId){
        this.formParams.directoryId=null;
      }
      this.directoryList=[];
      var paramsSpcxId={}
      // this.spcxList.forEach(methods=>{
      this.addSpcxList.forEach(methods=>{
        if(methods.spcxId==SpcxId){
            paramsSpcxId.directoryModelId=methods.directoryModelId;
        }
      });
      this.getDirectory(paramsSpcxId);
      let obj = {};
      obj = this.addSpcxList.find((item)=>{//这里的spcxList就是上面遍历的数据源
              return item.spcxId === SpcxId;//筛选出匹配数据
          });
      this.formParams.spcxName=obj.spcxName;
    },
    rootDirOnfocus(){
      if(!this.formParams.spcxId){
        this.$message({
          message: "请选择审判程序",
          type: "warning"
        });
      }
    },
    changRootDir(val){
        if(this.formParams.directoryId){
          this.formParams.directoryId=null;
        }
        this.directoryList=[];
        this.rootDirectoryList.forEach(methods=>{
            if(methods.directoryId==val){
                this.directoryList=methods.children;
                this.formParams.rootDirectoryName=methods.directoryName;
            }
        })
    },
    dirOnfocus(){
      if(!this.formParams.rootDirectoryId){
        this.$message({
          message: "请选择所属卷",
          type: "warning"
        });
      }
    },
    deptChange(obj){
      this.formParams.directoryName=obj.directoryName;
    },
    handleTableChange(){},
    //分页
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getCaseCheckInfo(this.params)
    },
    handleCurrentChange(val) {
      this.params.currentPage = val;
      // this.getAllUserList(this.params);
      this.getCaseCheckInfo(this.params)
    },
    onSearch() {
      this.getCaseCheckInfo(this.params)
    },
    //新增用户
    onAddUser(){
      this.diaTitle = "添加新规则";
      this.dialogFormVisible = true;
      var arr=this.formParams;
      this.formParams={
        caseStatus: null,
        caseTypeId:null,
        caseTypeName: null,
        directoryId: null,
        directoryName: null,
        rootDirectoryId: null,
        rootDirectoryName: null,
        spcxId: null,
        spcxName: null,
      }
      this.addSpcxList=[];
      this.rootDirectoryList=[];
      this.directoryList=[];
    },
    addResCancel() {
      this.dialogFormVisible = false;
      this.formParams.resourceId = "";
      this.formParams.resourceName = "";
      this.formParams.description = "";
    },
    save() {
      if(this.diaTitle == "编辑规则"){
        this.editCaseCheckInfo(this.formParams);
      }else{
        this.addCaseCheckInfo(this.formParams);
      }
    },
    onEditSystem(index,row){
      this.diaTitle = "编辑规则";
      this.dialogFormVisible = true;
      this.formParams=row;
      var spcxParms={
            caseTypeId:row.caseTypeId
          }
      var spcxId=row.spcxId;
      var rootDirectoryId=row.rootDirectoryId;
      this.getSpcxList(spcxParms,spcxId,rootDirectoryId); 
    },
    onDelUser(index,row){
        var delParms={
          id:row.id
        };
        this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.delMuLvRule(delParms);
            this.$message({
                type: 'success',
                message: '删除成功'
            }); 
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '删除失败'
            }); 
        });
      
      
    }
  },
  components: {Treeselect}
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
<style lang="css">
  /* .el-pagination {
  color: #fff;
} */
.el-pager li,.el-pagination button:disabled,.el-pagination .btn-next, .el-pagination .btn-prev,.el-pager li.btn-quicknext{
  background:transparent;
  color:#fff;
  border: 1px solid #4295cb;
  margin: 0 ;
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
.el-pagination__total,.el-pagination__jump,.el-select-dropdown__list li{
  color:#fff;
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
.vue-treeselect__control{
    background: transparent;
    border: 1px solid #2c69ff;
  }
.el-input__inner{
  height:40px;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #0c1f7f !important;
  color: #ffb400;
}

.el-select-dropdown__list {
    background-color: rgb(14, 50, 116);
}
.el-pager li.active+li{
  border:1px solid #4295cb;
}
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: #1e3caf;
    color: #00ffff;
}
 .el-input__inner,.vue-treeselect__control {
   background-color: transparent;
   color: #fff;
   border-color: #4295cb;
    height:40px;
 }
 .vue-treeselect__single-value{
   color:#fff;
 }
</style>
