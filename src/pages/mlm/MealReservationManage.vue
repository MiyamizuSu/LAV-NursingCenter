<script setup lang="ts">
import { axiosInstance as axios } from '@/lib/core';
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Check } from '@element-plus/icons-vue'

interface MealReservationItem {
  id: number
  customerId: number
  customerName: string
  mealItemId: number
  mealItemName: string
  purchaseCount: number
  purchaseTime: string
  isDeleted: boolean
}

// 查询参数
const queryParams = ref({
  isCompleted: 0,
  startTime: '',
  endTime: ''
})

// 表格数据
const tableData = ref<MealReservationItem[]>([])
const selectedItems = ref<number[]>([])
const loading = ref(false)

// 分页参数
const pagination = ref({
  page: 1,
  size: 10,
  total: 0
})

// 获取订单数据
const fetchOrders = async () => {
  try {
    loading.value = true
    const { data } = await axios.post('/mealReservation/page', {
      current: pagination.value.page,
      size: pagination.value.size,
      isDeleted: queryParams.value.isCompleted,
      startTime: queryParams.value.startTime,
      endTime: queryParams.value.endTime
    })
    tableData.value = data.data
    pagination.value.total = data.total
  } catch (error) {
    ElMessage.error('获取订单失败')
  } finally {
    loading.value = false
  }
}

// 完成操作
const handleComplete = async (id: number) => {
  try {
    await axios.post('/mealReservation/delete', { id })
    ElMessage.success('操作成功')
    fetchOrders()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 批量完成
const handleBatchComplete = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要操作的订单')
    return
  }

  try {
    await axios.post('/mealReservation/deleteBatch', {
      ids: selectedItems.value
    })
    ElMessage.success('批量操作成功')
    selectedItems.value = []
    fetchOrders()
  } catch (error) {
    ElMessage.error('批量操作失败')
  }
}
onMounted(fetchOrders)

</script>

<template>
  <div class="container">
    <!-- 查询条件 -->
    <el-card shadow="hover" class="section-card">
      <div class="filter-bar">
        <el-select v-model="queryParams.isCompleted" placeholder="订单状态" style="width: 140px">
          <el-option label="未完成" :value="0" />
          <el-option label="已完成" :value="1" />
        </el-select>

        <el-date-picker v-model="queryParams.startTime" type="datetime" placeholder="开始时间"
          value-format="YYYY-MM-DD HH:mm:ss" style="width: 220px" />

        <el-date-picker v-model="queryParams.endTime" type="datetime" placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss" style="width: 220px" />

        <div class="button-group">
          <el-button type="primary" @click="fetchOrders" :icon="Search">查询</el-button>
          <el-button type="success" @click="handleBatchComplete" :icon="Check" :disabled="selectedItems.length === 0">
            批量完成
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="hover" class="section-card mt-16">
      <el-table :data="tableData" v-loading="loading" stripe header-row-class-name="table-header"
        row-class-name="table-row"
        @selection-change="(rows: MealReservationItem[]) => selectedItems = rows.map(r => r.id)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="customerName" label="客户姓名" />
        <el-table-column prop="foodName" label="膳食名称" />
        <el-table-column prop="purchaseCount" label="购买数量" />
        <el-table-column prop="purchaseTime" label="购买时间" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="row.deleted ? 'success' : 'warning'">
              {{ row.deleted ? '已完成' : '未完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button v-if="!row.deleted" type="primary" size="small" @click="handleComplete(row.id)" :icon="Check">
              标记完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination background v-model:current-page="pagination.page" v-model:page-size="pagination.size"
        :page-sizes="[10, 12, 15]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchOrders" @current-change="fetchOrders" />
    </el-card>
  </div>
</template>

<style lang="css" scoped>
.container {
  padding: 16px;
  min-height: calc(100vh - 60px);
}

.section-card {
  border-radius: 12px;
  margin-bottom: 16px;

  :deep(.el-card__body) {
    padding: 16px;
  }
}

.filter-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.button-group {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

:deep(.table-header) {
  th {
    background: var(--el-fill-color-light) !important;
    font-weight: 600;
    color: var(--el-text-color-primary);
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
  margin-top: 16px;
  justify-content: flex-end;
}

.el-button {
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(28, 126, 255, 0.2);
  }

  &--success:hover {
    box-shadow: 0 2px 6px rgba(103, 194, 58, 0.2);
  }
}

.mt-16 {
  margin-top: 16px;
}


.el-table {

  :deep(th),
  :deep(td) {
    padding: 8px 12px !important;
  }
}


.el-pagination {
  margin: 16px 0;
}


.flex-container {
  gap: 12px;
  padding: 8px 0;
}

.button-group {
  gap: 8px;
}


:deep(.el-dialog) {
  .el-form-item {
    margin-bottom: 18px;
  }
}
</style>