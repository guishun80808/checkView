<template>
<div id="user">
    <el-row :gutter="10" style="margin:0">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="header" style="padding:0">
            <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <i></i>
                <span>用户管理</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>
            <div class="text item">
            <div class="grid-content bg-purple">
                <el-form :inline="true" :model="searchParms" class="demo-form-inline">
                   <el-form-item label="归属法院：">
                      <el-select
                        v-model="searchParms.courtId"
                        clearable
                        placeholder="请选择"
                        class="search_select"
                        @change="courtChange"
                      >
                        <el-option
                          v-for="item in allCourtList"
                          :key="item.courtId"
                          :label="item.courtName"
                          :value="item.courtId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="庭室名称：">
                      <el-select
                        v-model="searchParms.courtRoomId"
                        clearable
                        placeholder="请选择"
                        @change="courtRoomChange"
                      >
                        <el-option
                          v-for="item in court_roomList"
                          :key="item.courtRoomId"
                          :label="item.courtRoomName"
                          :value="item.courtRoomId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="角色：">
                        <el-select
                        v-model="searchParms.roleIds"
                        clearable
                        placeholder="请选择"
                        class="search_select"
                        >
                        <el-option
                            v-for="item in allRoleList"
                            :key="item.roleId"
                            :label="item.roleName"
                            :value="item.roleId"
                        ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户名：">
                      <el-input v-model="searchParms.userName" placeholder="请输入" class="search_input"></el-input>
                    </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearch" v-preventReClick="1000">搜索</el-button>
                    <el-button type="primary" icon="el-icon-plus"   @click="onAddUser">新增</el-button>
                     <!-- v-auth="['user:add']" -->
                </el-form-item>
                </el-form>
            </div>
            </div>
            </el-card>
        </el-col>
    </el-row>
     <!-- 用户列表展示 -->
      <el-row :gutter="10" style="margin:0" class="userTableRow">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="grid-content bg-purple-light content" >
            <!-- highlight-current-row -->
            <el-table
              ref="singleTable"
              :data="allUserList"
              stripe
              @current-change="handleCurrentChange"
              style="width: 100%;text-align: center;"
              height="593"
            >
              <el-table-column type="index" width="50" align="center"></el-table-column>
              <el-table-column property="userName" width label="用户名" align="center"></el-table-column>
              <el-table-column property="userFullName" width label="姓名" align="center"></el-table-column>
              <el-table-column property="courtName" width="" label="法院" align="center"></el-table-column>
              <el-table-column property="courtRoomName" label="庭室" align="center"></el-table-column>
              <el-table-column property="roleNames" width="" label="角色名" align="center"></el-table-column>

              <el-table-column property="lastLoginIp" label="上次登录IP" align="center"></el-table-column>
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
      <!-- 分页 -->
      <el-row class="pageRow">
        <div class="block">
          <!-- <span class="demonstration">完整功能</span> -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChangePage"
            :current-page="currentPage1"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="30"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
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
          <!-- <el-form-item label="" prop="resourceName">
            <el-input v-model="formParams.resourceName" placeholder="请输入" class="search_input"></el-input>
          </el-form-item> -->
          <el-form-item label="归属法院：">
            <treeselect
              class="content"
              placeholder="请选择"
              :options="allCourtListTree"
              :show-count="true"
              v-model="formParams.courtId"
              :normalizer="normalizer"
               @select="dialogCourtChange"
               :always-open="alwaysOpen"
              />
          </el-form-item>
          <el-form-item label="庭室名称：" >
            <!-- <el-input v-model="formParams.description" placeholder="请输入" class="search_input"></el-input> -->
            <el-select v-model="formParams.courtRoomId" placeholder="请选择">
                  <el-option
                    v-for="item in addCourtRoomList"
                    :key="item.courtRoomId"
                    :label="item.courtRoomName"
                    :value="item.courtRoomId">
                  </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名：">
            <el-input v-model="formParams.userName" :disabled="isDisabled" placeholder="请输入" class="search_input"></el-input>
          </el-form-item>
          <el-form-item label="用户密码：" v-if="this.diaTitle=='编辑用户信息'">
            <el-input v-model="formParams.userPassword" type="password" placeholder="请输入" class="search_input"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input v-model="formParams.userFullName" placeholder="请输入" class="search_input"></el-input>
          </el-form-item>
          <el-form-item label="角色：">
            <el-select v-model="formParams.roleIdsArr" multiple placeholder="请选择">
                  <el-option
                        v-for="item in allRoleList"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId"
                    ></el-option>
            </el-select>
            <!-- <el-input v-model="formParams.roleIds" placeholder="请输入" class="search_input"></el-input> -->
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
import { queryAllCourtList, getCourtRoomById,getUserList,getRoleList ,addUser,editUser,delUser} from "@/api/common";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: {},
  data() {
    return {
      alwaysOpen: false,
      isDisabled:false,
      addCourtRoomName:"",
      allCourtList: [],
      allCourtListTree: [],
      CourtListTree_value:null,
      allRoleList: [],
      allUserList:[],
      court_roomList: [],
      addCourtRoomList:[],
      searchParms: {
        courtId:"",
        courtRoomId:"",
        userName:"",
        currentPage: 1,
        pageSize: 30
      },
      params: {},
      currentPage1: 1,
      total: 0,
      dialogFormVisible: false,
      diaTitle: "",
      formParams: {
        "courtId": null,
        "courtRoomId": null,
        "roleIdsArr": [],
        "userFullName": "",
        "userName": ""
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
  computed: {
    // ...mapGetters(["allRoleList", "allCourtList"])
    ...mapGetters(["userInfo"]),
  },
  created() {},
  components: {Treeselect },
  mounted() {
    var courtIdParms={
        courtId: this.userInfo.courtId
    }
    this.searchParms.courtId=this.userInfo.courtId;
    this.searchParms.courtRoomId=this.userInfo.courtRoomId;
    this.changeData();
    this.getAllCourtList(courtIdParms);
    this.getCourtRoomById(courtIdParms)
    this.getUserList();
    this.getRoleList();
    this.$bus.$emit("on-click", "/users");
  },
  watch: {},
  methods: {
    changeData() {
      this.$emit("changeData", "/users/user");
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
    async getRoleList() {
        getRoleList()
        .then(response => {
          this.allRoleList = response.data;
          // this.total = response.total;
        })
        .catch(() => {
        });
    },
    async getUserList() {
        getUserList(this.searchParms)
        .then(response => {
          this.allUserList = response.data;
          this.total = response.total;
        })
        .catch(() => {
          this.allUserList=[];
          // this.$message({
          //   message: "没有查询到该用户",
          //   type: "error"
          // });
        });
    },
    //所有法院列表
    async getAllCourtList(courtId) {
      try {
        const { data } = await queryAllCourtList(courtId);
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
    //根据法院ID查询庭室
    async getCourtRoomById(params) {
      try {
        const { data } = await getCourtRoomById(params);
        // this.allCourtList = data;
        if(params.courtName){
          this.addCourtRoomList=data;

        }else{
            this.court_roomList = data;
        }
      } catch {
        this.court_roomList = [];
        this.$message({
          message: "当前法院无庭室",
          type: "warning"
        });
      }
    },
    dialogCourtChange(val) {
        var paramsCourtId={
          courtId:val.courtId,
          courtName:val.courtName
        };
        this.formParams.courtRoomId="";

        this.getCourtRoomById(paramsCourtId)

    },
    updateValue(state, value) {
      // state.value = value
      this.allCourtListTree=value
    },
    onSearch() {
      // this.getAllUserList(this.searchParms);
      this.getUserList();
    },
    //新增用户
    onAddUser(){
        this.diaTitle = "新增用户信息";
        this.isDisabled=false;
        this.dialogFormVisible = true;
        this.formParams.courtId=null;
        this.formParams.courtRoomId=null;
        this.addCourtRoomList=[];
        this.formParams.roleIdsArr=[];
        this.formParams.userName=null;
        this.formParams.userFullName=null;
    },
    addResCancel() {
      this.dialogFormVisible = false;
      this.formParams.resourceId = "";
      this.formParams.resourceName = "";
      this.formParams.description = "";
    },
    save() {
      this.formParams.roleIds=this.formParams.roleIdsArr.join(',');
      this.dialogFormVisible = false;
      if (this.diaTitle == "新增用户信息") {
        this.addUser(this.formParams);
      } else if (this.diaTitle == "编辑用户信息") {
        this.editUser(this.formParams);
      }
    },
    // 新增用户接口
     async addUser(formParams) {
      try {
        const { data } = await addUser(formParams);
        this.getUserList();
        this.$message({
          message: "新增成功",
          type: "success"
        });

      } catch {
        this.allCourtList = [];
      }
    },
    //编辑用户
    onEditUser(index,row){
        this.diaTitle = "编辑用户信息";
        this.isDisabled=true;
        this.dialogFormVisible = true;
        this.formParams.roleIdsArr=[];
        this.formParams.userId=row.userId;

        this.formParams.courtId=row.courtId;
        this.formParams.courtRoomId=row.courtRoomId;
        this.formParams.userName=row.userName;
        this.formParams.userFullName=row.userFullName;

        this.params.courtId = row.courtId;
        this.params.courtName = row.courtName;
        this.getCourtRoomById(this.params);
        if(row.roleIds){
            var roleIdsArr= row.roleIds.split(",");
            var formParamsRoleIdsArr=this.formParams.roleIdsArr
            roleIdsArr.forEach(method=>{
                  formParamsRoleIdsArr.push(parseInt(method));
            })
        }else{
          this.formParams.roleIdsArr=[];
        }
        
    },
    ///编辑用户接口
     async editUser(formParams) {
      try {
        const { data } = await editUser(formParams);
        this.getUserList();
        this.$message({
          message: "编辑成功",
          type: "success"
        });

      } catch {
        this.allCourtList = [];
      }
    },
    //删除用户
    onDelUser(key,row){
        var delParms={};
        delParms.userId=row.userId;
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
        }).then(() => {
            this.delUser(delParms);
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            }); 
        });
    },
     async delUser(delParms) {
      try {
        const { data } = await delUser(delParms);
          this.getUserList();

        this.$message({
          message: "删除成功",
          type: "success"
        });
      } catch {}
    },
    courtChange(val) {
      this.params.courtId = val;
      this.searchParms.courtId = val;
      this.searchParms.courtRoomId = "";
      //原始方法调用：根据法院id查询庭室
      // getCourtRoomById(this.addForm).then(response => {
      //         console.log(response);
      // });
      // let obj = {};
      // obj = this.allCourtList.find((item)=>{//这里的userList就是上面遍历的数据源
      //     return item.court_id === val;//筛选出匹配数据
      // });
      if (val) {
        this.getCourtRoomById(this.params);
      } else {
        this.court_roomList = [];
      }
    },
    courtRoomChange(val) {
      //   this.searchParms.courtRoomId = val;
      //   let obj = {};
      //   obj = this.court_roomList.find(item => {
      //     return item.courtRoomId === val;
      //   });
      // //   this.addForm.court_room_id_text = obj.court_room_name;
      //   this.searchParms.courtRoomName = obj.courtRoomName;
    },
    handleCurrentChange(val) {},
    //分页
    handleSizeChange(val) {
      this.searchParms.pageSize = val;
      this.getUserList(this.searchParms)
    },
    handleCurrentChangePage(val) {
      this.searchParms.currentPage = val;
      this.getUserList(this.searchParms)
    },
  },
  
};
</script>

<style scoped lang="scss">
#user{
  background: #061b54;

}
.el-table, .el-table__expanded-cell{
  // background: transparent;
  background: rgb(17, 62, 140);
  color:#fff;
}

