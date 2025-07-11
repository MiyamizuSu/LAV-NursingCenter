<!-- 系统管理员端 护理管理 护理级别 -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { type NursingLevel, type User } from '@/lib/type.d';
import Switcher from '@/components/custom/Switcher.vue';
import { ElContainer, ElMain, ElMessage, ElNotification, ElTable, ElButton, ElCol, ElDialog, ElForm, type FormRules } from 'element-plus'
import { Setting, Edit } from '@element-plus/icons-vue'
import { Button } from '@/components/ui/button';
import { useRouter } from 'vue-router';
import { axiosInstance as axios } from '@/lib/core'
import { useLevelProgramStore } from '@/lib/store'

const router = useRouter()
const levelProgramStore = useLevelProgramStore()

let websocket = reactive({} as WebSocket)

const initWebSocket = () => {
    let user = {} as User
    if (sessionStorage.getItem('userType') == '0') {
        user = JSON.parse(localStorage.getItem('user0')!)
    } else if (sessionStorage.getItem('userType') == '1') {
        user = JSON.parse(localStorage.getItem('user1')!)
    }
    let url = axios.defaults.baseURL?.replace("http://", "ws://").replace("https://", "wss://") + "/websocket/" + user.userId.toString()
    websocket = new WebSocket(url)
    websocket.onopen = (ev) => {
        // console.log("WebSocket连接成功：", ev);
    }
    websocket.onerror = (ev) => {
        // console.log("WebSocket连接发生错误：", ev);
    }
    websocket.onmessage = (ev) => {
        let data = ev.data
        console.log("收到消息：", data)
        if (data == 'NursingLevel_UPDATE') {
            console.log("根据消息自动发送请求更新数据")
            loadData()
        }
    }
    websocket.onclose = (ev) => {
        // console.log("connection closed (" + ev.code + ")");
    }
}

onMounted(() => {
    loadData()
    initWebSocket()
})

let currentUser = ref({} as User)

// 分页数据
let tableData = ref([] as NursingLevel[])

let total = ref(0)
let queryEntity = ref({
    status: 1,
    current: 1,
    size: 5
})

const handleChange = (val: string) => {
    if (val == '启用') {
        queryEntity.value.status = 1
    } else {
        queryEntity.value.status = 0
    }
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
    title: "修改护理级别"
})

// 添加/修改的表单
let editForm = ref({} as NursingLevel)

// 通用校验：输入不能为空
const validateInput = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('输入不能为空！'))
    }
}

const editLevelRules = reactive<FormRules>({
    name: [
        { required: true, validator: validateInput, message: "请输入护理级别的名称", trigger: "blur" }

    ],
    status: [
        { required: true, validator: validateInput, message: "请选择护理级别的状态", trigger: "blur" }
    ]
})

// 给表单赋值（用于修改）
const alignFormValue = (nursingLevel: NursingLevel) => {
    editForm.value = JSON.parse(JSON.stringify(nursingLevel)) //深拷贝
}
// 清空表单内容
const cleanFormValue = () => {
    editForm.value.id = 0
    editForm.value.name = ""
    editForm.value.status = 1
}

/** 
 * 修改护理级别
*/
const start_updateLevel = (nursingLevel: NursingLevel) => {
    alignFormValue(nursingLevel)
    dialogFormControl.value.isUpdate = true
    dialogFormControl.value.title = "修改护理级别"
    dialogFormControl.value.isVisible = true
}

/** 
 * 添加护理级别
*/
const start_addLevel = () => {
    cleanFormValue()
    dialogFormControl.value.isUpdate = false
    dialogFormControl.value.title = "添加护理级别"
    dialogFormControl.value.isVisible = true
}

