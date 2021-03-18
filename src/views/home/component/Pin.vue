<template>
    <el-card class="box-card">
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>沸点列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索-->
        <el-row>
            <el-col>
                <el-input placeholder="请输入内容" v-model="keyWord" class="input-with-select" style="width: 300px;margin-top: 30px" clearable @clear="getAllPin">
                    <el-button slot="append" icon="el-icon-search" @click="onClickForGetPins"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <!--表格-->
        <el-table
                :data="pins"
                style="width: 100%">
            <el-table-column
                    type="index"
                    prop="date"
                    label="#"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="user_name"
                    label="作者"
                    width="360">
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="内容">
                    <template slot-scope="scope">
                       <div v-html="ellipsis(scope.row.content)"></div>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="pinTypeLabel"
                    label="标签">
            </el-table-column>
             <el-table-column
                    prop="commentCount"
                    label="评论数">
            </el-table-column>
            <el-table-column
                    prop="manicate"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="danger"  @click="onClickForDeletePin(scope.row._id)" plain size="mini" :disabled="!$store.state.authList.includes('删除沸点')">删除</el-button>
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
        name: "Pin",
        data(){
            return {
                // 搜索框
                keyWord:'',

                // 表格信息
                pins:[],
                // 分页
                pageNum:1,
                pageSize:8,
                count:0,
            }
        },
        methods:{
            async onClickForEditPin(_id){
                this.$router.push({name:'Pinedit',query:{_id:_id}})
            },
            onClickForDeletePin(_id){
                this.$confirm('永久删除文章, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let {status,data:{code,msg}} = await this.$http.post(`/api/Pin/deletePin`,{_id})
                    if(status===200){
                        if(code===0){
                            this.$message({
                                message: '删除文章成功',
                                type: 'success'
                            });
                            this.getAllPin()
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
            onClickForGetPins(){
                this.getAllPin()
            },
            async getAllPin(){
                let {status,data:{code,msg,pins,count}} = await this.$http.post(`/api/pin/getPin`,{
                    keyWord:this.keyWord,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                })
                if (status===200){
                    if (code===0){
                        this.pins = pins;
                        this.count = count
                    }else {
                        alert(msg)
                    }
                }else {
                    alert("获取数据失败")
                }
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.getAllPin()
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.pageNum = val;
                this.getAllPin();
            },
            ellipsis(value) {
                if (!value) return "";
                if (value.length > 50) {
                    return value.slice(0, 50) + "...";
                }
                return value;
            }
        },
        created(){
            this.getAllPin();
        },
        filters: {
            //当渲染的文字超出30字后显示省略号
            
        }

    }
</script>

<style scoped lang="scss">

    .box-card{
        background-color:rgba(244,251,251,0.47);
    }

    .el-breadcrumb__inner{
        color: black!important;
    }
    .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
        color: darkgreen!important;
    }
</style>
