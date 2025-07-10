<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { FormField } from '@/components/ui/form'
import FormControl from '@/components/ui/form/FormControl.vue'
import FormLabel from '@/components/ui/form/FormLabel.vue'
import IInput from '@/components/ui/insput/IInput.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { motion } from 'motion-v'
import { axiosInstance as axios, createWebSocket, resetWebSocket } from '@/lib/core'
import { ElMessage } from 'element-plus'
import DynamicButton from '@/components/custom/DynamicButton.vue'
import { toast } from 'vue-sonner'
import { onMounted, onUnmounted } from 'vue'
const router = useRouter()

const isCustomerLogin = ref(false)

type UserMes = {
    account: string,
    password: string
    rememberMe: boolean
}
const formSchema = toTypedSchema(z.object({
    username: z.string(),
    userPassword: z.string()
}))

const { handleSubmit } = useForm({
    validationSchema: formSchema,
})

const user1 = ref<UserMes>({
    account: '',
    password: '',
    rememberMe: false
})

async function userlogin() {
    const { promise, resolve, reject } = Promise.withResolvers<undefined>();
    toast.promise(promise, {
        loading: '登陆中...',
        success: () => '登陆成功',
        error: (reason: string) => reason
    })
    try {
        const response = await axios.post("/user/login", user1.value)
        let rb = response.data;
        if (rb.status == 200) {
            // 取得登录成功的用户的令牌
            let token = rb.data;
            // 把用户令牌存入前端Session中
            sessionStorage.removeItem('customerActive')
            localStorage.setItem('tokenu', token)
            const res = await axios.post("/user/load", {})
            if (res.data.status == 200) {
                // 登录成功
                if (res.data.data.userType == 0) {
                    localStorage.setItem('tokenu0', token)
                    localStorage.setItem('user0', JSON.stringify(res.data.data))
                    sessionStorage.setItem('userType', res.data.data.userType)
                    localStorage.setItem('AdminUsing', "1")
                } else {
                    localStorage.setItem('tokenu1', token)
                    localStorage.setItem('user1', JSON.stringify(res.data.data))
                    sessionStorage.setItem('userType', res.data.data.userType)
                    localStorage.setItem('NurseUsing', "1")
                }
                const wb = await createWebSocket( res.data.data.userId)
                    if (user1.value.rememberMe) {
                        localStorage.setItem('isRemember', 'true')
                    }

                resetWebSocket(wb)
                resolve(undefined)
                router.push('/main')
            }
        }
        else {
            reject('登陆失败')
        }
    }
    catch(e) {
        console.log(e)
        reject('请检查网络设置')
    }


}
const customerLogin = () => {
    axios.post("/customer/login", {
        phoneNumber: user1.value.account,
        password: user1.value.password
    }).then(response => {
        let rb = response.data;
        if (rb.status == 200) {
            // 取得登录成功的用户的令牌
            let token = rb.data;
            sessionStorage.removeItem('userType')
            // console.log('token: ', token)
            // 把用户令牌存入前端Session中
            localStorage.setItem('tokenc', token);
            localStorage.removeItem('tokenu')
            axios.post("/customer/load", {}).then(res => {
                if (res.data.status == 200) {
                    localStorage.setItem('customer', JSON.stringify(res.data.data))
                    sessionStorage.setItem('customerActive', '1')
                    localStorage.setItem('customerUsing', '1')
                    // 登录成功
                    if (user1.value.rememberMe) {
                        localStorage.setItem('isRemember', 'true')
                    }

                    ElMessage({ message: "登录成功！", type: "success" })
                    router.push('/mealReservation');
                }
            })

        } else {
            // 登录失败
            ElMessage({ message: rb.msg, type: "error" })
        }
    })
}

</script>

