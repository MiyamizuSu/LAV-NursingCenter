<!-- 系统管理员端 健康管家 服务关注 第二部分 -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { type User, type NursingLevel, type Customer, type CustomerNursingService, type NursingProgram } from '@/lib/type.d';
import { ElMain, ElMessage, ElNotification, ElTable, ElButton, ElCol, ElMessageBox, type FormRules } from 'element-plus'
import Button from '@/components/ui/button/Button.vue';
import { useRouter, useRoute } from 'vue-router';
import { axiosInstance as axios } from '@/lib/core'
import { useCustomerProgramsStore } from '@/lib/store';

const router = useRouter()
const customerProgramsStore = useCustomerProgramsStore()

onMounted(async () => {
    currentCustomer.value = await customerProgramsStore.getCurrentCustomer.value
    console.log(currentCustomer.value)
    loadData()
})

const goBack = () => {
    router.back()
}

let currentCustomer = ref({} as Customer)
let currentLevel = ref({} as NursingLevel)

// 客户护理项目服务分页数据
let currentServices = ref([] as CustomerNursingService[]) //已购买的
let availablePrograms = ref([] as NursingProgram[])
let selectedServices = ref([] as CustomerNursingService[]) //选中待添加的

/**
 * 当前护理项目服务的分页
 */
let currentService_total = ref(0)
let currentService_queryEntity = ref({
    customerId: 0,
    programName: "",
    current: 1,
    size: 5
})

const currentService_handleSizeChange = (val: number) => {
    currentService_queryEntity.value.size = val
    loadCurrentServices()
}

const currentService_handleCurrentChange = (val: number) => {
    currentService_queryEntity.value.current = val
    loadCurrentServices()
}

/**
 * 可选护理项目服务的分页
 */
let availableProgram_total = ref(0)
let availableProgram_queryEntity = ref({
    customerId: 0,
    programName: "",
    current: 1,
    size: 5
})

const availableProgram_handleSizeChange = (val: number) => {
    availableProgram_queryEntity.value.size = val
    loadAvailablePrograms()
}

const availableProgram_handleCurrentChange = (val: number) => {
    availableProgram_queryEntity.value.current = val
    loadAvailablePrograms()
}


// 多选框选中的服务项目，用于批量移除
let multipleSelection = ref([] as CustomerNursingService[])

const handleSelectionChange = (val: CustomerNursingService[]) => {
    multipleSelection.value = val
}

// 控制添加对话框
let add_dialogControl = ref({
    isVisible: false,
    title: "添加客户护理项目"
})

// 控制续费对话框
let renew_dialogControl = ref({
    isVisible: false,
    title: "护理项目续费"
})

// 续费的表单对象
let editForm = ref({} as CustomerNursingService)
let addCount = ref(0)

// 通用校验：输入不能为空
const validateTextInput = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('输入不能为空！'))
    }
}

const validateNumberInput = (rule: any, value: any, callback: any) => {
    if (value === '' || value < 0) {
        callback(new Error('输入数字不能小于零！'))
    }
}

const editProgramRules = reactive<FormRules>({
    expirationDate: [
        { required: true, validator: validateTextInput, message: "请选择服务到期时间", trigger: "blur" }
    ],
    addCount: [
        { required: true, validator: validateNumberInput, message: "请输入新增数量", trigger: "blur" }
    ],
})

const start_deleteService = (service: CustomerNursingService) => {
    ElMessageBox.confirm('确定移除该客户的该护理项目吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        axios.post("/customerNursingService/delete", { id: service.id }).then(res => {
            if (res.data.status == 200) {
                loadData()
                ElMessage({ message: "移除成功！", type: "success" })
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
            message: '已取消移除护理项目'
        });
    });
}

