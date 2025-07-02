<!-- 系统管理员端 客户管理 入住登记 -->
<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { axiosInstance as axios } from '@/lib/core'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { h, reactive, ref, onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { cn, debounce } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { valueUpdater } from '@/components/ui/table/utils'
import { RippleButton } from '@/components/ui/ripple-button'
import Switcher from '@/components/custom/Switcher.vue'
import { ElButton, ElInput } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Customer } from '@/lib/type'
import { usecustomerManagementStore } from '@/lib/store'

const ctmStore = usecustomerManagementStore()
// 分页参数
const pages = ref({
  currentPage: 1,
  pageSize: 8,
  total: 0
})
const customerType = ref(0)

const columns: ColumnDef<Customer>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:modelValue': (value: any) => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
    }),
    cell: ({ row }) => h(Checkbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': (value: any) => row.toggleSelected(!!value),
      'ariaLabel': 'Select row',
    }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'index',
    header: () => h('div', {}, '序号'),
    cell: ({ row }) => {
      const pageSize = pages.value.pageSize
      const currentPage = pages.value.currentPage
      return h('div', {}, row.index + 1 + (currentPage - 1) * pageSize)
    }
  },
  {
    accessorKey: 'name',
    header: () => h('div', {}, '姓名'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
  },
  {
    accessorKey: 'gender',
    header: () => h('div', {}, '性别'),
    cell: ({ row }) => {
      const genderValue = row.getValue('gender')
      const displayGender = genderValue === 1 ? '男' : genderValue === 0 ? '女' : '未知'
      return h('div', { class: 'capitalize' }, displayGender)
    }
  },
  {
    accessorKey: 'bloodType',
    header: () => h('div', {}, '血型'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('bloodType')),
  },
  {
    accessorKey: 'age',
    header: () => h('div', {}, '年龄'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('age')),
  },
  {
    accessorKey: 'idCard',
    header: () => h('div', {}, '身份证号'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('idCard')),
  },
  {
    accessorKey: 'relative',
    header: () => h('div', {}, '家属'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('relative')),
  },
  {
    accessorKey: 'phoneNumber',
    header: () => h('div', {}, '电话号码'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('phoneNumber')),
  },
  {
    accessorKey: 'building',
    header: () => h('div', {}, '楼栋'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('building')),
  },
  {
    accessorKey: 'roomNumber',
    header: () => h('div', {}, '房间号'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('roomNumber')),
  },
  {
    accessorKey: 'bedNumber',
    header: () => h('div', {}, '床位号'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('bedNumber')),
  },
  {
    accessorKey: 'checkinDate',
    header: () => h('div', {}, '入住时间'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('checkinDate')),
  },
  {
    accessorKey: 'expirationDate',
    header: () => h('div', {}, '合同到期时间'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('expirationDate')),
  },
  {
    accessorKey: 'operation',
    header: () => h('div', {}, '操作'),
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(
          'button',
          {
            class: 'px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition',
            onClick: () => openUpdateForm(row.original),
          },
          '修改'
        ),
        h(
          'button',
          {
            class: 'px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition',
            onClick: () => openDeleteForm(row.original),
          },
          '删除'
        ),
      ]),
  },
]
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})
const table = useVueTable({
  get data() {
    return ctmStore.getCustomerList.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get expanded() { return expanded.value },
  },
})
// 页码改变时
const changePage = (page: number) => {
  pages.value.currentPage = page
  loadCustomers()
}
const searchName = ref('')  // 搜索框输入
// 处理重置搜索
const resetCustomers = () => {
  searchName.value = ''
  loadCustomers()
}
const onInput = async (event: Event) => {
  const deLoad = debounce(loadCustomers)
  deLoad()
}

