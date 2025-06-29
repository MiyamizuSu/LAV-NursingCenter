<!-- 系统管理员端 膳食管理 食物管理 -->
<script setup lang="ts">
import { axiosInstance as axios } from '@/lib/core';
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage, ElMessageBox, type UploadRequestOptions } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { uploadFile } from '@/lib/utils'
import { Loading } from '@element-plus/icons-vue'
import Compressor from 'compressorjs';

interface Food {
  id: number
  name: string
  type: string | string[]
  description: string
  price: number
  imageUrl: string
}

// 查询参数
const queryParams = ref({
  name: '',
  type: [] as string[],
  current: 1,
  size: 5
})

// 数据存储
const foodList = ref<Food[]>([])
const total = ref(0)
const selectedFoods = ref<Food[]>([])
const dialogVisible = ref(false)
const formType = ref('create')
const foodForm = ref<Partial<Food>>({})
const typeOptions = [
  { label: '早餐', value: '早餐' },
  { label: '午餐', value: '午餐' },
  { label: '晚餐', value: '晚餐' },
  { label: '甜点', value: '甜点' }
]
const chartDialogVisible = ref(false)
let chartInstance: echarts.ECharts | null = null
const isUploading = ref(false)

// 分页查询
const queryFoods = () => {
  axios.post('/food/page', queryParams.value)
    .then(res => {
      const pr = res.data
      console.log(pr)
      foodList.value = pr.data
      total.value = pr.total
    })
    .catch(error => console.log(error))
}

// 删除单个
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确认删除该食品？', '提示', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消'
  }).then(() => {
    axios.post(`/food/delete`, { id: id }).then(res => {
      if (res.data.status == 200) {
        ElMessage.success('删除成功')
        queryFoods()
      } else {
        ElMessage.error('删除失败')
      }
    })
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedFoods.value.length === 0) {
    ElMessage.warning('请选择要删除的食品')
    return
  }

  const ids = selectedFoods.value.map(item => item.id)
  ElMessageBox.confirm(`确认删除选中的${ids.length}个食品？`, '提示', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消'
  }).then(() => {
    axios.post('/food/deleteBatch', { ids })

      .then(() => {
        ElMessage.success('批量删除成功')
        queryFoods()
      })
  })
}

// 打开创建对话框
const openCreateDialog = () => {
  formType.value = 'create'
  foodForm.value = {}
  dialogVisible.value = true
}

//编辑处理方法
const handleEdit = (row: Food) => {
  formType.value = 'edit'
  foodForm.value = {
    ...row,
    type: row.type
  }
  dialogVisible.value = true
}

const beforeUpload = (file: File) => {
  isUploading.value = true
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file.name)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return true
}

const handleFileChange = (file: any) => {
  // 生成预览图
  const reader = new FileReader()
  reader.onload = (e) => {
    foodForm.value.imageUrl = e.target?.result as string
  }
  reader.readAsDataURL(file.raw)
}


const httpRequest = async (options: UploadRequestOptions) => {
  const fileTo = options.file
  const compressedBlob = await compressImage(fileTo); // 压缩图片
  const compressedFile = await blobToFile(compressedBlob, fileTo.name);
  uploadFile(compressedFile).then(res => {
    if (res.status == 200) {
      ElMessage.success('上传成功')
      isUploading.value = false
      foodForm.value.imageUrl = res.data.data.links.url
    } else {
      ElMessage.error('上传失败')
      isUploading.value = false
    }
  })
}

const blobToFile = (blob: any, fileName: string) => {
  let file: File = new File([blob], fileName, { type: blob.type });
  return file;
}

const compressImage = (file: File) => { //压缩图片
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.75, // 设置压缩质量
      maxWidth: 550, // 设置图片最大宽度
      maxHeight: 450, // 设置图片最大高度
      success(result) {
        resolve(result);
      },
      error(error) {
        reject(error);
      },
    });
  });

}

// 提交表单
const submitForm = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return
    const url = formType.value === 'create'
      ? '/food/add'
      : '/food/update'

    // 编辑时需要传递ID
    const requestData = formType.value === 'edit'
      ? { ...foodForm.value, id: foodForm.value.id }
      : foodForm.value

    axios.post(url, requestData)
      .then(response => {
        let pr = response.data
        if (pr.status == 200) {
          ElMessage.success('操作成功')
          dialogVisible.value = false
          queryFoods()
        } else {
          ElMessage.error(pr.msg)
        }
      }).catch(error => console.log(error))

  })
}

const formRef = ref()

