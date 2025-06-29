<!-- 健康管家端 日常护理 -->
<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 客户信息接口
interface Customer {
  customerId: number
  name: string
  age: number
  gender: number
  roomNumber: string
  bedNumber: string
  building: string
  phone: string
  nursingLevelName: string
}

// 护理项目接口
interface CareItem {
  id: number
  programCode: string
  programName: string
  programPrice: number
  leftCount: number
  totalCount: number
  usedCount: number
  expirationDate: string
  status: string
}

// 分页查询参数
const customerQuery = ref({
  name: '',
  current: 1,
  size: 5
})

// 护理项目查询参数
const careItemQuery = ref({
  current: 1,
  size: 5
})

// 客户列表数据
const customers = ref<Customer[]>([])
const customerTotal = ref(0)

// 护理项目数据
const careItems = ref<CareItem[]>([])
const careItemTotal = ref(0)

// 对话框控制
const showCareDialog = ref(false)
const showRecordDialog = ref(false)
const currentCustomer = ref({} as Customer)

// 护理记录表单
const careRecordForm = ref({
  customerId: 0,
  customerName: '',
  programCode: '',
  programName: '',
  nursingTime: '',
  executionCount: 1,
  description: '',
  nurseName: '张护工'
})

//表单验证规则
const formRules = ref({
  nursingTime: [{ required: true, message: '请选择护理时间', trigger: 'change' }],
  description: [{ required: true, message: '请输入护理内容', trigger: 'blur' }],
  executionCount: [{ type: 'number', min: 1, message: '次数必须大于0' }]
})

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

// 查询护理项目
const queryCareItems = () => {
  axios.post('http://localhost:9000/customerNursingService/page', {
    ...careItemQuery.value,
    customerId: currentCustomer.value?.customerId
  })
    .then(res => {
      const pr = res.data
      careItems.value = pr.data
      careItemTotal.value = pr.total
      careItems.value.forEach((item) => {
        item.leftCount = item.totalCount - item.usedCount
      })
    })
    .catch(error => console.log(error))
}

// 提交护理记录方法
const submitCareRecord = () => {
  recordForm.value.validate((valid: boolean) => {
    if (!valid) return

    ElMessageBox.confirm('确认创建护理记录？', '提示', {
      confirmButtonText: '立即创建',
      cancelButtonText: '取消'
    }).then(() => {
      axios.post('http://localhost:9000/nursingRecord/add', careRecordForm.value)
        .then(res => {
          if (res.data.status === 200) {
            ElMessage.success('创建成功')
            showRecordDialog.value = false
            queryCareItems()
          }
        })
        .catch(error => {
          console.log(error)
          ElMessage.error('创建失败')
        })
    })
  })
}

// 表单引用 
const recordForm = ref()

// 打开护理项目管理
const openCareDialog = (customer: Customer) => {
  currentCustomer.value = customer
  careItemQuery.value.current = 1 // 重置分页参数
  queryCareItems()
  showCareDialog.value = true
}

const handleOpenRecordDialog = (careItem: CareItem) => {
  careRecordForm.value = {
    ...careRecordForm.value,
    customerName: currentCustomer.value?.name || '',
    customerId: currentCustomer.value?.customerId || 0,
    programCode: careItem.programCode,
    programName: careItem.programName
  }
  showRecordDialog.value = true
}

onMounted(() => {
  queryCustomers()
})

</script>

