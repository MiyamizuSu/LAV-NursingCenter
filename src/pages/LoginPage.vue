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
import { axiosInstance as axios } from '@/lib/core'
import { ElMessage } from 'element-plus'
import DynamicButton from '@/components/custom/DynamicButton.vue'
import { toast} from 'vue-sonner'
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

const login = async () => {
    const response = await axios.post("/user/login", user1.value)
    let rb = response.data;
    if (rb.status == 200) {
        let token = rb.data;
        sessionStorage.setItem('token', token);
        const res = await axios.post("/user/load", {})
        if (res.data.status == 200) {
            sessionStorage.setItem("user", JSON.stringify(res.data.data))
            toast.success('登陆成功')
            router.push('/main');
        }
    } else {
        toast.error('登陆失败')
    }
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
        <motion.div :initial="{
            x: 100,
            y: 100
        }" :animate="{
            x: 0,
            y: 0
        }" :transition="{
            type: 'spring'
        }" class="z-10 h-[40vh] w-[25vw]">
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
                        <DynamicButton class=" mt-4" @Click="login">提交</DynamicButton>
                    </div>

                </CardContent>
            </Card>
        </motion.div>

    </div>
</template>
