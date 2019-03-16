<template>
    <div class="section-tab">
        <el-row v-if="isList">
            <el-button type="primary" icon="el-icon-plus" class="add-button" @click="switchToEditMode(true)">新增文章
            </el-button>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="title" label="文章标题">
                </el-table-column>
                <el-table-column prop="coverImg" label="封面图">
                    <template slot-scope="scope">
                        <img :src="scope.row.coverImg" class="cover-img"/>
                    </template>
                </el-table-column>
                <el-table-column prop="operatorName" label="最后修改人">
                </el-table-column>
                <el-table-column prop="gmtModified" label="最后修改时间">
                </el-table-column>
                <el-table-column prop="sort" label="排序">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="deleteRow(scope.row.id)" type="text" size="small">删除</el-button>
                        <el-button @click="switchToEditMode(scope.row)" type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" layout="prev, pager, next" :page-count="totalPage" background @current-change="currentPageChanged">
            </el-pagination>
        </el-row>
        <el-row v-if="!isList" class="edit-div">
            <el-form ref="form" :model="form" :rules="formRule" label-width="160px">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="简短描述">
                    <el-input v-model="form.phrase"></el-input>
                </el-form-item>
                <el-form-item label="封面图片">
                    <el-upload accept=".jpg, .png" ref="cover_img" class="avatar-uploader" :action="ossHost" :data="ossFormData" :show-file-list="false" :on-change="changeCoverImgUpload" :on-remove="removeCoverImgUpload" :on-success="successCoverImgUpload" :before-upload="beforeCoverImgUpload">
                        <img v-if="cover_img" :src="cover_img" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item v-if="moduleIndex == 2" label="ItemId" prop="dailyItemId">
                    <el-input v-model.number="form.dailyItemId"></el-input>
                </el-form-item>
                <el-form-item v-if="moduleIndex == 3" label="图片列表">
                    <el-upload class="upload-demo" list-type="picture-card" :action="ossHost" :data="ossFormData" :limit="9" :file-list="imgList" :on-remove="removeImgListUpload" :on-success="successImgListUpload" :before-upload="beforeImgListUpload">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="排列顺序" prop="sort">
                    <el-input v-model.number="form.sort"></el-input>
                </el-form-item>
                <el-form-item v-if="moduleIndex == 2 || moduleIndex == 3 || moduleIndex == 4" label="转发数" prop="repost">
                    <el-input v-model.number="form.repost"></el-input>
                </el-form-item>
                <el-form-item v-if="moduleIndex == 2 || moduleIndex == 3 || moduleIndex == 4" label="点赞数" prop="praise">
                    <el-input v-model.number="form.praise"></el-input>
                </el-form-item>
                <el-form-item label="详细内容" class="insertItem">
                    <span v-if="moduleIndex != 2 && moduleIndex != 3 && moduleIndex != 4" @click="insertItemid" class="insertItemDom">插入itemId</span>
                    <UEditor :config=config ref="ueditor" :id="sectionIndex.toString()"></UEditor>
                </el-form-item>
                <el-form-item>
                    <el-input type="hidden" v-model="form.id" style="display: none"></el-input>
                    <el-button type="primary" @click="saveEdit">立即提交</el-button>
                    <el-button @click="cancelEdit">取消</el-button>
                </el-form-item>
            </el-form>
        </el-row>
    </div>
</template>
<script>
import "../assets/css/section.less"
import axios from 'axios'
import API from '../api/api.js'


import UEditor from '@/components/ueditor/ueditor.vue'

