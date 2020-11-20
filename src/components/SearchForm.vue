<template>
    <div class="_form-container">
        <p class="form-title">{{ formTitle }}</p>
        <el-form
                ref="_form"
                 :model="model"
                 label-width="200px"
                 class="form"
                 size="small"
                 :rules="rules"
                 :class="{vertical:vertical,horizontal: !vertical}">
            <template v-for="(item,index) in columns">
                <div :class="['form-item',item.type==='uploadVideo'?'videoWidth':'']"  :key="index">
                    <el-form-item
                            :label="item.label"
                            :prop="item.prop"
                    >
                        <template v-if="item.type === 'password'">
                         <el-input type="password" v-model.trim="model[item.prop]" :disabled="disabled"></el-input>
                     </template>
                        <template v-else-if="item.type === 'uploadImg'">
                            <uplaod-img
                                    :imgs="imgs.join(',')"
                                    :disabled="item.disabled"
                                    :limitNum="item.limitNum"
                                    :finish="finish"></uplaod-img>
                            <input v-model="model[item.prop]" style="display: none"/>
                        </template>
                        <template v-else-if="item.type === 'uploadVideo'">
                            <upload-video :disabled="false" :isVideo="true" :finish="finishVideo" :limitNum="1" :hideAdd="hideUpload"/>
                            <div class="videoWrap">
                                <video v-if="videos.length!==0"
                                       @click="playVideo()"
                                       id="videoPlay"
                                       controls
                                       width="600px"
                                       height="240"
                                       :src="videos[0]['file']"
                                       type="video/mp4"></video>
                                <span v-if="hideUpload" class="el-icon-circle-close" @click="hideVideo"></span>
                            </div>
                        </template>
                        <template v-else-if="item.type === 'select'">
                            <el-select
                                    style="width: 100%"
                                    clearable
                                    :multiple="item.multiple"
                                    v-model="model[item.prop]"
                                    @focus="getOption(item, index)"
                                    :disabled="disabled"
                            >
                                <el-option
                                        v-for="(option, index) in item.options"
                                        :key="index"
                                        :label="option.label"
                                        :value="option.value"
                                ></el-option>
                            </el-select>
                        </template>
                        <template v-else-if="item.type === 'radio'">
                            <template v-for="(option, index) in item.options">
                                <el-radio
                                        :key="index"
                                        v-model="model[item.prop]"
                                        :label="option.value"
                                >{{ option.label }}</el-radio>
                            </template>
                        </template>
                        <template v-else-if="item.type === 'dateTime'">
                            <el-date-picker
                                    v-model="model[item.prop]"
                                    :type="item.types"
                                    :format="item.format"
                                    :value-format="item.valueFormat"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </template>
                        <template v-else-if="item.type === 'cascader'">
                            <el-cascader
                                    v-model="model[item.prop]"
                                    :options="item.options"
                                    clearable
                                    :props="item.props"
                                   ></el-cascader>
                        </template>
                        <template v-else-if="item.type === 'switch'">
                            <el-switch
                                    v-model="model[item.prop]"
                                    :active-color="item.activeColor"
                                    :inactive-color="item.inactiveColor">
                            </el-switch>
                        </template>
                        <template v-else>
                            <el-input
                                    v-model.trim="model[item.prop]"
                                    :disabled="item.disabled"
                            ></el-input>
                        </template>
                    </el-form-item>
                </div>
            </template>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'SearchForm',
        props:{
            formTitle:{
              type: String,
              default: ''
            },
            vertical: {
                type: Boolean,
                default: false
            },
            column:{
                type: Array,
                default: ()=>{return []}
            },
            disabled:{
                type: Boolean,
                default: false
            }
        },
        data(){
            return{
                model: {},
                columns: this.column,
                imgs:[],
                videos:[],
                hideUpload:false,
                propImg: '',
                propVideo:''
            }
        },
        methods:{
            finish(data){
                console.log(data)
                this.imgs = data.map(v=>{
                    return v.img
                });
                this.model[this.propImg] = data;
                this.$emit('finishUpload',this.imgs)
            },
            finishVideo(data){
                console.log(data)
                if(data.length!==0){
                    this.hideUpload = true;
                    this.videos = data;
                    this.model[this.propVideo] = data;
                }
                this.$emit('finishVideo',data);
            },
            playVideo() {
                let vdo = document.getElementById("videoPlay");
                vdo.play();
            },
            getOption(item, index) {
                // console.log(item);
                if (item.asyncOption && !item.options) {/*从接口动态获取数据*/
                    item.asyncOption().then(data => {
                        let columns = [...this.columns];
                        columns[index]["options"] = data;
                        // console.log(columns);
                        this.columns = columns;
                    });
                }
            },
            getForm(){
                return this.$refs._form;
            },
            getValidate() {
                return this.$refs._form.validate();
            },
            getValue() {
                return this.model;
            },
            setValue(data) {
                this.model = { ...this.model, ...data };
            },
            hideVideo(){
                this.videos = [];
                this.hideUpload = false;
            }
        },
        computed:{
          rules(){
              let rules = {};
              this.column.forEach(item=>{
                  let key = item.prop;
                  let hadRules = item.rules;
                  if(hadRules){
                      rules[key] = [item.rules]
                  }
              });
              return rules;
          }
        },
        mounted() {
            let model = {};
            this.column.forEach((item,index)=>{
                if(item.type === 'uploadImg'){
                    this.propImg = 'uploadImg'
                }
                if(item.type === 'uploadVideo'){
                    this.propVideo = 'uploadVideo'
                }
                let result = {
                    [item.prop]:""
                };
                model = {...model,...result};
                if(item.type === "select"){
                    this.getOption(item,index);
                }
            });
            this.model = model;
        }
    }
</script>

<style lang="scss" scoped>
    ._form-container {
        width: 100%;
    }
    .form-title {
        color: #333;
        font-size: 16px;
        padding: 8px 0;
        text-align: left;
    }
    .form {
        width: 100%;
    }
    .horizontal {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        flex-wrap: wrap;
        .form-item {
            width: 33%;
            margin-top: 20px;
        }
    }
    .horizontal {
        .videoWidth{
            width: 60%;
        }
    }
    .vertical {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        .form-item {
            width: 700px;
        }
    }
    .videoWrap{
        position: relative;
    }
    .el-icon-circle-close{
        position: absolute;
        right: 4px;
        top: 4px;
    }
    @media screen and (max-width: 1200px) {
        .horizontal {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-start;
            flex-wrap: wrap;
            .form-item {
                width: 50%;
            }
        }
    }
    @media screen and (max-width: 960px) {
        .horizontal {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-start;
            flex-wrap: wrap;
            .form-item {
                width: 80%;
            }
        }
    }
</style>
