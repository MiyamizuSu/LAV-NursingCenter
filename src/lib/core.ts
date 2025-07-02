import axios, { type AxiosInstance } from "axios";
import {  router  } from './router'
import type { Adapter } from "./type";

let baseUrl: string;
if (import.meta.env.VITE_DEV_ENV === 'sameSite') {
    baseUrl = import.meta.env.VITE_DEV_URL_SAMESITE
}
else {
    baseUrl = import.meta.env.VITE_DEV_URL_UNSAMESITE
}

export const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 1000,
})

//请求拦截器
axiosInstance.interceptors.request.use(function (config) {
    const currentPath = router.currentRoute.value.path;
    if (currentPath === '/login') {
        if (config.url?.indexOf('/user') != -1) {
            let token = localStorage.getItem('tokenu');
            console.log("用户登录发送token ", token)
            if (token) {
                config.headers['token'] = token;
            }
        } else {
            let token = localStorage.getItem('tokenc');
            if (token) {
                config.headers['token'] = token;
            }
        }
    }
    else if (currentPath.startsWith('/main')) {
        // 发送请求之前的动作
        // 利用前端Session获得令牌信息
        if (currentPath.startsWith('/main/nursingRecord2')
            || currentPath.startsWith('/main/dailyNursing')
            || currentPath.startsWith('/main/goOutApplication')
            || currentPath.startsWith('/main/checkOutApplication')) {
            let token = localStorage.getItem('tokenu1');
            if (token) {
                // console.log("发送tokenu1 ", token)
                config.headers['token'] = token;
            }
        } else {
            let token = localStorage.getItem('tokenu0');
            if (token) {
                // console.log("发送tokenu0 ", token)
                config.headers['token'] = token;
            }
        }
    }
    else if (localStorage.getItem('tokenu') != null) {
        let token = localStorage.getItem('tokenu');
        // console.log("发送tokenu ", token)
        if (token) {
            config.headers['token'] = token;
        }
    } else if (localStorage.getItem('tokenc') != null) {
        let token = localStorage.getItem('tokenc');
        // console.log("发送tokenc ", token)
        if (token) {
            config.headers['token'] = token;
        }
    }
    // else if(sessionStorage.getItem('userType')==null) {
    //     let token = localStorage.getItem('tokenc');
    //     console.log("发送tokenc ",token)
    //     if (token) {
    //         config.headers['token'] = token;
    //     }
    // }else if(sessionStorage.getItem('customerActive')==null){
    //     let token = localStorage.getItem('tokenu');
    //     console.log("发送tokenu ",token)
    //     if (token) {
    //         config.headers['token'] = token;
    //     }
    // }
    console.log("最终发送token  ", config.headers['token'])
    return config;
},
    function (error) {
        return Promise.reject(error);
});

//响应拦截器
axiosInstance.interceptors.response.use(function (response) {
    // 获取响应之前的动作
    // 当token失效时，会自动跳转至提示页面要求用户登录
    if (response.data === 'invalid token') {
        router.push('/errorPage');
    }
    return response;
},
    function (error) {
        return Promise.reject(error);
    });

export async function xhrWithAdapter<S extends object | object[], T extends object | object[]>(url: string, requestBody: object, adapter: Adapter<S, T>, axios: AxiosInstance = axiosInstance): Promise<T> {
    const response = (await axios.post<S>(url, requestBody)).data as { data: any };
    return adapter.adapt(response.data);
}
