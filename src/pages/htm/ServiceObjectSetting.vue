<!-- 系统管理员端 健康管家 设置服务对象 -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { type User, type Customer } from '@/lib/type.d';
import { ElMain, ElMessage, ElNotification, ElTable, ElButton, ElCol, ElMessageBox } from 'element-plus'
import Button from '@/components/ui/button/Button.vue';
import { useRouter } from 'vue-router';
import { axiosInstance as axios } from '@/lib/core'

onMounted(() => {
    loadData()
})

const router = useRouter()

// 管家分页数据
let allNurses = ref([] as User[])

/**
 * 管家的分页
 */
let nurse_total = ref(0)
let nurse_queryEntity = ref({
    userType: 1, //只看健康管家
    name: "",
    current: 1,
    size: 5
})

const nurse_handleSizeChange = (val: number) => {
    nurse_queryEntity.value.size = val
    loadData()
}

const nurse_handleCurrentChange = (val: number) => {
    nurse_queryEntity.value.current = val
    loadData()
}

const manageNursingCustomers = (nurse: User) => {
    router.push({
        path: '/main/manageNursingCustomers',
        query: {
            currentNurse: JSON.stringify(nurse)
        }
    })
}

const loadNurses = () => {
    axios.post("http://localhost:9000/user/page", nurse_queryEntity.value)
        .then(res => {
            if (res.data.status == 200) {
                allNurses.value = res.data.data
                nurse_total.value = res.data.total

            } else {
                ElNotification({
                    title: 'Error',
                    message: res.data.msg,
                    type: 'error',
                })
            }
        })
}

const loadData = () => {
    loadNurses()
}

</script>

<template>
    <el-container style="align-content: center; overflow-y: auto;">
        <!-- <p style="margin-top: -5vh; text-align: center; font-size: 20px; font-weight: bold;">护理记录</p> -->
        <el-col style="margin-left: 5%; width: 95%;">
            <p style="">
                <!-- 搜索框 -->
                <el-input v-model="nurse_queryEntity.name" clearable placeholder="管家姓名" style="width: 30vh;"></el-input>
                <Button @click="loadNurses" class="add-button" style="margin-left: 2vh;">查询</Button>
            </p>
            <br><br>

            <div style="background-color: #007bff; margin-top: 2vh; width: 1250px; height: 3vh; align-content: center;">
                <label style="font-size: 16px; font-weight: bold; color: white; font-size: 15px; ">健康管家列表</label>
            </div>
            <el-table :data="allNurses" :stripe="true" style="width: 1250px;">
                <el-table-column type="index" label="序号" width="100">
                </el-table-column>
                <el-table-column property="name" label="姓名" width="180">
                </el-table-column>
                <el-table-column property="phoneNumber" label="电话" width="200">
                </el-table-column>
                <el-table-column label="性别" width="150">
                    <template #default="scope">
                        <span v-if="scope.row.gender == 1">男</span>
                        <span v-else>女</span>
                    </template>
                </el-table-column>
                <el-table-column property="email" label="邮箱" width="300">
                </el-table-column>

                <el-table-column label="操作" width="320" style="text-align: center;">
                    <template #default="scope">
                        <Button @click="manageNursingCustomers(scope.row)"
                            style="background-color: #007bff; color: white; ">设置服务对象</Button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination :current-page="nurse_queryEntity.current" :page-sizes="[1, 5, 10, 50]"
                :default-page-size="nurse_queryEntity.size" @update:page-size="nurse_handleSizeChange"
                @update:current-page="nurse_handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :total="nurse_total" style="margin-top: 10vh;" />
        </el-col>
    </el-container>
</template>

<style lang="css" scoped>
.add-button {
    background-color: #007bff;
    font-size: 16px;
}
</style>
