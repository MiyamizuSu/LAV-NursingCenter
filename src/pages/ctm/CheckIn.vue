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
import { h, reactive, ref } from 'vue'
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

export interface Customer {
  id: number
  name: string
  gender: string
  bloodType: string
  age: number
  idCard: string
  relative: string
  phoneNumber: string
  roomNumber: string
  bedNumber: string
  checkinDate: string
  expirationDate: string
}

const data: Customer[] = [
  {
    id: 1,
    name: '大师兄',
    gender: '男',
    bloodType: 'A',
    age: 66,
    idCard: '2378973045304',
    relative: '奇诺',
    phoneNumber: '13376548907',
    roomNumber: '2011',
    bedNumber: '2011-3',
    checkinDate: '2024-12-20',
    expirationDate: '2025-06-20'
  },
]

// const data: Payment[] = [
//   {
//     id: 'm5gr84i9',
//     amount: 316,
//     status: 'success',
//     email: 'ken99@yahoo.com',
//   },
//   {
//     id: '3u1reuv4',
//     amount: 242,
//     status: 'success',
//     email: 'Abe45@gmail.com',
//   },
//   {
//     id: 'derv1ws0',
//     amount: 837,
//     status: 'processing',
//     email: 'Monserrat44@gmail.com',
//   },
//   {
//     id: '5kma53ae',
//     amount: 874,
//     status: 'success',
//     email: 'Silas22@gmail.com',
//   },
//   {
//     id: 'bhqecj4p',
//     amount: 721,
//     status: 'failed',
//     email: 'carmella@hotmail.com',
//   },
// ]

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
  // {
  //   accessorKey: 'status',
  //   header: 'Status',
  //   cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('status')),
  // },
  // {
  //   accessorKey: 'email',
  //   header: ({ column }) => {
  //     return h(Button, {
  //       variant: 'ghost',
  //       onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
  //     }, () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
  //   },
  //   cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
  // },
  // {
  //   accessorKey: 'amount',
  //   header: () => h('div', { class: 'text-right' }, 'Amount'),
  //   cell: ({ row }) => {
  //     const amount = Number.parseFloat(row.getValue('amount'))

  //     // Format the amount as a dollar amount
  //     const formatted = new Intl.NumberFormat('en-US', {
  //       style: 'currency',
  //       currency: 'USD',
  //     }).format(amount)

  //     return h('div', { class: 'text-right font-medium' }, formatted)
  //   },
  // },


  {
    accessorKey: 'id',
    header: () => h('div', {}, '序号'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('id')),
  },
  {
    accessorKey: 'name',
    header: () => h('div', {}, '姓名'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
  },
  {
    accessorKey: 'gender',
    header: () => h('div', {}, '性别'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('gender')),
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
    header: () => h('div', {}, '操作'),
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(
          'button',
          {
            class: 'px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition',
            // onClick: () => handleEdit(row.original),
          },
          '修改'
        ),
        h(
          'button',
          {
            class: 'px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition',
            // onClick: () => handleDelete(row.original),
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
  data,
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
    {required: true, message: '请输入年龄', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const num = Number(value)
        if (isNaN(num)) {
          callback(new Error('年龄必须是数字'))
        } else if (num < 0 || num > 120) {
          callback(new Error('年龄必须在 0 到 120 之间'))
        }else if (!Number.isInteger(num)) {
          callback(new Error('年龄必须是整数')) 
        }else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  gender: [
    {required: true, message: '请选择性别', trigger: 'blur'}
  ],
  idCard: [
    {required: true, message: '请输入身份证号', trigger: 'blur'}
  ],
  bloodType: [
    {required: true, message: '请输入血型', trigger: 'blur'}
  ],
  relative: [
    {required: true, message: '请输入家属姓名', trigger: 'blur'}
  ],
  phoneNumber: [
    {required: true, message: '请输入联系电话', trigger: 'blur'},
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
    {required: true, message: '请输入楼栋', trigger: 'blur'}
  ],
  roomNumber: [
    {required: true, message: '请输入房间号', trigger: 'blur'}
  ],
  bedNumber: [
    {required: true, message: '请输入床位号', trigger: 'blur'}
  ],
  customerType: [
    {required: true, message: '请选择客户类型', trigger: 'blur'}
  ],
  checkinDate: [
    {required: true, message: '请选择入住时间', trigger: 'blur'}
  ],
  expirationDate: [
    {required: true, message: '请选择合同到期时间', trigger: 'change'},
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

</script>

<template>


  <div class="w-full">
    <div class="flex gap-2 items-center py-4">
      <Input class="max-w-sm" placeholder="客户姓名" :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value=" table.getColumn('name')?.setFilterValue($event)" />

      <div class="grid place-content-center p-8">
        <RippleButton @click="openDialog('入住登记')"> 登记 </RippleButton>
      </div>
    </div>
    <div>
      <Switcher left-value="自理老人" right-value="护理老人">

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



    <div class="rounded-md border">
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
              无查询结果
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
        <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
          前一页
        </Button>
        <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
          下一页
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
            <el-radio value="自理老人">自理老人</el-radio>
            <el-radio value="护理老人">护理老人</el-radio>
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
            <el-button type="primary" @click="addCustomerVisible = true">提交</el-button>
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





</template>

<style lang="css" scoped></style>