<template>
  <div>
    <script id="editor" type="text/plain" ></script>
  </div>
</template>

<script>
  import '../../../public/ueditor/ueditor.config.js'
  import '../../../public/ueditor/ueditor.all.js'
  import '../../../public/ueditor/lang/zh-cn/zh-cn.js'


  export default {
    name: "UEditor",
    props: {
      id: {
          type: String
      },
      config: {
          type: Object
      },
      form:  {
          type: Object
      },
    },
    data() {
      return {
        editor: null
      }
    },
    mounted() {
      //初始化UE
      const _this = this;
      this.editor = UE.delEditor("editor");
      this.editor = UE.getEditor('editor',this.config);
    },
    destoryed() {
      this.editor.destory();
    },
    methods:{
      getUEContent: function(){
       return this.editor.getContent();
      },
      getContentTxt: function(){
        return this.editor.getContentTxt();
      }
    }
  }
</script>
