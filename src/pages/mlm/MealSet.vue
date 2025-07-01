<!-- 系统管理员端 膳食管理 膳食配置 -->
<script setup lang="ts">
import { axiosInstance as axios } from '@/lib/core';
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Delete, Search, Edit } from '@element-plus/icons-vue'

// 客户相关
interface Customer {
  customerId: number
  name: string
  age: number
  gender: string
  bedNumber: string
  phone: string
}

// 膳食配置相关
interface MealConfig {
  id: number
  name: string
  description: string
  customerId: number
}

// 客户列表相关
const customers = ref<Customer[]>([])
const customerQuery = ref({
  name: '',
  customerType: 1,
  current: 1,
  size: 5
})

const handleDeleteConfig = (id: number) => {
  ElMessageBox.confirm('确定删除该配置？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.post('/dietConfigItem/delete', { id }).then(res => {
      let pr = res.data
      if (pr.status === 200) {
        ElMessage.success('删除成功')
        queryMealConfigs()
      } else {
        ElMessage.error(pr.msg || '删除失败')
      }
    }).catch(error => {
      console.log(error)
      ElMessage.error('请求失败')
    })
  })
}

const showConfigManagement = (customer: Customer) => {
  currentCustomerId.value = Number(customer.customerId)
  nextTick(() => {
    queryMealConfigs()
  })
}

const customerTotal = ref(0)

