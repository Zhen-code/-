<template>
        <div class="table-container">
            <div class="table-tool" v-show="showToolBar">
                <p class="table-title">{{ title }}</p>
                <el-button size="mini" @click="addRow"></el-button>
                <el-button size="mini" @click="deleteRow"></el-button>
            </div>
            <el-table
                    ref="table"
                    border
                    :data="dataList"
                    height="500"
                    style="width: 100%;"
                    class="edit-table"
                    highlight-current-row
                    @current-change="currentRowChange"
                    @cell-click="cellClick"
            >
                <el-table-column
                        v-for="(col,index) in column"
                        :key="index"
                        :label="col.label"
                        :width="col.width"
                        :min-width="col.minWidth"
                        :prop="col.prop"
                        >
                    <template v-slot="scope">
                        <template v-if="col.type === 'input' && !disabled && scope.$index === clickCell.index &&col.prop === clickCell.property">
                            <el-input v-model.trim="clickCell.value" @blur="blurInput($event,{...clickCell})"></el-input>
                        </template>
                        <template v-else-if="col.type === 'number' && !disabled && scope.$index === clickCell.index && col.prop === clickCell.property">
                            <el-input @blur="checkInput(clickCell.value,col,scope)" v-model.trim="clickCell.value"></el-input>
                        </template>
                        <template v-else-if="col.type === 'calc'">
                            <p>{{calcValue(scope,col)}}</p>
                        </template>
                        <template v-else-if="col.type === 'datetime'">
                            <el-date-picker
                                    v-model="scope.row[col.prop]"
                                    type="datetime"
                                    prefix-icon="none"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                            >
                            </el-date-picker>
                        </template>
                        <template v-else-if="col.type === 'select'">
                            <el-select v-model="scope.row[col.prop]">
                                <el-option
                                        v-for="select in col.options"
                                        :key="select.value"
                                        :label="select.label"
                                        :value="select.value"
                                >
                                </el-option>
                            </el-select>
                        </template>
                        <template v-else-if="col.type === 'operation'">
                            <template v-for="(item, index) in col.btn">
                                <el-button
                                        :key="index"
                                        :type="item.type"
                                        @click="item.click(scope)"
                                >{{item.label}}</el-button
                                >
                            </template>
                        </template>
                        <template v-else>
                            <p>{{ scope.row[col.prop] }}</p>
                        </template>
                    </template>
                </el-table-column>
            </el-table>

    </div>
</template>

