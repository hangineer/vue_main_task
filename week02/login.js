import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const app = {
    data(){
        return {
            baseUrl:"https://vue3-course-api.hexschool.io",
            userInfo:{
                username:"",
                password:""
            },
        }
    },
    methods:{
        login(){
            axios.post(`${this.baseUrl}/v2/admin/signin`, this.userInfo)
            .then(res => {
                const { token , expired } = res.data;
                //寫入
                document.cookie = `adminToken = ${token}; expired = ${new Date(expired)};`
                window.location.href = "product.html"

            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: '請確認電子郵件與密碼無誤',
                    showConfirmButton: true,
                    timer: 3000                  
                });
                console.dir(err);
                throw(err);
            })
        }
    }
}
createApp(app).mount("#app")