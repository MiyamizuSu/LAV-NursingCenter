<!-- 系统管理员端 护理管理 客户护理设置 -->
<style lang="css" scoped>
    .add-button {
        background-color: #007bff;
        font-size: 16px;
    }
</style>

<template>
    <el-container style="align-content: center; width: 100%;">
        <!-- <p style="margin-top: 0; text-align: center; font-size: 30px; font-weight: bolder;">客户护理设置</p> -->

        <!-- 表格区域 -->
        <div 
        style="margin-top: 3vh; margin-left: 20%; align-items: center;">
            <p>
                <!-- 搜索框 -->
                <el-input v-model="customer_queryEntity.name" clearable placeholder="客户姓名" style="width: 30vh;"></el-input>
                <Button @click="loadUsers" class="add-button"
                style="margin-top: 2vh; margin-bottom: 2vh; margin-left: 2vh;">查询</Button>
            </p>

            <br>
        
            <div style="background-color: #007bff; margin-top: 2vh; width: 100%; height: 3vh; align-content: center;">
                <label style="text-align: center; color: white; font-size: 16px; font-weight: bold;">客户信息列表</label>
            </div>
            <el-table :data="nursingCustomers" :border="true" :stripe="true" 
                >
                <el-table-column type="index" label="序号" width="80" style="text-align: center;"
                >
                </el-table-column>
                <el-table-column property="name" label="客户姓名" width="120"
                >
                </el-table-column>
                <el-table-column property="age" label="年龄" width="100"
                >
                </el-table-column>
                <el-table-column label="性别" width="100">
                    <template #default="scope">
                        <span v-if="scope.row.gender == 0">女</span>
                        <span v-else-if="scope.row.gender == 1">男</span>
                    </template>
                </el-table-column>
                <el-table-column property="roomNumber" label="房间号" width="100"
                >
                </el-table-column>
                <el-table-column property="bedNumber" label="床位号" width="100"
                >
                </el-table-column>
                <el-table-column property="building" label="所属楼栋" width="100"
                >
                </el-table-column>
                <el-table-column property="phoneNumber" label="联系电话" width="120"
                >
                </el-table-column>
                <el-table-column property="nursingLevelName" label="护理级别" width="100"
                >
                </el-table-column>
                <el-table-column  label="操作" width="200" style="text-align: center;">
                    <template #default="scope">
                        <div v-if="scope.row.nursingLevelName.length > 0">
                            <Button @click="start_resetLevel(scope.row)"
                                style="background-color: white; color: red; border: 2px;">移除护理级别</Button>
                        </div>
                        <div v-else>
                            <Button @click="start_setService(scope.row)"
                                style="background-color: white; color: blue; border: 2px;">设置护理级别</Button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 客户护理项目服务页面弹框 -->
            <el-dialog v-model="dialogControl.isVisible" :title="dialogControl.title" 
            style="width: 1200px; height: 700px; overflow-y: auto;" draggable overflow>
                <p>
                    <label style="font-weight: bolder; font-size: 17px;">护理级别：</label>
                    <el-select v-model="selectedLevel" value-key="id" placeholder="请选择护理级别" @change="handle_levelChange"
                        style="width: 400px;">
                        <el-option v-for="level in allLevels" :key="level.id" :label="level.name" :value="level">
                        </el-option>
                    </el-select>
                </p>
                
                <div style="background-color: #007bff; margin-top: 2vh; width: 100%; height: 3vh; align-content: center;">
                    <label style="text-align: center; color: white; font-size: 16px; font-weight: bold;">可选护理项目列表</label>
                </div>
                <el-table :data="currentServices" :border="true" :stripe="true" style="width: 100%;"
                @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="50" ></el-table-column>
                    <el-table-column type="index" label="序号" width="80" style="text-align: center;"
                    >
                    </el-table-column>
                    <el-table-column property="programCode" label="编号" width="120"
                    >
                    </el-table-column>
                    <el-table-column property="programName" label="名称" width="125"
                    >
                    </el-table-column>
                    <el-table-column label="价格" width="100">
                        <template #default="scope">
                            <span v-if="scope.row.programPrice > 0">{{ scope.row.programPrice }}元/次</span>
                            <span v-else>免费</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="executionPeriod" label="执行周期" width="125"
                    >
                    </el-table-column>
                    <el-table-column property="executionTimes" label="执行次数" width="100"
                    >
                    </el-table-column>
                    <el-table-column property="purchaseDate" label="服务购买日期" width="130"
                    >
                    </el-table-column>
                    <el-table-column label="购买数量" width="125">
                        <template #default="scope">
                            <el-input v-model="scope.row.totalCount" type="number" placeholder="请输入购买数量" style="width: 100%;"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="服务到期日期" width="200">
                        <template #default="scope">
                            <el-date-picker v-model="scope.row.expirationDate" type="date" value-on-clear=""
                            value-format="YYYY-MM-DD" placeholder="选择服务到期日期" style="width: 100%;"></el-date-picker>
                        </template>
                    </el-table-column>
                </el-table>

                <div style="margin-top: 70px;">
                    <el-button type="primary" @click="confirm_commit" style="margin-left: 40%; margin-right: 20px;">提交</el-button>
                    <el-button @click="cancel_commit">取消</el-button>
                </div>
            </el-dialog>

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
        </div>
    
    </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { type NursingLevel, type NursingProgram, type Customer, type CustomerNursingService } from '@/lib/type.d';
