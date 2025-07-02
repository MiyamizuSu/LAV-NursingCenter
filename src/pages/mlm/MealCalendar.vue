<!-- 系统管理员端 膳食管理 膳食日历 -->
<script setup lang="ts">
import { axiosInstance as axios } from '@/lib/core';
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox, ElTable, ElButton, ElInput, ElForm, ElDialog, ElContainer } from 'element-plus'
import { Search, Plus, Delete } from '@element-plus/icons-vue'

export interface Food {
  id: number,
  name: string,
  type: string,
  description: string,
  price: number,
  imageUrl: string
}

export interface MealItem {
  id: number,
  weekDay: string,
  status: number,
  foodId: number,
  foodName: string,
  foodType: string,
  foodDescription: string,
  foodPrice: number,
  foodImageUrl: string
}
const weekDayOptions = ref([
  { label: '周一', value: '周一' },
  { label: '周二', value: '周二' },
  { label: '周三', value: '周三' },
  { label: '周四', value: '周四' },
  { label: '周五', value: '周五' },
  { label: '周六', value: '周六' },
  { label: '周日', value: '周日' },
])

const foodTypeOptions = ref([
  { label: '早餐', value: '早餐' },
  { label: '午餐', value: '午餐' },
  { label: '晚餐', value: '晚餐' },
  { label: '甜点', value: '甜点' },
])

const isAdding = ref(true)
let total = ref(400)
const dialogVisible = ref(false);
const formLableWidth = 'auto';
const selectedRows = ref<MealItem[]>([]);

let arr = ref([] as MealItem[]);
let foods = ref([] as Food[]);

let queryEntity = ref({
  foodName: '',
  foodType: [] as string[],
  weekDay: [] as string[],
  current: 1,
  size: 5
})

let mealItem = ref({
  weekDay: '',
  status: 0,
  foodId: null as number | null,
  foodName: '',
  foodType: '',
  foodDescription: '',
  foodPrice: 0,
  foodImageUrl: ''
})

let rules = ref({
  foodType: [{
    required: true,
    message: '请选择食物类型',
    trigger: 'blur'
  }],
  weekDay: [{
    required: true,
    message: '请选择星期',
    trigger: 'blur'
  }],
  foodId: [{
    required: true,
    message: '请选择食品',
    trigger: 'blur'
  }]
})

const handleAdd = () => {
  dialogVisible.value = true
  isAdding.value = true
  // 清空表单数据
  mealItem.value = {
    weekDay: '',
    status: 1,
    foodId: 0,
    foodName: '',
    foodType: '',
    foodDescription: '',
    foodPrice: 0,
    foodImageUrl: ''
  }
  //重置表单验证
  form.value?.resetFields()
  foods.value = []
}

const handleEdit = (row: any) => {
  dialogVisible.value = true
  isAdding.value = false

  for (let key in row) {
    (mealItem as any).value[key] = row[key];
  }
  listFoodByType()
}