<template>
  <el-container style="height: 80vh; padding: 0;">
    <el-col :span="24">
      <!-- 客户列表卡片 -->
      <el-card shadow="hover" class="main-card">
        <div class="filter-bar">
          <el-input v-model="customerQuery.name" placeholder="客户姓名" style="width: 200px" clearable />
          <el-button type="primary" @click="queryCustomers">查询</el-button>
        </div>

        <el-table :data="customers" style="width: 100%;" stripe header-row-class-name="table-header" :fit="true"
          row-class-name="table-row">
          <el-table-column align="center" type="index" label="序号" width="60" />
          <el-table-column align="center" prop="name" label="姓名" />
          <el-table-column align="center" prop="age" label="年龄" />
          <el-table-column align="center" label="性别">
            <template #default="{ row }">{{ row.gender === 1 ? '男' : '女' }}</template>
          </el-table-column>
          <el-table-column align="center" prop="building" label="楼栋" />
          <el-table-column align="center" prop="roomNumber" label="房间号" />
          <el-table-column align="center" prop="bedNumber" label="床号" />
          <el-table-column align="center" prop="nursingLevelName" label="护理级别" />

          <el-table-column align="center" label="操作">

            <template #default="{ row }">
              <el-link type="primary" @click="openCareDialog(row)">日常护理</el-link>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="customerQuery.current" v-model:page-size="customerQuery.size"
          :page-sizes="[5, 7, 9]" layout="total, sizes, prev, pager, next, jumper" :total="customerTotal"
          @current-change="queryCustomers" @size-change="queryCustomers" />
      </el-card>

      <!-- 护理项目管理对话框 -->
      <el-dialog :title="`护理项目管理 - ${currentCustomer.name}`" v-model="showCareDialog" width="70%" top="5vh">
        <el-card shadow="hover" class="dialog-card">
          <el-table :data="careItems" stripe header-row-class-name="dialog-table-header">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="programCode" label="项目编号" width="120" />
            <el-table-column prop="programName" label="项目名称" min-width="150" />
            <el-table-column prop="programPrice" label="价格" width="120" align="right">
              <template #default="{ row }">¥{{ row.programPrice }}</template>
            </el-table-column>
            <el-table-column prop="leftCount" label="余量" width="100" align="center" />
            <el-table-column prop="expirationDate" label="到期日" width="140" />
            <el-table-column label="状态" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="new Date(row.expirationDate) < new Date() ? 'danger'
                  : row.leftCount <= 0 ? 'warning' : 'success'" effect="plain">
                  {{ new Date(row.expirationDate) < new Date() ? '已过期' : row.leftCount <= 0 ? '已用完' : '可用' }} </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140" align="center">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleOpenRecordDialog(row)"
                  :disabled="new Date(row.expirationDate) < new Date() || row.leftCount <= 0">
                  执行护理
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination v-model:current-page="careItemQuery.current" v-model:page-size="careItemQuery.size"
            :page-sizes="[5, 7, 9]" layout="total, sizes, prev, pager, next, jumper" :total="careItemTotal"
            @current-change="queryCareItems" @size-change="queryCareItems" class="dialog-pagination" />
        </el-card>
      </el-dialog>
    </el-col>
  </el-container>

  <!-- 护理记录对话框 -->
  <el-dialog title="添加护理记录" v-model="showRecordDialog" @closed="recordForm?.resetFields()">
    <el-form :model="careRecordForm" :rules="formRules" ref="recordForm">
      <el-form-item label="客户姓名">
        <el-input v-model="currentCustomer.name" disabled />
      </el-form-item>
      <el-form-item label="项目编号">
        <el-input v-model="careRecordForm.programCode" disabled />
      </el-form-item>
      <el-form-item label="护理项目">
        <el-input v-model="careRecordForm.programName" disabled />
      </el-form-item>
      <el-form-item label="护理次数" prop="executionCount">
        <el-input-number v-model="careRecordForm.executionCount" :min="1" controls-position="right" />
      </el-form-item>
      <el-form-item label="护理时间" prop="nursingTime">
        <el-date-picker v-model="careRecordForm.nursingTime" type="datetime" placeholder="选择日期时间"
          value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>
      <el-form-item label="护理内容" prop="description">
        <el-input v-model="careRecordForm.description" type="textarea" :rows="3" placeholder="请输入详细护理内容" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="showRecordDialog = false">取消</el-button>
      <el-button type="primary" @click="submitCareRecord">立即创建</el-button>
    </template>
  </el-dialog>
</template>

<style lang="css" scoped>
.nursing-container {
  padding: 0px;
  min-height: calc(100vh - 60px);
}

.main-card {
  border-radius: 12px;
  margin-right: 30px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

:deep(.table-header) {
  th {
    background: #f8f9fa !important;
    font-weight: 600;
    color: #606266;
  }
}

:deep(.table-row) {
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.el-dialog {
  :deep(.el-card) {
    border: none;
    box-shadow: none;

    .el-card__body {
      padding: 0;
    }
  }
}

.el-link {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.dialog-card {
  border-radius: 8px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

:deep(.dialog-table-header) th {
  background: #f8fafc !important;
  font-weight: 600;
  color: #606266;
}

.dialog-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.el-tag {
  margin: 2px;
  transition: all 0.3s;
}

.el-button--small {
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(28, 126, 255, 0.2);
  }
}

.el-table {
  flex: 1;

  :deep(.el-table__inner-wrapper) {
    height: 100% !important;
  }

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