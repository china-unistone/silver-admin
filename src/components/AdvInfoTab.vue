<template>
    <div class="section-tab">
        <el-row v-if="listMode">
            <el-row>
                <el-col :span="4">
                    <el-tooltip placement="right" content="刷新">
                        <el-button icon="el-icon-refresh" circle size="mini" type="primary" plain @click="clickOnRefresh"></el-button>
                    </el-tooltip>
                </el-col>
                <el-col :span="8">
                    <el-select v-model="paramAdvType" filterable clearable placeholder="请选择广告位类型" style="width: 100%;">
                      <el-option
                        v-for="item in advTypeList"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                  <el-button type="primary" @click="clickOnSearch" style="margin-left:5px;">搜索</el-button>
                  <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addNewAdvInfo" style="margin-left:5px;">新增</el-button>
                </el-col>
            </el-row>
            <el-table :data="advInfoList" border style="width: 100%;margin-top: 20px;text-align:center;">
                <el-table-column prop="id" label="ID" width="80">
                </el-table-column>
                <el-table-column prop="advBoardTypeId" label="广告位类型" width="120">
                  <template slot-scope="scope">
                    <span>{{ advTypeRender(scope.row.advBoardTypeId) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" width="150">
                </el-table-column>
                <el-table-column label="logo" width="150px">
                    <template slot-scope="scope">
                        <img :src="scope.row.logo" class="cover-img"/>
                    </template>
                </el-table-column>
                <el-table-column label="打开方式" width="100px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.openType == 1">外部链接</span>
                    <span v-else>内部链接</span>
                  </template>
                </el-table-column>
                <el-table-column prop="url" label="链接地址">
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="50">
                </el-table-column>
                <el-table-column prop="gmtUpdate" label="修改时间" width="100">
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="updateRow(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="deleteRow(scope.row.id)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" :page-count="totalPage" @current-change="currentPageChanged" layout="prev, pager, next" background>
            </el-pagination>
        </el-row>
        <div v-if="!listMode">
            <el-row>
                <el-col :span="12">
                    <el-form ref="advInfoForm" :model="formData" :rules="formRule" label-width="150px">
                        <el-form-item label="广告位类型:" prop="advBoardTypeId">
                            <el-select v-model="formData.advBoardTypeId" filterable placeholder="请选择广告位类型">
                              <el-option
                                v-for="item in advTypeList"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="标题:" prop="title">
                            <el-input v-model="formData.title" placeHolder="请输入标题"></el-input>
                        </el-form-item>
                        <el-form-item label="内容:" prop="content">
                            <el-input v-model="formData.content" placeHolder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="打开方式:" prop="openType">
                            <el-radio-group v-model="formData.openType">
                                <el-radio :label="1">外部链接</el-radio>
                                <el-radio :label="2">内部链接</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="logo">
                            <el-upload accept=".jpg, .png" ref="cover_img" class="avatar-uploader" :action="ossHost" :data="ossFormData" :show-file-list="false" :on-change="changeCoverImgUpload" :on-remove="removeCoverImgUpload" :on-success="successCoverImgUpload" :before-upload="beforeCoverImgUpload">
                                <img v-if="cover_img" :src="cover_img" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="链接地址:" prop="url">
                            <el-input v-model="formData.url" placeHolder="请输入链接地址"></el-input>
                        </el-form-item>
                        <el-form-item label="排序:" prop="sort">
                            <el-input v-model.number="formData.sort" placeHolder="请输入排序序号"></el-input>
                        </el-form-item>
                        <el-form-item label="是否显示:" prop="show" style="padding-top: 10px;">
                            <el-switch
                              v-model="formData.show"
                              active-text="是"
                              :active-value="1"
                              inactive-text="否"
                              :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="创建时间:">
                            <el-input v-model="formData.gmtCreate" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="修改时间:">
                            <el-input v-model="formData.gmtUpdate" :disabled="true"></el-input>
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
  name: 'AdvInfoTab',
  data() {
    return {
      advInfoList: [], // 广告位列表
      totalPage: 1,   // 广告位总页数
      paramAdvType: null,
      advTypeList: [], // 广告位类型列表
      listMode: true,
      isAdd: true,
      formData: {},
      formRule: {
        advBoardTypeId: [{ required: true, message: '请选择广告位类型', trigger: 'change' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        openType: [{ required: true, message: '请选择打开方式', trigger: 'change' }],
        url: [{ required: true, message: '请输入链接地址', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序序号', trigger: 'blur' },
           { type: 'number', message: '排序序号必须为数字值', trigger: 'blur' }]
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
    advTypeRender(value){
      console.log('.......', value)
      for (var i = 0; i < this.advTypeList.length; i++) {
        if(this.advTypeList[i].id == value){
          return this.advTypeList[i].title
        }
      }
      return ''
    },
    /* 列表页面 */
    fetchAdvInfoList(cp) {
      const params = {
        pageNum: cp,
        pageSize: 20,
        advBoardTypeId: this.paramAdvType
      }
      axios.get(API.AdvInfoPageList, {
        params
      }).then(res => {
        if (res.status !== 0) {
          this.$message.error('获取广告位列表失败')
        } else {
          // 转换imgPath
          var list = res.data.list || []
          this.advInfoList = list
          this.totalPage = res.data.totalPage
        }
      }).catch(() => this.$message.error('获取广告位列表失败'))
    },
    fetchAdvTypeList() {
      const params = {
        pageNum: 1,
        pageSize: 999
      }
      axios.get(API.AdvTypePageList, {
        params
      }).then(res => {
        if (res.status !== 0) {
          this.$message.error('获取广告位类型失败')
        } else {
          // 转换imgPath
          var list = res.data.list || []
          this.advTypeList = list
        }
      }).catch(() => this.$message.error('获取广告位类型失败'))
    },
    currentPageChanged(cp) {
      this.fetchAdvInfoList(cp)
    },
    clickOnSearch(){
      this.fetchAdvInfoList(1)
    },
    clickOnRefresh() {
      this.paramAdvType = null
      this.fetchAdvTypeList()
      this.fetchAdvInfoList(1)
    },
    addNewAdvInfo() {
      // 重置所有的formData
      this.formData = {
        openType: 2,
        show: 1
      }
      this.cover_img = ''
      this.isAdd = true
      this.listMode = false
    },
    updateRow(row) {
      this.formData = JSON.parse(JSON.stringify(row))
      this.cover_img = this.getPictureFullPath(this.formData.logo)
      this.isAdd = false
      this.listMode = false
    },
    deleteRow(rId) {
      console.log(rId)
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get(API.AdvInfoDelete, {
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
          this.fetchAdvInfoList(1)
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
    
    /* 修改页面 */
    clickOnCancel() {
      this.paramAdvType = null
      this.listMode = true
    },
    clickOnSubmit() {
      this.$refs.advInfoForm.validate((valid) => {
        if (!valid) {
          return
        }
        // 获取图片
        if (!this.cover_img) {
          this.$message({ type: "error", message: "请先上传封面图片" });
          return false;
        }
        this.formData.logo = this.cover_img
        this.formData.advBoardTypeId = parseInt(this.formData.advBoardTypeId)
        this.formData.openType = parseInt(this.formData.openType)
        this.formData.show = parseInt(this.formData.show)
        this.formData.sort = parseInt(this.formData.sort)
        console.log(this.formData)
        let api = this.isAdd ? API.AdvInfoInsert : API.AdvInfoUpdate
        axios.post(api, this.formData).then(res => {
          console.log(res)
          if (res.status !== 0) {
            this.$message.error('保存失败')
          } else {
            this.$message.success(res.msg)
            this.clickOnRefresh()
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
      this.ossFormData.key = this.ossDir + 'advInfo/' + file.name
    },
    // 获取图片完整路径
    getPictureFullPath(fileName) {
      if (!fileName) {
        return fileName
      }
      if (fileName.toLowerCase().startsWith('http://') || fileName.toLowerCase().startsWith('https://')) {
        return fileName
      }
      return this.ossHost + '/' + this.ossDir + 'advInfo/' + fileName
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
    this.clickOnRefresh()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

/deep/.el-table{
  th, td{
    text-align: center;
  }
}

/deep/.el-switch{
 margin-top: 10px;
}

.el-radio {
    line-height: 40px;
}
</style>