<!-- 系统管理员端 护理管理 护理级别 -->
<style lang="css" scoped>

</style>

<template>
<el-main style="align-content: center;">

    <p style="text-align: center; margin: 2vh; font-size: 20px; font-weight: bolder;">护理级别下项目管理：{{ currentLevel.name }}</p>

    <Button @click="goBack()" style="margin-left: 40%; font-size: 15px;">返回护理级别列表</Button>
    <br>
    <!-- 表格区域 -->
    <el-container  style="align-items: center; margin-top: 3vh; margin-left: 10%; width: 90%;">
        
        <el-card style="width: 45%; height: 80vh; ">
            <p>
                <!-- 搜索框 -->
                <el-input v-model="queryEntity0.name" clearable placeholder="护理项目名称" style="width: 30vh;"></el-input>
                <Button @click="loadData" 
                style="margin-top: 2vh; margin-bottom: 2vh; margin-left: 2vh;">查询</Button>
            </p>
            <el-table :data="allPrograms" :border="true" :stripe="true" style="margin-top: 2vh;">
                <el-table-column 
                    type="index"
                    label="序号" 
                    width="80"
                    style="text-align: center;"
                >
                </el-table-column>
                <el-table-column 
                    property="programCode" 
                    label="编号" 
                    width="120"
                >
                </el-table-column>
                <el-table-column 
                    property="name" 
                    label="名称" 
                    width="120"
                >
                </el-table-column>
                <el-table-column label="价格" width="100">
                    <template #default="scope">
                        <span v-if="scope.row.price > 0">{{ scope.row.price }}元/次</span>
                        <span v-else>免费</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    property="executionPeriod" 
                    label="执行周期" 
                    width="100"
                >
                </el-table-column>
                <el-table-column 
                    property="executionTimes" 
                    label="执行次数"
                    width="80"
                    style="text-align: center;"
                >
                </el-table-column>
                <el-table-column  label="操作" width="130" style="text-align: center;">
                    <template #default="scope">
                        <div v-if="judgeContains(scope.row.id)">
                            <label style="font-size: 15px; color: #007bff; margin-left: 1vh; " >已添加</label>
                        </div>
                        <div v-else>
                            <el-button type="primary" @click="addToLevel(scope.row)">添加</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                :current-page="queryEntity0.current"
                :page-sizes="[1, 5, 10, 50]"
                :default-page-size="queryEntity0.size"
                @update:page-size="handleSizeChange0"
                @update:current-page="handleCurrentChange0"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total0"
                style="margin-top: 10vh;"
            />
        </el-card>    

        
        <el-card style="width: 45%; height: 80vh; margin-left: 5%; margin-right: 0;">
            <!-- <p>
                <el-input v-model="queryEntity1.programName" clearable placeholder="护理项目名称" style="width: 30vh;"></el-input>
                <Button @click="loadData" 
                style="margin-top: 2vh; margin-bottom: 2vh; margin-left: 2vh;">查询</Button>
            </p> -->

            <el-table :data="currentPrograms" :border="true" :stripe="true" style="margin-top: 2vh;">
                <el-table-column 
                    type="index"
                    label="序号" 
                    width="80"
                    style="text-align: center;"
                >
                </el-table-column>
                <el-table-column 
                    property="programCode" 
                    label="编号" 
                    width="120"
                >
                </el-table-column>
                <el-table-column 
                    property="name" 
                    label="名称" 
                    width="120"
                >
                </el-table-column>
                <el-table-column label="价格" width="100">
                    <template #default="scope">
                        <span v-if="scope.row.price > 0">{{ scope.row.price }}元/次</span>
                        <span v-else>免费</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    property="executionPeriod" 
                    label="执行周期" 
                    width="100"
                >
                </el-table-column>
                <el-table-column 
                    property="executionTimes" 
                    label="执行次数"
                    width="80"
                    style="text-align: center;"
                >
                </el-table-column>
                <el-table-column  label="操作" width="130" style="text-align: center;">
                    <template #default="scope">
                        <el-button type="danger" @click="start_deleteFromLevel(scope.row)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                :current-page="queryEntity1.current"
                :page-sizes="[1, 5, 10, 50]"
                :default-page-size="queryEntity1.size"
                @update:page-size="handleSizeChange1"
                @update:current-page="handleCurrentChange1"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total1"
                style="margin-top: 10vh;"
            />
        </el-card>
        
    </el-container>
    
   
