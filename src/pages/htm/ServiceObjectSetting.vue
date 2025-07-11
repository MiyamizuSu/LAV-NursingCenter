<!-- 系统管理员端 健康管家 设置服务对象 -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { type User, type Customer } from '@/lib/type.d';
import { ElMain, ElMessage, ElNotification, ElTable, ElButton, ElCol, ElMessageBox } from 'element-plus'
import Button from '@/components/ui/button/Button.vue';
import { useRouter } from 'vue-router';
import { axiosInstance as axios } from '@/lib/core'
import { useNursingCustomersStore } from '@/lib/store';

onMounted(() => {
    loadData()
})

const router = useRouter()
const nursingCustomersStore = useNursingCustomersStore()

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
    nursingCustomersStore.setCurrentNurse(nurse)
    router.push('/main/manageNursingCustomers')
}

const loadNurses = () => {
    axios.post("/user/page", nurse_queryEntity.value)
        .then(res => {
            if (res.data.status == 200) {
                allNurses.value = res.data.data
                nurse_total.value = res.data.total

            } else {
                allNurses.value = res.data.data
                nurse_total.value = res.data.total
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
    <el-container style="align-content: center; overflow-y: auto; padding: 20px;">
        <el-col style="width: 100%;">
            <el-card shadow="hover" class="section-card" style="width: 100%;">
                <p>
                    <!-- 搜索框 -->
                    <el-input v-model="nurse_queryEntity.name" clearable placeholder="管家姓名"
                        style="width: 30vh;"></el-input>
                    <Button @click="loadNurses" class="add-button" style="margin-left: 2vh;">查询</Button>
                </p>
                <br><br>

                <div
                    style="background-color: #007bff; margin-top: 2vh; width: 100%; height: 3vh; align-content: center;">
                    <label style="font-size: 16px; font-weight: bold; color: white; font-size: 15px; ">健康管家列表</label>
                </div>
                <el-table :data="allNurses" :stripe="true" style="width: 100%;">
                    <el-table-column type="index" label="序号" align="center" min-width="50">
                    </el-table-column>
                    <el-table-column property="name" label="姓名" align="center">
                    </el-table-column>
                    <el-table-column property="phoneNumber" label="电话" align="center">
                    </el-table-column>
                    <el-table-column label="性别" align="center">
                        <template #default="scope">
                            <span v-if="scope.row.gender == 1">男</span>
                            <span v-else>女</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="email" label="邮箱" align="center">
                    </el-table-column>

                    <el-table-column label="操作" align="center" min-width="100">
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
