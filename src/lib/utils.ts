import Axios, {type AxiosResponse} from 'axios';
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import _ from 'lodash'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const requestHeader={
  'Authorization': `Bearer 1244|k4RqFjRckv90WPqYZZT78kY5Yif2lGQrJVf7hkH5`,
  'Content-Type': 'multipart/form-data',
  'Access-Control-Allow-Origin':"*",
  'Accept':'application/json'
}

export const uploadFile = (file:File): Promise<AxiosResponse<any>> => Axios.post("https://picui.cn/api/v1/upload", {
  'file':file
},{
  withCredentials:false,
  headers:requestHeader
}).then((res) => {
   return res;
}).catch((error) => {
  console.error(error);
  throw error;
})

export const setDomFontSize = () => {
  const width = document.documentElement.clientWidth || document.body.clientWidth
  const fontsize = (width <= 200 ? 1200 : width) / 100 + 'px'
  const htmlStyle = document.getElementsByTagName('html')[0].style as CSSStyleDeclaration
  htmlStyle.fontSize = fontsize
}

let setDomFontSizeDebounce = _.debounce(setDomFontSize, 400)
window.addEventListener('resize', setDomFontSizeDebounce)