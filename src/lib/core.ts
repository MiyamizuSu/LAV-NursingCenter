import axios from "axios";
import {router} from './router'

let baseUrl:string;
if(import.meta.env.VITE_DEV_ENV==='sameSite'){
    baseUrl=import.meta.env.VITE_DEV_URL_SAMESITE
}
else{
    baseUrl=import.meta.env.VITE_DEV_URL_UNSAMESITE
}

const axiosInstance=axios.create({
    baseURL:baseUrl,
    timeout:1000,
})

//请求拦截器
axiosInstance.interceptors.request.use(function(config) {
    // 发送请求之前的动作
	// 利用前端Session获得令牌信息
	let token=sessionStorage.getItem('token');
	// console.log(token);
	// 把令牌加入请求的头部报文中
	if(token){
		config.headers['token']=token;
	}
    return config;
  },
  function(error) {
    return Promise.reject(error);
});

//响应拦截器
axiosInstance.interceptors.response.use(function(response) {
    // 获取响应之前的动作
    // 当token失效时，会自动跳转至提示页面要求用户登录
	if(response.data ==='invalid token'){
		router.push('/errorPage');
	}
    return response;
  },
  function(error) {
    return Promise.reject(error);
});

export {
    axiosInstance
}