import axios from 'axios'
import Switcher from '@/components/custom/Switcher.vue';
import { ElMain, ElMessage, ElNotification, ElTable, ElButton, ElCol, ElDialog, ElMessageBox } from 'element-plus' 
import {Edit, Setting, Delete } from '@element-plus/icons-vue'
import Button from '@/components/ui/button/Button.vue';

onMounted(() => {
    loadData()
})

// 分页数据
let nursingCustomers = ref([] as Customer[])
let selectedCustomer = ref({} as Customer)

let allLevels = ref([] as NursingLevel[])
let selectedLevel = ref({} as NursingLevel)
let currentPrograms = ref([] as NursingProgram[])
let currentServices = ref([] as CustomerNursingService[])

const handle_levelChange = (value: NursingLevel) => {
    selectedLevel.value = value
    console.log("当前护理级别：", selectedLevel.value)
    loadProgramsUnderLevel()
}

// 多选框选中的项目
let multipleSelection = ref([] as CustomerNursingService[])

const handleSelectionChange = (val: CustomerNursingService[]) => {
    multipleSelection.value = val
    console.log(multipleSelection.value)
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
 * 当前级别下护理项目服务的分页
 */
let service_total = ref(0)
let program_queryEntity = ref({
    programName: "",
    current: 1,
    size: 5
})

// 分页改变触发函数
const service_handleSizeChange = (val: number) => {
    program_queryEntity.value.size = val
    loadProgramsUnderLevel()
}

const service_handleCurrentChange = (val: number) => {
    program_queryEntity.value.current = val
    loadProgramsUnderLevel()
}


// 控制对话框
let dialogControl = ref({
    isVisible: false,
    title: "客户护理设置"
})


const start_resetLevel = (customer: Customer) => {
    ElMessageBox.confirm('确定移除该客户的护理级别吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post("http://localhost:9000/customerNursingService/deleteByCustomer", customer).then(res => {
            if (res.data.status == 200) {
                loadData()
                ElMessage({message: "移除成功！", type: "success"})
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
          message: '已取消移除护理级别'
        });
    });
}

/** 
 * 开始设置护理级别及项目
*/ 
const start_setService = (customer: Customer) => {
    selectedCustomer.value = customer
    loadProgramsUnderLevel()
    dialogControl.value.title = "客户护理设置 - "+customer.name
    dialogControl.value.isVisible = true
}

// 检查购买护理项目设置是否合法：购买数量与到期日期
const validateSelection = ()=> {
    for (let service of multipleSelection.value) {
        if (service.totalCount < 1 || service.totalCount%1 !== 0) {
            ElMessage({message: "购买数量必须为正整数！", type: "warning"})
            return false;
        }
        let date1 = new Date(service.purchaseDate)
        let date2 = new Date(service.expirationDate)
        if (date2.getTime() <= date1.getTime()) {
            ElMessage({message: "到期日期必须晚于购买日期！", type: "warning"})
            return false;
        }
    }
    return true;
}

