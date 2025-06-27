<!-- 系统管理员端 护理管理 护理项目 -->
<style lang="css" scoped>
    .add-button {
        background-color: #007bff;
        font-size: 16px;
    }
</style>

<template>
    <!-- <p style="margin-top: 0; text-align: center; font-size: 20px; font-weight: bolder;">护理项目管理</p> -->
    
    <el-container style="align-content: center; overflow-y: auto;">
        <!-- 表格区域 -->
        <el-col :span="16" 
        style=" align-items: center; margin-left: 20%;">
            <p>
                <!-- 搜索框 -->
                <el-input v-model="queryEntity.name" clearable placeholder="护理项目名称" style="width: 30vh;"></el-input>
                <Button @click="loadData" class="add-button"
                style="margin-top: 2vh; margin-bottom: 2vh; margin-left: 2vh;">查询</Button>
                <Button @click="start_addProgram" class="add-button"
                style="margin-top: 2vh; margin-bottom: 2vh; margin-left: 2vh;">添加</Button>
            </p>

            <br>
            
            <Switcher left-value="启用" right-value="停用" >
            </Switcher>
            <br>

            <p>
                <el-switch v-model="isActive" :checked="true" size="large"
                    active-text="启用" inactive-text="停用"
                    :active-value="1" :inactive-value="0" @change="handleChange"
                />
                <el-button type="danger" style="font-size: 15px; margin-left: 2vh;" @click="start_deleteBatch">批量删除</el-button>
            </p>
            
            <br>
            <div style="background-color: #007bff; font-size: 16px; font-weight: bold; margin-top: 2vh; width: 100%; height: 3vh; align-content: center;">
                <label style="text-align: center; color: white; font-size: 15px; ">护理项目列表</label>
            </div>
            <el-table :data="allPrograms" :border="true" :stripe="true" 
                @selection-change="handleSelectionChange">
                <el-table-column 
                    type="selection"
                    width="50"
                >
                </el-table-column>
                <el-table-column 
                    type="index"
                    label="序号" 
                    width="60"
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
                    width="125"
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
                    width="90"
                >
                </el-table-column>
                <el-table-column 
                    property="executionTimes" 
                    label="执行次数"
                    width="80"
                    style="text-align: center;"
                >
                </el-table-column>
                <el-table-column 
                    property="description" 
                    label="描述"
                    width="220"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column  label="状态" width="90">
                    <template #default="scope">
                        <span v-if="scope.row.status==1">启用</span>
                        <span v-else>停用</span>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="200" style="text-align: center;">
                    <template #default="scope">
                        <label @click="start_updateProgram(scope.row)"
                            style="font-size: 15px; color: #007bff; margin-left: 1vh; " ><el-icon> <Edit /> </el-icon> 修改</label>
                        <label @click="start_deleteProgram(scope.row)"
                            style="font-size: 15px; color: red; margin-left: 3vh;"><el-icon><Delete /></el-icon> 删除</label>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog v-model="dialogFormControl.isVisible" :title="dialogFormControl.title" 
            style="width: 540px; height: 600px; overflow-y: auto;" draggable overflow>
                <el-form :model="editForm" :rules="editProgramRules">
                    <el-form-item label="编号" prop="programCode" label-width="100px" style="margin-top: 30px;">
                        <el-input type="text" v-model="editForm.programCode"  
                            placeholder="请输入护理项目编号" style="width: 350px;"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name" label-width="100px" >
                        <el-input type="text" v-model="editForm.name"  
                            placeholder="请输入护理项目名称" style="width: 350px;"></el-input>
                    </el-form-item>
                    <el-form-item label="价格" prop="price" label-width="100px" >
                        <el-input type="number" v-model.number="editForm.price"  
                            placeholder="请输入护理项目价格" style="width: 350px;"></el-input>
                    </el-form-item>
                    <el-form-item label="执行周期" prop="executionPeriod" label-width="100px" >
                        <el-select v-model="editForm.executionPeriod" placeholder="请选择护理项目执行周期"
                            size="large" style="width: 350px"
                        >
                            <el-option label="每天" value="每天"></el-option>
                            <el-option label="每两天" value="每两天"></el-option>
                            <el-option label="每三天" value="每三天"></el-option>
                            <el-option label="每四天" value="每四天"></el-option>
                            <el-option label="每五天" value="每五天"></el-option>
                            <el-option label="每六天" value="每六天"></el-option>
                            <el-option label="每周" value="每周"></el-option>
                            <el-option label="每两周" value="每两周"></el-option>
                            <el-option label="每三周" value="每三周"></el-option>
                            <el-option label="每月" value="每月"></el-option>
                            <el-option label="按需" value="按需"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="执行次数" prop="executionTimes" label-width="100px" >
                        <el-input type="number" v-model.number="editForm.executionTimes"  
                            placeholder="请输入护理项目执行次数" style="width: 350px;"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description" label-width="100px" >
                        <el-input type="textarea" v-model="editForm.description"  :autosize="{ minRows: 3, maxRows: 7 }"
                            placeholder="请输入护理项目描述" style="width: 350px;"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status" label-width="100px" >
                        <el-select v-model="editForm.status" placeholder="请选择护理项目状态"
                            size="large" style="width: 350px"
                        >
                            <el-option label="已启用" :value="1"></el-option>
                            <el-option label="已停用" :value="0"></el-option>
                        </el-select>
                    </el-form-item>

                    <div style="margin-top: 50px;">
                        <el-button type="primary" @click="confirm_commit" style="margin-left: 30%; margin-right: 20px;">提交</el-button>
                        <el-button @click="cancel_commit">取消</el-button>
                    </div>
                </el-form>
            </el-dialog>

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
        </el-col>
    
    </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { type NursingProgram } from '@/lib/type.d';
