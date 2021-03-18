<template>
    <el-card class="box-card">
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--添加轮播图按钮-->
        <el-row style="margin-top: 20px">
            <el-col>
                <el-button type="success" @click="dialogFormVisible = true">添加活动</el-button>
            </el-col>
        </el-row>

        <!--表格-->
        <el-table
                :data="eventList"
                height="450"
                style="width: 100%">
            <el-table-column
                    type="index"
                    prop="date"
                    label="#"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="eventTitle"
                    label="活动主题">
            </el-table-column>
            <el-table-column
                    prop="eventLink"
                    label="跳转链接">
            </el-table-column>
            <el-table-column
                    prop="eventTime"
                    label="时间">
            </el-table-column>
            <el-table-column
                    prop="eventCoverUrl"
                    label="封面">
                <template slot-scope="scope">
                    <div style="height: 100px;position: relative;margin-top: 20px" class="image-wrapper">
                        <img
                          :src="formUrl(scope.row.eventCoverUrl)" alt="" style="width: 100%" >
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="manicate"
                    label="删除">
                <template slot-scope="scope">
                    <el-button type="danger"  @click="onClickForDeleteEvent(scope.row._id)" plain size="mini" icon="el-icon-delete" circle :disabled="!$store.state.authList.includes('删除活动')"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--添加活动对话框-->
        <el-dialog title="添加活动" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="活动主题" :label-width="formLabelWidth">
                    <el-input v-model="form.eventTitle" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动链接" :label-width="formLabelWidth">
                    <el-input v-model="form.eventLink" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动时间" :label-width="formLabelWidth">
                     <el-date-picker
                        v-model="form.eventTime"
                        type="datetime"
                        placeholder="选择日期时间">
                        </el-date-picker>
                </el-form-item>
                <el-form-item label="封面" :label-width="formLabelWidth" class="cover-container">
                    <!-- <div style="height: 150px;width:200px;position: relative;cursor: pointer" class="image-wrapper"> -->
                        <el-upload
                            accept="jpeg,png"
                            :multiple="false"
                            action=""
                            :limit="1"
                            list-type="picture-card"
                            class="avatar-uploader"
                            :on-change="handleAvatarSuccess"
                            :auto-upload="false">
                             <i class="el-icon-plus"></i>
                        </el-upload>
                        <!-- <i class="el-icon-upload" v-if="form.eventCoverUrl === '' " style="fontSize:60px;"></i> -->
                        
                        <!-- <div class="mask" >
                            <i class="el-icon-upload"></i>
                        </div>
                        <img v-if="form.eventCoverUrl" :src="form.eventCoverUrl" alt="" style="width: auto;height: 100%;">
                        <input type="file" style="position: absolute;left: 0;top: 0;width: auto;height: 100%;opacity: 0" class="input-image" @change="upLoadImage" ref="imageInput"> -->
                    <!-- </div> -->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onClickForAddEvent" :disabled="!$store.state.authList.includes('添加活动')">确 定</el-button>
            </div>
      </el-dialog>
    </el-card>
</template>

<script>
    import {BASE_URL} from "../../../global/util";
    import moment from "moment"
    export default {
        name: "Banner",
        data(){
            return {
                eventList:[],
                // 添加活动
                dialogFormVisible:false,
                formLabelWidth: '120px',
                form: {
                    eventTitle: '',
                    eventLink:'',
                    eventTime:'',
                    eventCover:'',
                },
            }
        },
        methods:{
            onClickForDeleteEvent(_id){
                this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let {status,data:{code,msg}} = await this.$http.post(`/api/event/delete`,{_id})
                    if(status===200){
                        if(code===0){
                            this.$message({
                                message: msg,
                                type: 'success'
                            });
                            this.getAllEvents()
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
            beforeAvatarUpload(){
                return false;
            },
            formUrl(url){
                if( window.location.host.includes("localhost") ){
                    return `http://localhost:5001/${url}`
                }else {
                    return `/${url}`
                }
            },
            async getAllEvents(){
               let {status,data:{msg,code,events}} = await this.$http.get('/api/event/list')
                if (status===200){
                    if (code===0){
                        this.eventList = events;

                    }else {
                        alert(msg)
                    }
                }else {
                    alert("获取数据失败")
                }
            },
            async onClickForAddEvent(){
                let form_data =new FormData();
                form_data.append('eventCover',this.form.eventCover);
                form_data.append('eventTitle',this.form.eventTitle);
                form_data.append('eventLink',this.form.eventLink);
                form_data.append('eventTime',moment(this.form.eventTime).format("MM-DD"));
                let {status,data:{msg,code}} = await this.$http.post('/api/event/upload',form_data,{
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                if (status===200){
                    if (code===0){
                        this.$message({
                            message: msg,
                            type: 'success'
                        });

                    }else {
                        alert(msg)
                    }
                }else {
                    alert("获取数据失败")
                }
                this.getAllEvents();
                this.dialogFormVisible = false

            },
            handleAvatarSuccess(e){
                this.form.eventCover = e.raw
            },
        },
        created(){
            this.getAllEvents()
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
