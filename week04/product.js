
import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

import pagination from "./components/pagination.js"; //全域註冊
import productsModal from "./components/productsModal.js";
import deleteModal from "./components/deleteModal.js";

let  productModal = null;
let  delProductModal = null;

  // 產品資料格式
  const app = createApp({
    data(){
      return{
        baseUrl: "https://vue3-course-api.hexschool.io",
        apiPath: "hannahtw",
        selectedItem: {},
        products: [],
        isNew: true,
        tempProduct: {
            imagesUrl: [],
        },
        page:{}, 
      }
    },
    components:{
        pagination,
        productsModal,
        deleteModal
    },
    mounted() {
        //讀取 token
        const adminToken =  document.cookie.replace(/(?:(?:^|.*;\s*)adminToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = adminToken; 
        this.checkIsAdmin();
        
        //彈跳視窗
        // https://getbootstrap.com/docs/5.0/components/modal/#via-javascript
        productModal = new bootstrap.Modal(document.getElementById("productModal"), { 
            keyboard: false });
        delProductModal = new bootstrap.Modal(document.getElementById("delProductModal"), {
            keyboard: false });
    },
    methods:{
        checkIsAdmin(){
            axios.post(`${this.baseUrl}/v2/api/user/check`)
            .then(res => {
                Swal.fire({
                    icon: 'success',
                    title: '登入及驗證成功',
                    showConfirmButton: true,
                    timer: 2000
                  });
                this.getData();
            })
            .catch(err => {
                console.dir(err);
                window.location.href = "index.html";
            })
        },
        getData(page = 1){ //ES6 預設參數
            axios.get(`${this.baseUrl}/v2/api/${this.apiPath}/admin/products/?page=${page}`)
            .then(res => {
                this.products = res.data.products
                this.page = res.data.pagination
                console.log("res!!!",res)
                
            })
            .catch(err => { 
                console.dir(err);
                throw(err);
            })
        },
        //數字轉千分位
        numberWithCommas(x){
            let num = x.toString().split(".")
            num[0] = num[0].replace(/\B(?=(\d{3})+(?!\d))/g,",") //\B: 另外一側必須不是 \w 的字元
            return num.join(".")
        },
        openModal(status,product){
            if(status === "edit"){
                this.tempProduct = {...product};
                this.isNew = false;
                productModal.show();
            }else if(status === "add"){
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            }else if(status === "delete"){
                this.tempProduct = {...product};
                delProductModal.show();
            }
        },
        //新增圖片
        createImages(){
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push("");
        },
        //更新商品內容
        updateProduct(){
            //參考答案中的寫法，是可以共用的
            let url = `${this.baseUrl}/v2/api/${this.apiPath}/admin/product`;
            let http_request = "post";

            if(this.isNew === false){
                url = `${this.baseUrl}/v2/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                http_request = "put";
            }       
            axios[http_request](url, { data: this.tempProduct })
            .then(res => {
                Swal.fire({
                icon: 'success',
                text: res.data.message,
                showConfirmButton: true,
                timer: 2000                  
                })
                productModal.hide();
                this.getData();
            })
            .catch(err => {
                console.dir(err)
                Swal.fire({
                icon: 'error',
                text: err.response.data.message,
                showConfirmButton: true,
                timer: 2000                  
            })
            })
        },
        checkDelProduct(){
           axios.delete(`${this.baseUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`)
           .then(res => {
            delProductModal.hide();
            Swal.fire({
                icon: 'success',
                text: res.data.message,
                showConfirmButton: true,
                timer: 2000                  
            })
            this.getData();
           })
           .catch(err => {
            delProductModal.hide();
            if(err.response.status === 404)
            Swal.fire({
                icon: 'error',
                text: '您所查看的API不存在 >_<',
                showConfirmButton: true,
                timer: 2000                  
            })
           })
        },

    }
  })
app.mount("#app")