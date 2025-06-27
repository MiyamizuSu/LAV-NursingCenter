<script setup lang="ts">
import { useRouter } from 'vue-router';
import 'vue-sonner/style.css'
import SidebarProvider from './components/ui/sidebar/SidebarProvider.vue';
import AppSideBar from './components/custom/AppSideBar.vue';
import SidebarTrigger from './components/ui/sidebar/SidebarTrigger.vue';
import Button from './components/ui/button/Button.vue';
import 'element-plus/dist/index.css'
import axios from 'axios'
import { provide } from 'vue';

const router=useRouter()
// router.push('/login')
router.push('/main/nursingLevel')


axios.defaults.baseURL='http://localhost:9000/'
// 请求拦截器和响应拦截器全局设置
//请求拦截器
axios.interceptors.request.use(function(config) {
    console.log('在发送请求之前做些什么');
		// 利用前端Session获得令牌信息
		let token=sessionStorage.getItem('token');
		console.log(token);
		// 把令牌加入请求的头部报文中
		// 给请求对象的头部报文中增加一个键，该键名为token
		// null等价于false
		// !=null 等价于true
		// if(token！=null)可以简写为if(token)
		if(token){
			config.headers['token']=token;
		}
		
    return config;
  }, 
  function(error) {
    console.log('对请求错误做些什么');
    return Promise.reject(error);
});

//响应拦截器
axios.interceptors.response.use(function(response) {
    console.log('在响应之前做些什么');
		console.log(response.data);
		if(response.data==='invalid token'){
		  router.push('/errorPage');
		}
    return response;
  }, 
  function(error) {
    console.log('对响应错误做点什么');
    return Promise.reject(error);
});

// 实现axios对象全局注入
provide('axios',axios);

</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <RouterView></RouterView>
    <!-- <CheckIn></Checkin> -->
    <!-- <SidebarProvider>
      <AppSideBar></AppSideBar>
      <SidebarTrigger></SidebarTrigger>
    </SidebarProvider> -->
  </div>
</template>

<style scoped>
</style>
