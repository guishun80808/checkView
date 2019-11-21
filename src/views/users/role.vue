<template>
 <div>
    <el-row :gutter="10" style="margin:0">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="header" style="padding:0">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                  <i></i>
                  <span>角色管理</span>
              </div>
              <div class="text item">
                <div class="grid-content bg-purple">
                    <el-button type="primary" icon="el-icon-plus"   @click="onAddUser">新增</el-button>
                </div>
              </div>
            </el-card>
        </el-col>
    </el-row>
     <!-- 角色列表展示 -->
      <el-row :gutter="10" style="margin:0" class="userTableRow">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="grid-content bg-purple-light content">
            <!-- highlight-current-row -->
            <el-table
              ref="singleTable"
              :data="allRoleList"
              stripe
              @current-change="handleCurrentChange"
              style="width: 100%;text-align: center;"
              height="720"
            >
              <el-table-column type="index" width="50" align="center"></el-table-column>
              <el-table-column property="roleName" width label="角色名称" align="center"></el-table-column>
              <el-table-column property="roleDesc" width label="角色描述" align="center"></el-table-column>
              <el-table-column property width="" label="角色权限" align="center">
                <!-- <template slot-scope="scope">
                  <div >
                    <span v-for="(item,key) in scope.row.menuNames" data-key-id=key>{{item+"、"}}</span>
                  </div>
                </template> -->
                <template slot-scope="scope">
                <div
                  v-html="getRolePermiss(scope.row)"
                  @click="delComment($event)"
                  style="text-align:center;white-space:normal;height:auto;"
                  class="datagrid-cell datagrid-cell-c3-cbrList"
                ></div>
              </template>
              </el-table-column>
              <el-table-column property="rolePermissionDesc" label="角色权限描述" align="center"></el-table-column>
              <el-table-column label="操作" prop align="center" width="285">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="onEditUser(scope.$index, scope.row)"
                  >编辑</el-button>
                  <!-- v-auth="['user:update']" -->
                  <el-button
                    size="mini"
                    type="danger"
                    plain
                    @click="onDelUser(scope.$index, scope.row)"
                  >删除</el-button>
                  <!-- v-auth="['user:delete']" -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
     <!-- addRes -->
      <!-- <el-dialog :title="diaTitle" :visible.sync="dialogFormVisible" width="25%"> -->
      <el-dialog :title="diaTitle" :visible.sync="dialogFormVisible" width>
        <el-form
          ref="formParams"
          :model="formParams"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称：">
            <el-input v-model="formParams.roleName"  placeholder="请输入" class="search_input"></el-input>
          </el-form-item>
          <el-form-item label="角色权限：">
            <el-select v-model="formParams.menuIds" multiple placeholder="请选择">
                  <el-option v-for="item in allMenus" :key="item.menuId" :label="item.menuName" :value="item.menuId" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色描述：">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="formParams.roleDesc"></el-input>
          </el-form-item>
          <el-form-item label="权限描述：">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="formParams.rolePermissionDesc"></el-input>
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
import { queryAllCourtList, getRoleList } from "@/api/common";
import { queryAllMenus,addRole,editRole,delRole} from "@/api/role";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  props: {},
  data() {
    return {
      // isDisabled:false,
      addCourtRoomName:"",
      allCourtList: [],
      allCourtListTree: [],
      CourtListTree_value:null,
      allRoleList: [],
      allUserList:[],
      allMenus:[],
      court_roomList: [],
      addCourtRoomList:[],
      searchParms: {
        courtId:"",
        courtRoomId:"",
        currentPage: 1,
        pageSize: 30
      },
      params: {},
      currentPage1: 1,
      total: 0,
      dialogFormVisible: false,
      diaTitle: "",
      formParams: {
        "roleDesc": null,
        "menuNames": null,
        "menuIds": [],
        "rolePermissionDesc": "",
        "roleName": ""
      },
      rules: {
        resourceName: [
          { required: true, message: "请输入资源名称", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入资源类型", trigger: "blur" }
        ],
        resource: [
          { required: true, message: "请选择资源", trigger: "change" }
        ],
        role: [{ required: true, message: "请选择角色", trigger: "change" }]
      },
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.changeData();
    this.getAllCourtList();
    // this.getUserList();
    this.getRoleList();
    this.queryAllMenus()
    this.$bus.$emit("on-click", "/users");
  },
  watch: {},
   methods: {
     changeData() {
      this.$emit("changeData", "/users/role");
    },
    normalizer(node) {
      //去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.courtId,
        label: node.courtName,
        children: node.children
      };
    },
    getRolePermiss(cellValue) {
      var deptList=cellValue.menuNames
        let str = "";
         str=deptList.join('，');
        return str;
    },

    async getRoleList() {
        getRoleList()
        .then(response => {
          this.allRoleList = response.data;
          // this.total = response.total;
        })
        .catch(() => {
        
        });
    },
    async queryAllMenus() {
        queryAllMenus()
        .then(response => {
          this.allMenus = response.data;
        })
        .catch(() => {
        
        });
    },

    //所有法院列表
    async getAllCourtList() {
      try {
        const { data } = await queryAllCourtList({ courtId: 101 });
        var courtArr = [];
        var dataArr = [];
        this.allCourtListTree.push(data);
        // console.log(this.allCourtListTree)
        dataArr.push(data);
        this.eachCourt(dataArr, courtArr);

        this.allCourtList = courtArr;
      } catch {
        this.allCourtList = [];
      }
    },
    
    //将树形结构法院转换成列表形式
    eachCourt(data, arr) {
      data.forEach(method => {
        var objCourt = {};
        objCourt.courtId = method.courtId;
        objCourt.courtName = method.courtName;
        arr.push(objCourt);

        if (method.children.length > 0) {
          this.eachCourt(method.children, arr);
        } else {
          return;
        }
      });
    },
    updateValue(state, value) {
      // state.value = value
      this.allCourtListTree=value
    },
    // onSearch() {
    //   // this.getAllUserList(this.searchParms);
    //   this.getUserList();
    // },
    //新增用户
    onAddUser(){
        this.diaTitle = "新增角色信息";
        this.dialogFormVisible = true;
        this.formParams= {
          "roleDesc": null,
          "menuNames": null,
          "menuIds": [],
          "rolePermissionDesc": "",
          "roleName": "",
          // "createUserId": 1
        }
    },
    addResCancel() {
      this.dialogFormVisible = false;
      this.formParams.resourceId = "";
      this.formParams.resourceName = "";
      this.formParams.description = "";
    },
    save() {
      // this.formParams.roleIds=this.formParams.roleIdsArr.join(',');
      this.dialogFormVisible = false;
      if (this.diaTitle == "新增角色信息") {
        this.addRole(this.formParams);
      } else if (this.diaTitle == "编辑用户信息") {
        this.editRole(this.formParams);
      }
    },
    // 新增用户接口
     async addRole(formParams) {
      try {
        const { data } = await addRole(formParams);
        // this.getUserList();
        this.getRoleList();
        this.$message({
          message: "新增成功",
          type: "success"
        });
      } catch {
      }
    },
    //编辑用户
    onEditUser(index,row){
        this.diaTitle = "编辑用户信息";
        // this.isDisabled=true;
        console.log(row);
        this.dialogFormVisible = true;
        this.formParams.roleDesc=row.roleDesc;
        this.formParams.menuIds=row.menuIds;
        this.formParams.menuNames=row.menuNames;
        this.formParams.rolePermissionDesc=row.rolePermissionDesc;
        this.formParams.roleName=row.roleName;
        this.formParams.roleId=row.roleId;
       
        // var roleIdsArr= row.roleIds.split(",");
        // var formParamsRoleIdsArr=this.formParams.roleIdsArr
        // roleIdsArr.forEach(method=>{
        //       formParamsRoleIdsArr.push(parseInt(method));
        // })
    },
    ///编辑用户接口
     async editRole(formParams) {
      try {
        const { data } = await editRole(formParams);
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        this.getRoleList();
      } catch {
       
      }
    },
    //删除用户
    onDelUser(key,row){
        var delParms={};
        delParms.roleId=row.roleId;
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.delRole(delParms);
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            }); 
        });
    },
     async delRole(delParms) {
      try {
        const { data } = await delRole(delParms);
        this.getRoleList();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      } catch {}
    },
    handleCurrentChange(val) {
      // this.currentRow = val;
      // console.log(this.currentRow);
    },
  },
  components: {}
};
</script>

