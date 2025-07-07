<!-- 系统管理员端 护理管理 护理级别 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { type NursingLevel, type NursingProgram } from '@/lib/type.d';
import { ElContainer, ElMain, ElMessage, ElNotification, ElTable, ElButton, ElCol } from 'element-plus'
import Button from '@/components/ui/button/Button.vue';
import { axiosInstance as axios } from '@/lib/core'
import { useLevelProgramStore } from '@/lib/store'

const router = useRouter()
const levelProgramStore = useLevelProgramStore()

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
    axios.post("/levelWithProgram/deleteByLevelAndProgram", {
        levelId: currentLevel.value.id,
        programId: program.id,
    }).then(res => {
        if (res.data.status == 200) {
            ElMessage({ message: "移除成功！", type: "success" })
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
    axios.post("/levelWithProgram/add", {
        levelId: currentLevel.value.id,
        programId: program.id,
    }).then(res => {
        if (res.data.status == 200) {
            ElMessage({ message: "添加成功！", type: "success" })
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
    // currentLevel.value = JSON.parse(route.query.currentLevel as string)
    currentLevel.value = levelProgramStore.getCurrentLevel.value
    // console.log(currentLevel.value)
    queryEntity1.value.levelId = currentLevel.value.id

    axios.post("/nursingProgram/page", queryEntity0.value)
        .then(res => {
            if (res.data.status == 200) {
                allPrograms.value = res.data.data
                total0.value = res.data.total
                // console.log("allPrograms: ", allPrograms.value)

                // ElMessage({message: "数据加载成功！", type: "success"})
            } else {
                allPrograms.value = res.data.data
                total0.value = res.data.total
                ElNotification({
                    title: 'Error',
                    message: res.data.msg,
                    type: 'error',
                })
            }
        })

    axios.post("/levelWithProgram/pageProgramsByLevelId", queryEntity1.value)
        .then(res => {
            if (res.data.status == 200) {
                currentPrograms.value = res.data.data
                total1.value = res.data.total
                // console.log("currentPrograms: ", currentPrograms.value)

                // ElMessage({message: "数据加载成功！", type: "success"})
            } else {
                currentPrograms.value = res.data.data
                total1.value = res.data.total
                ElNotification({
                    title: 'Error',
                    message: res.data.msg,
                    type: 'error',
                })
            }
        })
}

</script>

<template>
    <el-container style="align-items: center; width: 100%; margin: 0%;">
        <el-card shadow="hover" class="section-card" style="width: 100%;">
            <p>
                <!-- 搜索框 -->
                <el-input v-model="queryEntity0.name" clearable placeholder="护理项目名称" style="width: 30vh;"></el-input>
                <Button @click="loadData" style="margin-left: 2vh;">查询</Button>
                <Button @click="goBack()" style="margin-left: 2vh; font-size: 14px;">返回护理级别列表</Button>
            </p>
            <br>

            <el-row style="width: 100%;">
                <el-card style="width: 48%; height: 70vh; overflow-y: auto;">
                    <div style="background-color: #007bff; width: 100%; height: 3vh; align-content: center;">
                        <label
                            style="text-align: center; font-size: 16px; font-weight: bold; color: white; font-size: 15px; ">所有护理项目</label>
                    </div>
                    <el-table :data="allPrograms" :border="true" :stripe="true" style="width: 100%;" :fit="true">
                        <el-table-column type="index" label="序号" align="center">
                        </el-table-column>
                        <el-table-column property="programCode" label="编号" align="center">
                        </el-table-column>
                        <el-table-column property="name" label="名称" align="center">
                        </el-table-column>
                        <el-table-column label="价格" align="center">
                            <template #default="scope">
                                <span v-if="scope.row.price > 0">{{ scope.row.price }}元/次</span>
                                <span v-else>免费</span>
                            </template>
                        </el-table-column>
                        <el-table-column property="executionPeriod" label="执行周期" align="center">
                        </el-table-column>
                        <el-table-column property="executionTimes" label="执行次数" align="center"
                            style="text-align: center;">
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template #default="scope">
                                <div v-if="judgeContains(scope.row.id)">
                                    <label style="font-size: 15px; color: #007bff; margin-left: 1vh; ">已添加</label>
                                </div>
                                <div v-else>
                                    <el-button type="primary" @click="addToLevel(scope.row)">添加</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination :current-page="queryEntity0.current" :page-sizes="[1, 5, 10, 50]"
                        :default-page-size="queryEntity0.size" @update:page-size="handleSizeChange0"
                        @update:current-page="handleCurrentChange0" layout="total, sizes, prev, pager, next, jumper"
                        :total="total0" style="margin-top: 10vh;" />
                </el-card>

                <el-card style="width: 48%; height: 70vh; margin-left: 4%; overflow-y: auto;">
                    <div style="background-color: #007bff; width: 100%; height: 3vh; align-content: center;">
                        <label style="text-align: center; font-size: 16px; font-weight: bold; color: white; ">{{
                            currentLevel.name
                            }}下的护理项目</label>
                    </div>
                    <el-table :data="currentPrograms" :border="true" :stripe="true" style="width: 100%;" :fit="true">
                        <el-table-column type="index" label="序号" align="center">
                        </el-table-column>
                        <el-table-column property="programCode" label="编号" align="center">
                        </el-table-column>
                        <el-table-column property="name" label="名称" align="center">
                        </el-table-column>
                        <el-table-column label="价格" align="center">
                            <template #default="scope">
                                <span v-if="scope.row.price > 0">{{ scope.row.price }}元/次</span>
                                <span v-else>免费</span>
                            </template>
                        </el-table-column>
                        <el-table-column property="executionPeriod" label="执行周期" align="center">
                        </el-table-column>
                        <el-table-column property="executionTimes" label="执行次数" align="center"
                            style="text-align: center;">
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template #default="scope">
                                <el-button type="danger" @click="start_deleteFromLevel(scope.row)">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination :current-page="queryEntity1.current" :page-sizes="[1, 5, 10, 50]"
                        :default-page-size="queryEntity1.size" @update:page-size="handleSizeChange1"
                        @update:current-page="handleCurrentChange1" layout="total, sizes, prev, pager, next, jumper"
                        :total="total1" style="margin-top: 10vh;" />
                </el-card>
            </el-row>
        </el-card>

    </el-container>
</template>


<style src="./scopedStyle.css"></style>
