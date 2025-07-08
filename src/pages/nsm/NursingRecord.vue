<!-- 系统管理员端 护理管理 护理记录 -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { type NursingRecord, type Customer } from '@/lib/type.d';
import { ElMain, ElMessage, ElNotification, ElTable, ElButton, ElCol, ElDialog, ElMessageBox } from 'element-plus'
import Button from '@/components/ui/button/Button.vue';
import { axiosInstance as axios } from '@/lib/core'

onMounted(() => {
    loadData()
})

// 分页数据
let nursingCustomers = ref<Customer[]>([])
let selectedCustomer = ref({} as Customer)

let currentRecords = ref([] as NursingRecord[])

// 多选框选中的护理记录（用于批量移除）
let multipleSelection = ref([] as NursingRecord[])

const handleSelectionChange = (val: NursingRecord[]) => {
    multipleSelection.value = val
}

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

/**
 * 当前客户护理记录的分页
 */
let record_total = ref(0)
let record_queryEntity = ref({
    customerId: 0,
    current: 1,
    size: 5
})

const record_handleSizeChange = (val: number) => {
    record_queryEntity.value.size = val
    loadRecords()
}

const record_handleCurrentChange = (val: number) => {
    record_queryEntity.value.current = val
    loadRecords()
}

const start_viewRecords = (customer: Customer) => {
    selectedCustomer.value = customer
    loadRecords()

}

// 删除选中的单个护理记录
const start_deleteRecord = (record: NursingRecord) => {
    ElMessageBox.confirm('确定删除该护理记录吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        axios.post("http://localhost:9000/nursingRecord/delete", { id: record.id })
            .then(res => {
                if (res.data.status == 200) {
                    loadData()
                    ElMessage({ message: "删除成功！", type: "success" })
                } else {
                    loadData()
                    ElNotification({
                        title: 'Error',
                        message: res.data.msg,
                        type: 'error',
                    })
                }
            })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消删除'
        });
    });
}

// 批量删除记录
const start_deleteBatch = () => {
    if (multipleSelection.value.length == 0) {
        ElMessage({ message: "请先选中至少一条数据！", type: "warning" })
        return;
    }
    ElMessageBox.confirm('确定删除所有选中的护理记录吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        axios.post("http://localhost:9000/nursingRecord/deleteBatch", multipleSelection.value)
            .then(res => {
                if (res.data.status == 200) {
                    loadRecords()
                    ElMessage({ message: res.data.data, type: "success" })
                } else {
                    loadRecords()
                    ElNotification({
                        title: 'Error',
                        message: res.data.msg,
                        type: 'error',
                    })
                }
            })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消删除'
        });
    });
}

const loadUsers = () => {
    axios.post("http://localhost:9000/customer/page", customer_queryEntity.value)
        .then(res => {
            if (res.data.status == 200) {
                nursingCustomers.value = res.data.data
                customer_total.value = res.data.total
                console.log(nursingCustomers.value)
                // ElMessage({message: "加载成功！", type: "success"})
                selectedCustomer.value = nursingCustomers.value[0]
                console.log(selectedCustomer.value)
                loadRecords()
            } else {
                ElNotification({
                    title: 'Error',
                    message: res.data.msg,
                    type: 'error',
                })
            }
        })
}

const loadRecords = () => {
    record_queryEntity.value.customerId = selectedCustomer.value.customerId
    axios.post("http://localhost:9000/nursingRecord/page", record_queryEntity.value)
        .then(res => {
            if (res.data.status == 200) {
                currentRecords.value = res.data.data
                record_total.value = res.data.total

                console.log(currentRecords.value)
            } else {
                currentRecords.value = res.data.data
                record_total.value = res.data.total
                ElNotification({
                    title: 'Error',
                    message: res.data.msg,
                    type: 'error',
                })
            }
        })
}

const loadData = () => {
    loadUsers()
}

</script>