const handleDelete = (row: any) => {
  remove(row.id)
}

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的项');
    return;
  }

  ElMessageBox.confirm('确定删除选中的' + selectedRows.value.length + '项吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = selectedRows.value.map(item => item.id);
    let url = `/mealItem/deleteBatch`;

    axios.post(url, { ids }).then(response => {
      let pr = response.data;
      if (pr.status === 200) {
        ElMessage.success('删除成功');
        selectedRows.value = []; // 清空选中项
        query();
      }
    }).catch(error => console.log(error));
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

const form = ref()
const handleSubmit = async () => {
  form.value.validate((valid: any) => {
    if (valid) {
      if (isAdding.value) {
        add()
      } else {
        update()
      }
    } else {
      return false
    }
  })
}

const handleClose = (done: any) => {
  ElMessageBox.confirm('确定要退出吗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const handleSizeChange = (val: any) => {
  queryEntity.value.size = val;
  queryEntity.value.current = 1;
  query()
}
const handleCurrentChange = (val: number) => {
  queryEntity.value.current = val;
  query()
}

const query = () => {
  let url = `/mealItem/page`

  axios.post(url, queryEntity.value).then(response => {
    let pr = response.data
    arr.value = pr.data
    total.value = pr.total
  }).catch(error => console.log(error))
}

const add = () => {
  dialogVisible.value = true
  let url = `/mealItem/add`
  axios.post(url, mealItem.value).then(response => {
    let pr = response.data
    if (pr.status == 200) {
      ElMessage.success('添加成功')
      dialogVisible.value = false
      query()
    } else {
      ElMessage.error(pr.msg)
    }
  }).catch(error => console.log(error))
}

const update = () => {
  let url = `/mealItem/update`
  axios.post(url, mealItem.value).then(response => {
    let pr = response.data
    if (pr.status == 200) {
      ElMessage.success('修改成功')
      dialogVisible.value = false
      query()
    } else {
      ElMessage.error(pr.msg)
    }
  }).catch(error => console.log(error))
}

const listFoodByType = () => {
  let url = `/food/listByType`
  axios.post(url, mealItem.value).then(response => {
    let pr = response.data
    if (pr.status == 200) {
      foods.value = pr.data
    } else[
      foods.value = []
    ]
  }).catch(error => console.log(error))
}

const remove = (id: number) => {
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let url = `/mealItem/delete`
    axios.post(url, { id: id }).then(response => {
      let pr = response.data
      if (pr.status == 200) {
        ElMessage.success('删除成功')
        query()
      }
    }).catch(error => console.log(error))
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const init = () => {
  query();
}

onMounted(() => {
  init()
})

const formatStatus = (row: any) => {
  return row.status === 1 ? "已启用" : row.status === 0 ? "已停用" : "未知状态";
}

const handleChange = () => {
  mealItem.value.foodId = null
  mealItem.value.foodName = ''
  mealItem.value.foodDescription = ''
  mealItem.value.foodPrice = 0
  mealItem.value.foodImageUrl = ''
  listFoodByType()
}

</script>

<template>
  <el-container style="height: 80vh; padding: 0;">
    <el-col :span="24">
      <!-- 查询操作栏 -->
      <el-card shadow="hover" class="section-card">
        <div class="flex-container">
          <el-input v-model="queryEntity.foodName" placeholder="食品名称" style="width: 240px" clearable
            :prefix-icon="Search" />
          <el-select v-model="queryEntity.weekDay" placeholder="请选择周期" style="width: 200px;" clearable multiple>
            <el-option v-for="option in weekDayOptions" :key="option.value" :label="option.label"
              :value="option.value" />
          </el-select>

          <el-select v-model="queryEntity.foodType" placeholder="请选择品类" style="width: 200px;" clearable multiple>
            <el-option v-for="option in foodTypeOptions" :key="option.value" :label="option.label"
              :value="option.value" />
          </el-select>

          <div class="button-group">
            <el-button type="primary" @click="query" :icon="Search">查询</el-button>
            <el-button type="success" @click="handleAdd" :icon="Plus">新建</el-button>
            <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete" :icon="Delete">
              批量删除
            </el-button>
          </div>
        </div>

        <el-table title="所有膳食日历项" :data="arr" style="width: 100%" :fit="true"
          @selection-change="(rows) => selectedRows = rows">
          <el-table-column align="center" type="selection" />
          <el-table-column align="center" prop="weekDay" label="周期" />
          <el-table-column align="center" prop="foodId" label="食品id" />
          <el-table-column align="center" prop="foodName" label="食品名称" />
          <el-table-column align="center" label="食品图片" width="180">
            <template #default="{ row }">
              <el-image :src="row.foodImageUrl" class="meal-image" :preview-src-list="[row.foodImageUrl]" />
            </template>
          </el-table-column>

          <el-table-column align="center" prop="foodType" label="食品品类" />
          <el-table-column align="center" prop="foodDescription" label="食品描述" :min-width="180" />
          <el-table-column align="center" prop="foodPrice" label="食品价格" />
          <el-table-column align="center" prop="status" label="状态" :formatter="formatStatus" />
          <el-table-column align="center" label="操作" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index,)">
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="queryEntity.current" v-model:page-size="queryEntity.size"
          :page-sizes="[5, 7, 9]" layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />

      </el-card>
    </el-col>
  </el-container>

  <el-dialog v-model="dialogVisible" :title="isAdding ? '新增膳食日历项' : '编辑膳食日历项'" width="500" :before-close="handleClose"
    draggable overflow @closed="form?.resetFields()">
    <el-form :model="mealItem" :rules="rules" ref="form">
      <el-form-item label="选择品类" prop="foodType" :label-width="formLableWidth">
        <el-select v-model="mealItem.foodType" @change="handleChange" placeholder="请选择食品品类" :clearable="isAdding"
          :multiple="isAdding">
          <el-option v-for="option in foodTypeOptions" :key="option.value" :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择周期" prop="weekDay" :label-width="formLableWidth">
        <el-select v-model="mealItem.weekDay" placeholder="请选择周期" :clearable="isAdding" :multiple="isAdding">
          <el-option v-for="option in weekDayOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择食品" prop="foodId" :label-width="formLableWidth">
        <el-select v-model="mealItem.foodId" placeholder="请选择食品(请先选择品类)" :clearable="isAdding" :multiple="isAdding">
          <el-option v-for="food in foods" :label="`${food.name}（${food.type}）`" :value="food.id" :key="food.id">
            <span>{{ food.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ food.type }}</span>
            <template #prefix v-if="mealItem.foodId == 0">
              <span class="el-select__placeholder">{{ '请选择食品(请先选择品类)' }}</span>
            </template>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="mealItem.status">
          <el-radio label="已启用" :value="1"></el-radio>
          <el-radio label="已停用" :value="0"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ isAdding ? '新增' : '修改' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="css" scoped>
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

.meal-image {
  width: 100px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
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

.meal-image {
  width: 100px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
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
