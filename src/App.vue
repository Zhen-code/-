<template>
  <div id="app">
<!--    <search-form ref="form" :formTitle="title" :vertical="false" :column="columns" :disabled="false" @finishUpload="finishUpload" @finishVideo="finishVideo"></search-form>-->
<!--    <el-button type="primary" @click="submit">提交</el-button>-->
        <edit-table></edit-table>
  </div>
</template>

<script>
// import SearchForm from "./components/SearchForm";
import EditTable from "./components/EditTable";

export default {
  name: 'App',
  components: {
    // SearchForm,
    EditTable
  },
  data(){
    return{
      title: '表单',
      columns:[
        {
          prop: 'uploadImg',
          label: '图片上传',
          type: 'uploadImg',
          disabled: false,
          limitNum: 10,
          required: true,
          rules:{
            required: true,
            validator:(rule,value,callback)=>{
              if(value === ""){
                callback('请选择图片')
              }else{
                callback()
              }
            },
            trigger: "blur"
          }
        },
        {
          prop: 'uploadVideo',
          label: '视频上传',
          type: 'uploadVideo'
        },
        {
          prop: 'name',
          label:'姓名',
          type: 'input',
          rules:{
            required: true,
            validator: (rule,value,callback)=>{
              if(value === ""){
                callback('请输入名称')
              }else{
                callback()
              }
            },
            trigger: "blur"
          }
        },
        {
          prop:'password',
          label: '密码',
          type: 'password'
        },
        {
          prop:'select',
          label: '下拉框',
          type: 'select',
          options:[
            {label:'1',value:1}
          ],
          multiple: false
        },
        {
          prop:'radio',
          label:'单选框',
          type: 'radio',
          options: [
            {label:2,value:2},
            {label:3,value:3}
          ]
        },
        {
          prop:'dateTime',
          label: '时间日期',
          type: 'dateTime',
          format: 'yyyy-MM-dd ',//显示的日期格式
          valueFormat: 'yyyy-MM-dd',//值显示格式
          types: 'datetime'//日期加时间
        },
        {
          prop: 'cascader',
          label: '级联',
          type: 'cascader',
          options:[
            {
              value: 'zhinan',
              label: '指南',
              children: [{
                value: 'shejiyuanze',
                label: '设计原则',
                children: [{
                  value: 'yizhi',
                  label: '一致'
                }, {
                  value: 'fankui',
                  label: '反馈'
                }, {
                  value: 'xiaolv',
                  label: '效率'
                }, {
                  value: 'kekong',
                  label: '可控'
                }]
              }, {
                value: 'daohang',
                label: '导航',
                children: [{
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                }, {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }]
              }],
            }
          ],
          props: {multiple: false}//是否多选
        },
        {
          prop: 'switch',
          label:'开关',
          type:'switch',
          activeColor: '#13ce66',
          inactiveColor: "#ff4949"
        }
      ]
    }
  },
  methods:{
    finishUpload(imgs){//获取上传图片
      console.log(imgs)
    },
    finishVideo(video){
      console.log(video)
    },
    submit(){
      this.$refs.form.getValidate().then(res=>{
        console.log(this.$refs.form.getValue());
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    }
  },
  mounted() {
    this.$refs.form.setValue({
      name: '666'
    });
  }
}
</script>

<style>
</style>