/** 
 * 提交并发送请求
*/ 
const confirm_commit = () => {
    if (multipleSelection.value.length == 0) {
        ElMessage({message: "请至少勾选一项要购买的护理项目！", type: "warning"})
        return;
    }
    if (!validateSelection()) {
        return;
    }

    ElMessageBox.confirm('确定设置该客户的护理级别并为其购买选中的所有护理项目吗？', '客户护理设置确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post("http://localhost:9000/customerNursingService/addBatch", multipleSelection.value).then(res => {
            if (res.data.status == 200) {
                axios.post("http://localhost:9000/customer/setNursingLevel", {
                    customerId: selectedCustomer.value.customerId,
                    levelId: selectedLevel.value.id
                }).then(res2 => {
                    if (res2.data.status == 200) {
                        loadData()
                        ElMessage({message: `客户护理设置成功！`+res.data.data, type: "success"})
                        dialogControl.value.isVisible = false
                    } else {
                        loadData()
                        ElNotification({
                            title: 'Error',
                            message: res2.data.msg,
                            type: 'error',
                        })
                    }
                })
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
          message: '已取消客户护理设置'
        });
      });
}

const cancel_commit = () => {
    dialogControl.value.isVisible = false
}

const loadUsers = () => {
    axios.post("http://localhost:9000/customer/page", customer_queryEntity.value)
    .then(res => {
        if (res.data.status == 200) {
            nursingCustomers.value = res.data.data
            customer_total.value = res.data.total
            // ElMessage({message: "加载成功！", type: "success"})
        } else {
            ElNotification({
                title: 'Error',
                message: res.data.msg,
                type: 'error',
            })
        }
    })
}

const loadAllLevels = () => {
    axios.post("http://localhost:9000/nursingLevel/listByStatus", {status: 1})
    .then(res => {
        if (res.data.status == 200) {
            allLevels.value = res.data.data
            console.log(allLevels.value)
            selectedLevel.value = allLevels.value[0]
            console.log("护理级别默认值：", selectedLevel.value)
        } else {
            ElNotification({
                title: 'Error',
                message: res.data.msg,
                type: 'error',
            })
        }
    })
}

function pad(time: number, total: number, str = '0') {
    return time.toString().padStart(total, str)
}
const formatDate = (timer: Date)=>{
    let year = timer.getFullYear()
    let month = timer.getMonth() + 1
    let day = timer.getDate()
    // let hour = timer.getHours()
    // let minute = timer.getMinutes()
    // let second = timer.getSeconds()
    return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`
}

const addDays = (timer: Date, days: number) => {
    timer.setDate(timer.getDate() + days)
    return timer
}

const loadProgramsUnderLevel = () => {
    axios.post("http://localhost:9000/levelWithProgram/pageProgramsByLevelId", {
        levelId: selectedLevel.value.id,
        programName: program_queryEntity.value.programName,
        current: program_queryEntity.value.current,
        size: program_queryEntity.value.size,
    })
    .then(res => {
        if (res.data.status == 200) {
            currentPrograms.value = res.data.data
            service_total.value = res.data.total
            console.log("currentPrograms: ", currentPrograms.value)

            currentServices.value = []
            for (let program of currentPrograms.value) {
                currentServices.value.push({
                    id: 0,
                    customerId: selectedCustomer.value.customerId,
                    levelId: selectedLevel.value.id,
                    programId: program.id,
                    programCode: program.programCode,
                    programName: program.name,
                    programPrice: program.price,
                    executionPeriod: program.executionPeriod,
                    executionTimes: program.executionTimes,
                    purchaseDate: formatDate(new Date()),
                    totalCount: 1,
                    usedCount: 0,
                    expirationDate: formatDate(addDays(new Date(), 31))
                })
            }

            // ElMessage({message: "数据加载成功！", type: "success"})
        } else {
            currentPrograms.value = []
            currentServices.value = []
            // ElNotification({
            //     title: 'Error',
            //     message: res.data.msg,
            //     type: 'error',
            // })
        }
    })
}

const loadData = () => {
    loadUsers()
    loadAllLevels()
}



</script>