</el-main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { type NursingLevel, type NursingProgram } from '@/lib/entity';
import axios from 'axios'
import Switcher from '@/components/custom/Switcher.vue';
import { ElContainer, ElMain, ElMessage, ElNotification, ElTable, ElButton, ElCol } from 'element-plus' 
// import {Edit, Plus, Delete } from '@element-plus/icons-vue'
import Button from '@/components/ui/button/Button.vue';

const router = useRouter()
const route = useRoute()

onMounted(() => {
    loadData()
})

let currentLevel = ref({} as NursingLevel)

// 分页数据
let currentPrograms = ref([] as NursingLevel[]) // 右侧表格数据
let allPrograms = ref([] as NursingLevel[]) //左侧表格数据

let total1 = ref(0)
let queryEntity1 = ref({
    levelId: 0,
    programName: "",
    current: 1,
    size: 5,
})

let total0 = ref(0)
let queryEntity0 = ref({
    name: "",
    current: 1,
    size: 5,
    status: 1 //只要启用的
})

const goBack = () => {
    router.back()
}

// 分页改变触发函数
const handleSizeChange0 = (val: number) => {
    queryEntity0.value.size = val
    loadData()
}

const handleSizeChange1 = (val: number) => {
    queryEntity1.value.size = val
    loadData()
}

const handleCurrentChange0 = (val: number) => {
    queryEntity0.value.current = val
    loadData()
}

const handleCurrentChange1 = (val: number) => {
    queryEntity1.value.current = val
    loadData()
}

// // 监听
// watch(queryEntity1, (oldVal, newVal) => {
//     console.log(newVal)
//     loadData()
// })

const judgeContains = (programId: number) => {
    for (let program of currentPrograms.value) {
        if (program.id == programId) {
            return true
        }
    }
    return false
}

const start_deleteFromLevel = (program: NursingLevel) => {
    axios.post("http://localhost:9000/levelWithProgram/deleteByLevelAndProgram", {
        levelId: currentLevel.value.id,
        programId: program.id,
    }).then(res => {
        if (res.data.status == 200) {
            ElMessage({message: "移除成功！", type: "success"})
            loadData()
        } else {
            ElNotification({
                title: 'Error',
                message: res.data.msg,
                type: 'error',
            })
        }

    })
}

const addToLevel = (program: NursingLevel) => {
    axios.post("http://localhost:9000/levelWithProgram/add", {
        levelId: currentLevel.value.id,
        programId: program.id,
    }).then(res => {
        if (res.data.status == 200) {
            ElMessage({message: "添加成功！", type: "success"})
            loadData()
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
    currentLevel.value = JSON.parse(route.query.currentLevel as string)
    console.log(currentLevel.value)
    queryEntity1.value.levelId = currentLevel.value.id

    axios.post("http://localhost:9000/nursingProgram/page", queryEntity0.value)
    .then(res => {
        if (res.data.status == 200) {
            allPrograms.value = res.data.data
            total0.value = res.data.total
            console.log("allPrograms: ", allPrograms.value)

            // ElMessage({message: "数据加载成功！", type: "success"})
        } else {
            ElNotification({
                title: 'Error',
                message: res.data.msg,
                type: 'error',
            })
        }
    })

    axios.post("http://localhost:9000/levelWithProgram/pageProgramsByLevelId", queryEntity1.value)
    .then(res => {
        if (res.data.status == 200) {
            currentPrograms.value = res.data.data
            total1.value = res.data.total
            console.log("currentPrograms: ", currentPrograms.value)

            // ElMessage({message: "数据加载成功！", type: "success"})
        } else {
            ElNotification({
                title: 'Error',
                message: res.data.msg,
                type: 'error',
            })
        }
    })
}



</script>
