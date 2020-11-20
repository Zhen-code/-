<template>
  <div class="hello">
    <downloadExcel
    :data="json_data"
    :fields="json_fields"
    :name="name">
      <button>导出·excel</button>
    </downloadExcel>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data(){
    return{
      type: 'en',
      name: '订单',
      json_data: [
        {
          FB: '1212121212',
          AD: '广州'
        },
        {
          FB: '78545454545',
          AD: '深圳'
        }
      ],
      json_fields: {},
      json_meta: [
              [
                {
                  key: "charset",
                  value: "utf-8"
                }
              ]
      ]
    }
  },
  created() {
    if(this.type === 'cn'){
      this.json_fields = {
        "提单号": "FB",
        "发货地": "AD"
      };
      this.name = "订单"
    }else{
      console.log(666)
      this.json_fields = {
        "BL·NO": "FB",
        "address": "AD"
      };
      this.name = "order"
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
