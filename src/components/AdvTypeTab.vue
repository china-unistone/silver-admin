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
                    <el-select v-model="paramType" filterable clearable placeholder="请选择类型" style="width: 100%;">
                      <el-option
                        v-for="item in typeList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                  <el-button type="primary" @click="clickOnSearch" style="margin-left:5px;">搜索</el-button>
                  <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addNewAdvType">新增</el-button>
                </el-col>
            </el-row>
            <el-table :data="advTypeList" border style="width: 100%;margin-top: 20px;text-align:center;">
                <el-table-column prop="id" label="ID" width="80px">
                </el-table-column>
                <el-table-column label="类型" width="200">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type | typeFilter }} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题">
                </el-table-column>
                <el-table-column label="默认logo图链接" width="200">
                    <template slot-scope="scope">
                        <img :src="scope.row.defaultLogo" class="cover-img"/>
                    </template>
                </el-table-column>
                <el-table-column label="尺寸(宽×高)" width="200">
                  <template slot-scope="scope">
                      <span>{{ scope.row.width }}×{{ scope.row.height }} </span>
                  </template>
                </el-table-column>
                <el-table-column prop="gmtUpdate" label="修改时间" width="200">
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="false" @click="manageRow(scope.row.id)" type="text" size="small">管理广告位({{ scope.row.count || 0 }})</el-button>
                        <el-button @click="updateRow(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button v-if="false" @click="deleteRow(scope.row.id)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" :page-count="totalPage" @current-change="currentPageChanged" layout="prev, pager, next" background>
            </el-pagination>
        </el-row>
        <div v-if="!listMode">
            <el-row>
                <el-col :span="12">
                    <el-form ref="advTypeForm" :model="formData" :rules="formRule" label-width="150px">
                       <el-form-item label="类型:" prop="type">
                        <el-select v-model.number="formData.type" placeholder="请选择类型">
                          <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                          </el-option>
                        </el-select>
                       </el-form-item>
                        <el-form-item label="标题:" prop="title">
                            <el-input v-model="formData.title" placeHolder="请输入标题"></el-input>
                        </el-form-item>
                        <el-form-item label="内容:" prop="content">
                            <el-input v-model="formData.content" placeHolder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="默认logo">
                            <el-upload accept=".jpg, .png" ref="cover_img" class="avatar-uploader" :action="ossHost" :data="ossFormData" :show-file-list="false" :on-change="changeCoverImgUpload" :on-remove="removeCoverImgUpload" :on-success="successCoverImgUpload" :before-upload="beforeCoverImgUpload">
                                <img v-if="cover_img" :src="cover_img" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="默认链接:" prop="defaultUrl">
                            <el-input v-model="formData.defaultUrl" placeHolder="请输入默认链接"></el-input>
                        </el-form-item>
                        <el-form-item label="宽度:" prop="width">
                            <el-input v-model.number="formData.width" placeHolder="请输入宽度"></el-input>
                        </el-form-item>
                        <el-form-item label="高度:" prop="height">
                            <el-input v-model.number="formData.height" placeHolder="请输入高度"></el-input>
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

const typeList = [
  { name: '首页icon', value: 1 },
  { name: '品牌banner', value: 2 },
  { name: '品牌分类', value: 3 },
  { name: '热卖品牌', value: 4 },
  { name: '京东首页icon', value: 5 },
  { name: '拼多多首页icon', value: 6 },
  { name: '聚划算icon', value: 7 }
]

export default {
  name: 'AdvTypeTab',
  data() {
    return {
      advTypeList: [], // 广告位类型列表
      totalPage: 1,   // 广告位类型总页数
      typeList: typeList,
      paramType:null,
      listMode: true,
      isAdd: true,
      formData: {},
      formRule: {
        type:  [{ required: true, message: '请选择类型', trigger: 'change' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        defaultUrl: [{ required: true, message: '请输入默认链接', trigger: 'blur' }],
        width: [{ required: true, message: '请输入宽度', trigger: 'blur' },
           { type: 'number', message: '排列序号必须为数字值', trigger: 'blur' }],
        height: [{ required: true, message: '请输入高度', trigger: 'blur' },
           { type: 'number', message: '排列序号必须为数字值', trigger: 'blur' }]
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
  filters: {
    typeFilter: function (value) {
      for (var i=0;i< typeList.length;i++) {
        if(value == typeList[i].value){
          return typeList[i].name
        }
      }
      return ''
    }
  },
  methods: {
    /* 列表页面 */
    fetchAdvTypeList(cp) {
      const params = {
        pageNum: cp,
        pageSize: 20,
        type: this.paramType
      }
      axios.get(API.AdvTypePageList, {
        params
      }).then(res => {
        if (res.status !== 0) {
          this.$message.error('获取列表失败')
        } else {
          // 转换imgPath
          var list = res.data.list || []
          this.advTypeList = list
          this.totalPage = res.data.totalPage
        }
      }).catch(() => this.$message.error('获取列表失败'))
    },
    currentPageChanged(cp) {
      this.fetchAdvTypeList(cp)
    },
    clickOnSearch(){
      this.fetchAdvTypeList(1)
    },
    clickOnRefresh() {
      this.paramType = null
      this.fetchAdvTypeList(1)
    },
    addNewAdvType() {
      // 重置所有的formData
      this.formData = {}
      this.cover_img = ''
      this.isAdd = true
      this.listMode = false
    },
    manageRow(rId) {

    },
    updateRow(row) {
      this.formData = JSON.parse(JSON.stringify(row))
      this.cover_img = this.getPictureFullPath(this.formData.defaultLogo)
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
        axios.get(API.AdvTypeDelete, {
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
          this.fetchAdvTypeList(1)
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
      this.paramType = null
      this.listMode = true
    },
    clickOnSubmit() {
      this.$refs.advTypeForm.validate((valid) => {
        if (!valid) {
          return
        }
        // 获取图片
        if (!this.cover_img) {
          this.$message({ type: "error", message: "请先上传封面图片" });
          return false;
        }
        this.formData.defaultLogo = this.cover_img
        console.log(this.formData)
        let api = this.isAdd ? API.AdvTypeInsert : API.AdvTypeUpdate
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
      this.ossFormData.key = this.ossDir + 'advType/' + file.name
    },
    // 获取图片完整路径
    getPictureFullPath(fileName) {
      if (!fileName) {
        return fileName
      }
      if (fileName.toLowerCase().startsWith('http://') || fileName.toLowerCase().startsWith('https://')) {
        return fileName
      }
      return this.ossHost + '/' + this.ossDir + 'advType/' + fileName
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

.el-radio {
    line-height: 40px;
}
</style>