<template>
    <el-container style="padding: 0; width: 100%;">
        <el-card shadow="hover" class="section-card" style="width: 100%;">
            <p>
                <el-input v-model="customer_queryEntity.name" clearable placeholder="客户姓名"
                    style="width: 30vh;"></el-input>
                <Button @click="loadUsers" class="add-button" style="margin-left: 2vh;">查询</Button>
            </p>
            <br>

            <!-- 左右表格区域 -->
            <el-row style="width: 100%;">
                <el-card style="width: 43%; height: 70vh; overflow-y: auto;">
                    <div
                        style="background-color: #007bff; font-size: 16px; font-weight: bold; width: 100%; height: 3vh; align-content: center;">
                        <label style="text-align: center; color: white; font-size: 15px; "> 客户信息</label>
                    </div>
                    <el-table :data="nursingCustomers" :border="true" :stripe="true" :fit="true">
                        <el-table-column type="index" label="序号" align="center">
                        </el-table-column>
                        <el-table-column property="name" label="姓名" align="center">
                        </el-table-column>
                        <el-table-column property="age" label="年龄" align="center">
                        </el-table-column>
                        <el-table-column label="性别" align="center">
                            <template #default="scope">
                                <span v-if="scope.row.gender == 0">女</span>
                                <span v-else-if="scope.row.gender == 1">男</span>
                            </template>
                        </el-table-column>
                        <el-table-column property="bedNumber" label="床位号" align="center">
                        </el-table-column>
                        <el-table-column property="nursingLevelName" label="护理级别" align="center">
                        </el-table-column>
                        <el-table-column label="操作" align="center" min-width="100">
                            <template #default="scope">
                                <el-button @click="start_viewRecords(scope.row)" type="primary">查看记录</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination :current-page="customer_queryEntity.current" :page-sizes="[1, 5, 10, 50]"
                        :default-page-size="customer_queryEntity.size" @update:page-size="customer_handleSizeChange"
                        @update:current-page="customer_handleCurrentChange"
                        layout="total, sizes, prev, pager, next, jumper" :total="customer_total"
                        style="margin-top: 10vh;" />
                </el-card>

                <el-card style="width: 55%; height: 70vh; margin-left: 2%; overflow-y: auto;">
                    <div
                        style="background-color: #007bff; font-size: 16px; font-weight: bold; width: 100%; height: 3vh; ">
                        <label style="color: white; font-size: 15px; "> 护理记录 - {{ selectedCustomer.name }}</label>
                    </div>
                    <el-table :data="currentRecords" :border="true" :stripe="true" :fit="true"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" align="center"></el-table-column>
                        <el-table-column type="index" label="序号" align="center">
                        </el-table-column>
                        <el-table-column property="programCode" label="护理项目编号" align="center">
                        </el-table-column>
                        <el-table-column property="programName" label="护理项目名称" align="center">
                        </el-table-column>
                        <el-table-column property="executionCount" label="护理数量" align="center">
                        </el-table-column>
                        <el-table-column property="description" label="护理内容" align="center" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column property="nurseName" label="护理人员" align="center">
                        </el-table-column>
                        <el-table-column property="nursePhone" label="护理人员手机" align="center">
                        </el-table-column>
                        <el-table-column property="nursingTime" label="护理时间" align="center">
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template #default="scope">
                                <el-button type="danger" @click="start_deleteRecord(scope.row)">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <Button class="delete-button" style="font-size: 15px; margin-top: 3vh;"
                        @click="start_deleteBatch">批量移除</Button>

                    <el-pagination :current-page="record_queryEntity.current" :page-sizes="[1, 5, 10, 50]"
                        :default-page-size="record_queryEntity.size" @update:page-size="record_handleSizeChange"
                        @update:current-page="record_handleCurrentChange"
                        layout="total, sizes, prev, pager, next, jumper" :total="record_total"
                        style="margin-top: 10vh;" />
                </el-card>

            </el-row>

        </el-card>
    </el-container>
</template>

<style lang="css" scoped>
.section-card {
    border-radius: 12px;
    margin-bottom: 16px;
    margin-right: 5px;
    padding: 5px;

    :deep(.el-card__body) {
        padding: 15px;
    }
}
</style>
<style src="./scopedStyle.css"></style>
