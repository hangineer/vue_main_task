
  import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
  // 產品資料格式
  const app = {
    data(){
      return{
        baseUrl:"https://vue3-course-api.hexschool.io",
        apiPath:"hannahtw",
        selectedItem : {},
        products:[],
        timeout: 5000,
        alertIsShow:false,
      }
    },
    mounted() {
        this.alertIsShow = true;
        //確認是否為管理者
        const adminToken =  document.cookie.replace(/(?:(?:^|.*;\s*)adminToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = adminToken; 
        axios.post(`${this.baseUrl}/v2/api/user/check`)
        .then(res => {
            this.getData();
        })
        .catch(err => {
            console.dir(err);
            window.location.href = "index.html";
        })
    },
    methods:{
        getData(){
            axios.get(`${this.baseUrl}/v2/api/${this.apiPath}/admin/products`)
            .then(res => {
                console.log(res);
                this.products = res.data.products;

            })
        },
        //數字轉千分位
        numberWithCommas(x){
            let num = x.toString().split(".")
            num[0] = num[0].replace(/\B(?=(\d{3})+(?!\d))/g,",") //\B: 另外一側必須不是 \w 的字元
            return num.join(".")
        },
    }

}
createApp(app).mount("#app")