<style scoped lang="scss">
.header{
  margin-top:-25px;
}

.el-card{
  background: rgb(8, 45, 111);
  border: none;
  color: #fff;
}
.clearfix i{
    width: 4px;
    height: 20px;
    background-color: #02a3ff;
    display: inline-block;
    margin-right: 15px;
    position: absolute;
    top: 21px;
    left: 20px;
}
.clearfix span{
    margin-left: 20px;
}
.userTableRow{
  padding: 20px 15px;
  
}
.el-table--border, .el-table--group{
  border: none;
}
.el-table, .el-table__expanded-cell{
  // background: transparent;
  background: rgb(17, 62, 140);
  color:#fff;
}
.el-pagination__total,.el-pagination__jump,.el-select-dropdown__list li{
  color:#fff;
}
</style>
<style lang="css">
.el-card__header{
    border: none;
    font-size: 20px;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #0c1f7f !important;
  color: #ffb400;
}
.el-input__inner {
   background-color: transparent;
   color: #fff;
   border-color: #4295cb;
   height:40px;
 }
 .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: #1e3caf;
    color: #00ffff;
}
.el-select-dropdown__list {
    background-color: rgb(14, 50, 116);
}
.el-textarea__inner{
  background:  transparent;
  color: #fff;
  border-color: #4295cb;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover{
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected{
   /* background: rgb(10, 35, 103) */
}
.el-table::before{
   height:0px;
 }
</style>
