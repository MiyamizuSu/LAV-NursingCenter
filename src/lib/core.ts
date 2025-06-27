import axios from "axios";

let baseUrl:string;
if(import.meta.env.VITE_DEV_ENV==='sameSite'){
    baseUrl=import.meta.env.VITE_DEV_URL_SAMESITE
}
else{
    baseUrl=import.meta.env.VITE_DEV_URL_UNSAMESITE
}
export const axiosInstance=axios.create({
    baseURL:baseUrl,
    timeout:1000,
})