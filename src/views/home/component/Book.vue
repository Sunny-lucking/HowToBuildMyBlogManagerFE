<template>
    <el-card class="box-card">
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>资料管理</el-breadcrumb-item>
            <el-breadcrumb-item>资料列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!--表格-->
        <el-table
                :data="bookList"
                height="450"
                style="width: 100%">
            <el-table-column
                    type="index"
                    prop="date"
                    label="#"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="fileTitle"
                    label="资料名称">
            </el-table-column>
            <el-table-column
                    prop="fileDesc"
                    label="资料描述">
            </el-table-column>
            <el-table-column
                    prop="fileCoverUrl"
                    label="封面">
                <template slot-scope="scope">
                    <div style="height: 100px;position: relative;margin-top: 20px" class="image-wrapper">
                        <img
                          :src="formUrl(scope.row.fileCoverUrl)" alt="" style="width: 100%" >
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="manicate"
                    label="删除">
                <template slot-scope="scope">
                    <el-button type="danger"  @click="onClickForDeleteBook(scope.row._id)" plain size="mini" icon="el-icon-delete" circle :disabled="!$store.state.authList.includes('删除资料')"></el-button>
                </template>
            </el-table-column>
        </el-table>

    </el-card>
</template>

<script>
    import {BASE_URL} from "../../../global/util";
    import moment from "moment"
    export default {
        name: "Banner",
        data(){
            return {
                bookList:[],
                // 添加资料
                dialogFormVisible:false,
                formLabelWidth: '120px',
            }
        },
        methods:{
            onClickForDeleteBook(_id){
                this.$confirm('此操作将永久删除该资料, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let {status,data:{code,msg}} = await this.$http.post(`/api/book/delete`,{_id})
                    if(status===200){
                        if(code===0){
                            this.$message({
                                message: msg,
                                type: 'success'
                            });
                            this.getAllBooks()
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
            formUrl(url){
                if( window.location.host.includes("localhost") ){
                    return `http://localhost:5001/${url}`
                }else {
                    return `/${url}`
                }
            },
            async getAllBooks(){
               let {status,data:{msg,code,books}} = await this.$http.get('/api/book/list')
                if (status===200){
                    if (code===0){
                        this.bookList = books;

                    }else {
                        alert(msg)
                    }
                }else {
                    alert("获取数据失败")
                }
            },
        },
        created(){
            this.getAllBooks()
        }
    }
</script>

<style scoped lang="scss">
// .mask{
//     position: absolute;
//     left: 0;
//     top: 0;
//     width: 100%;
//     height: 100%;
//     background-color: gray;
//     opacity: 1;
//     /*cursor: pointer;*/
//     text-align: center;
//     font-size: 60px;
//     display:flex;
//     justify-content:center;
//     align-items:center;
//     .el-icon-upload{
//         // line-height: 60px;
        
//     }
// }
// .image-wrapper:hover .mask{
//     opacity: 0.6;
// }
// .image-wrapper{
//     display:flex;
//     justify-content:center;
//     align-items:center;
// }
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .hide{
    //   display:none;
  }
</style>
