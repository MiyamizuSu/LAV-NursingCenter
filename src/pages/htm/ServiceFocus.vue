<!-- 系统管理员端 健康管家 服务关注 -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { type User, type Customer } from '@/lib/type.d';
import { ElMain, ElMessage, ElNotification, ElTable, ElButton, ElCol, ElMessageBox } from 'element-plus'
import Button from '@/components/ui/button/Button.vue';
import { useRouter } from 'vue-router';
import { axiosInstance as axios } from '@/lib/core'
import { useCustomerProgramsStore } from '@/lib/store';

onMounted(() => {
    loadData()
})

const router = useRouter()
const customerProgramsStore = useCustomerProgramsStore()

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
        ElMessage({ message: "请先配置该客户的护理级别！", type: "warning" })
        return;
    }
    customerProgramsStore.setCurrentCustomer(customer)
    router.push('/main/manageCustomerPrograms')
}

const loadCustomers = () => {
    axios.post("/customer/page", customer_queryEntity.value)
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

<template>
    <el-container style="overflow-y: auto; padding: 0;">
        <el-col style="width: 100%;">
            <el-card shadow="hover" class="section-card">
                <p>
                    <!-- 搜索框 -->
                    <el-input v-model="customer_queryEntity.name" clearable placeholder="客户姓名"
                        style="width: 30vh;"></el-input>
                    <Button @click="loadCustomers" class="add-button" style="margin-left: 2vh;">查询</Button>
                </p>
                <br><br>

                <div
                    style="background-color: #007bff; margin-top: 2vh; width: 100%; height: 3vh; align-content: center;">
                    <label style="font-size: 16px; font-weight: bold; color: white; font-size: 15px; ">客户信息列表</label>
                </div>
                <el-table :data="allCustomers" :stripe="true" style="width: 100%;" :fit="true">
                    <el-table-column type="index" label="序号" align="center">
                    </el-table-column>
                    <el-table-column property="name" label="客户姓名" align="center">
                    </el-table-column>
                    <el-table-column property="age" label="年龄" align="center">
                    </el-table-column>
                    <el-table-column label="性别" align="center">
                        <template #default="scope">
                            <span v-if="scope.row.gender == 1">男</span>
                            <span v-else>女</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="bedNumber" label="床位号" align="center">
                    </el-table-column>
                    <el-table-column property="nursingLevelName" label="护理级别" align="center">
                    </el-table-column>
                    <el-table-column property="phoneNumber" label="联系电话" align="center">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template #default="scope">
                            <el-button @click="manageCustomerPrograms(scope.row)"
                                style="color: #007bff;">配置护理项目</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination :current-page="customer_queryEntity.current" :page-sizes="[1, 5, 10, 50]"
                    :default-page-size="customer_queryEntity.size" @update:page-size="customer_handleSizeChange"
                    @update:current-page="customer_handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                    :total="customer_total" style="margin-top: 10vh;" />
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