// 表单验证规则
const formRules = ref({
  name: [{ required: true, message: '请输入食品名称', trigger: 'blur' }],
  type: [
    {
      required: true,
      validator: (value: string[], callback: Function) => {
        if (!value || value.length === 0) {
          callback(new Error('请选择食品类型'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  description: [
    { required: true, message: '请输入食品描述', trigger: 'blur' },
    { min: 5, max: 200, message: '描述长度需在5到200个字符之间', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0' }
  ],
  imageUrl: [
    { required: true, message: '请输入图片地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ]
})

const showPriceChart = async () => {
  try {
    const { data } = await axios.post('/food/list', {})
    const foods = data.data

    // 同名食品价格归一化（取平均值）
    const priceMap = foods.reduce((acc: Record<string, { total: number, count: number }>, food: Food) => {
      if (!acc[food.name]) {
        acc[food.name] = { total: 0, count: 0 }
      }
      acc[food.name].total += food.price
      acc[food.name].count++
      return acc
    }, {} as Record<string, { total: number, count: number }>)

    const chartData = Object.entries(priceMap).map(([name, info]) => ({
      name,
      price: Number(((info as { total: number, count: number }).total / (info as { total: number, count: number }).count).toFixed(2))
    })).sort((a, b) => b.price - a.price)

    // 初始化图表
    // 先打开对话框再初始化图表
    chartDialogVisible.value = true

    // 使用nextTick确保DOM渲染完成
    nextTick(() => {
      const chartDom = document.getElementById('priceChart')
      if (!chartDom) {
        throw new Error('图表容器未找到')
      }

      // 先销毁旧实例
      chartInstance?.dispose()
      chartInstance = echarts.init(chartDom)

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const data = params[0]
            return `${data.name}<br/>价格: ${data.value} RMB`
          }
        },
        xAxis: {
          type: 'category',
          data: chartData.map(item => item.name),
          axisLabel: { rotate: 45 }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value: number) => `${value} RMB`
          }
        },
        series: [{
          data: chartData.map(item => item.price),
          type: 'bar',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          }
        }]
      }

      chartInstance.setOption(option)
    })

  } catch (error: any) {

    ElMessage.error(error.message || '图表初始化失败')
    console.error(error)
  }
}

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

onMounted(() => {
  queryFoods()
  // //规定针对事件信号的响应机制(handler)，
  // emitter.on('urlChange', e => foodForm.value.imageUrl=e as string)
})

</script>

<template>
  <div class="container">
    <!-- 查询条件 -->
    <div class="query-bar">
      <el-input v-model="queryParams.name" placeholder="食品名称" style="width:200px" clearable />
      <el-select v-model="queryParams.type" placeholder="食品类型" clearable multiple style="width:200px;margin:0 10px">
        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="queryFoods">查询</el-button>
      <el-button type="success" @click="openCreateDialog">新建食品</el-button>
      <el-button type="danger" @click="handleBatchDelete" :disabled="selectedFoods.length === 0">
        批量删除
      </el-button>
      <el-button type="warning" @click="showPriceChart" style="margin-left: 10px">
        价格统计
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="foodList" @selection-change="(rows: Food[]) => selectedFoods = rows" style="width:100%">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="食品名称" width="160" />
      <el-table-column label="图片" width="160">
        <template #default="{ row }">
          <el-image :src="row.imageUrl" style="width:100px;height:60px" />
        </template>
      </el-table-column>
      <el-table-column prop="type" label="食品类型" width="160" />
      <el-table-column prop="description" label="食品描述" width="360" />
      <el-table-column prop="price" label="价格" width="100" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination v-model:current-page="queryParams.current" v-model:page-size="queryParams.size"
      :page-sizes="[5, 6, 7, 8]" :total="total" layout="total, sizes, prev, pager, next, jumper"
      @current-change="queryFoods" @size-change="queryFoods" />
    <!-- 价格统计对话框 -->
    <el-dialog v-model="chartDialogVisible" title="价格统计(同名食品平均价格)" width="800" draggable overflow
      @closed="chartInstance?.dispose()">
      <div id="priceChart" style="width: 100%; height: 500px;"></div>
    </el-dialog>

    <!-- 创建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="formType === 'create' ? '新建食品' : '编辑食品'" @closed="formRef?.resetFields()"
      draggable overflow>
      <el-form :model="foodForm" :rules="formRules" ref="formRef" label-width="80px">
        <el-form-item prop="name" label="食品名称">
          <el-input v-model="foodForm.name" />
        </el-form-item>
        <el-form-item prop="type" label="食品类型">
          <el-select v-model="foodForm.type" :multiple="formType === 'create'" clearable placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="description" label="食品描述">
          <el-input v-model="foodForm.description" type="textarea" />
        </el-form-item>
        <el-form-item prop="price" label="价格">
          <el-input-number v-model="foodForm.price" :min="0">
            <template #suffix>
              <span>RMB</span>
            </template>
          </el-input-number>
        </el-form-item>
        <el-form-item prop="imageUrl" label="食品图片">
          <el-row :gutter="10" class="w-full">
            <el-col :span="14">
              <el-input v-model="foodForm.imageUrl" placeholder="或直接输入图片URL"
                @change="formRef.validateField('imageUrl')" />
            </el-col>

          </el-row>
          <el-upload :show-file-list="false" :http-request="httpRequest" :on-change="handleFileChange"
            :crossorigin="'use-credentials'" :before-upload="beforeUpload" class="image-container">
            <div class="image-container">
              <template v-if="isUploading">
                <el-icon class="is-loading" color="#409eff" :size="28">
                  <Loading />
                </el-icon>
              </template>
              <img v-else-if="foodForm.imageUrl" :src="foodForm.imageUrl" class="upload-image" />
              <div v-else class="upload-placeholder">
                <el-icon>
                  <Plus />
                </el-icon>
                <span class="tip-text">点击上传图片</span>
              </div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  min-height: calc(100vh - 60px);
}

.query-bar {
  margin-bottom: 20px;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  display: flex;
  gap: 10px;
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

  :deep(th) {
    background: #f8f9fa !important;
    height: 50px;
  }

  :deep(td) {
    height: 60px;
  }
}

.el-pagination {
  margin: 20px 0;
  justify-content: flex-end;
}

.image-container {
  position: relative;
  max-width: 280px;
  max-height: 190px;
  min-width: 100px;
  min-height: 75px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s;
}

.upload-placeholder {
  transition: all 0.3s;

  &:hover {
    color: #409eff;
    border-color: #409eff;
  }
}

:deep(.el-dialog) {
  border-radius: 12px;

  .el-form-item {
    margin-bottom: 22px;

    &__label {
      font-weight: 500;
      color: #606266;
    }
  }
}

.el-button--small {
  padding: 6px 12px;
  border-radius: 4px;
}

.el-image {
  border-radius: 4px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
}

#priceChart {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}
</style>
