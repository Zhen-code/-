<template>
    <div class="uploadBlock">
        <template v-for="(item,index) in img" v-show="img.length>0">
            <div class="uploadImage" :key="index">
                <img :src="item.img" alt/>
                <span class="uploadSuccess el-icon-success"></span>
                <div class="uploadImageCover" v-if="!disabled">
                    <span class="uploadCoverIcon el-icon-zoom-in" @click="showImage(item)"></span>
                    <span class="uploadCoverIcon el-icon-delete" @click="deleteImg(index)"></span>
                </div>
            </div>
        </template>
        <input type="file" :multiple="limitNum" class="uploadInput" ref="upload"/>
        <div v-show="hideAdd==false" class="uploadImageBtn" @click="dialog.visible = true"></div>
        <el-dialog title="多图上传" :visible="dialog.visible" :show-close="false" width="600px">
            <div class="multiBlock" v-loading="loading">
                <div class="waitFiles">
                    <template v-for="(item,index) in waitImage" v-show="img.length>0">
                        <div class="uploadImage" :key="index">
                            <img :src="item" alt />
                            <span class="uploadSuccess el-icon-success"></span>
                            <div class="uploadImageCover">
                                <span class="uploadCoverIcon el-icon-delete" @click="deleteWaitImg(index)"></span>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="dialogBottom">
                    <div class="uploadBtn" v-show="hideAdd==false" @click="selectImage">选择图片</div>
                    <el-button type="primary" @click="uploadFiles">上传</el-button>
                    <el-button @click="cancelUpload">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import AliUpload from "../plugin/AliUpload";

    export default {
        name: "MultiUpload",
        props:{
            imgs:{
                type:String,
                default:''
            },
            limitNum: Number || String,
            multi: {
                type: Boolean,
                default: true
            },
            disabled: Boolean,
            finish: Function
        },
        data(){
            return{
                img: [],
                hideAdd: false,
                dialog: {
                    visible: false
                },
                loading: false,
                waitImage: [],
                waitFiles: [],
                count: 0
            }
        },
        methods:{
            upload(file){
                const that = this;
              this.loading = true;
              let name = file.name.split('.');
              let type = name[name.length-1];
                AliUpload(type,file,'',"image").then(res=>{
                  this.count = this.count + 1;
                  console.log(res);
                  try {
                      this.img.push({ img: res.url });
                      if (this.img.length >= this.limitNum) {
                          this.hideAdd = true;
                      } else {
                          this.hideAdd = false;
                      }
                      that.finish(this.img);
                  } catch (e) {
                      console.log("error", e);
                  }
                  this.loading = false;
                  if (this.count >= this.waitFiles.length) {
                      this.cancelUpload();
                  }
              })
                  .catch(err => {
                      this.loading = false;
                      this.count = this.count + 1;
                      if (this.count >= this.waitFiles.length) {
                          this.cancelUpload();
                      }
                      console.log("errors", err);
                  });
            },
            showImage(item) {
                window.open(item.img, "_blank");
            },
            deleteImg(index) {
                if (this.img.length <= 1) {
                    this.img = [];
                } else {
                    this.img.splice(index, 1);
                }
                if (this.img.length >= this.limitNum) {
                    this.hideAdd = true;
                } else {
                    this.hideAdd = false;
                }
                this.finish(this.img);
            },
            deleteWaitImg(index) {
                console.log(index);

                if (this.waitImage.length <= 1) {
                    this.waitImage = [];
                } else {
                    this.waitImage.splice(index, 1);
                    this.waitFiles.splice(index, 1);
                }
            },
            selectImage() {
                this.$refs.upload.click();
                console.log(this.img);
            },
            uploadFiles() {
                let len = this.waitFiles.length;
                if (len > this.limitNum) {
                    this.waitFiles.splice(this.limitNum, len - this.limitNum);
                }
                if (len > 0) {
                    for (let i = -0; i < len; i++) {
                        this.upload(this.waitFiles[i]);
                    }
                } else {
                    this.$message({
                        type: "error",
                        message: "请选择图片",
                        duration: 1500
                    });
                    return;
                }
            },
            cancelUpload() {
                this.dialog.visible = false;
                this.waitImage = [];
                this.waitFiles = [];
                this.hideAdd = false;
            },
            setWaitFile(file) {
                this.waitFiles.push(file);
                let _this = this;
                let reader = new FileReader(); //实例化文件读取对象
                reader.readAsDataURL(file); //将文件读取为 DataURL,也就是base64编码
                reader.onload = function(ev) {
                    //文件读取成功完成时触发
                    let dataURL = ev.target.result; //获得文件读取成功后的DataURL,也就是base64编码
                    console.log(dataURL);
                    _this.waitImage.push(dataURL);
                    if (_this.waitImage.length > _this.limitNum) {
                        _this.waitImage.pop();
                    }
                    if (_this.waitImage.length == _this.limitNum) {
                        _this.hideAdd = true;
                    }
                };
                // let url = window.URL.createObjectURL(file);
                // console.log(url)
                // this.waitImage.push(url);
            }
        },
        watch:{
            imgs: ()=>{
                console.log(this.imgs)
                if(this.imgs){
                    this.img = this.imgs.split(',').map(v=>{
                        return{
                            img: v
                        }
                    })
                }else{
                    this.img = []
                }
                if(this.img.length>=this.limitNum){
                    this.hideAdd = true;
                }else{
                    this.hideAdd = false;
                }
            }
        },
        mounted() {
            let t = this;
            if(!this.disabled){
                this.$refs.upload.addEventListener("change", function(e) {
                    // console.log("file", e.target.files[0]);
                    for (let i = 0; i < e.target.files.length; i++) {
                        let file = e.target.files[i];
                        t.setWaitFile(file);
                    }
                    // t.upload(file);
                    e.target.value = "";
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .uploadBlock {
        flex: 1;
        /*height: 80px;*/
        background-color: #ffffff;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        flex-wrap: wrap;
        width: 100%;
        height: auto;
    }
    .uploadImage {
        width: 80px;
        height: 80px;
        overflow: hidden;
        margin-right: 10px;
        margin-bottom: 10px;
        background-color: #ffffff;
        border-radius: 5px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .uploadSuccess {
        position: absolute;
        right: 2px;
        top: 2px;
        color: #67c23a;
        font-size: 20px;
    }
    .uploadImageCover {
        width: 100%;
        height: 100%;
        border-radius: 5px;
        background-color: rgba(0, 0, 0, 0.2);
        position: absolute;
        top: 0;
        left: 0;
        /*display: flex;*/
        flex-direction: row;
        align-items: center;
        justify-content: center;
        display: none;
    }
    .uploadImage:hover .uploadImageCover {
        display: flex;
    }
    .uploadCoverIcon {
        width: 24px;
        height: 24px;
        color: #ffffff;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
        font-size: 20px;
        margin: 0 5px;
    }
    .uploadInput {
        width: 0;
        height: 0;
        opacity: 0;
    }
    .uploadImageBtn {
        width: 80px;
        height: 80px;
        margin-right: 10px;
        margin-bottom: 10px;
        background-color: #f5f7fa;
        border: 1px dashed #dcdfe6;
        border-radius: 5px;
        background-image: url("../assets/add.png");
        background-size: 30px 30px;
        background-repeat: no-repeat;
        background-position: center center;
        cursor: pointer;
    }
    .waitFiles {
        width: 500px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .dialogBottom{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-end;
    }
    .uploadBtn{
        display: inline-block;
        border: 2px dashed #EEEEEE;
        color: #000;
        padding: 10px;
        margin-right: 10px;
    }
</style>
