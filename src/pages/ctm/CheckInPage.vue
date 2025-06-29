<!-- 系统管理员端 客户管理 入住登记 -->
<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
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
import { ArrowUpDown, ChevronDown, ChevronsUpDown, IdCard, Import } from 'lucide-vue-next'
import { h, reactive, ref, onMounted, watch } from 'vue'
import { axiosInstance as axios } from '@/lib/core'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu'
import { RippleButton } from '@/components/ui/ripple-button'
import Switcher from '@/components/custom/Switcher.vue'
import { ElButton, ElInput } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Customer } from '@/lib/type'
import { usecustomerManagementStore } from '@/lib/store'
const data: Customer[] = [
]
const ctmStore = usecustomerManagementStore()
// 分页参数
const pages = ref({
  currentPage: 1,
  pageSize: 10
})
const total = ref(0)
const customerType = ref(0)

// 获取分页客户数据
const fetchCustomers = async () => {
  if (import.meta.env.VITE_DEV_ENV === 'sameSite') {
    if (selectedCustomerType.value === '护理老人') {
      customerType.value = 1
    } else {
      customerType.value = 0
    }
    axios.post('http://10.25.41.129:9000/customer/page', {
      current: pages.value.currentPage,
      size: pages.value.pageSize,
      customerType: customerType.value,
      name: ""
    }
    ).then((res) => {
      console.log(res.data)
      if (res.data.status === 200) {
        ctmStore.setNewList(res.data.data)
        total.value = res.data.total
        updateTableData(ctmStore.getCustomerList.value)
      } else {
        ctmStore.getCustomerList.value = []
      }
    })
  }
}

const showUpdateForm = ref(false)  // 修改界面的可见性
const updateCustomerVisible = ref(false) // 确认修改界面的可见性
const openUpdateForm = (customer: Customer) => {  // 打开修改界面
  Object.assign(form, customer)
  console.log("当前客户信息", form)
  showUpdateForm.value = true
}
const checkUpdateForm = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      console.log('表单数据:', form)
      updateCustomerVisible.value = true
    } else {
      console.log('表单验证失败')
    }
  })
}
const cancelUpdate = () => {
  console.log('取消修改：')
  showUpdateForm.value = false
  clearForm()
}
const updateForm = async () => {
  // 后端
  axios.post("/customer/update", form).then((res) => {
    console.log(res.data)
    if (res.data.status === 200) {
      fetchCustomers()
    } else {

    }

  })

  updateCustomerVisible.value = false
  showUpdateForm.value = false
  clearForm()

}

const columns: ColumnDef<Customer>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
    }),
    cell: ({ row }) => h(Checkbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': value => row.toggleSelected(!!value),
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
// dd
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

const showForm = ref(false)
const form = reactive({
  name: '',
  age: '',
  gender: '',
  idCard: '',
  bloodType: '',
  relative: '',
  phoneNumber: '',
  building: '',
  roomNumber: '',
  bedNumber: '',
  customerType: '',
  checkinDate: '',
  expirationDate: '',
})
const formTitle = ref()
// 打开添加表单
const openDialog = (title: string) => {
  formTitle.value = title
  showForm.value = true
}
// 提交客户信息
const onSubmit = () => {
  // 实现后端
  // ...
  axios.post("/customer/add", form).then((res) => {

  })

  addCustomerVisible.value = false
  showForm.value = false
  clearForm()
}
const cancelSubmit = () => {
  console.log('取消提交：')
  showForm.value = false
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
  form.building = ''
  form.roomNumber = ''
  form.bedNumber = ''
  form.customerType = ''
  form.checkinDate = ''
  form.expirationDate = ''
}

const addCustomerVisible = ref(false)

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
  building: [
    { required: true, message: '请输入楼栋', trigger: 'blur' }
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
// 检查用户输入
const checkAddForm = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      console.log('表单数据:', form)
      addCustomerVisible.value = true
    } else {
      console.log('表单验证失败')
    }
  })
}

// 页码改变时
const changePage = (page: number) => {
  pages.value.currentPage = page
  fetchCustomers()
}

// 将数据更新到表格（如果使用 useTable）
const updateTableData = (rows: any[]) => {
  table.setOptions(prev => ({
    ...prev,
    data: rows
  }))
}

const deleteCustomerVisible = ref(false) // 确认删除提示框可见性
// 删除提示框
const openDeleteForm = (customer: Customer) => {
  ElMessageBox.confirm(
    '确定要删除客户' + customer.name + '的信息吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      axios.post("/customer/deleteById", customer.customerId).then((res: any) => {
        if (res.data.status === 200) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          fetchCustomers()
        } else {
          ElMessage({
            type: 'error',
            message: '删除失败',
          })
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}

const selectedCustomerType = ref('自理老人')
watch(selectedCustomerType, (newType: any) => {
  fetchCustomers()
})

onMounted(() => {
  fetchCustomers()

})
function change(e: string) {
  selectedCustomerType.value = e
}
</script>

<template>

  <!-- 客户信息列表 -->
  <div class="w-full">
    <div class="flex gap-2 items-center py-4">
      <Input class="max-w-sm" placeholder="客户姓名" :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value=" table.getColumn('name')?.setFilterValue($event)" />

      <div class="grid place-content-center p-8">
        <RippleButton @click="openDialog('入住登记')"> 登记 </RippleButton>
      </div>
    </div>
    <div>
      <Switcher left-value="自理老人" right-value="护理老人" @select-value-change="change">
      </Switcher>
    </div>
    <div class="flex justify-end pb-4">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Columns
            <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
            :key="column.id" class="capitalize" :model-value="column.getIsVisible()" @update:model-value="(value: any) => {
              column.toggleVisibility(!!value)
            }">
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
        <Button variant="outline" size="sm" :disabled="pages.currentPage * pages.pageSize >= total"
          @click="changePage(pages.currentPage + 1)">
          后一页
        </Button>
      </div>
    </div>
  </div>

  <!-- 添加客户表单 -->
  <div>
    <el-dialog v-model="showForm" :title=formTitle width="35%" :append-to-body="true" label-position="left"
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
              <el-input v-model="form.building" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房间号：" prop="roomNumber">
              <el-input v-model="form.roomNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="床位号：" prop="bedNumber">
              <el-input v-model="form.bedNumber" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="客户类型：" prop="customerType">
          <el-radio-group v-model="form.customerType">
            <el-radio value='0'>自理老人</el-radio>
            <el-radio value='1'>护理老人</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="入住时间：" prop="checkinDate">
          <el-col :span="11">
            <el-date-picker v-model="form.checkinDate" type="date" placeholder="选择一个日期" style="width: 100%" />
          </el-col>
        </el-form-item>
        <el-form-item label="合同到期时间：" prop="expirationDate">
          <el-col :span="11">
            <el-date-picker v-model="form.expirationDate" type="date" placeholder="选择一个日期" style="width: 100%" />
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

    <el-dialog v-model="addCustomerVisible" title="提示" width="500" top="40vh">
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
            <el-radio value="0">自理老人</el-radio>
            <el-radio value="1">护理老人</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="入住时间：" prop="checkinDate">
          <el-col :span="11">
            <el-date-picker v-model="form.checkinDate" type="date" placeholder="选择一个日期" style="width: 100%" disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="合同到期时间：" prop="expirationDate">
          <el-col :span="11">
            <el-date-picker v-model="form.expirationDate" type="date" placeholder="选择一个日期" style="width: 100%" />
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

    <el-dialog v-model="updateCustomerVisible" title="提示" width="500" top="40vh">
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