// 获取分页客户数据
const loadCustomers = async () => {
  if (selectedCustomerType.value === '护理老人') {
    customerType.value = 1
  } else {
    customerType.value = 0
  }
  const res = await axios.post('/customer/page', {
    current: pages.value.currentPage,
    size: pages.value.pageSize,
    customerType: customerType.value,
    name: searchName.value
  })
  if (res.data.status === 200) {
    ctmStore.setNewList(res.data.data)
    pages.value.total = res.data.total
  } else {
    ctmStore.getCustomerList.value = []
  }
}
// 获取所有客户数据
const loadAllCustomers = async () => {
  const res = await axios.post('/customer/listAll')
  if (res.data.status === 200) {
    ctmStore.setAllCustomerList(res.data.data)
  } else {
    ctmStore.getAllCustomerList.value = []
  }
}
// 获取房间信息
const loadRooms = async () => {
  const res = await axios.post('/room/listAll')
  if (res.data.status === 200) {
    ctmStore.setRoomList(res.data.data)
  } else {
    ctmStore.setRoomList([])
  }
}
// 获取空闲床位信息
const loadSpareBeds = async () => {
  const res = await axios.post('/bed/listSpareByRoomNumber', { roomNumber: form.roomNumber })
  if (res.data.status === 200) {
    ctmStore.setSpareBedList(res.data.data)
  } else {
    ElMessage.warning('该房间无可用床位')
    ctmStore.setSpareBedList([])
  }
}