// 膳食配置列表相关
const mealConfigs = ref<MealConfig[]>([])
const selectedConfigs = ref<MealConfig[]>([])
const mealConfigQuery = ref({
  name: '',
  current: 1,
  size: 5
})
const mealConfigTotal = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const isAdding = ref(true)
const currentCustomerId = ref<number>()
const form = ref()
const mealConfigForm = ref<MealConfig>({
  id: 0,
  name: '',
  description: '',
  customerId: 0
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入详细描述', trigger: 'blur' }]
}

// 客户列表查询
const queryCustomers = () => {
  axios.post('/customer/page', customerQuery.value)
    .then(res => {
      let pr = res.data
      if (pr.status === 200) {
        customers.value = pr.data
        customerTotal.value = pr.total
      } else {
        ElMessage.error(pr.msg || '查询失败')
      }
    }).catch(error => {
      console.log(error)
      ElMessage.error('请求失败')
    })
}

// 膳食配置查询接口
const queryMealConfigs = () => {
  if (!currentCustomerId.value) return

  axios.post('/dietConfigItem/page', {
    ...mealConfigQuery.value,
    customerId: currentCustomerId.value
  }).then(res => {
    let pr = res.data
    if (pr.status === 200) {
      mealConfigs.value = pr.data
      mealConfigTotal.value = pr.total
    } else {
      ElMessage.error(pr.msg || '查询失败')
    }
  }).catch(error => {
    console.log(error)
    ElMessage.error('请求失败')
  })
}

// 表单提交处理
const handleSubmit = () => {
  form.value.validate((valid: any) => {
    if (valid) {
      const config = {
        ...mealConfigForm.value,
        customerId: currentCustomerId.value
      }

      const url = isAdding.value ? '/dietConfigItem/add'
        : '/dietConfigItem/update'
      axios.post(url, config).then(res => {
        let pr = res.data
        if (pr.status === 200) {
          ElMessage.success(isAdding.value ? '添加成功' : '修改成功')
          dialogVisible.value = false
          queryMealConfigs()
        } else {
          ElMessage.error(pr.msg || '操作失败')
        }
      }).catch(error => {
        console.log(error)
        ElMessage.error('请求失败')
      })
    }
  })
}

// 批量删除处理
const handleBatchDeleteConfig = () => {
  if (selectedConfigs.value.length === 0) return

  ElMessageBox.confirm(`确定删除选中的${selectedConfigs.value.length}项配置？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = selectedConfigs.value.map(c => c.id)
    axios.post('/dietConfigItem/deleteBatch', { ids })
      .then(res => {
        let pr = res.data
        if (pr.status === 200) {
          ElMessage.success(`已删除${ids.length}项配置`)
          queryMealConfigs()
          selectedConfigs.value = []
        } else {
          ElMessage.error(pr.msg || '删除失败')
        }
      }).catch(error => {
        console.log(error)
        ElMessage.error('请求失败')
      })
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const formatGender = (row: any) => {
  return row.gender === 0 ? '女' : row.gender === 1 ? '男' : '未知'
}

// 返回客户列表
const backToCustomerList = () => {
  currentCustomerId.value = undefined
}


onMounted(() => {
  if (!currentCustomerId.value) {
    queryCustomers()
  }
})
</script>

<template>
  <el-container style="height: 80vh; padding: 0;">
    <el-col :span="24">
      <!-- 客户查询 -->
      <el-card shadow="hover" class="section-card" v-if="!currentCustomerId">
        <div class="filter-bar">
          <el-input v-model="customerQuery.name" placeholder="客户姓名" style="width: 200px;" clearable />
          <el-select v-model="customerQuery.customerType" placeholder="客户类型" style="width: 200px; margin-left: 10px"
            clearable>
            <el-option label="自理老人" :value="0" />
            <el-option label="护理老人" :value="1" />
          </el-select>
          <el-button type="primary" @click="queryCustomers">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
        </div>

        <el-table stripe header-row-class-name="table-header" :fit="true" row-class-name="table-row" :data="customers">
          <el-table-column align="center" type="index" label="序号" :min-width="55" />
          <el-table-column align="center" prop="name" label="客户姓名" />
          <el-table-column align="center" prop="age" label="年龄" />
          <el-table-column align="center" prop="gender" label="性别" :formatter="formatGender" />
          <el-table-column align="center" prop="bedNumber" label="床位号" />
          <el-table-column align="center" prop="phoneNumber" label="联系电话" />
          <el-table-column align="center" label="操作" fixed="right" :min-width="90">
            <template #default="{ row }">
              <el-link type="primary" @click="showConfigManagement(row)" :underline="false" style="padding: 0 5px">
                管理膳食配置
              </el-link>
            </template>
          </el-table-column>
        </el-table>

        <!-- 客户列表分页 -->
        <el-pagination v-model:current-page="customerQuery.current" v-model:page-size="customerQuery.size"
          :page-sizes="[5, 7, 9]" layout="total, sizes, prev, pager, next, jumper" :total="customerTotal"
          @size-change="queryCustomers" @current-change="queryCustomers" />
      </el-card>

      <!-- 膳食配置管理部分 -->
      <el-card v-else shadow="hover" class="section-card" style="max-width: 800px">
        <div class="action-bar">
          <div class="flex-container">
            <el-button type="primary" @click="backToCustomerList">
              <el-icon>
                <ArrowLeft />
              </el-icon>
              返回
            </el-button>
            <el-input v-model="mealConfigQuery.name" placeholder="配置名称" style="width: 200px; margin-left: 15px"
              clearable />
            <div class="button-group">
              <el-button type="primary" @click="queryMealConfigs">查询</el-button>
              <el-button type="primary"
                @click="dialogVisible = true; isAdding = true; mealConfigForm = { id: 0, name: '', description: '', customerId: currentCustomerId }">
                新增配置
              </el-button>
              <el-button type="danger" :disabled="selectedConfigs.length === 0" @click="handleBatchDeleteConfig">
                批量删除
              </el-button>
            </div>
          </div>
        </div>

        <el-table stripe header-row-class-name="table-header" row-class-name="table-row" :fit="true" :data="mealConfigs"
          @selection-change="(rows: any) => selectedConfigs = rows">
          <el-table-column align="center" type="selection" />
          <el-table-column align="center" type="index" label="序号" />
          <el-table-column align="center" prop="name" label="配置名称" :min-width="180" />
          <el-table-column align="center" prop="description" label="详细描述" :min-width="240" :show-overflow-tooltip="true" />
          <el-table-column align="center" label="操作" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small"
                @click="dialogVisible = true; isAdding = false; mealConfigForm = { ...row }">
                <el-icon>
                  <Edit />
                </el-icon>
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="handleDeleteConfig(row.id)">
                <el-icon>
                  <Delete />
                </el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>

        </el-table>

        <el-pagination v-model:current-page="mealConfigQuery.current" v-model:page-size="mealConfigQuery.size"
          :page-sizes="[5, 7, 9]" layout="total, sizes, prev, pager, next, jumper" :total="mealConfigTotal"
          @size-change="queryMealConfigs" @current-change="queryMealConfigs" />
      </el-card>
    </el-col>
  </el-container>

  <!-- 配置表单对话框 -->
  <el-dialog :title="isAdding ? '新增膳食配置' : '编辑膳食配置'" v-model="dialogVisible" width="500px">
    <el-form :model="mealConfigForm" :rules="rules" ref="form">
      <el-form-item label="配置名称" prop="name">
        <el-input v-model="mealConfigForm.name" />
      </el-form-item>
      <el-form-item label="详细描述" prop="description">
        <el-input v-model="mealConfigForm.description" type="textarea" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>

</template>

<style lang="css" scoped>
.container {
  padding: 16px;
  min-height: calc(100vh - 60px);
}

.section-card {
  border-radius: 12px;
  margin-bottom: 20px;
  margin-right: 30px;
  padding: 16px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.filter-bar,
.action-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

:deep(.table-header) {
  th {
    background: var(--el-fill-color-light) !important;
    font-weight: 600;
    color: var(--el-text-color-regular);
  }
}

:deep(.table-row) {
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.section-pagination {
  margin-top: 25px;
  justify-content: flex-end;
}

.el-button {
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(28, 126, 255, 0.2);
  }

  &--danger:hover {
    box-shadow: 0 2px 6px rgba(245, 108, 108, 0.2);
  }
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

.flex-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

:deep(.el-table) {
  margin-bottom: 20px;
}
</style>