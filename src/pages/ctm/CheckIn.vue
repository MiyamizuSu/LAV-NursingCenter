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
import { ArrowUpDown, ChevronDown, ChevronsUpDown, Import } from 'lucide-vue-next'

import { h, ref } from 'vue'
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

export interface Payment {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export interface Customer{
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
    header: () => h('div', {} ,'序号'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('id')),
  },
  {
    accessorKey: 'name',
    header: () => h('div', {} ,'姓名'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
  },
  {
    accessorKey: 'gender',
    header: () => h('div', {} ,'性别'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('gender')),
  },
  {
    accessorKey: 'bloodType',
    header: () => h('div', {} ,'血型'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('bloodType')),
  },
  {
    accessorKey: 'age',
    header: () => h('div', {} ,'年龄'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('age')),
  },
  {
    accessorKey: 'idCard',
    header: () => h('div', {} ,'身份证号'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('idCard')),
  },
  {
    accessorKey: 'relative',
    header: () => h('div', {} ,'家属'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('relative')),
  },
  {
    accessorKey: 'phoneNumber',
    header: () => h('div', {} ,'电话号码'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('phoneNumber')),
  },
  {
    accessorKey: 'roomNumber',
    header: () => h('div', {} ,'房间号'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('roomNumber')),
  },
  {
    accessorKey: 'bedNumber',
    header: () => h('div', {} ,'床位号'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('bedNumber')),
  },
  {
    accessorKey: 'checkinDate',
    header: () => h('div', {} ,'入住时间'),
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('checkinDate')),
  },
  {
    accessorKey: 'expirationDate',
    header: () => h('div', {} ,'操作'),
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

</script>

<template>


  <div class="w-full">
    <div class="flex gap-2 items-center py-4">
      <Input class="max-w-sm" placeholder="客户姓名"
        :model-value="table.getColumn('email')?.getFilterValue() as string"
        @update:model-value=" table.getColumn('email')?.setFilterValue($event)" />

      <div class="grid place-content-center p-8">
        <RippleButton> 登记 </RippleButton>
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
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
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


</template>

<style lang="css" scoped></style>