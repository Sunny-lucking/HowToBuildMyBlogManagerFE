<template>
    <el-card class="box-card">
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>人员管理</el-breadcrumb-item>
            <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索-->
        <el-row>
            <el-col>
                <el-input placeholder="请输入内容" v-model="keyWord" class="input-with-select" style="width: 300px;margin-top: 30px" clearable @clear="getAllUsers">
                    <el-button slot="append" icon="el-icon-search" @click="onClickForGetUserList"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <!--表格-->
        <el-table
                :data="userList"
                style="width: 100%">
            <el-table-column
                    type="index"
                    prop="date"
                    label="#"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="git_name"
                    label="昵称"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="state"
                    label="用户状态">
                <template slot-scope="scope">
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="scope.row.avatar_url"
                        fit="cover"></el-image>
                </template>
            </el-table-column>
            <el-table-column
                    prop="bio"
                    label="bio">
                <template slot-scope="scope">
                    <div v-html="ellipsis(scope.row.bio)"></div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="company"
                    label="公司">
            </el-table-column>
           <el-table-column
                    prop="location"
                    label="位置">
            </el-table-column>
            <!-- <el-table-column
                    prop="state"
                    label="用户状态">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.state"
                            active-color="#13ce66"
                            @change="onClickForChangeState(scope.row._id)"
                            inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column> -->
            <el-table-column
                    prop="manicate"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="danger"  @click="onClickForDeleteUser(scope.row._id)" plain size="mini" icon="el-icon-delete" circle ></el-button> 
                    <!-- :disabled="!$store.state.authList.includes('删除用户')" -->
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[2, 4, 6, 8]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count">
        </el-pagination>
    </el-card>
</template>

<script>
    import {BASE_URL} from "../../../global/util";


    export default {
        name: "Users",
        data() {
            return {

                pageNum:1,
                pageSize:2,
                keyWord:'',
                userList:[],
                count:0,
                // 添加用户对话框
                dialogFormVisible: false,
                form: {
                    name: '',
                    email:'',
                    phone:'',
                    password:''
                },
                formLabelWidth: '120px',
                //编辑用户对话框
                editFormVisible:false,
                editForm: {
                    name: '',
                    email:'',
                    phone:'',
                    password:''
                },

                // 分配角色对话框
                roleFormVisible: false,
                roleForm: {
                    name: '',
                    currentId:-1
                },
                roles:[],
                currentAdmin:{}
            }
        },
        methods:{
            ellipsis(value) {
                if (!value) return "";
                if (value.length > 50) {
                    return value.slice(0, 25) + "...";
                }
                return value;
            },
            async onClickForSetRole(){
                this.roleFormVisible = false
                let {status,data:{msg}} = await this.$http.post('/api/admin/setRole',{_id:this.currentAdmin._id,roleId:this.roleForm.currentId})
                if (status===200){
                    alert(msg)
                } else{
                    alert('操作失败')
                }

            },
            async getCurrentAdmin(_id){
                let {data:{admin}} = await this.$http.get(`/api/admin/getOneAdmin?_id=${_id}`);
                this.currentAdmin = admin
                this.roleForm.name = admin.name
                this.roleForm.currentId = admin.roleId

            },
           
            onClickForShowRoleDialog(_id){
                this.roleFormVisible = true
                this.getCurrentAdmin(_id)
            },
            async onClickForChangeState(_id){
                let {status,data:{code,msg}} = await this.$http.post('/api/admin/changeAdminState',{_id})
                if (status===200){
                    if (code===0){
                        this.$message({
                            message: '修改状态成功',
                            type: 'success'
                        });
                    }else {
                        alert(msg)
                    }
                } else{
                    alert("操作失败")
                }
            },
            async onClickForSendEdit(){
                this.editFormVisible =false
                let {status,data:{msg,code}} = await this.$http.post(`/api/admin/editOneAdmin`,this.editForm)
                if (status===200){
                    if(code===0){
                        this.$message({
                            message: '修改管理员成功',
                            type: 'success'
                        });
                        this.getAllUsers()
                    }else {
                        alert(msg)
                    }
                }else{
                    alert('操作失败')
                }
            },
            async onClickForEditAdmin(_id){
                this.editFormVisible = true
                let {status,data:{admin,code,msg}} = await this.$http.get(`/api/admin/getOneAdmin?_id=${_id}`)
                if (status===200){
                    console.log(admin);
                    if (code===0){
                        console.log("该不会");
                        this.editForm = admin

                    }else {
                        console.log("不进来这里吗");
                        alert(msg)
                    }
                } else{
                    alert('操作失败，请检查网络问题')
                }
            },
            onClickForDeleteUser(_id){
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    debugger
                    let {status,data:{code,msg}} = await this.$http.post(`/api/user/delete`,{_id})
                    if(status===200){
                        if(code===0){
                            this.$message({
                                message: msg,
                                type: 'success'
                            });
                            this.getAllUsers()
                        }else{
                            alert(msg)
                        }
                    }else{
                        alert("操作失败")
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },
           
            onClickForGetUserList(){
                this.getAllUsers()
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.getAllUsers()
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
               this.pageNum = val;
               this.getAllUsers();
            },
            async getAllUsers(){
               let {status,data:{code,msg,userList,count}} = await this.$http.post(`/api/user/getAllAuthor`,{
                   keyWord:this.keyWord,
                   pageNum:this.pageNum,
                   pageSize:this.pageSize,
               })
               if (status===200){
                   if (code===0){
                       this.userList = userList;
                       this.count = count
                   }else {
                       alert(msg)
                   }
               }else {
                   alert("获取数据失败")
               }
           }
        },
        created(){
            this.getAllUsers()
        },
        filters: {
            //当渲染的文字超出30字后显示省略号
            
        }
    }
</script>

<style scoped lang="scss">

</style>