export default {
    name: "SectionTab",
    components: {
        UEditor,
    },
    props: {
        sectionIndex: Number,
        moduleIndex: Number
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
    data() {
        return {
            uploadData: [{
                type: "add",
                result: ""
            }],
            tableData: [],
            totalPage: 1,
            cover_img: '',
            imgList: [],
            phrase: '',
            isList: true,
            editor: null,
            form: {
                title: '',
                sort: 0,
                id: 0,
                phrase: '',
                content: '',
                repost: 0,
                praise: 0,
                dailyItemId: null
            },
            formRule: {
                title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
                sort: [{ required: true, message: '请输入排列序号', trigger: 'blur' }, { type: 'number', message: '排列序号必须为数字值' }],
                dailyItemId: [{ type: 'number', message: 'itemId必须为数字值' }],
                repost: [{ required: true, message: '请输入转发数', trigger: 'blur' }, { type: 'number', message: '转发数必须为数字值' }],
                praise: [{ required: true, message: '请输入点赞数', trigger: 'blur' }, { type: 'number', message: '点赞数必须为数字值' }],
            },
            config: {
                //可以在此处定义工具栏的内容
                // toolbars: [
                //  ['fullscreen', 'undo', 'redo','|','bold', 'italic', 'underline',
                //  '|','superscript','subscript','|', 'insertorderedlist', 'insertunorderedlist',
                //  '|','fontfamily','fontsize','justifyleft','justifyright','justifycenter','justifyjustify']
                // ],
                toolbars: [
                    [
                        'fullscreen', 'source', '|', 'undo', 'redo', '|',
                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                        'directionalityltr', 'directionalityrtl', 'indent', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                        'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                        'simpleupload', 'insertvideo', 'map', 'insertframe', 'inserttable', 'deletetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol'
                    ]
                ],
                autoHeightEnabled: false,
                autoFloatEnabled: true,
                initialContent: '', //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
                autoClearinitialContent: false, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
                initialFrameWidth: null,
                initialFrameHeight: 350,
                BaseUrl: '',
                UEDITOR_HOME_URL: 'ueditor/',
                ossUrl: API.OSSUrl,
                sectionIndex: this.sectionIndex
            },
            addFormVisible: false,
            //oss data
            accessid: '',
            policy: '',
            signature: '',
            ossDir: '',
            ossHost: '',
            ossFormData: {}
        }
    },
    mounted() {
        this.pageList(1)
        console.log('moduleIndex=====', this.moduleIndex)
    },
    methods: {
        pageList(cp) {
            axios.get(API.EditPageList, {
                params: {
                    pageNum: cp,
                    pageSize: 20,
                    module: this.moduleIndex,
                    section: this.sectionIndex
                }
            }).then(res => {
                this.tableData = res.data.list
                this.totalPage = res.data.totalPage
            }).catch(() => {
                this.$message.error('服务器异常！')
            });
        },
        deleteRow(rId) {
            // console.log(rId)
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.get(API.EditDeleteData, {
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
                    this.pageList(1)
                }).catch(() => {
                    this.$message.error('删除失败')
                })
            }).catch(() => {
                // 取消操作
            })
        },
        currentPageChanged(cp) {
            this.pageList(cp);
        },
        switchToEditMode(row) {
            let _this = this;
            this.isList = false;
            this.form.id = row.id;
            this.form.sort = row.sort;
            this.form.phrase = row.phrase;
            this.form.title = row.title;
            this.form.repost = row.repost;
            this.form.praise = row.praise;
            this.form.content = row.content;
            this.config.initialContent = row.content;

            this.form.dailyItemId = row.dailyItemId;
            this.cover_img = row.coverImg;
            this.form.promoUrls = row.promoUrls;
            this.imgList = this.parseImgStrToFileArr(this.form.promoUrls)
        },
        parseImgStrToFileArr(imgStr) {
            var fileArr = []
            var imgStrArr = []
            if (imgStr) {
                imgStrArr = imgStr.split(',')
            }
            for (var i = 0; i < imgStrArr.length; i++) {
                if (imgStrArr[i]) {
                    fileArr.push({ url: imgStrArr[i] })
                }
            }
            return fileArr
        },
        parseFileArrToImgStr(fileArr) {
            if (!fileArr) {
                return null
            }
            var imgStrArr = []
            for (var i = 0; i < fileArr.length; i++) {
                imgStrArr.push(fileArr[i].url)
            }
            return imgStrArr.join(',')
        },
        changeCoverImgUpload(file, fileList) {
            console.log(file);
            console.log(fileList);
        },
        removeCoverImgUpload(res, file) {},
        successCoverImgUpload(response, file, fileList) {
            // this.cover_img = URL.createObjectURL(file.raw);
            this.cover_img = this.ossHost + '/' + this.ossDir + "area_title" + this.moduleIndex + "/" + file.raw.name;
        },
        beforeCoverImgUpload(file) {
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!')
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
                return false
            }

            this.ossFormData.OSSAccessKeyId = this.accessid
            this.ossFormData.policy = this.policy
            this.ossFormData.Signature = this.signature
            this.ossFormData.key = this.ossDir + "area_title" + this.moduleIndex + "/" + file.name
        },
        saveEdit() {
            let _this = this;
            _this.$refs.form.validate().then(() => {
                let content = _this.$refs.ueditor.getUEContent();
                let title = _this.form.title;
                let sort = _this.form.sort;
                if (!_this.cover_img) {
                    _this.$message({ type: "error", message: "请先上传封面图片" });
                    return false;
                }
                let data = {
                    id: parseInt(_this.form.id),
                    title: _this.form.title,
                    sort: parseInt(_this.form.sort),
                    phrase: _this.form.phrase,
                    repost: _this.form.repost || 0,
                    praise: _this.form.praise || 0,
                    content: content,
                    coverImg: _this.cover_img,
                    promoUrls: _this.parseFileArrToImgStr(_this.imgList),
                    dailyItemId: _this.form.dailyItemId,
                    module: _this.moduleIndex,
                    section: _this.sectionIndex
                }
                let apiUrl = (data.id) ? API.EditUpdateData : API.EditInsertData;
                axios.post(apiUrl, data)
                    .then(function(response) {
                        if (response.status == 0) {
                            _this.$message({ type: "success", message: "文章提交成功" });
                            _this.isList = true;
                            _this.pageList(1);
                        } else {
                            _this.$message({ type: "error", message: "文章提交失败" });
                        }
                    })

            }).catch(err => console.log(err))

        },
        cancelEdit() {
            this.isList = true
        },
        insertItemid() {
            this.$prompt('请输入淘宝商品itemId', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9]*$/,
                inputErrorMessage: '淘宝商品itemId格式不正确'
            }).then(({ value }) => {
                UE.getEditor('editor' + this.sectionIndex).execCommand('insertHtml', '<div class="goodsBox">{#' + value + '#}</div>');
            }).catch(() => {});
        },
        removeImgListUpload(file, fileList) {
            this.imgList = fileList
        },
        successImgListUpload(response, file, fileList) {
            var url = this.ossHost + '/' + this.ossDir + "area_title" + this.moduleIndex + "/" + file.raw.name
            file.url = url
            this.imgList = fileList
        },
        beforeImgListUpload(file) {
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
                return false
            }

            this.ossFormData.OSSAccessKeyId = this.accessid
            this.ossFormData.policy = this.policy
            this.ossFormData.Signature = this.signature
            this.ossFormData.key = this.ossDir + "area_title" + this.moduleIndex + "/" + file.name
        },
    }
};
</script>