import { axiosInstance as axios } from '@/lib/core';
import Switcher from '@/components/custom/Switcher.vue';
import { ElContainer, ElMain, ElMessage, ElNotification, ElTable, ElButton, ElCol, ElDialog, ElForm, type FormRules, ElMessageBox } from 'element-plus' 
import {Edit, Setting, Delete } from '@element-plus/icons-vue'
import { router } from '@/lib/router';
import Button from '@/components/ui/button/Button.vue';

onMounted(() => {
    loadData()
})

// 分页数据
let allPrograms = ref([] as NursingProgram[])

// 多选框选中的数据
let multipleSelection = ref([] as NursingProgram[])

const handleSelectionChange = (val: NursingProgram[]) => {
    multipleSelection.value = val
    // console.log(multipleSelection.value)
}

let total = ref(0)
let queryEntity = ref({
    status: 1,
    name: "",
    current: 1,
    size: 5
})


const isActive = ref(true) // status是否等于1（启用状态）

const handleChange = (val: number) => {
    console.log("Switch的值改变了：", val)
    queryEntity.value.status = val
    console.log(queryEntity.value.status)
    loadData()
}

// 分页改变触发函数
const handleSizeChange = (val: number) => {
    queryEntity.value.size = val
    loadData()
}

const handleCurrentChange = (val: number) => {
    queryEntity.value.current = val
    loadData()
}


// 控制表单对话框
let dialogFormControl = ref({
    isVisible: false,
    isUpdate: true, //是修改还是添加
    title: "修改护理项目"
})

// 添加/修改的表单
let editForm = ref({} as NursingProgram)

const emptyForm = {
    id: 0,
    programCode: "",
    name: "",
    price: 0,
    status: 1,
    executionPeriod: "",
    executionTimes: 1,
    description: "",
    isDeleted: false
} as NursingProgram

// 通用校验：输入不能为空
const validateTextInput = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('输入不能为空！'))
    }
}

const validateNumberInput = (rule: any, value: any, callback: any) => {
    if (value < 0) {
        callback(new Error('输入数字不能小于零！'))
    }
}

const editProgramRules = reactive<FormRules>({
    programCode: [
        {required: true, validator: validateTextInput, message: "请输入护理项目的名称", trigger: "blur"}

    ],
    name: [
        {required: true, validator: validateTextInput, message: "请输入护理项目的名称", trigger: "blur"}

    ],
    price: [
        {required: true, validator: validateNumberInput, message: "请输入护理项目的价格（大于等于0）", trigger: "blur"}
    ],
    executionPeriod: [
        {required: true, validator: validateTextInput, message: "请选择护理项目的执行周期", trigger: "blur"}
    ],
    executionTimes: [
        {required: true, validator: validateNumberInput, message: "请输入护理项目的执行次数（大于等于1）", trigger: "blur"}
    ],
    description: [
        {required: false,  message: "请输入护理项目的描述", trigger: "blur"}
    ],
    status: [
        {required: true, validator: validateNumberInput, message: "请选择护理项目的状态", trigger: "blur"}
    ]
})

