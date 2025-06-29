<!-- 健康管家端 护理记录管理 -->
<script setup lang="ts">
import { axiosInstance as axios } from '@/lib/core'
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

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
  axios.post('http://localhost:9000/customer/page', customerQuery.value)
    .then(res => {
      const pr = res.data
      if (pr.status === 200) {
        customers.value = pr.data
        customerTotal.value = pr.total
      }
    })
    .catch(error => console.log(error))
}

// 查询护理记录
const queryRecords = (customerId: number, customerName: string) => {
  recordQuery.value.customerId = customerId
  currentCustomerName.value = customerName
  axios.post('http://localhost:9000/nursingRecord/page', recordQuery.value)
    .then(res => {
      const pr = res.data
      if (pr.status === 200) {
        records.value = pr.data
        recordTotal.value = pr.total
      }
    })
    .catch(error => console.log(error))
}

// 删除护理记录
const handleDelete = (id: number) => {
  console.log(id)
  ElMessageBox.confirm('确认移除该护理记录？', '警告', {
    confirmButtonText: '确认移除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.post(`http://localhost:9000/nursingRecord/delete`, { id })
      .then(res => {
        if (res.data.status === 200) {
          ElMessage.success('移除成功')
          queryRecords(recordQuery.value.customerId, currentCustomerName.value)
        }
      })
      .catch(error => console.log(error))
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
    axios.post('http://localhost:9000/nursingRecord/deleteBatch', { ids })
      .then(res => {
        if (res.data.status === 200) {
          ElMessage.success(`已删除${ids.length}条记录`)
          queryRecords(recordQuery.value.customerId, currentCustomerName.value)
          selectedRecords.value = []
        }
      })
      .catch(error => console.log(error))
  })
}

onMounted(() => {
  queryCustomers()
})

</script>

<template>
  <div class="container">
    <!-- 客户查询 -->
    <div style="margin-bottom:20px">
      <el-input v-model="customerQuery.name" placeholder="客户姓名" style="width:200px;margin-right:10px" clearable />
      <el-button type="primary" @click="queryCustomers">查询</el-button>
    </div>

    <el-row :gutter="20">
      <!-- 客户列表 -->
      <el-col :span="8">
        <div class="section-title">客户列表</div>
        <el-table :data="customers" height="600" style="width: 100%" :header-cell-style="{ 'text-align': 'center' }">
          <el-table-column type="index" label="序号" width="52" />
          <el-table-column prop="name" label="姓名" min-width="66" />
          <el-table-column prop="age" label="年龄" min-width="52" />
          <el-table-column label="性别" width="52">
            <template #default="{ row }">{{ row.gender === 1 ? '男' : '女' }}</template>
          </el-table-column>
          <el-table-column prop="bedNumber" label="床号" width="72" />
          <el-table-column prop="nursingLevelName" label="护理级别" width="80" />
          <el-table-column label="操作" width="60">
            <template #default="{ row }">
              <el-link type="primary" @click="queryRecords(row.customerId, row.name)">查看</el-link>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="customerQuery.current" v-model:page-size="customerQuery.size"
          :page-sizes="[5, 7, 9]" layout="total, sizes, prev, pager, next, jumper" :total="customerTotal"
          @current-change="queryCustomers" @size-change="queryCustomers" />
      </el-col>

      <!-- 护理记录列表 -->
      <el-col :span="16">
        <div class="section-title">
          护理记录列表 - 当前客户：{{ currentCustomerName || '请选择客户' }}
          <el-button type="danger" size="small" style="margin-left:20px" @click="handleBatchDelete">
            批量删除
          </el-button>
        </div>
        <el-table :data="records" height="600" style="width: 100%" :header-cell-style="{ 'text-align': 'center' }"
          @selection-change="(val: NursingRecord[]) => selectedRecords = val">
          <el-table-column type="selection" width="40" />
          <el-table-column type="index" label="序号" width="52" />
          <el-table-column prop="programCode" label="项目编号" min-width="98" />
          <el-table-column prop="programName" label="项目名称" min-width="82" :show-overflow-tooltip="true" />
          <el-table-column prop="executionCount" label="数量" width="52" />
          <el-table-column prop="description" label="护理内容" min-width="150" :show-overflow-tooltip="true" />
          <el-table-column prop="nurseName" label="护理人员" width="80" />
          <el-table-column prop="nursePhone" label="联系电话" width="116" />
          <el-table-column prop="nursingTime" label="护理时间" width="160" :show-overflow-tooltip="true" />
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ row }">
              <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row.id)" />
            </template>
          </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="recordQuery.current" v-model:page-size="recordQuery.size"
          :page-sizes="[5, 7, 9]" layout="total, sizes, prev, pager, next, jumper" :total="recordTotal"
          @current-change="() => queryRecords(recordQuery.customerId, currentCustomerName)"
          @size-change="() => queryRecords(recordQuery.customerId, currentCustomerName)" />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #606266;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 4px solid #409eff;
}
</style>
