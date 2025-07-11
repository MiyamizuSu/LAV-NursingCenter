import axios, { type AxiosInstance } from "axios";
import { router } from './router'
import type { Adapter } from "./type";

let baseUrl: string;
let domain:string
let appWebSocket: WebSocket = new WebSocket('');
if (import.meta.env.VITE_DEV_ENV === 'sameSite') {
    domain=import.meta.env.VITE_DEV_DOMAIN_SAMESITE
    baseUrl = import.meta.env.VITE_DEV_URL_SAMESITE
}
else {
    domain=import.meta.env.VITE_DEV_DOMAIN_UNSAMESITE
    baseUrl = import.meta.env.VITE_DEV_URL_UNSAMESITE
}

export const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 20000,
})

//请求拦截器
axiosInstance.interceptors.request.use(function (config) {
    const currentPath = router.currentRoute.value.path;
    if (currentPath === '/login') {
        if (config.url?.indexOf('/user') != -1) {
            let token = localStorage.getItem('tokenu');
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
        if (sessionStorage.getItem("userType") == '1') {
            let token = localStorage.getItem('tokenu1');
            if (token) {
                config.headers['token'] = token;
            }
        } else if (sessionStorage.getItem("userType") == '0') {
            let token = localStorage.getItem('tokenu0');
            if (token) {
                config.headers['token'] = token;
            }
        }
    }
    else if (config.url?.indexOf('/user') != -1 && localStorage.getItem('tokenu') != null) {
        let token = localStorage.getItem('tokenu');
        if (token) {
            config.headers['token'] = token;
        }
    } else if (localStorage.getItem('tokenc') != null) {
        let token = localStorage.getItem('tokenc');
        if (token) {
            config.headers['token'] = token;
        }
    }
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
        if (sessionStorage.getItem('userType') == '1') {
            localStorage.removeItem('NurseUsing');
            sessionStorage.removeItem('userType');
        } else if (sessionStorage.getItem('userType') == '0') {
            localStorage.removeItem('AdminUsing');
            sessionStorage.removeItem('userType');
        } else if (sessionStorage.getItem('customerActive') != null) {
            localStorage.removeItem('customerUsing');
            sessionStorage.removeItem('customerActive');
        }
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
export async function createWebSocket(userId: number) {
    const { promise: wbPromise, resolve, reject } = Promise.withResolvers<WebSocket>();
    const wb = new WebSocket(`ws://${domain}/webSocket/${userId}`);
    wb.addEventListener('open', function () {
        console.log("websocket connectin!")
        resolve(wb);
    })
    wb.addEventListener('error', function (e) {
        reject(`网络异常,websocket未能正确连接 reason:${e}`)
    })
    return wbPromise
}
export function useWebSocket(){
    return appWebSocket
}
export function resetWebSocket(wb:WebSocket){
    appWebSocket=wb;
}
