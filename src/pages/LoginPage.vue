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

const router=useRouter()

type UserMes = {
    username: string;
    userPassword: string;
}
const formSchema = toTypedSchema(z.object({
    username: z.string(),
    userPassword: z.string()
}))

const { handleSubmit } = useForm({
    validationSchema: formSchema,
})

const user1 = ref<UserMes>({
    username: '',
    userPassword: ''
})

const jump=()=>{
    router.push('/main')
}

</script>

<template>
    <div class="flex justify-center items-center h-screen w-screen ">
        <Card class="absolute h-[50vh] w-[30vw] -translate-x-1/4 z-1">
            1
        </Card>
        <Card class="z-10 h-[40vh] w-[25vw]">
            <CardContent>
                <form class="grid gap-4">
                    <FormField v-slot="{ componentField }" name="username">
                        <FormLabel>账号</FormLabel>
                        <FormControl>
                            <IInput v-bind:componentField v-model="user1.username"></IInput>
                        </FormControl>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="userPassword">
                        <FormLabel>密码</FormLabel>
                        <FormControl>
                            <IInput type="password" v-bind:componentField v-model="user1.userPassword"></IInput>
                        </FormControl>
                    </FormField>
                </form>
                <div class="flex justify-end mt-10">
                    <Button class=" mt-4" @Click="jump" >提交</Button>
                </div>
                
            </CardContent>
        </Card>
    </div>
</template>