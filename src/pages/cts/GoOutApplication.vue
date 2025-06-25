<!-- 健康管家端 客户管理模块 外出申请 -->
<script setup lang="ts">
import type {
    ColumnDef,
    ColumnFiltersState,
    ExpandedState,
    SortingState,
    VisibilityState,
} from '@tanstack/vue-table'
import {
    FlexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from '@tanstack/vue-table'
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import { computed, h, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { cn, debounce } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { valueUpdater } from '@/components/ui/table/utils'
import axios from 'axios'
import type { FormInstance, FormRules } from 'element-plus'
import { usecustomerManagementStore, useCustomerNurseStore } from '@/lib/store'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'

import { Copy } from 'lucide-vue-next'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import type { Customer, OutingRegistration } from './type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const position = ref('bottom')  // 下拉框显示位置
const outingPages = ref({
    currentPage: 1,
    pageSize: 10,
    totalOuting: 0
})
const customerPages = ref({
    currentPage: 1,
    pageSize: 10,
    totalCustomer: 0
})
const ctsStore = useCustomerNurseStore()
const customerColumns: ColumnDef<Customer>[] = [
    {
        accessorKey: 'index',
        header: () => h('div', {}, '序号'),
        cell: ({ row }) => {
            const pageSize = customerPages.value.pageSize
            const currentPage = customerPages.value.currentPage
            return h('div', {}, row.index + 1 + (currentPage - 1) * pageSize)
        }
    },
    {
        accessorKey: 'name',
        header: () => h('div', {}, '姓名'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
    },
    {
        accessorKey: 'age',
        header: () => h('div', {}, '年龄'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('age')),
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
        accessorKey: 'bedNumber',
        header: () => h('div', {}, '床位号'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('bedNumber')),
    },
    {
        accessorKey: 'nursingLevelName',
        header: () => h('div', {}, '护理级别'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('nursingLevelName')),
    },
]
const outingColumns: ColumnDef<OutingRegistration>[] = [
    {
        accessorKey: 'index',
        header: () => h('div', {}, '序号'),
        cell: ({ row }) => {
            const pageSize = outingPages.value.pageSize
            const currentPage = outingPages.value.currentPage
            return h('div', {}, row.index + 1 + (currentPage - 1) * pageSize)
        }
    },
    {
        accessorKey: 'customerName',
        header: () => h('div', {}, '姓名'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('customerName')),
    },
    {
        accessorKey: 'outingReason',
        header: () => h('div', {}, '外出事由'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('outingReason')),
    },
    {
        accessorKey: 'outingDate',
        header: () => h('div', {}, '外出时间'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('outingDate')),
    },
    {
        accessorKey: 'expectedReturnDate',
        header: () => h('div', {}, '预计回院时间'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('expectedReturnDate')),
    },
    {
        accessorKey: 'actualReturnDate',
        header: () => h('div', {}, '实际回院时间'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('actualReturnDate')),
    },
    {
        accessorKey: 'escortName',
        header: () => h('div', {}, '陪同人'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('escortName')),
    },
    {
        accessorKey: 'escortRelation',
        header: () => h('div', {}, '与老人关系'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('escortRelation')),
    },
    {
        accessorKey: 'escortPhone',
        header: () => h('div', {}, '陪同人电话'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('escortPhone')),
    },
    {
        accessorKey: 'reviewStatus',
        header: () => h('div', {}, '审批状态'),
        cell: ({ row }) => {
            const reviewStatusValue = row.getValue('reviewStatus')
            let displayReviewStatus = ''
            let color = ''
            if (reviewStatusValue === 0) {
                displayReviewStatus = '已提交'
                color = '#409EFF'
            } else if (reviewStatusValue === 1) {
                displayReviewStatus = '不通过'
                color = 'red'
            } else if (reviewStatusValue === 2) {
                displayReviewStatus = '已通过'
                color = '#67C23A'
            }
            return h('div', { style: { color, class: 'capitalize' } }, displayReviewStatus)
        }
    },
    {
        accessorKey: 'reviewTime',
        header: () => h('div', {}, '审批时间'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('reviewTime')),
    },
    {
        accessorKey: 'operation',
        header: () => h('div', {}, '操作'),
        cell: ({ row }) => {
            const reviewStatus = row.getValue('reviewStatus')
            if (reviewStatus === 0) {
                return h('div', { class: 'flex gap-2' }, [
                    h(

                        'button',
                        {
                            class: 'px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition',
                            // onClick: () => openApprovalForm(row.original),
                        },
                        '审批'
                    ),
                ])
            }
            return null
        }
    },
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})
const customerTable = useVueTable({  // 客户信息表
    get data() {
        return ctsStore.getCustomerList
    },
    columns: customerColumns,
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
const outingTable = useVueTable({  // 退住信息表
    get data() {
        return ctsStore.getOutingList
    },
    columns: outingColumns,
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
// 客户信息列表页码改变时
const changeCustomerPage = (page: number) => {
    customerPages.value.currentPage = page
    loadCustomers()
}
// 退住信息列表页面改变时
const changeOutingPage = (page: number) => {
    outingPages.value.currentPage = page
    loadOutingRegistrations()
}
const searchName = ref('')  // 搜索框输入
const customerName = ref('')
const tableKey = Date.now()
// 处理重置搜索
const resetCustomers = () => {
    searchName.value = ''
    loadCustomers()
}
const onInput = async (event: Event) => {
    const deLoad = debounce(loadCustomers)
    deLoad();
}
// 获取分页客户数据
const loadCustomers = async () => {
    axios.post('http://localhost:9000/customer/page', {
        current: customerPages.value.currentPage,
        size: customerPages.value.pageSize,
        name: searchName.value
    }).then((res) => {
        if (res.data.status === 200) {
            ctsStore.setCustomerList(res.data.data)
            customerPages.value.totalCustomer = res.data.total
        } else {
            ctsStore.getCustomerList.value = []
        }
    })
    // searchName.value = ''
}
// 获取所有客户数据
const loadAllCustomers = async () => {
    axios.post('http://localhost:9000/customer/listAll').then((res) => {
        if (res.data.status === 200) {
            console.log('所有客户数据', res.data.data)
            ctsStore.setAllCustomerList(res.data.data)
        } else {
            console.log('查询失败')
        }
    })
}

// 获取分页外出审批数据
const loadOutingRegistrations = async () => {
    axios.post('http://localhost:9000/outingRegistration/page', {
        current: outingPages.value.currentPage,
        size: outingPages.value.pageSize,
        name: ""
    }).then((res) => {
        console.log("外出审批数据：", res.data)
        if (res.data.status === 200) {
            ctsStore.setOutingList(res.data.data)
            outingPages.value.totalOuting = res.data.total
            updateOutingTable(ctsStore.getOutingList.value)
        } else {
            ctsStore.getOutingList.value = []
        }
    })
    //searchName.value = ''
}
const updateOutingTable = (rows: any[]) => {
    outingTable.setOptions(prev => ({
        ...prev,
        data: rows
    }))
}


const addOutingFormVisible = ref(false)   // 添加外出申请表单可见性
const addOutingForm = reactive<OutingRegistration>({ // 暂存审批信息
    id: -1,
    customerId: -1,
    customerName: '',
    outingReason: '',
    outingDate: '',
    expectedReturnDate: '',
    escortName: '',
    escortRelation: '',
    escortPhone: '',
    reviewStatus: -1,
    rejectReason: '',
    reviewTime: ''
})

watch(() => addOutingForm.customerName, (val) => {
    console.log("当前选择的客户名：", val)
})





onMounted(() => {
    loadCustomers()
    loadAllCustomers()
    loadOutingRegistrations()
})
</script>

<template>
    <div class="w-full flex flex-col gap-4">
        <div>
            <div class="flex items-center py-10 gap-4">
                <div>
                    <Input class="w-96" placeholder="客户姓名" v-model="searchName" @input="onInput" />
                </div>
                <div>
                    <InteractiveHoverButton @click="resetCustomers" text="重置" text-before-color="#95e1d3"
                        text-after-color="#eaffd0" before-color="#eaffd0" after-color="#95e1d3">
                        <template #svgIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-rotate-ccw-icon lucide-rotate-ccw">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                        </template>
                    </InteractiveHoverButton>
                </div>
                <div>
                    <Dialog>
                        <DialogTrigger as-child>
                            <InteractiveHoverButton @click="addOutingFormVisible = true" text="添加外出申请">
                                <template #svgIcon>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="lucide lucide-circle-plus-icon lucide-circle-plus">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M8 12h8" />
                                        <path d="M12 8v8" />
                                    </svg>
                                </template>
                            </InteractiveHoverButton>
                        </DialogTrigger>
                        <DialogContent v-model="addOutingFormVisible" class="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>添加外出申请</DialogTitle>
                                <el-divider></el-divider>
                            </DialogHeader>
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">

                                    <Label class="text-right">
                                        选择客户：
                                    </Label>
                                    
            <Select>
              <SelectTrigger id="framework">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="nuxt">
                  Nuxt
                </SelectItem>
                <SelectItem value="next">
                  Next.js
                </SelectItem>
                <SelectItem value="sveltekit">
                  SvelteKit
                </SelectItem>
                <SelectItem value="astro">
                  Astro
                </SelectItem>
              </SelectContent>
            </Select>
                                </div>
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label for="username" class="text-right">
                                        Username
                                    </Label>
                                    <Input id="username" value="@peduarte" class="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </div>
            </div>
            <div>
                <!-- 分隔符 -->
                <el-divider></el-divider>
            </div>
        </div>

        <div class="flex gap-4 flex-row items-start w-full">
            <!-- 左侧：客户信息列表 -->
            <div class="w-1/4">
                <div class="text-white px-4 py-2 font-semibold rounded-t-md" style="background-color: #409EFF;">
                    客户信息
                </div>
                <div class="rounded-b-md border">
                    <Table>
                        <TableHeader>
                            <TableRow v-for="headerGroup in customerTable.getHeaderGroups()" :key="headerGroup.id">
                                <TableHead v-for="header in headerGroup.headers" :key="header.id">
                                    <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                                        :props="header.getContext()" />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <template v-if="customerTable.getRowModel().rows?.length">
                                <template v-for="row in customerTable.getRowModel().rows" :key="row.id">
                                    <TableRow :data-state="row.getIsSelected() && 'selected'">
                                        <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                            <FlexRender :render="cell.column.columnDef.cell"
                                                :props="cell.getContext()" />
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
                                <TableCell :colspan="customerColumns.length" class="h-24 text-center">
                                    查无此人
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div class="flex items-center justify-end space-x-2 py-4">
                    <div class="flex-1 text-sm text-muted-foreground">
                        共
                        {{ customerTable.getFilteredRowModel().rows.length }}
                        行
                    </div>
                    <div class="space-x-2">
                        <Button variant="outline" size="sm" :disabled="customerPages.currentPage <= 1"
                            @click="changeCustomerPage(customerPages.currentPage - 1)">
                            前一页
                        </Button>
                        <Button variant="outline" size="sm"
                            :disabled="customerPages.currentPage * customerPages.pageSize >= customerPages.totalCustomer"
                            @click="changeCustomerPage(customerPages.currentPage + 1)">
                            后一页
                        </Button>
                    </div>
                </div>
            </div>
            <!-- 右侧：外出审批表格 -->
            <div class="w-3/4 pr-6">
                <div class="text-white px-4 py-2 font-semibold rounded-t-md" style="background-color: #409EFF;">
                    外出申请审批
                </div>
                <div class="rounded-b-md border overflow-auto" style="max-height: calc(100vh - 240px);">
                    <Table>
                        <TableHeader>
                            <TableRow v-for="headerGroup in outingTable.getHeaderGroups()" :key="headerGroup.id">
                                <TableHead v-for="header in headerGroup.headers" :key="header.id">
                                    <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                                        :props="header.getContext()" />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <template v-if="outingTable.getRowModel().rows?.length">
                                <template v-for="row in outingTable.getRowModel().rows" :key="row.id">
                                    <TableRow :data-state="row.getIsSelected() && 'selected'">
                                        <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                            <div class="whitespace-normal break-words">
                                                <FlexRender :render="cell.column.columnDef.cell"
                                                    :props="cell.getContext()" />
                                            </div>
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
                                <TableCell :colspan="outingColumns.length" class="h-24 text-center">
                                    暂无审批信息
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div class="flex items-center justify-end space-x-2 py-4">
                    <div class="flex-1 text-sm text-muted-foreground">
                        共
                        {{ outingTable.getFilteredRowModel().rows.length }}
                        行
                    </div>
                    <div class="space-x-2">
                        <Button variant="outline" size="sm" :disabled="outingPages.currentPage <= 1"
                            @click="changeOutingPage(outingPages.currentPage - 1)">
                            前一页
                        </Button>
                        <Button variant="outline" size="sm"
                            :disabled="outingPages.currentPage * outingPages.pageSize >= outingPages.totalOuting"
                            @click="changeOutingPage(outingPages.currentPage + 1)">
                            后一页
                        </Button>
                    </div>
                </div>
            </div>
        </div>


        <!-- 添加外出申请表单 -->
        <Dialog>
            <DialogTrigger as-child>
                <Button variant="outline">
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent v-model="addOutingFormVisible" class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="name" class="text-right">
                            Name
                        </Label>
                        <Input id="name" value="Pedro Duarte" class="col-span-3" />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="username" class="text-right">
                            Username
                        </Label>
                        <Input id="username" value="@peduarte" class="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">
                        Save changes
                    </Button>
                    <DialogClose as-child>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>


    </div>

</template>

<style lang="css" scoped></style>