// 给表单赋值（用于修改）
const alignFormValue = (nursingProgram: NursingProgram) => {
    editForm.value = JSON.parse(JSON.stringify(nursingProgram)) //深拷贝
}
// 清空表单内容
const cleanFormValue = () => {
    alignFormValue(emptyForm)
}

/** 
 * 开始修改护理项目
*/ 
const start_updateProgram = (nursingProgram: NursingProgram) => {
    alignFormValue(nursingProgram)
    dialogFormControl.value.isUpdate = true
    dialogFormControl.value.title = "修改护理项目"
    dialogFormControl.value.isVisible = true
}

/** 
 * 开始添加护理项目
*/ 
const start_addProgram = () => {
    cleanFormValue()
    dialogFormControl.value.isUpdate = false
    dialogFormControl.value.title = "添加护理项目"
    dialogFormControl.value.isVisible = true
}

// 删除单个护理项目
const start_deleteProgram = (nursingProgram: NursingProgram) => {
    ElMessageBox.confirm('确定删除该护理项目吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post("/nursingProgram/delete", {id: nursingProgram.id})
        .then(res => {
            if (res.data.status == 200) {
                loadData()
                ElMessage({message: "删除成功！", type: "success"})
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

// 批量删除
const start_deleteBatch = () => {
    if (multipleSelection.value.length == 0) {
        ElMessage({message: "请先勾选至少一条数据！", type: "warning"})
        return;
    }
    ElMessageBox.confirm('确定删除所有选中的护理项目吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post("/nursingProgram/deleteBatch", multipleSelection.value)
        .then(res => {
            if (res.data.status == 200) {
                loadData()
                ElMessage({message: res.data.data, type: "success"})
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

/** 
 * 提交并发送请求
*/ 
const confirm_commit = () => {
    // 先校验表单
    if (editForm.value.programCode === '' || editForm.value.name === '' || editForm.value.executionPeriod === '') {
        ElMessage({message: "输入不能为空！", type: "warning"})
        return;
    }
    if (editForm.value.price < 0) {
        ElMessage({message: "价格不能为负数！", type: "warning"})
        return;
    }
    if (editForm.value.executionTimes < 1 || editForm.value.executionTimes%1 !== 0) {
        ElMessage({message: "执行次数必须是大于等于1的整数！", type: "warning"})
        return;
    }

    if (dialogFormControl.value.isUpdate) {
        axios.post("/nursingProgram/update", editForm.value)
        .then(res => {
            if (res.data.status == 200) {
                loadData()
                dialogFormControl.value.isVisible = false
                ElMessage({message: "修改成功！", type: "success"})
            } else {
                ElNotification({
                    title: 'Error',
                    message: res.data.msg,
                    type: 'error',
                })
            }
        })
    } else {
        axios.post("/nursingProgram/add", editForm.value)
        .then(res => {
            if (res.data.status == 200) {
                loadData()
                dialogFormControl.value.isVisible = false
                ElMessage({message: "添加成功！", type: "success"})
            } else {
                ElNotification({
                    title: 'Error',
                    message: res.data.msg,
                    type: 'error',
                })
            }
        })
    }
}

const cancel_commit = () => {
    dialogFormControl.value.isVisible = false
}


const loadData = () => {
    axios.post("/nursingProgram/page", queryEntity.value)
    .then(res => {
        if (res.data.status == 200) {
            allPrograms.value = res.data.data
            total.value = res.data.total
            console.log(allPrograms.value)

            // ElMessage({message: "数据加载成功！", type: "success"})
        } else {
            allPrograms.value = res.data.data
            total.value = res.data.total
            console.log(allPrograms.value)
            ElNotification({
                title: '没有符合条件的数据',
                message: res.data.msg,
                type: 'warning',
            })
        }
    })
}



</script>
