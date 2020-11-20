<template>
    <div class="uploadBlock">
        <div class="uploadBtn" v-loading="loading" v-show="!hideAdd" v-if="!disabled">
            <input type="file" ref="upload" />
        </div>
    </div>
</template>

<script>
    import AliUpload from '../plugin/AliUpload';
    export default {
        name: "FileUpload",
        props:{
            disabled: {
                type: Boolean,
                default: false
            },
            hideAdd:{
                type: Boolean,
                default: false
            },
            isVideo:{
                type: Boolean,
                default: true
            },
            limitNum:{
                type: Number || String,
                default: 0
            },
            finish: Function
        },
        data(){
            return{
                loading: false,
                files: []
            }
        },
        methods:{
            getSuffix(val) {
                //获取最后一个.的位置
                // let index = val.lastIndexOf(".");
                //获取后缀
                // let ext = val.substr(index + 1);
                return ["video/mp4"].indexOf(val.type) !== -1;
            },
            upload(file) {
                let a = false;
                if (this.isVideo == true) {
                    if (this.getSuffix(file) == false) {
                        this.$message({
                            message: "请上传视频格式文件",
                            type: "warning"
                        });
                        a = true;
                    }
                }
                if (a == true) {
                    return;
                }
                this.loading = true;
                let name = file.name.split(".");
                let type = name[name.length - 1];
                AliUpload(type, file, '', "video")
                    .then(res => {
                        console.log(res);
                        try {
                            this.files.push({ file: res.url });
                            // if (this.files.length >= this.limitNum) {
                            //
                            // } else {
                            //
                            // }
                            this.finish(this.files);
                        } catch (e) {
                            console.log("error", e);
                        }
                        this.loading = false;
                    })
                    .catch(err => {
                        this.loading = false;
                        console.log("errors", err);
                    });
            },
        },
        mounted() {
            let t =this;
            if (!this.disabled) {
                this.$refs.upload.addEventListener("change", function(e) {
                    let file = e.target.files[0];
                    console.log("file", file);
                    t.upload(file);
                    e.target.value = "";
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .uploadBlock{
        display: flex;
        flex: 1;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        height: auto;
    }
    .uploadBtn {
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
    .uploadBtn input {
        width: 100%;
        height: 100%;
        outline: none;
        opacity: 0;
        cursor: pointer;
    }

</style>
