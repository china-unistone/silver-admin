<template>
    <div class="section-tab">
        <el-row v-if="listMode">
            <el-row>
                <el-col :span="4">
                    <el-tooltip placement="right" content="刷新">
                        <el-button icon="el-icon-refresh" circle size="mini" type="primary" plain @click="clickOnRefresh"></el-button>
                    </el-tooltip>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addNewArticle">新增官方公告</el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData" border style="width: 100%;margin-top: 20px;">
                <el-table-column prop="id" label="排列序号">
                </el-table-column>
                <el-table-column prop="imgUrl" label="封面图">
                    <template slot-scope="scope">
                        <img :src="scope.row.coverImgPath" class="cover-img"/>
                    </template>
                </el-table-column>
                <el-table-column prop="gmtModified" label="修改时间">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="deleteRow(scope.row.id)" type="text" size="small">删除</el-button>
                        <el-button @click="updateRow(scope.row)" type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" layout="prev, pager, next" :page-count="totalPage" background @current-change="currentPageChanged">
            </el-pagination>
        </el-row>
        <div v-if="!listMode">
            <el-row>
                <el-col :span="12">
                    <el-form ref="articleForm" :model="formData" :rules="formRule" label-width="150px">
                        <el-form-item label="标题:" prop="title">
                            <el-input v-model="formData.title" placeHolder="请输入标题"></el-input>
                        </el-form-item>
                        <el-form-item label="内容:" prop="content">
                            <el-input v-model="formData.content" placeHolder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="封面图片">
                            <el-upload accept=".jpg, .png" ref="cover_img" class="avatar-uploader" :action="ossHost" :data="ossFormData" :show-file-list="false" :on-change="changeCoverImgUpload" :on-remove="removeCoverImgUpload" :on-success="successCoverImgUpload" :before-upload="beforeCoverImgUpload">
                                <img v-if="cover_img" :src="cover_img" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="链接地址:" prop="activityUrl">
                            <el-input v-model="formData.activityUrl" placeHolder="请输入链接地址"></el-input>
                        </el-form-item>
                        <el-form-item label="是否过期:" prop="activityOverdue">
                            <el-radio-group v-model="formData.activityOverdue">
                                <el-radio :label=0>未过期</el-radio>
                                <el-radio :label=1>过期</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="创建时间:" prop="gmtCreate">
                            <el-input v-model="formData.gmtCreate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="修改时间:" prop="gmtModified">
                            <el-input v-model="formData.gmtModified" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="clickOnSubmit">提交</el-button>
                            <el-button type="primary" @click="clickOnCancel">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    import "../assets/css/section.less"
    import axios from 'axios'
    import API from '../api/api.js'

    export default {
        name: 'OfficialMsg',
        data() {
            return {
                tableData: [],
                totalPage: 1,
                listMode: true,
                isAdd: true,
                formData: {
                    type: '4',
                    activityOverdue: 0
                },
                formRule: {
                    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                    content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                    activityUrl: [{ required: true, message: '请输入链接地址', trigger: 'blur' }]
                },
                cover_img: '', // 表单中的首页大图url地址
                //oss data
                accessid: '',
                policy: '',
                signature: '',
                ossDir: '',
                ossHost: '',
                ossFormData: {}
            }
        },
        created() {
            //获取oss认证
            axios.get(API.OSSUrl).then((result) => {
                if (!result || !result.data) {
                    this.$message.error('图片服务器连接异常！')
                    return
                }
                this.accessid = result.data.accessid
                this.policy = result.data.policy
                this.signature = result.data.signature
                this.ossDir = result.data.dir
                this.ossHost = result.data.host
            });
        },
        methods: {
            getDataList(cp) {
                const params = {
                    pageNum: cp,
                    pageSize: 20,
                    type: 4
                }
                axios.get(API.SysMsgPageList, {
                    params
                }).then(res => {
                    console.log('>>>>>>>>' + JSON.stringify(res));
                    if (res.status !== 0) {
                        this.$message.error('获取广告列表失败')
                    } else {
                        // 转换imgPath
                        var list = res.data.list || []
                        for (var i = 0; i < list.length; i++) {
                            list[i].coverImgPath = this.getPictureFullPath(list[i].imgUrl)
                        }
                        this.tableData = list
                        this.totalPage = res.data.totalPage
                    }
                }).catch(() => this.$message.error('获取广告列表失败'))
            },
            currentPageChanged(cp) {
                this.getDataList(cp)
            },
            clickOnCancel() {
                this.listMode = true
            },
            clickOnRefresh() {
                this.getDataList(1)
            },
            deleteRow(rId) {
                console.log(rId)
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.get(API.SysMsgDelete, {
                        params: {
                            id: rId
                        }
                    }).then(res => {
                        if (res.status !== 0) {
                            this.$message.error(res.msg)
                        } else {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                        }
                        this.getDataList(1)
                    }).catch(() => {
                        this.$message.error('删除失败')
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            updateRow(row) {
                this.formData = JSON.parse(JSON.stringify(row))
                this.cover_img = this.getPictureFullPath(this.formData.imgUrl)
                this.isAdd = false
                this.listMode = false
            },
            addNewArticle() {
                // 重置所有的formData
                this.formData = {
                    type: '4',
                    activityOverdue : 0
                }
                this.cover_img = ''
                this.isAdd = true
                this.listMode = false
            },
            clickOnSubmit() {
                this.$refs.articleForm.validate((valid) => {
                    if (!valid) {
                        return
                    }
                    // 获取图片
                    if (!this.cover_img) {
                        this.$message({ type: "error", message: "请先上传封面图片" });
                        return false;
                    }
                    this.formData.imgUrl = this.cover_img  // this.getFileNameFromFullPath(this.cover_img)
                    if(this.formData.coverImgPath){
                        delete this.formData.coverImgPath
                    }
                    let api = this.isAdd ? API.SysMsgInsert : API.SysMsgUpdate

                    console.log('request' + JSON.stringify(this.formData));

                    axios.post(api, this.formData).then(res => {
                        console.log(res)
                        if (res.status !== 0) {
                            this.$message.error('保存失败')
                        } else {
                            this.$message.success(res.msg)
                            this.getDataList(1)
                            this.listMode = true
                        }
                    }).catch(err => console.log(err))
                })
            },
            changeCoverImgUpload(file, fileList) {
                console.log(file);
                console.log(fileList);
            },
            removeCoverImgUpload(res, file) {},
            successCoverImgUpload(response, file, fileList) {
                // this.cover_img = URL.createObjectURL(file.raw)
                this.cover_img = this.getPictureFullPath(file.raw.name)
            },
            beforeCoverImgUpload(file) {
                const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传广告图片只能是 JPG 或者 PNG 格式!')
                    return false
                }
                if (!isLt2M) {
                    this.$message.error('上传广告图片大小不能超过 2MB!')
                    return false
                }

                this.ossFormData.OSSAccessKeyId = this.accessid
                this.ossFormData.policy = this.policy
                this.ossFormData.Signature = this.signature
                this.ossFormData.key = this.ossDir + "homeArticle" + "/" + file.name
            },
            // 获取图片完整路径
            getPictureFullPath(fileName) {
                if (!fileName) {
                    return fileName
                }
                if (fileName.toLowerCase().startsWith('http://') || fileName.toLowerCase().startsWith('https://')) {
                    return fileName
                }
                return this.ossHost + '/' + this.ossDir + "homeArticle" + "/" + fileName
            },
            // 获取图片名
            getFileNameFromFullPath(fullPath) {
                if (!fullPath) {
                    return fullPath
                }
                if (!fullPath.toLowerCase().startsWith('http://') && !fullPath.toLowerCase().startsWith('https://')) {
                    return fullPath
                }
                return fullPath.substring(fullPath.lastIndexOf('/') + 1)
            }
        },
        mounted() {
            this.getDataList(1)
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .el-radio {
        line-height: 40px;
    }
</style>