<template>
    <div class="fixed inset-0 z-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div v-for="i in 150" :key="i" class="particle" :style="`
        --x-start: ${Math.random()};
        --y-start: ${Math.random()};
        --x-end: ${Math.random()};
        --y-end: ${Math.random()};
        --particle-size: ${4 + Math.random() * 6}px;
        --particle-color: hsl(${200 + Math.random() * 60}, 70%, 70%);
        animation-delay: ${Math.random() * -20}s;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
     `">
        </div>
    </div>
    <div class="flex justify-center items-center h-screen w-screen bg-gradient-to-br dark:bg-slate-900 to-indigo-50">
        <motion.div :initial="{
            x: -100,
            y: -100
        }" :animate="{
            x: 0,
            y: 0,
        }" :transition="{
            type: 'spring'
        }" class="absolute  -translate-x-1/4 z-1">

        </motion.div>
        <motion.div :initial="{
            x: 100,
            y: 100
        }" :animate="{
            x: 0,
            y: 0
        }" :transition="{
            type: 'spring'
        }" class="w-full max-w-md px-4 mx-auto">

            <Card class="shadow-xl rounded-2xl overflow-hidden border-none dark:bg-slate-900 backdrop-blur-sm">
                <CardContent class="p-8 space-y-6">
                    <div class="text-center space-y-4">
                        <div class="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                            <h1 class="text-3xl font-bold text-transparent">
                                {{ isCustomerLogin ? '膳食预定系统' : '护理中心' }}
                            </h1>
                        </div>
                        <p class="text-gray-500 text-sm">欢迎回来，请登录您的账号</p>
                    </div>

                    <el-form class="space-y-4" @submit.prevent="isCustomerLogin ? customerLogin : userLogin">
                        <FormField v-slot="{ componentField }" name="username">
                            <div class="space-y-2">
                                <FormLabel class="text-gray-600 font-medium">账号</FormLabel>
                                <FormControl>
                                    <IInput v-bind:componentField v-model="user1.account" clearable
                                        class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all dark:bg-slate-800"
                                        placeholder="请输入手机号/账号" />
                                </FormControl>
                            </div>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="userPassword">
                            <div class="space-y-2">
                                <div class="flex justify-between items-center">
                                    <FormLabel class="text-gray-600 font-medium">密码</FormLabel>
                                </div>
                                <FormControl>
                                    <IInput type="password" v-bind:componentField v-model="user1.password"
                                        class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all  dark:bg-slate-800"
                                        placeholder="请输入密码" />
                                </FormControl>
                            </div>
                        </FormField>

                        <div class="flex items-center justify-between pt-2">
                            <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" v-model="user1.rememberMe"
                                    class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500/50" />
                                <span class="text-gray-600 text-sm">记住登录状态</span>
                            </label>
                            <button type="button" @click="isCustomerLogin = !isCustomerLogin"
                                class="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                                {{ isCustomerLogin ? '切换到员工登录' : '切换到客户登录' }}
                            </button>
                        </div>

                        <!-- 动态提交按钮 -->
                        <div class="flex justify-end mt-10 ">
                            <DynamicButton class="mt-4  dark:bg-slate-800 rounded-lg"
                                @Click="isCustomerLogin ? customerLogin() : userLogin()">
                                {{ isCustomerLogin ? '膳食预定' : '用户登录' }}
                            </DynamicButton>
                        </div>
                    </el-form>
                </CardContent>
            </Card>
        </motion.div>
    </div>
</template>

<style scoped>
.particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 0;
}

.particle {
    position: absolute;
    background-color: var(--particle-color, #93c5fd);
    border-radius: 50%;
    animation: float 20s infinite linear;
    width: var(--particle-size, 6px);
    height: var(--particle-size, 6px);
    opacity: 0.4;
    filter: blur(1px);
}

/* 新增渐变背景动画 */
div[class^="fixed"]::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg,
            #c7d2feaa 0%,
            #a5b4fcaa 25%,
            #818cf8aa 50%,
            #6366f1aa 75%,
            #4f46e5aa 100%);
    animation: gradient-move 20s linear infinite;
    z-index: -1;
}

div[class^="fixed"]::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%,
            rgba(199, 210, 254, 0.3) 0%,
            rgba(165, 180, 252, 0.2) 30%,
            transparent 70%);
    pointer-events: none;
}

@keyframes float {

    0%,
    100% {
        transform: translate(calc(-100vw * var(--x-start)), calc(-100vh * var(--y-start)));
        opacity: 0.2;
    }

    50% {
        transform: translate(calc(100vw * var(--x-end)), calc(100vh * var(--y-end)));
        opacity: 0.6;
    }
}

@keyframes gradient-move {
    0% {
        transform: rotate(0deg) scale(1.5);
    }

    100% {
        transform: rotate(360deg) scale(1.5);
    }
}
</style>