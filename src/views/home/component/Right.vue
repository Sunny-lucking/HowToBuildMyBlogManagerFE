<template>
    <el-card class="box-card">
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--添加权限按钮-->
        <el-row style="margin-top: 20px">
            <el-col>
                <el-button type="success" @click="dialogFormVisible = true">添加权限</el-button>
            </el-col>
        </el-row>
        <!--表格-->
        <el-table
                :data="rightsTable"
                border
                height="400px"
                style="width: 100%;margin-top: 20px;">
            <el-table-column
                    type="index"
                    label="#"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="authName"
                    label="权限名称"
                    width="180">
            </el-table-column>
            <!-- <el-table-column
                    prop="path"
                    label="路径">
            </el-table-column> -->
            <el-table-column
                    prop="level"
                    label="层级">
            </el-table-column>
            <el-table-column
                    prop="id"
                    label="id">
            </el-table-column>
            <el-table-column
                    prop="pId"
                    label="pId">
            </el-table-column>
             <el-table-column
                    prop="manicate"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="onClickForEditRight(scope.row._id)" plain size="mini" icon="el-icon-edit" circle></el-button>
                    <el-button type="danger"  @click="onClickForDeleteRight(scope.row._id)" plain size="mini" icon="el-icon-delete" circle></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--添加权限对话框-->
        <el-dialog title="添加权限" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="权限名称" :label-width="formLabelWidth">
                    <el-input v-model="form.authName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限层级" :label-width="formLabelWidth">
                    <el-input v-model="form.level" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限ID" :label-width="formLabelWidth">
                    <el-input v-model="form.id" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="权限父级ID" :label-width="formLabelWidth">
                    <el-input v-model="form.pId" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onClickForAddRight">确 定</el-button>
            </div>
        </el-dialog>

        <!--编辑权限对话框-->
        <el-dialog title="编辑权限" :visible.sync="editFormVisible">
            <el-form :model="editForm">
                 <el-form-item label="权限名称" :label-width="formLabelWidth">
                    <el-input v-model="editForm.authName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限层级" :label-width="formLabelWidth">
                    <el-input v-model="editForm.level" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限ID" :label-width="formLabelWidth">
                    <el-input v-model="editForm.id" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="权限父级ID" :label-width="formLabelWidth">
                    <el-input v-model="editForm.pId" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取 消</el-button>
                <el-button type="primary"  @click="onClickForSendEdit" >确 定</el-button>
                <!-- :disabled="!$store.state.authList.includes('编辑角色')" -->
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
    import {BASE_URL} from "../../../global/util";


    export default {
        name: "Right",
        data(){
            return{
                rightsTable:[],

                // 添加用户对话框
                dialogFormVisible: false,
                formLabelWidth: '120px',
                form: {
                    authName: '',
                    level:'',
                    pId:'',
                    id:''
                },

                 // 编辑角色对话框
                editFormVisible:false,
                editForm: {
                   authName: '',
                    level:'',
                    pId:'',
                    id:''
                },
            }
        },
        methods:{
            async getAllRights(){
                let {status,data:{rights}} = await this.$http.get('/api/right/getRight')
                this.rightsTable = rights

            },
            async onClickForEditRight(_id){
                this.editFormVisible = true
                let {status,data:{right,code,msg}} = await this.$http.get(`/api/right/getOneRight?_id=${_id}`)
                if (status===200){
                    if (code===0){
                        this.editForm = right
                    }else {
                        console.log("不进来这里吗");
                        alert(msg)
                    }
                } else{
                    alert('操作失败，请检查网络问题')
                }
            },
            async onClickForAddRight(){
                let {data:{code,msg}} = await this.$http.post('/api/right/addRight',this.form)
                if (code===0){
                    this.$message({
                        message: '创建成功',
                        type: 'success'
                    });
                    this.getAllRights();
                    this.form={}
                    this.dialogFormVisible = false;
                }else{
                    alert(msg)
                }
            },
            async onClickForSendEdit(){
                let {status,data:{code,msg}}  = await this.$http.post('/api/right/editOneRight',this.editForm)
                this.editFormVisible =false
                if (status===200){
                    if(code===0){
                        this.$message({
                            message: '修改角色成功',
                            type: 'success'
                        });
                        this.getAllRights()
                    }else {
                        alert(msg)
                    }
                }else{
                    alert('操作失败')
                }
            },
            async onClickForDeleteRight(_id){
                this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let {status,data:{code,msg}} = await this.$http.post(`/api/right/deleteRight`,{_id})
                    if(status===200){
                        if(code===0){
                            this.$message({
                                message: '删除权限成功',
                                type: 'success'
                            });
                            this.getAllRights()
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
        },
        mounted(){
                this.getAllRights();
        }
    }
</script>

<style scoped lang="scss">
    .box-card{
        background-color:rgba(244,251,251,0.47);
    }

</style>
<style>
    .el-breadcrumb__inner{
        color: black!important;
    }
    .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
        color: darkgreen!important;
    }
</style>