const formRef = ref<FormInstance>()
// 配置表单校验规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const num = Number(value)
        if (isNaN(num)) {
          callback(new Error('年龄必须是数字'))
        } else if (num < 0 || num > 120) {
          callback(new Error('年龄必须在 0 到 120 之间'))
        } else if (!Number.isInteger(num)) {
          callback(new Error('年龄必须是整数'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' }
  ],
  bloodType: [
    { required: true, message: '请输入血型', trigger: 'blur' }
  ],
  relative: [
    { required: true, message: '请输入家属姓名', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const reg = /^\d{11}$/
        if (!reg.test(value)) {
          callback(new Error('电话号码必须是11位数字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  roomNumber: [
    { required: true, message: '请输入房间号', trigger: 'blur' }
  ],
  bedNumber: [
    { required: true, message: '请输入床位号', trigger: 'blur' }
  ],
  customerType: [
    { required: true, message: '请选择客户类型', trigger: 'blur' }
  ],
  checkinDate: [
    { required: true, message: '请选择入住时间', trigger: 'blur' }
  ],
  expirationDate: [
    { required: true, message: '请选择合同到期时间', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (!form.checkinDate || !value) {
          callback()
          return
        }
        const checkin = new Date(form.checkinDate)
        const expiration = new Date(value)
        if (checkin > expiration) {
          callback(new Error('入住时间必须早于合同到期时间'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}
const showForm = ref(false)
const form = reactive({
  name: '',
  age: '' as string | number,
  gender: '' as string | number,
  idCard: '',
  bloodType: '',
  relative: '',
  phoneNumber: '',
  building: 606,
  roomNumber: '',
  bedNumber: '',
  customerType: '' as string | number,
  checkinDate: '',
  expirationDate: '',
})
const addCustomerVisible = ref(false)
// 检查用户输入
const checkAddForm = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      addCustomerVisible.value = true
    } else {
      ElMessage.error('请填写完整信息')
    }
  })
}
// 取消提交添加表单
const cancelSubmit = () => {
  formRef.value?.resetFields()
  showForm.value = false
  selectedRoom.value = ''
  selectedBed.value = ''
  ctmStore.setSpareBedList([])
  clearForm()
}
// 清空表单
const clearForm = () => {
  form.name = ''
  form.age = ''
  form.gender = ''
  form.idCard = ''
  form.bloodType = ''
  form.relative = ''
  form.phoneNumber = ''
  form.building = 606
  form.roomNumber = ''
  form.bedNumber = ''
  form.customerType = ''
  form.checkinDate = ''
  form.expirationDate = ''
}
const selectedRoom = ref('')  // 现在选择的房间
const selectedBed = ref('')   // 已选中的床位
const onRoomChange = (id: number) => {
  const room = ctmStore.getRoomList.value.find(c => c.id === id)
  if (room) {
    form.roomNumber = room.roomNumber
  } else {
    form.roomNumber = ''
  }
  form.bedNumber = ''
  selectedBed.value = ''
  loadSpareBeds()
}
const onBedChange = (id: number) => {
  const bed = ctmStore.getSpareBedList.value.find(c => c.id === id)
  if (bed) {
    form.bedNumber = bed.bedNumber
  } else {
    form.bedNumber = ''
  }
}
// 提交客户信息
const onSubmit = async () => {
  form.age = Number(form.age)
  const res = await axios.post('/customer/add', form)
  if (res.data.status === 200) {
    ElMessage.success('添加成功')
    addCustomerVisible.value = false
    showForm.value = false
    await loadCustomers()
    clearForm()
  } else {
    ElMessage.error(res.data.msg)
    addCustomerVisible.value = false
  }
}

const showUpdateForm = ref(false)  // 修改界面的可见性
const updateCustomerVisible = ref(false) // 确认修改界面的可见性
const openUpdateForm = (customer: Customer) => {  // 打开修改界面
  Object.assign(form, customer)
  showUpdateForm.value = true
}
const checkUpdateForm = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      updateCustomerVisible.value = true
    } else {
      ElMessage.error('请填写完整信息')
    }
  })
}
const cancelUpdate = () => {
  formRef.value?.resetFields()
  showUpdateForm.value = false
  clearForm()
}
const updateForm = async () => {
  const res = await axios.post('/customer/update', form)
  if (res.data.status === 200) {
    ElMessage.success('修改成功')
    updateCustomerVisible.value = false
    showUpdateForm.value = false
    await loadCustomers()
    clearForm()
  } else {
    ElMessage.error('修改失败')
  }
}

const deleteCustomerVisible = ref(false) // 确认删除提示框可见性
// 删除提示框
const openDeleteForm = async (customer: Customer) => {
  ElMessageBox.confirm(
    '确定要删除客户' + customer.name + '的信息吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const res = await axios.post("/customer/delete", { customerId: customer.customerId })
      if (res.data.status === 200) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        loadCustomers()
      } else {
        ElMessage({
          type: 'error',
          message: '删除失败',
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}
// 批量删除客户信息
const batchDeleteCustomer = async () => {
  const selectedCustomers = table.getSelectedRowModel().rows.map(row => row.original)
  if (selectedCustomers.length === 0) {
    ElMessage.warning('请先选择要删除的客户')
    return
  }
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedCustomers.length} 条客户信息吗？`,
    '批量删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      // 并发执行每条删除请求
      const results = await Promise.allSettled(
        selectedCustomers.map(customer =>
          axios.post('/customer/delete', {
            customerId: customer.customerId,
          })
        )
      )
      const successCount = results.filter(
        r => r.status === 'fulfilled' && r.value?.data?.status === 200
      ).length
      const failCount = results.length - successCount
      if (successCount > 0) {
        ElMessage.success(`成功删除 ${successCount} 条记录`)
      }
      if (failCount > 0) {
        ElMessage.error(`删除失败 ${failCount} 条记录`)
      }
      table.resetRowSelection() // 清空选择
      loadCustomers() // 重新加载数据
    } catch (error) {
      ElMessage.error('批量删除失败')
    }
  })
    .catch(() => {
      ElMessage.info('已取消批量删除')
    })
}

const selectedCustomerType = ref('自理老人')
watch(selectedCustomerType, (newType: any) => {
  loadCustomers()
})

onMounted(async () => {
  await loadCustomers()
  await loadAllCustomers()
  await loadRooms()
})
function change(e: string) {
  selectedCustomerType.value = e
}
</script>

<template>

  <!-- 客户信息列表 -->
  <div class="w-full pr-10">
    <div class="flex gap-2 items-center py-4 justify-between">
      <div class="flex items-center gap-2">
        <div>
          <Input class="max-w-sm" placeholder="客户姓名" v-model="searchName" @input="onInput" />
        </div>
        <div>
          <InteractiveHoverButton @click="resetCustomers" text="重置" text-before-color="#95e1d3"
            text-after-color="#eaffd0" before-color="#eaffd0" after-color="#95e1d3">
            <template #svgIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-rotate-ccw-icon lucide-rotate-ccw">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </template>
          </InteractiveHoverButton>
        </div>
      </div>
      <div class="ml-auto">
        <InteractiveHoverButton @click="showForm = true" text="登记" text-before-color="#71C9CE"
          text-after-color="#CBF1F5" before-color="#CBF1F5" after-color="#71C9CE">
          <template #svgIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-circle-plus-icon lucide-circle-plus">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
          </template>
        </InteractiveHoverButton>
      </div>
    </div>
    <div class="mb-5 flex items-center gap-4">
      <Switcher left-value="自理老人" right-value="护理老人" @select-value-change="change">
      </Switcher>
      <div class="ml-auto">
        <InteractiveHoverButton @click="batchDeleteCustomer" text="批量删除" text-before-color="#FF4F0F"
          text-after-color="#FFE3BB" before-color="#FFE3BB" after-color="#FF4F0F">
          <template #svgIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-trash2-icon lucide-trash-2">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </template>
        </InteractiveHoverButton>
      </div>
    </div>

    <div class="text-white px-4 py-2 font-semibold rounded-t-md" style="background-color: #409EFF;">
      客户信息
    </div>
    <div class="rounded-b-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id" :data-pinned="header.column.getIsPinned()"
              :class="cn(
                { 'sticky bg-background/95': header.column.getIsPinned() },
                header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
              )">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" :data-pinned="cell.column.getIsPinned()"
                  :class="cn(
                    { 'sticky bg-background/95': cell.column.getIsPinned() },
                    cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                  )">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              查无此人
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        共
        {{ table.getFilteredRowModel().rows.length }}
        行，已选中
        {{ table.getFilteredSelectedRowModel().rows.length }}
        行
      </div>
      <div class="space-x-2">
        <Button variant="outline" size="sm" :disabled="pages.currentPage <= 1"
          @click="changePage(pages.currentPage - 1)">
          前一页
        </Button>
        <Button variant="outline" size="sm" :disabled="pages.currentPage * pages.pageSize >= pages.total"
          @click="changePage(pages.currentPage + 1)">
          后一页
        </Button>
      </div>
    </div>
  </div>

  <!-- 添加客户表单 -->
  <div>
    <el-dialog v-model="showForm" title="入住登记" width="35%" :append-to-body="true" label-position="left"
      @close="cancelSubmit">
      <el-form :model="form" :rules="rules" ref="formRef">
        <!-- 分隔符 -->
        <el-divider></el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户姓名：" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄：" prop="age">
              <el-input v-model="form.age" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别：" prop="gender">
              <el-select v-model="form.gender" placeholder="请选择性别">
                <el-option label="男" :value=1 />
                <el-option label="女" :value=0 />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号：" prop="idCard">
              <el-input v-model="form.idCard" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="血型：" prop="bloodType">
              <el-input v-model="form.bloodType" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家属：" prop="relative">
              <el-input v-model="form.relative" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话：" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="楼栋：" prop="building">
              <el-input v-model="form.building" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房间号：" prop="roomNumber">
              <!-- <el-input v-model="form.roomNumber" /> -->
              <el-select v-model="selectedRoom" placeholder="请选择房间" filterable style="width: 100%"
                @change="onRoomChange">
                <el-option v-for="room in ctmStore.getRoomList.value" :key="room.id" :label="room.roomNumber"
                  :value="room.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="床位号：" prop="bedNumber">
              <!-- <el-input v-model="form.bedNumber" /> -->
              <el-select v-model="selectedBed" placeholder="请选择床位" filterable style="width: 100%" @change="onBedChange">
                <el-option v-for="bed in ctmStore.getSpareBedList.value" :key="bed.id" :label="bed.bedNumber"
                  :value="bed.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="客户类型：" prop="customerType">
          <el-radio-group v-model="form.customerType">
            <el-radio :value=0>自理老人</el-radio>
            <el-radio :value=1>护理老人</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="入住时间：" prop="checkinDate">
          <el-col :span="11">
            <el-date-picker v-model="form.checkinDate" type="date" placeholder="选择一个日期" style="width: 100%"
              format="YYYY-MM-DD" value-format="YYYY-MM-DD" value-on-clear=""/>
          </el-col>
        </el-form-item>
        <el-form-item label="合同到期时间：" prop="expirationDate">
          <el-col :span="11">
            <el-date-picker v-model="form.expirationDate" type="date" placeholder="选择一个日期" style="width: 100%"
              format="YYYY-MM-DD" value-format="YYYY-MM-DD" value-on-clear="" />
          </el-col>
        </el-form-item>
        <!-- 分隔符 -->
        <el-divider></el-divider>
        <el-form-item>
          <div style="width: 100%; text-align: right">
            <el-button type="primary" @click="checkAddForm">提交</el-button>
            <el-button @click="cancelSubmit">取消</el-button>
          </div>
        </el-form-item>

      </el-form>

    </el-dialog>

    <el-dialog v-model="addCustomerVisible" title="提示" width="500" top="40vh" :z-index="3000" append-to-body>
      <span>确定登记该客户入住信息吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addCustomerVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

  <!-- 修改客户信息表单 -->
  <div>
    <el-dialog v-model="showUpdateForm" title="信息修改" width="35%" :append-to-body="true" label-position="left"
      @close="cancelSubmit">
      <el-form :model="form" :rules="rules" ref="formRef">
        <!-- 分隔符 -->
        <el-divider></el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户姓名：" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄：" prop="age">
              <el-input v-model="form.age" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别：" prop="gender">
              <el-select v-model="form.gender" placeholder="请选择性别">
                <el-option label="男" value="1" />
                <el-option label="女" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号：" prop="idCard">
              <el-input v-model="form.idCard" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="血型：" prop="bloodType">
              <el-input v-model="form.bloodType" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家属：" prop="relative">
              <el-input v-model="form.relative" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话：" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="楼栋：" prop="building">
              <el-input v-model="form.building" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房间号：" prop="roomNumber">
              <el-input v-model="form.roomNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="床位号：" prop="bedNumber">
              <el-input v-model="form.bedNumber" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="客户类型：" prop="customerType">
          <el-radio-group v-model="form.customerType" prop="customerType">
            <el-radio :value=0>自理老人</el-radio>
            <el-radio :value=1>护理老人</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="入住时间：" prop="checkinDate">
          <el-col :span="11">
            <el-date-picker v-model="form.checkinDate" type="date" placeholder="选择一个日期" style="width: 100%" disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="合同到期时间：" prop="expirationDate">
          <el-col :span="11">
            <el-date-picker v-model="form.expirationDate" type="date" value-format="YYYY-MM-DD" value-on-clear=""
            placeholder="选择一个日期" style="width: 100%" />
          </el-col>
        </el-form-item>
        <!-- 分隔符 -->
        <el-divider></el-divider>
        <el-form-item>
          <div style="width: 100%; text-align: right">
            <el-button type="primary" @click="checkUpdateForm">提交</el-button>
            <el-button @click="cancelUpdate">取消</el-button>
          </div>
        </el-form-item>

      </el-form>

    </el-dialog>

    <el-dialog v-model="updateCustomerVisible" title="提示" width="500" top="40vh" :z-index="3000" append-to-body>
      <span>确定修改该客户入住信息吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="updateCustomerVisible = false">取消</el-button>
          <el-button type="primary" @click="updateForm">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

  <!-- 删除客户信息确认框 -->
  <div>
    <el-dialog v-model="deleteCustomerVisible" title="警告" width="500" top="40vh">
      <span>确定登记该客户入住信息吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addCustomerVisible = false">取消</el-button>
          <el-button type="warning" @click="onSubmit">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<style lang="css" scoped></style>