<script>
    export default {
        name: "EditTable",
        props:{
          title:{
              type: String,
              default: '标题'
          },
          column:{
              type: Array,
              default: ()=> [],
              required: true
          },
            disabled:{
              type: Boolean,
                required: true,
                default: false
            },
            tableData: {
                type: Array,
                required: true,
                default: ()=> []
            },
            showToolBar: {
                type: Boolean,
                required: true,
                default: false
            }
        },
        data(){
            return{
                dataList: [],
                clickCell:{
                    index: -1,
                    value: "",
                    property: ""
                },
                currentRow: '',
                date: ""
            }
        },
        methods:{
            currentRowChange(row){
                this.currentRow = row;
            },
            cellClick(row,col){
                let property = col.property;
                let value = row[property];
                let index = row["_index"];
                this.clickCell = {
                    index: index,
                    value: value,
                    property: property
                }
            },
            blurInput(e, cell) {
                let { index, value, property } = cell;
                if (index < 0) {
                    return;
                }
                this.dataList[index][property] = value;
            },
            checkInput(val,col,scope){
                let prop = col.prop;
                let index = scope.$index;
                if(val !== ""){
                    if(isNaN(Number(val))){
                        this.dataList[index][prop] = "";
                    }else if(!isNaN(Number(val)) && col.precision){
                        this.dataList[index][prop] = this.formatDecimal(Number(val),col.precision)
                    }else{
                        this.dataList[index][prop] = Number(val);
                    }
                }else{
                    this.dataList[index][prop] = "";
                }
            },
            calcValue(scope, col) {
                // console.log(scope);
                // console.log(col);
                let condition = col.condition;
                while (condition.match(/{\w+}/) !== null) {
                    let key = condition.match(/{\w+}/)[0];
                    key = key.replace("{", "");
                    key = key.replace("}", "");
                    const value = scope["row"][key] || 0;
                    condition = condition.replace("{" + key + "}", value);
                }
                if (col.calSingle) {
                    let reg = /[\\+\-\\*/]/g;
                    let operator = condition.match(reg)[0];
                    let val = condition.split(operator);
                    let finalVal = 0;
                    switch (operator) {
                        case "*":
                            finalVal = this.multiply(Number(val[0]), Number(val[1]));
                            break;
                        default:
                            break;
                    }
                    // console.log(finalVal);
                    this.dataList[scope.$index][col.prop] = finalVal;
                    return finalVal;
                }
                return new Function("return " + condition)();
            },
            multiply(num1, num2){
                var m = 0,
                    s1 = num1.toString(),
                    s2 = num2.toString();
                try {
                    m += s1.split(".")[1].length;
                } catch (e) {
                    // console.log('相乘存在不是小数值');
                }
                try {
                    m += s2.split(".")[1].length;
                } catch (e) {
                    // console.log('相乘存在不是小数值');
                }
                return (
                    (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
                    Math.pow(10, m)
                );
            },
            formatDecimal(num, decimal){
            num = num.toString();
            let index = num.indexOf(".");
            if (index !== -1) {
                num = num.substring(0, decimal + index + 1);
            } else {
                num = num.substring(0);
            }
            return parseFloat(num).toFixed(decimal);
         },
            getDate() {
                let timeStamp = new Date().getTime();
                let date = new Date(timeStamp);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                if (month / 10 < 1) {
                    month = "0" + month;
                }
                let strDate = date.getDate();
                if (strDate / 10 < 1) {
                    strDate = "0" + strDate;
                }
                this.date = "FL" + year + "" + month + "" + strDate + "-";
            },
            getNowTime() {
                let now = new Date();
                let year = now.getFullYear(); //得到年份
                let month = now.getMonth(); //得到月份
                let date = now.getDate(); //得到日期
                month = month + 1;
                month = month.toString().padStart(2, "0");
                date = date.toString().padStart(2, "0");
                let hour = now.getHours();
                hour = hour.toString().padStart(2, "0");
                let minute = now.getMinutes();
                minute = minute.toString().padStart(2, "0");
                let seconds = now.getSeconds();
                seconds = seconds.toString().padStart(2, "0");
                this.dateTime = `${year}-${month}-${date} ${hour}:${minute}:${seconds}`;
                console.log(`${year}-${month}-${date} ${hour}:${minute}:${seconds}`);
            },
            addRow(){
                this.dataList.push(this.model);
                this.dataList = this.dataList.map((item,index)=>{
                    return{
                        ...item,
                        _index: index
                    }
                })
            },
            deleteRow(){
                if(this.currentRow._index !==undefined){
                    let _index = this.currentRow._index;
                    this.dataList.splice(_index,1);
                    this.dataList = this.dataList.map((item,index)=>{
                        return{
                            ...item,
                            _index: index
                        }
                    })
                }
            },
            getTableData(){
                return new Promise(resolve => {
                    try {
                        this.dataList.forEach((item,index)=>{
                            let item2Array = Object.entries(item);
                            item2Array.map(i=>{
                                if(this.rule[i[0]]){
                                    if(i[1]==="" || i[1]===undefined||i[1]===null){
                                        let i1 = 0;
                                        let filterArray = this.column.filter((v,i2)=>{
                                            if(v.prop === i[0]){
                                                i1 = i2;
                                                return true
                                            }
                                        });
                                        let label = filterArray[0]['label'];
                                        throw {index,i1,label}
                                    }
                                }
                            })
                        })
                    }catch (e) {
                        resolve({err:e,data:null})
                        return
                    }
                    let list = [...this.dataList];
                    let result = list.map(item=>{
                        let data = {};
                        for(let key in item){
                            let value = item[key];
                            if(key !== "_index"){
                                data[key] = value
                            }
                        }
                        return data;
                    });
                    resolve({err:null,data:result})
                })
            }
        },
        computed: {
            model(){
                let model = {};
                this.column.forEach(item=>{
                    if(item.type !== "operation"){
                        let prop = item.prop;
                        if (item.prependDate) {
                            model[prop] = this.date;
                        }else {
                            model[prop] = "";
                        }
                    }
                })
                return model
            },
            rule(){
                let rule = {};
                this.column.forEach(item => {
                    if(item.required){
                        let prop = item.prop;
                        rule[prop] = true;
                    }
                })
                return rule;
            }
        },
        created() {
            this.getDate();
            },
        mounted() {

        }
    }
</script>

<style scoped>
    .table-container {
        width: 100%;
        margin-top: 15px;
    }
    .table-tool {
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .table-title {
        color: #333;
        font-size: 16px;
        margin-right: 10px;
    }
    .edit-table {
        margin-bottom: 10px;
    }
    .el-input-group__prepend {
        padding: 0;
        background-color: transparent;
        border: 0;
        color: #333;
    }
    .el-input__inner {
        padding: 0;
        border: 0;
        background-color: transparent;
        color: #333;
    }
</style>