// .el-table--striped .el-table__body tr.el-table__row--striped td
.userTableRow{
  padding: 20px 15px;
  
}
.el-table--border, .el-table--group{
  border: none;
}
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

</style>
<style lang="css">
  .app-main{
    background: #061b54;
  }
  .el-card__header{
    border: none;
    font-size: 20px;
  }
  .el-table thead{
    background: rgb(17, 62, 140);
    color:#fff;
  }
  .el-table th, .el-table tr{
    /* background: transparent; */
  }
  .has-gutter tr, .has-gutter th{
    background: rgb(10, 35, 103)
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: rgb(8, 48, 118);
}
.el-table td, .el-table th.is-leaf{
  border: none;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #0c1f7f !important;
  color: #ffb400;
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
.vue-treeselect__menu-container{
    background-color: rgb(14, 50, 116);
}
.el-select-dropdown__list {
    background-color: rgb(14, 50, 116);
}
.el-select-dropdown__item{
  color:#fff;
}
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: #1e3caf;
    color: #00ffff;
}
 
.el-input__inner,.vue-treeselect__control,.el-input.is-disabled {
   background-color: transparent;
   color: #fff;
   border-color: #4295cb;
    height:40px;
 }
 .vue-treeselect__single-value{
   color:#fff;
 }
 .el-table::before{
   /* height:0px; */
 }
.pageRow{
  /* margin-top:10px; */
    position: absolute;
    bottom: 30px;
}
.vue-treeselect__menu,.vue-treeselect__option--highlight{
  background-color: rgb(14, 50, 116);
  color: #fff;
}
.vue-treeselect--single .vue-treeselect__option--selected{
  background: #113e8c;
  color: #ffb400;
}
.vue-treeselect--single .vue-treeselect__option--selected:hover{
  background: #0c1f7f
}


</style>