const start_deleteBatch = () => {
    if (multipleSelection.value.length == 0) {
        ElMessage({ message: "请先勾选要移除的项目！", type: "warning" })
        return;
    }
    ElMessageBox.confirm('确定删除所有选中的护理项目吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        axios.post("/customerNursingService/deleteBatch", multipleSelection.value)
            .then(res => {
                if (res.data.status == 200) {
                    loadData()
                    ElMessage({ message: res.data.data, type: "success" })
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

const start_renewService = (service: CustomerNursingService) => {
    editForm.value = JSON.parse(JSON.stringify(service)) //深拷贝赋值
    addCount.value = 0
    renew_dialogControl.value.isVisible = true
}

const start_addServices = () => {
    loadAvailablePrograms()
    selectedServices.value = []
    add_dialogControl.value.title = `添加客户护理项目 - ${currentCustomer.value.name} - ${currentCustomer.value.nursingLevelName}`
    add_dialogControl.value.isVisible = true
}

function pad(time: number, total: number, str = '0') {
    return time.toString().padStart(total, str)
}
const formatDate = (timer: Date) => {
    let year = timer.getFullYear()
    let month = timer.getMonth() + 1
    let day = timer.getDate()
    return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`
}

const addDays = (timer: Date, days: number) => {
    timer.setDate(timer.getDate() + days)
    return timer
}

const addToSelected = (program: NursingProgram) => {
    selectedServices.value.push({
        id: 0,
        customerId: currentCustomer.value.customerId,
        levelId: currentLevel.value.id,
        programId: program.id,
        programCode: program.programCode,
        programName: program.name,
        programPrice: program.price,
        executionPeriod: program.executionPeriod,
        executionTimes: program.executionTimes,
        purchaseDate: formatDate(new Date()),
        totalCount: 1,
        usedCount: 0,
        expirationDate: formatDate(addDays(new Date(), 92))
    })
    // loadAvailablePrograms()
}

const deleteFromSelected = (service: CustomerNursingService) => {
    selectedServices.value = selectedServices.value.filter(item => item.programId !== service.programId)
}

const judgeContains = (programId: number) => {
    for (let service of selectedServices.value) {
        if (service.programId == programId) {
            return true
        }
    }
    return false
}

// 检查购买护理项目设置是否合法：购买数量与到期日期
const validateSelection = () => {
    for (let service of selectedServices.value) {
        if (service.totalCount < 1 || service.totalCount % 1 !== 0) {
            ElMessage({ message: "购买数量必须为正整数！", type: "warning" })
            return false;
        }
        let date1 = new Date(service.purchaseDate)
        let date2 = new Date(service.expirationDate)
        if (date2.getTime() <= date1.getTime()) {
            ElMessage({ message: "到期日期必须晚于购买日期！", type: "warning" })
            return false;
        }
    }
    return true;
}

/** 
 * 提交并发送请求
*/
const confirm_renew_commit = () => {
    // 先验证表单
    if (editForm.value.expirationDate === '') {
        ElMessage({ message: "请选择服务到期时间！", type: "warning" })
        return;
    }
    if (addCount.value <= 0 || addCount.value % 1 !== 0) {
        ElMessage({ message: "新增数量必须是正整数！", type: "warning" })
        return;
    }
    let date1 = new Date(editForm.value.expirationDate)
    let date2 = new Date()
    let date3 = new Date(editForm.value.purchaseDate)
    if (date1.getTime() <= date2.getTime() || date1.getTime() <= date3.getTime()) {
        ElMessage({ message: "服务到期时间必须晚于购买时间和当前时间！", type: "warning" })
        return;
    }

    editForm.value.totalCount += addCount.value
    axios.post("/customerNursingService/update", editForm.value).then(res => {
        if (res.data.status == 200) {
            loadData()
            ElMessage({ message: "续费成功！", type: "success" })
            renew_dialogControl.value.isVisible = false
        } else {
            loadData()
            ElNotification({
                title: 'Error',
                message: res.data.msg,
                type: 'error',
            })
        }
    })
}

const confirm_add_commit = () => {
    if (selectedServices.value.length == 0) {
        ElMessage({ message: "请至少勾选一项要购买的护理项目！", type: "warning" })
        return;
    }
    if (!validateSelection()) {
        return;
    }

    ElMessageBox.confirm('确定为该客户购买选中的所有护理项目吗？', '添加护理项目确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        axios.post("/customerNursingService/addBatch", selectedServices.value).then(res => {
            if (res.data.status == 200) {
                loadData()
                ElMessage({ message: `客户护理项目设置成功！` + res.data.data, type: "success" })
                add_dialogControl.value.isVisible = false
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
            message: '已取消添加护理项目'
        });
    });
}

const cancel_renew_commit = () => {
    renew_dialogControl.value.isVisible = false
}

const cancel_add_commit = () => {
    add_dialogControl.value.isVisible = false
}

const loadCurrentServices = () => {
    currentService_queryEntity.value.customerId = currentCustomer.value.customerId
    axios.post("/customerNursingService/page", currentService_queryEntity.value)
        .then(res => {
            if (res.data.status == 200) {
                currentServices.value = res.data.data
                currentService_total.value = res.data.total

            } else {
                currentServices.value = res.data.data
                currentService_total.value = res.data.total
                // ElNotification({
                //     title: 'Error',
                //     message: res.data.msg,
                //     type: 'error',
                // })
            }
        })
}

// 保证在这之前已加载完客户已购买的护理项目服务
const loadAvailablePrograms = () => {
    availableProgram_queryEntity.value.customerId = currentCustomer.value.customerId

    axios.post("/customerNursingService/pageAvailableProgramsByCustomer", availableProgram_queryEntity.value)
        .then(res => {
            if (res.data.status == 200) {
                availablePrograms.value = res.data.data
                availableProgram_total.value = res.data.total
            } else {
                availablePrograms.value = res.data.data
                availableProgram_total.value = res.data.total
                // ElNotification({
                //     title: 'Error',
                //     message: res.data.msg,
                //     type: 'error',
                // })
            }
        })
}

const loadNursingLevel = () => {
    axios.post("/nursingLevel/getByName", { name: currentCustomer.value.nursingLevelName }).then(res => {
        if (res.data.status == 200) {
            currentLevel.value = res.data.data
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
    loadNursingLevel()
    loadCurrentServices()
}
</script>

<template>
    <el-container style="padding: 0; overflow-y: auto;">
        <el-col style="width: 100%;">
            <el-card shadow="hover" class="section-card" style="width: 100%;">
                <p style="margin-bottom: 2vh; margin-top: 2vh;">
                    <label style="font-size: 18px; font-weight: bold;">客户护理项目配置 - {{ currentCustomer.name }}</label>
                    <Button @click="goBack()" style="margin-left: 5vh; font-size: 14px;">返回客户列表</Button>
                </p>
                <p>
                    <!-- 搜索框 -->
                    <el-input v-model="currentService_queryEntity.programName" clearable placeholder="项目名称"
                        style="width: 30vh;"></el-input>
                    <Button @click="loadCurrentServices" class="add-button" style="margin-left: 2vh;">查询</Button>

                    <Button @click="start_addServices" class="add-button" style="margin-left: 2vh;">添加</Button>
                    <Button @click="start_deleteBatch"
                        style="margin-left: 2vh; background-color: darkred; font-size: 15px;">批量移除</Button>
                </p>
                <br><br>

                <div
                    style="background-color: #007bff; margin-top: 2vh; width: 100%; height: 3vh; align-content: center;">
                    <label style="font-size: 16px; font-weight: bold; color: white; font-size: 15px; ">{{
                        currentCustomer.name }} - 已购的护理项目</label>
                </div>
                <el-table :data="currentServices" :stripe="true" style="width: 100%;" :fit="true"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center"></el-table-column>
                    <el-table-column type="index" label="序号" align="center">
                    </el-table-column>
                    <el-table-column property="programCode" label="项目编号" align="center">
                    </el-table-column>
                    <el-table-column property="programName" label="项目名称" align="center">
                    </el-table-column>
                    <el-table-column label="单次价格" align="center">
                        <template #default="scope">
                            <span v-if="scope.row.programPrice > 0">{{ scope.row.programPrice }}元/次</span>
                            <span v-else>免费</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="余量" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.totalCount - scope.row.usedCount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="purchaseDate" label="服务购买日期" align="center">
                    </el-table-column>
                    <el-table-column property="expirationDate" label="服务到期日期" align="center">
                    </el-table-column>
                    <el-table-column label="状态" align="center">
                        <template #default="scope">
                            <p>
                                <Button v-if="scope.row.totalCount - scope.row.usedCount > 5"
                                    style="background-color: green; height: 30px; border-radius: 0%;">正常</Button>
                                <Button v-else-if="scope.row.totalCount - scope.row.usedCount > 0"
                                    style="background-color: orange; height: 30px; border-radius: 0%;">即将用完</Button>
                                <Button v-else-if="scope.row.totalCount - scope.row.usedCount == 0"
                                    style="background-color: orangered; height: 30px; border-radius: 0%;">已用完</Button>
                                <Button v-else
                                    style="background-color: red; height: 30px; border-radius: 0%;">已欠费</Button>
                            </p>
                            <p style="margin-top: 1vh; ">
                                <Button v-if="new Date(scope.row.expirationDate) > new Date()"
                                    style="background-color: green; height: 30px; border-radius: 0%;">未到期</Button>
                                <Button v-else
                                    style="background-color: red;  height: 30px; border-radius: 0%;">已到期</Button>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template #default="scope">
                            <p> <el-button @click="start_deleteService(scope.row)" style="color: red; ">移除</el-button>
                            </p>
                            <p style="margin-top: 1vh;"> <el-button @click="start_renewService(scope.row)"
                                    style="color: deepskyblue; ">续费</el-button> </p>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination :current-page="currentService_queryEntity.current" :page-sizes="[1, 5, 10, 50]"
                    :default-page-size="currentService_queryEntity.size"
                    @update:page-size="currentService_handleSizeChange"
                    @update:current-page="currentService_handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper" :total="currentService_total"
                    style="margin-top: 10vh;" />
            </el-card>

        </el-col>

        <!-- 添加客户护理项目服务页面弹框 -->
        <el-dialog v-model="add_dialogControl.isVisible" :title="add_dialogControl.title"
            style="width: 1200px; height: 750px; overflow-y: auto;" draggable overflow>
            <div style="background-color: #007bff; margin-top: 2vh; width: 100%; height: 3vh; align-content: center;">
                <label style="text-align: center; color: white; font-size: 16px; font-weight: bold;">可选的护理项目</label>
            </div>
            <el-table :data="availablePrograms" :stripe="true" style="width: 100%;">
                <!-- <el-table-column type="selection" align="center" ></el-table-column> -->
                <el-table-column type="index" label="序号" width="110" align="center">
                </el-table-column>
                <el-table-column property="programCode" label="项目编号" width="180">
                </el-table-column>
                <el-table-column property="name" label="项目名称" width="180">
                </el-table-column>
                <el-table-column label="单次价格" width="180">
                    <template #default="scope">
                        <span v-if="scope.row.price > 0">{{ scope.row.price }}元/次</span>
                        <span v-else>免费</span>
                    </template>
                </el-table-column>
                <el-table-column property="executionPeriod" label="护理周期" width="160">
                </el-table-column>
                <el-table-column property="executionTimes" label="护理频次" width="150">
                </el-table-column>
                <el-table-column label="操作" width="205">
                    <template #default="scope">
                        <div v-if="judgeContains(scope.row.id)">
                            <label style="font-size: 15px; color: #007bff; ">已添加</label>
                        </div>
                        <div v-else>
                            <Button @click="addToSelected(scope.row)" class="add-button"
                                style="font-size: 15px; ">添加</Button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination :current-page="availableProgram_queryEntity.current" :page-sizes="[1, 5, 10, 50]"
                :default-page-size="availableProgram_queryEntity.size"
                @update:page-size="availableProgram_handleSizeChange"
                @update:current-page="availableProgram_handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper" :total="availableProgram_total"
                style="margin-top: 5vh;" />

            <div style="background-color: #007bff; margin-top: 5vh; width: 100%; height: 3vh; align-content: center;">
                <label style="text-align: center; color: white; font-size: 16px; font-weight: bold;">已选的护理项目</label>
            </div>
            <el-table :data="selectedServices" :stripe="true" style="width: 100%;"
                @selection-change="handleSelectionChange" :fit="true">
                <!-- <el-table-column type="selection" width="50" ></el-table-column> -->
                <el-table-column type="index" label="序号" align="center">
                </el-table-column>
                <el-table-column property="programCode" label="编号" align="center">
                </el-table-column>
                <el-table-column property="programName" label="名称" align="center">
                </el-table-column>
                <el-table-column label="价格" align="center">
                    <template #default="scope">
                        <span v-if="scope.row.programPrice > 0">{{ scope.row.programPrice }}元/次</span>
                        <span v-else>免费</span>
                    </template>
                </el-table-column>
                <el-table-column property="executionPeriod" label="执行周期" align="center">
                </el-table-column>
                <el-table-column property="executionTimes" label="执行次数" align="center">
                </el-table-column>
                <el-table-column property="purchaseDate" label="服务购买日期" align="center">
                </el-table-column>
                <el-table-column label="购买数量" align="center">
                    <template #default="scope">
                        <el-input-number v-model="scope.row.totalCount" :min="1" controls-position="right"
                            style="width: 80px;" />
                    </template>
                </el-table-column>
                <el-table-column label="服务到期日期" align="center">
                    <template #default="scope">
                        <el-date-picker v-model="scope.row.expirationDate" type="date" value-on-clear=""
                            value-format="YYYY-MM-DD" placeholder="选择服务到期日期" style="width: 100%;"></el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button type="danger" @click="deleteFromSelected(scope.row)"
                            style="margin-left: 2vh;">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>


            <div style="margin-top: 70px;">
                <el-button type="primary" @click="confirm_add_commit"
                    style="margin-left: 40%; margin-right: 20px;">提交</el-button>
                <el-button @click="cancel_add_commit">取消</el-button>
            </div>
        </el-dialog>


        <el-dialog v-model="renew_dialogControl.isVisible" :title="renew_dialogControl.title"
            style="width: 540px; height: 600px; overflow-y: auto;" draggable overflow>
            <el-form :model="editForm" :rules="editProgramRules">
                <el-form-item label="客户姓名：" label-width="120px" style="margin-top: 30px;">
                    <el-input type="text" v-model="currentCustomer.name" disabled placeholder="请输入客户姓名"
                        style="width: 350px;"></el-input>
                </el-form-item>
                <el-form-item label="护理项目编号：" prop="programCode" label-width="120px" style="margin-top: 30px;">
                    <el-input type="text" v-model="editForm.programCode" disabled placeholder="请输入护理项目编号"
                        style="width: 350px;"></el-input>
                </el-form-item>
                <el-form-item label="护理项目名称：" prop="programName" label-width="120px">
                    <el-input type="text" v-model="editForm.programName" disabled placeholder="请输入护理项目名称"
                        style="width: 350px;"></el-input>
                </el-form-item>
                <el-form-item label="价格：" prop="programPrice" label-width="120px">
                    <el-input type="number" v-model.number="editForm.programPrice" disabled placeholder="请输入护理项目价格"
                        style="width: 350px;"></el-input>
                </el-form-item>
                <el-form-item label="原有剩余数量：" label-width="120px">
                    <label>{{ editForm.totalCount - editForm.usedCount }}</label>
                </el-form-item>
                <el-form-item label="新增数量：" prop="addCount" label-width="120px">
                    <!-- <el-input type="number" v-model.number="addCount" placeholder="请输入新增数量" style="width: 350px;" /> -->
                    <el-input-number v-model="addCount" :min="1" controls-position="right" style="width: 200px;" />
                </el-form-item>
                <el-form-item label="总数量：" label-width="120px">
                    <label>{{ editForm.totalCount - editForm.usedCount + addCount }}</label>
                </el-form-item>
                <el-form-item label="服务到期日期" prop="expirationDate" label-width="120px">
                    <el-date-picker v-model="editForm.expirationDate" type="date" value-on-clear=""
                        value-format="YYYY-MM-DD" placeholder="选择服务到期日期" style="width: 350px;"></el-date-picker>
                </el-form-item>

                <div style="margin-top: 50px;">
                    <el-button type="primary" @click="confirm_renew_commit"
                        style="margin-left: 30%; margin-right: 20px;">提交</el-button>
                    <el-button @click="cancel_renew_commit">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </el-container>
</template>

<style lang="css" scoped></style>
<style src="./scopedStyle.css"></style>
