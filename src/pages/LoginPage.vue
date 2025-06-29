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
    //  const res= await axios.post("/user/login",user1.value)
    //  console.log(res)
     jump()

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
                        <Button class=" mt-4" @Click="simpleLogin">提交</Button>
                    </div>

                </CardContent>
            </Card>
        </motion.div>

    </div>
</template>