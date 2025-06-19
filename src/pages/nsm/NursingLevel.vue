<!-- 系统管理员端 护理管理 护理级别 -->
<style lang="css" scoped>

</style>

<template>
    <el-main style="align-content: center;">
    <el-container v-if="pageStatus == 'level'">
        <p style="text-align: center; font-size: 30px; font-weight: bolder;">护理级别管理</p>

        <!-- 表格区域 -->
        <div style="margin-top: 5vh; margin-left: 30%; width: 50%; align-items: center;">
            <el-button type="primary"   @click="start_addLevel" 
            style="font-size: 15px; margin: 2vh; width: 80px; text-align: center;">添加</el-button>
            
            <Switcher left-value="启用" right-value="停用" >
            </Switcher>

            <el-table :data="tableData" :border="true" :stripe="true" style="margin-top: 2vh;">
                <el-table-column 
                    type="index"
                    label="序号" 
                    width="60"
                    style="text-align: center;"
                    >
                </el-table-column>
                <el-table-column 
                    property="name" 
                    label="级别名称" 
                    width="100"
                    style="text-align: center;"
                    >
                </el-table-column>
                <el-table-column  label="状态" width="100">
                    <template #default="scope">
                        <span v-if="scope.row.status==1">启用</span>
                        <span v-else>停用</span>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="250" style="text-align: center;">
                    <template #default="scope">
                        <label @click="start_updateLevel(scope.row)"
                        style="font-size: 15px; color: #007bff; margin-left: -10px; " ><el-icon> <Edit /> </el-icon> 修改</label>
                        <label @click="start_managePrograms"
                        style="font-size: 15px; color: green; margin-left: 2vh;"> 护理项目配置</label>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                :current-page="queryEntity.current"
                :page-sizes="[1, 5, 10, 50]"
                :default-page-size="queryEntity.size"
                @update:page-size="handleSizeChange"
                @update:current-page="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                style="margin-top: 10vh;"
            />
        </div>
    </el-container>
    
    <el-container>
        
    </el-container>
    </el-main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type NursingLevel } from '@/lib/entity';
import axios from 'axios'
import Switcher from '@/components/custom/Switcher.vue';
import { ElContainer, ElMain, ElMessage, ElNotification, ElTable, ElButton } from 'element-plus' 
import {Edit, Plus, Delete } from '@element-plus/icons-vue'

onMounted(() => {
    loadData()
})

let pageStatus = ref("level")

// 分页数据
let tableData = ref([] as NursingLevel[])

let total = ref(0)
let queryEntity = ref({
    status: 1,
    current: 1,
    size: 5
})

// 分页改变触发函数
const handleSizeChange = (val: number) => {
    queryEntity.value.size = val
    loadData()
}

const handleCurrentChange = (val: number) => {
    queryEntity.value.current = val
    loadData()
}

const changeStatus = () => {
    let oldVal = queryEntity.value.status
    console.log(oldVal)
    queryEntity.value.status = 1 - oldVal
}

// 监听
watch(queryEntity, (oldVal, newVal) => {
    console.log(newVal)
    loadData()
})

// 控制表单对话框可见性
let dialogFormVisible = ref(true)

// 添加/修改表单
let editForm = ref({} as NursingLevel)
let isUpdate = ref(true) // 是修改还是添加

// 给表单赋值（用于修改）
const alignFormValue = (nursingLevel: NursingLevel) => {
    editForm.value.name = nursingLevel.name
    editForm.value.status = nursingLevel.status
}
// 清空表单内容
const cleanFormValue = (nursingLevel: NursingLevel) => {
    editForm.value.name = ""
    editForm.value.status = 1
}

/** 
 * 修改护理级别部分 
*/ 
const start_updateLevel = (nursingLevel: NursingLevel) => {
    alignFormValue(nursingLevel)
    dialogFormVisible.value = true
}


/** 
 * 添加护理级别部分 
*/ 
const start_addLevel = () => {

}


/** 
 * 配置级别下护理项目部分 
*/ 
const start_managePrograms = () => {
    
}

const loadData = () => {
    axios.post("http://localhost:9000/nursingLevel/pageByStatus", queryEntity.value)
    .then(res => {
        if (res.data.status == 200) {
            tableData.value = res.data.data
            total.value = res.data.total
            console.log(tableData.value)

            ElMessage({message: "数据加载成功！", type: "success"})
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
