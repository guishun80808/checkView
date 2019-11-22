<template>
  <div id="hierarchy">
    <el-row
      :gutter="10"
      style="margin:0;background: rgb(8,45,111);padding-bottom:20px;padding:20px"
    >
      <p class="r_header_title">
        <span class="y_line"></span>系统维护
      </p>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple">
          <el-form :inline="true" :model="params" class="demo-form-inline">
            <el-form-item label="配置名称：">
              <el-input v-model="params.propertyName" placeholder="请输入" class="search_input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" style="margin-left:30px;" @click="onSearch" v-preventReClick="1000">搜索</el-button>
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
              @current-change="tableChange"
              style="width: 100%;text-align: center;"
              height="593"
            >
              <el-table-column type="index" width="50" align="center"></el-table-column>
              <el-table-column property="propertyName" width label="配置名称" align="center"></el-table-column>
              <el-table-column property="propertyValue" width label="配置值" align="center"></el-table-column>
              <el-table-column property="propertyDesc" width="" label="配置描述" align="center"></el-table-column>
              <el-table-column property="updateFlag" label="配置修改" align="center">
                <template slot-scope="scope">
                <div
                  v-html="getUpdateFlagName(scope.row)"
                  style="text-align:center;white-space:normal;height:auto;"
                  class="datagrid-cell datagrid-cell-c3-cbrList"
                ></div>
              </template>
              </el-table-column>
              <el-table-column label="创建时间" width="180" align="center">
                <!-- <template slot-scope="scope">{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</template> -->
                <template slot-scope="scope">
                  <div
                    v-html="getCreateTime(scope.row)"
                    style="text-align:center;white-space:normal;height:auto;"
                    class="datagrid-cell datagrid-cell-c3-cbrList"
                  ></div>
                </template>
              </el-table-column>
              <el-table-column property="userName" width="80" label="创建人" align="center"></el-table-column>
              <el-table-column label="操作" prop align="center" width="285">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    :disabled="scope.row.updateFlag==1"
                    @click="onEditCofig(scope.$index, scope.row)"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    plain
                    @click="onDelCofig(scope.$index, scope.row)"
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
          <el-form-item label="配置名称：">
            <el-input v-model="formParams.propertyName"  placeholder="请输入" class="search_input"></el-input>
          </el-form-item>
          <el-form-item label="配置修改：">
            <el-select v-model="formParams.updateFlag"  placeholder="请选择">
                  <el-option v-for="item in updateFlagList" :key="item.updateFlag" :label="item.updateFlagName" :value="item.updateFlag" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配置描述：">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="formParams.propertyDesc"></el-input>
          </el-form-item>
          <el-form-item label="配置值：">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="formParams.propertyValue"></el-input>
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
import{getCaseType ,getSpcxList,getCaseCheckInfo}from"@/api/caseType"
import{getPropList,addProp,delCofig,editProp}from"@/api/config"
import {parseTime} from "@/utils";
export default {
  data() {
    return {
      total:0,
      currentPage1: 1,
      caseTypeList: [],
      spcxList: [],
      rootDirectoryList:[],
      updateFlagList:[
        {updateFlag:0,updateFlagName:"能修改"},
        {updateFlag:1,updateFlagName:"不能修改"}
      ],
      CaseCheckInfo:[],
      params: {
        currentPage: 1,
        pageSize: 10,
        propertyName: null
       
      },
      dialogFormVisible:false,
      diaTitle: "",
      formParams: {
        createUserId: null,
        propertyDesc: null,
        propertyName: null,
        propertyValue: null,
        updateFlag: null,
        updateFlagName: null
      },
    };
  },
  computed: {...mapGetters(["userInfo"]),},
  created() {
    // this.getAllArea();
    // this.getCaseStatistics();
  },
  mounted() {
    this.changeData();
    this.getPropList(this.params);
    console.log(this.userInfo)
    this.formParams.createUserId=this.userInfo.userId;
    this.$bus.$emit("on-click", "/configs");
  },
  watch: {},
  methods: {
    changeData() {
      this.$emit("changeData", "/configs/config");
    },
    async getPropList(parms) {
          getPropList(parms)
          .then(response => {
            this.CaseCheckInfo = response.data;
            this.total = response.total;
          })
          .catch((err) => {
              console.log(err);
              this.CaseCheckInfo=[];
          });
    },
   
    async addProp(formParams) {
      try {
        const { data } = await addProp(formParams);
        this.getPropList(this.params);
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.dialogFormVisible = false;
      } catch (err) {
        console.log(err);
        this.$message({
          message: "新增失败",
          type: "erro"
        });
      }
    },
    async delCofig(formParams) {
      try {
        const { data } = await delCofig(formParams);
        this.getPropList(this.params);
        // this.dialogFormVisible = false;
      } catch (err) {
        console.log(err);
        this.$message({
          message: "删除失败",
          type: "erro"
        });
      }
    },
    async editProp(formParams) {
      try {
        const { data } = await editProp(formParams);
        this.getPropList(this.params);
        this.dialogFormVisible = false;
        this.$message({
          message: "编辑成功",
          type: "success"
        });
      } catch (err) {
        console.log(err);
        this.$message({
          message: "编辑失败",
          type: "erro"
        });
      }
    },
    async getSpcxList(parms) {
      try {
        const { data } = await getSpcxList(parms);
        this.spcxList = data;
        console.log(this.spcxList);
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询审判程序失败",
          type: "warning"
        });
      }
    },
    getUpdateFlagName(scope){
      var str="";
      if(scope.updateFlag==0){
        str="能修改"
      }else{
        str="不能修改"
      }
      return str;
    },
    tableChange(){},
    //分页
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getPropList(this.params);
    },
    handleCurrentChange(val) {
      this.params.currentPage = val;
      this.getPropList(this.params);
    },
    onSearch() {
      this.getPropList(this.params);
    },
    //新增配置
    onAddUser(){
        this.diaTitle = "新增配置";
        this.dialogFormVisible = true;
        this.formParams={
        createUserId: this.userInfo.userId,
        propertyDesc: null,
        propertyName: null,
        propertyValue: null,
        updateFlag: null,
        updateFlagName: null
      }
      this
    },
    addResCancel() {
      this.dialogFormVisible = false;
    },
    save() {
      if(!this.formParams.propertyName){
          this.$message({
            message: "配置名称不能为空",
            type: "warning"
          });
          return;
      }
      if(this.formParams.updateFlag===null){
          this.$message({
            message: "配置修改必选",
            type: "warning"
          });
          return;
      }
      if(!this.formParams.propertyDesc){
          this.$message({
            message: "配置描述必填",
            type: "warning"
          });
          return;
      }
      if(!this.formParams.propertyValue){
          this.$message({
            message: "配置值不能为空",
            type: "warning"
          });
          return;
      }
      if(this.diaTitle=="编辑配置"){
        // this.formParams.createTime=(new Date()).getTime();
        this.editProp(this.formParams)
      }else{
        this.addProp(this.formParams);
      }
    },
    onEditCofig(inde,row){
        // console.log(row);
        this.diaTitle = "编辑配置";
        this.dialogFormVisible = true;
        this.formParams.propertyId=row.propertyId
        this.formParams.createUserId=row.createUserId
        this.formParams.propertyDesc=row.propertyDesc
        this.formParams.propertyName=row.propertyName
        this.formParams.propertyValue=row.propertyValue
        this.formParams.updateFlag=row.updateFlag;
        if(row.updateFlag==0){
          this.formParams.updateFlagName=="能修改"
        }else{
          this.formParams.updateFlagName=="不可修改"
        };
        

    },
    onDelCofig(inde,row){
      var delParms={
        propertyId:row.propertyId
      }
      this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // this.delUser(delParms);
            this.delCofig(delParms);
            this.$message({
                type: 'success',
                message: '删除成功'
            }); 
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            }); 
        });
    },
    getCreateTime(scope){
      var time=parseTime(scope.createTime, "{y}-{m}-{d}")
      return time;
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
<style lang="css">
.el-select-dropdown__list{
  background-color: rgb(14, 50, 116);
}
.el-select-dropdown__list li{
  color: #fff;
}
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
    background-color: #1e3caf;
    color: #00ffff;
}
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
.el-pager li.active+li{
  border:1px solid #4295cb;
}
.vue-treeselect__control{
    background: transparent;
    border: 1px solid #2c69ff;
  }
.el-input__inner{
  height:40px;
  background: transparent;
  border-color: #4295cb;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #0c1f7f !important;
  color: #ffb400;
}
.el-textarea .el-textarea__inner{
  background: transparent;
  border: 1px solid #2c69ff;
  color: #fff;
}
.pageRow{
  /* margin-top:20px; */
  position: absolute;
  bottom: 30px;
}
</style>
