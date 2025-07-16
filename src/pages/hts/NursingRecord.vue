<!-- 健康管家端 护理记录管理 -->
<script setup lang="ts">
import { axiosInstance as axios } from '@/lib/core'
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import type { User } from '@/lib/type'
import { debounce } from '@/lib/utils'

// 客户信息接口
interface Customer {
  customerId: number
  name: string
  age: number
  gender: number
  bedNumber: string
  nursingLevel: string
  phoneNumber: string
}

// 护理记录接口
interface NursingRecord {
  id: number
  programCode: string
  programName: string
  executionCount: number
  description: string
  nurseName: string
  nursePhone: string
  nursingTime: string
}

let currentNurse = ref({} as User)

// 客户查询参数
const customerQuery = ref({
  name: '',
  current: 1,
  size: 5
})

// 护理记录查询参数
const recordQuery = ref({
  current: 1,
  size: 5,
  customerId: 0
})

// 数据存储
const customers = ref<Customer[]>([])
const customerTotal = ref(0)
const records = ref<NursingRecord[]>([])
const recordTotal = ref(0)
// 当前客户名称
const currentCustomerName = ref('')

const selectedRecords = ref<NursingRecord[]>([])

// 分页查询客户
const queryCustomers = () => {
  axios.post('/customer/pageByNurseId', { ...customerQuery.value, nurseId: currentNurse.value.userId })
    .then(res => {
      const pr = res.data
      if (pr.status === 200) {
        customers.value = pr.data
        customerTotal.value = pr.total
      }
    })
}

// 查询护理记录
const queryRecords = (customerId: number, customerName: string) => {
  recordQuery.value.customerId = customerId
  currentCustomerName.value = customerName
  axios.post('/nursingRecord/page', recordQuery.value)
    .then(res => {
      const pr = res.data
      if (pr.status === 200) {
        records.value = pr.data
        recordTotal.value = pr.total
      }
    })
}

// 删除护理记录
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确认移除该护理记录？', '警告', {
    confirmButtonText: '确认移除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.post(`/nursingRecord/delete`, { id })
      .then(res => {
        if (res.data.status === 200) {
          ElMessage.success('移除成功')
          queryRecords(recordQuery.value.customerId, currentCustomerName.value)
        }
      })
  })
}

// 批量删除方法
const handleBatchDelete = () => {
  if (selectedRecords.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }

  ElMessageBox.confirm(`确认删除选中的${selectedRecords.value.length}条记录？`, '警告', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = selectedRecords.value.map(item => item.id)
    axios.post('/nursingRecord/deleteBatchByIds', { ids : ids })
      .then(res => {
        if (res.data.status === 200) {
          ElMessage.success(`已删除${ids.length}条记录`)
          queryRecords(recordQuery.value.customerId, currentCustomerName.value)
          selectedRecords.value = []
        }
      })
  })
}

onMounted(() => {
  currentNurse.value = JSON.parse(localStorage.getItem('user1')!)
  queryCustomers()
})

const onInput = async (event: Event) => {
  const deLoad = debounce(queryCustomers)
  deLoad()
}
</script>

<template>
  <el-container style="height: 80vh; padding: 0;">
    <el-col :span="24">
      <!-- 客户查询 -->
      <div style="margin-bottom:20px">
        <el-input v-model="customerQuery.name" placeholder="客户姓名" style="width:200px;margin-right:10px" clearable
          @input="onInput" />
        <el-button type="primary" @click="queryCustomers">查询</el-button>
      </div>
      <el-row :gutter="20">
        <!-- 客户列表卡片 -->
        <el-col :span="10">
          <el-card shadow="hover" class="section-card">
            <div class="section-title">客户列表</div>
            <el-table :data="customers" height="600" :fit="true" style="width: 100%"
              :header-cell-style="{ 'text-align': 'center' }">
              <el-table-column align="center" type="index" label="序号" />
              <el-table-column align="center" prop="name" label="姓名" />
              <el-table-column align="center" prop="age" label="年龄" />
              <el-table-column align="center" label="性别" width="52">
                <template #default="{ row }">{{ row.gender === 1 ? '男' : '女' }}</template>
              </el-table-column>
              <el-table-column align="center" prop="bedNumber" label="床号" />
              <el-table-column align="center" prop="nursingLevelName" label="护理级别" />
              <el-table-column align="center" label="操作">
                <template #default="{ row }">
                  <el-link type="primary" @click="queryRecords(row.customerId, row.name)">查看</el-link>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background v-model:current-page="customerQuery.current"
              v-model:page-size="customerQuery.size" :page-sizes="[5, 7, 9]"
              layout="total, sizes, prev, pager, next, jumper" :total="customerTotal" @current-change="queryCustomers"
              @size-change="queryCustomers" />
          </el-card>
        </el-col>

        <!-- 护理记录卡片 -->
        <el-col :span="14">
          <el-card shadow="hover" class="section-card" style="margin-right: 30px;">
            <div class="section-title">
              护理记录列表 - 当前客户：{{ currentCustomerName || '请选择客户' }}
              <el-button type="danger" size="small" style="margin-left:20px" @click="handleBatchDelete">
                批量删除
              </el-button>
            </div>
            <el-table :data="records" height="600" :fit="true" style="width: 100%"
              :header-cell-style="{ 'text-align': 'center' }"
              @selection-change="(val: NursingRecord[]) => selectedRecords = val">
              <el-table-column align="center" type="selection" width="40" />
              <el-table-column align="center" type="index" label="序号" />
              <el-table-column align="center" prop="programCode" label="项目编号" />
              <el-table-column align="center" prop="programName" label="项目名称" :show-overflow-tooltip="true" />
              <el-table-column align="center" prop="executionCount" label="数量" />
              <el-table-column align="center" prop="description" label="护理内容" :show-overflow-tooltip="true" />
              <el-table-column align="center" prop="nurseName" label="护理人员" />
              <el-table-column align="center" prop="nursePhone" label="联系电话" :show-overflow-tooltip="true" />
              <el-table-column align="center" prop="nursingTime" label="护理时间" :show-overflow-tooltip="true" />
              <el-table-column align="center" label="操作">
                <template #default="{ row }">
                  <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row.id)" />
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background v-model:current-page="recordQuery.current" v-model:page-size="recordQuery.size"
              :page-sizes="[5, 7, 9]" layout="total, sizes, prev, pager, next, jumper" :total="recordTotal"
              @current-change="() => queryRecords(recordQuery.customerId, currentCustomerName)"
              @size-change="() => queryRecords(recordQuery.customerId, currentCustomerName)" />
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-container>
</template>

<style scoped>
.section-card {
  margin-bottom: 20px;
  margin-right: 0px;
  border-radius: 8px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #606266;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 4px solid #409eff;
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
</style>
