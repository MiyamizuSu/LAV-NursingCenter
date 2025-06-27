<!-- 系统管理员端 健康管家 服务关注 -->
<style lang="css" scoped>
    .add-button {
        background-color: #007bff;
        font-size: 16px;
    }
</style>

<template>
    <el-container style="align-content: center; overflow-y: auto;">
        <!-- <p style="margin-top: -5vh; text-align: center; font-size: 20px; font-weight: bold;">护理记录</p> -->
        <el-col style="margin-left: 5%; width: 95%;">
            <p>
                <!-- 搜索框 -->
                <el-input v-model="customer_queryEntity.name" clearable placeholder="客户姓名" style="width: 30vh;"></el-input>
                <Button @click="loadCustomers" class="add-button" style="margin-left: 2vh;">查询</Button>
            </p>
            <br><br>

            <div style="background-color: #007bff; margin-top: 2vh; width: 1300px; height: 3vh; align-content: center;">
                <label style="font-size: 16px; font-weight: bold; color: white; font-size: 15px; ">客户信息列表</label>
            </div>
            <el-table :data="allCustomers" :stripe="true" style="width: 1300px;">
                <el-table-column type="index" label="序号" width="110"
                    >
                </el-table-column>
                <el-table-column property="name" label="客户姓名" width="150"
                    >
                </el-table-column>
                <el-table-column property="age" label="年龄" width="130"
                    >
                </el-table-column>
                <el-table-column label="性别" width="130"
                    >
                    <template #default="scope">
                        <span v-if="scope.row.gender==1">男</span>
                        <span v-else>女</span>
                    </template>
                </el-table-column>
                <el-table-column property="bedNumber" label="床位号" width="150"
                    >
                </el-table-column>
                <el-table-column property="nursingLevelName" label="护理级别" width="150"
                    >
                </el-table-column>
                <el-table-column property="phoneNumber" label="联系电话" width="180"
                    >
                </el-table-column>
                <el-table-column  label="操作" width="300" style="text-align: center;">
                    <template #default="scope">
                        <Button @click="manageCustomerPrograms(scope.row)"
                            style="background-color: #007bff; color: white;">配置护理项目</Button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                :current-page="customer_queryEntity.current"
                :page-sizes="[1, 5, 10, 50]"
                :default-page-size="customer_queryEntity.size"
                @update:page-size="customer_handleSizeChange"
                @update:current-page="customer_handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                :total="customer_total"
                style="margin-top: 10vh;"
            />
        </el-col>
    </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, inject } from 'vue';
import { type User, type Customer} from '@/lib/type.d';
import { type AxiosInstance } from 'axios'
import { ElMain, ElMessage, ElNotification, ElTable, ElButton, ElCol, ElMessageBox } from 'element-plus' 
import {Edit, Setting, Delete } from '@element-plus/icons-vue'
import Button from '@/components/ui/button/Button.vue';
import { useRouter } from 'vue-router';

const axios = inject('axios') as AxiosInstance

onMounted(() => {
    loadData()
})

const router = useRouter()

// 客户分页数据
let allCustomers = ref([] as Customer[])

/**
 * 客户的分页
 */
let customer_total = ref(0)
let customer_queryEntity = ref({
    customerType: 1, //只看护理老人
    name: "",
    current: 1,
    size: 5
})

const customer_handleSizeChange = (val: number) => {
    customer_queryEntity.value.size = val
    loadData()
}

const customer_handleCurrentChange = (val: number) => {
    customer_queryEntity.value.current = val
    loadData()
}

const manageCustomerPrograms = (customer: Customer) => {
    if (customer.nursingLevelName == null || customer.nursingLevelName.length == 0) {
        ElMessage({message: "请先配置该客户的护理级别！", type: "warning"})
        return;
    }

    router.push({
        path: '/main/manageCustomerPrograms',
        query: {
            currentCustomer: JSON.stringify(customer)
        }
    })
}

const loadCustomers = () => {
    axios.post("http://localhost:9000/customer/page", customer_queryEntity.value)
    .then(res => {
        if (res.data.status == 200) {
            allCustomers.value = res.data.data
            customer_total.value = res.data.total

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
    loadCustomers()
}


</script>
