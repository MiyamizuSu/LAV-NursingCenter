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
import Button from '@/components/ui/button/Button.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { motion } from 'motion-v'
import { axiosInstance as axios } from '@/lib/core'
import { ElMessage } from 'element-plus'
const router = useRouter()

type UserMes = {
    account: string,
    password: string
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
    password: ''
})

const jump = () => {
    router.push('/main')
}

const simpleLogin= async()=>{
     const res= await axios.post("/user/login",user1.value)
     console.log(res)
     jump()

}

const login = () => {
    axios.post("/user/login", user1.value).then(response => {
		let rb = response.data;
		if (rb.status == 200) {
			// 取得登录成功的用户的令牌
			let token = rb.data;
            // console.log('token: ', token)
			// 把用户令牌存入前端Session中
			sessionStorage.setItem('token', token);
            axios.post("/user/load", {}).then(res => {
                if (res.data.status == 200) {
                    sessionStorage.setItem("user", JSON.stringify(res.data.data))
                    // 登录成功
                    ElMessage({message: "登录成功！", type: "success"})
                    router.push('/main');
                }
            })
			
		} else {
			// 登录失败
			ElMessage({message: rb.msg, type: "error"})
		}
	})
}

</script>

<template>
    <div class="flex justify-center items-center h-screen w-screen overflow-auto ">
        <motion.div :initial="{
            x: -100,
            y: -100
        }" :animate="{
            x: 0,
            y: 0,
        }" :transition="{
            type: 'spring'
        }" class="absolute  -translate-x-1/4 z-1">
            <Card class="h-[50vh] w-[30vw]">
                1
            </Card>
        </motion.div>
        <motion.div 
        :initial="{
            x:100,
            y:100
        }"
        :animate="{
            x:0,
            y:0
        }"
        :transition="{
            type:'spring'
        }"
        class="z-10 h-[40vh] w-[25vw]">
            <Card class="">
                <CardContent>
                    <form class="grid gap-4">
                        <FormField v-slot="{ componentField }" name="username">
                            <FormLabel>账号</FormLabel>
                            <FormControl>
                                <IInput v-bind:componentField v-model="user1.account"></IInput>
                            </FormControl>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="userPassword">
                            <FormLabel>密码</FormLabel>
                            <FormControl>
                                <IInput type="password" v-bind:componentField v-model="user1.password"></IInput>
                            </FormControl>
                        </FormField>
                    </form>
                    <div class="flex justify-end mt-10">
                        <Button class=" mt-4" @Click="login">提交</Button>
                    </div>

                </CardContent>
            </Card>
        </motion.div>

    </div>
</template>