/** 
 * 提交并发送请求
*/
const confirm_commit = () => {
    // 先校验表单
    if (editForm.value.name === '') {
        ElMessage({ message: "护理级别名称不能为空！", type: "warning" })
        return;
    }

    if (dialogFormControl.value.isUpdate) {
        axios.post("/nursingLevel/update", editForm.value)
            .then(res => {
                if (res.data.status == 200) {
                    // loadData()
                    dialogFormControl.value.isVisible = false
                    ElMessage({ message: "修改成功！", type: "success" })
                } else {
                    ElNotification({
                        title: 'Error',
                        message: res.data.msg,
                        type: 'error',
                    })
                }
            })
    } else {
        axios.post("/nursingLevel/add", editForm.value)
            .then(res => {
                if (res.data.status == 200) {
                    // loadData()
                    dialogFormControl.value.isVisible = false
                    ElMessage({ message: "添加成功！", type: "success" })
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


/** 
 * 去配置级别下的护理项目
*/
const start_managePrograms = (selectedLevel: NursingLevel) => {
    levelProgramStore.setCurrentLevel(selectedLevel)
    router.push('/main/levelManagePrograms')
}

const loadData = () => {
    axios.post("/user/load", {}).then(res => {
        if (res.data.status == 200) {
            currentUser.value = res.data.data
        }
    })

    axios.post("/nursingLevel/pageByStatus", queryEntity.value)
        .then(res => {
            if (res.data.status == 200) {
                tableData.value = res.data.data
                total.value = res.data.total
            } else {
                tableData.value = res.data.data
                total.value = res.data.total
            }
        })
}

</script>

<template>
    <el-container style="align-content: center; overflow-y: auto;">
        <el-col style="width: 100%;">
            <el-card shadow="hover" class="section-card">
                <p style="margin-top: 2vh; margin-bottom: 2vh;">
                    <Button @click="start_addLevel" class="add-button">添加护理级别</Button>
                    <!-- <Button @click="router.push('/stream')">去和AI对话</Button> -->
                </p>

                <Switcher left-value="启用" right-value="停用" @select-value-change="handleChange">
                </Switcher>
                <br>

                <br>
                <div
                    style="background-color: #007bff; margin-top: 2vh; width: 100%; height: 3vh; align-content: center;">
                    <label style="font-size: 16px; font-weight: bold; color: white; font-size: 15px; ">护理级别列表</label>
                </div>

                <el-table :data="tableData" :stripe="true" style="width: 100%;" :fit="true">
                    <el-table-column type="index" label="序号" align="center" min-width="80">
                    </el-table-column>
                    <el-table-column property="name" label="级别名称" align="center">
                    </el-table-column>
                    <el-table-column label="状态" align="center">
                        <template #default="scope">
                            <span v-if="scope.row.status == 1">启用</span>
                            <span v-else>停用</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" min-width="100">
                        <template #default="scope">
                            <div v-if="queryEntity.status == 1">
                                <el-button @click="start_updateLevel(scope.row)" style="color: #007bff;  "><el-icon>
                                        <Edit />
                                    </el-icon> 修改</el-button>
                                <el-button @click="start_managePrograms(scope.row)"
                                    style="color: gray; margin-left: 7vh;"><el-icon>
                                        <Setting />
                                    </el-icon> 护理项目配置</el-button>
                            </div>
                            <div v-else>
                                <label @click="start_updateLevel(scope.row)" style="color: #007bff; "><el-icon>
                                        <Edit />
                                    </el-icon> 修改</label>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <el-dialog v-model="dialogFormControl.isVisible" :title="dialogFormControl.title"
                    style="width: 500px; height: 400px; overflow-y: auto;" draggable overflow>
                    <el-form :model="editForm" :rules="editLevelRules">
                        <el-divider></el-divider>
                        <el-form-item label="名称" prop="name" label-width="100px" style="margin-top: 50px;">
                            <el-input type="text" v-model="editForm.name" :disabled="dialogFormControl.isUpdate"
                                placeholder="请输入护理级别名称" style="width: 300px;"></el-input>
                        </el-form-item>
                        <el-form-item label="状态" prop="status" label-width="100px" style="margin-top: 50px;">
                            <el-select v-model="editForm.status" placeholder="请选择护理级别状态" size="large"
                                style="width: 300px">
                                <el-option label="已启用" :value="1"></el-option>
                                <el-option label="已停用" :value="0"></el-option>
                            </el-select>
                        </el-form-item>

                        <div style="margin-top: 30px;">
                            <el-button type="primary" @click="confirm_commit"
                                style="margin-left: 30%; margin-right: 20px;">提交</el-button>
                            <el-button @click="cancel_commit">取消</el-button>
                        </div>
                    </el-form>
                </el-dialog>

                <el-pagination :current-page="queryEntity.current" :page-sizes="[1, 5, 10, 50]"
                    :default-page-size="queryEntity.size" @update:page-size="handleSizeChange"
                    @update:current-page="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                    :total="total" style="margin-top: 10vh;" />
            </el-card>
        </el-col>

    </el-container>
</template>

<style scoped>
.add-button {
  background-color: #007bff;
  font-size: 16px;
}

.delete-button {
  background-color: red;
  color: white;
}

.container {
  padding: 16px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.query-bar {
  margin-bottom: 20px;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, .1);
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.el-table {
  :deep(.el-table__cell) {
    min-width: 80px;
    /* 设置最小列宽 */
  }

  :deep(.cell) {
    white-space: nowrap;
    /* 防止文字换行 */
  }

  :deep(th),
  :deep(td) {
    padding: 8px 12px !important;
  }
}

.el-pagination {
  margin: 16px 0;
}

:deep(.el-dialog) {
  border-radius: 12px;

  .el-form-item {
    margin-bottom: 18px;

    &__label {
      font-weight: 500;
      color: #606266;
    }
  }
}

.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;

  &--active {
    background: #e8f4ff;
    color: #409eff;
  }

  &--inactive {
    background: #fff0f0;
    color: #f56c6c;
  }
}

.el-select {
  width: 100%;
}

.el-button {
  transition: all 0.3s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
  }
}

.section-card {
  border-radius: 12px;
  margin-bottom: 16px;
  margin-right: 30px;
  padding: 16px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.flex-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.button-group {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.el-button {
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(28, 126, 255, 0.2);
  }

  &--danger:hover {
    box-shadow: 0 2px 6px rgba(245, 108, 108, 0.2);
  }
}
</style>
