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
import { h, onMounted, reactive, ref, watch, type Ref } from 'vue'
import { cn, debounce } from '@/lib/utils'

import { Button } from '@/components/ui/button'
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
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { useCustomerNurseStore } from '@/lib/store'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'
import type { Customer, OutingRegistration } from './type'

const ctsStore = useCustomerNurseStore()
const outingPages = ref({
    currentPage: 1,
    pageSize: 8,
    totalOuting: 0
})
const customerPages = ref({
    currentPage: 1,
    pageSize: 8,
    totalCustomer: 0
})

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
        cell: ({ row }) => h('div', { class: 'capitalize break-words whitespace-normal max-w-[120px]' }, row.getValue('expectedReturnDate')),
    },
    {
        accessorKey: 'actualReturnDate',
        header: () => h('div', {}, '实际回院时间'),
        cell: ({ row }) => h('div', { class: 'capitalize break-words whitespace-normal max-w-[120px]' }, row.getValue('actualReturnDate')),
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
            ''
            if (reviewStatus === 0) {
                return h('div', { class: 'flex flex-wrap gap-2 basis-1/6 shrink-0 grow text-right justify-end' }, [
                    h('button', {
                        class: 'px-2 py-1 text-xs text-white rounded transition whitespace-nowrap bg-[#E6A23C]',
                        onClick: () => deleteOutingRegistration(row.original)
                    }, '撤销申请')
                ])
            } else if (reviewStatus === 2) {
                return h('div', { class: 'flex flex-wrap gap-2 basis-1/6 shrink-0 grow text-right justify-end' }, [
                    h('button', {
                        class: 'px-2 py-1 text-xs text-white rounded transition whitespace-nowrap bg-[#67C23A]',
                        onClick: () => openUpdateReturnedDateForm(row.original)
                    }, '登记回院时间')
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
// 外出信息列表页面改变时
const changeOutingPage = (page: number) => {
    outingPages.value.currentPage = page
    loadOutingRegistrations()
}
const searchName = ref('')  // 搜索框输入
// 处理重置搜索
const resetCustomers = () => {
    searchName.value = ''
    loadCustomers()
    loadOutingRegistrations()
}
const onInput = async (event: Event) => {
    const deLoad = debounce(loadCustomers)
    const deLoad1 = debounce(loadOutingRegistrations)
    deLoad()
    deLoad1()
}
// 获取分页客户数据
const loadCustomers = async () => {
    const res = await axios.post('http://localhost:9000/customer/page', {
        current: customerPages.value.currentPage,
        size: customerPages.value.pageSize,
        name: searchName.value
    })
    if (res.data.status === 200) {
        ctsStore.setCustomerList(res.data.data)
        customerPages.value.totalCustomer = res.data.total
    } else {
        ctsStore.getCustomerList.value = []
    }
}
// 获取所有客户数据
const loadAllCustomers = async () => {
    const res = await axios.post('http://localhost:9000/customer/listAll')
    if (res.data.status === 200) {
        ctsStore.setAllCustomerList(res.data.data)
    } else {
        console.log('查询失败')
    }
}

// 获取分页外出审批数据
const loadOutingRegistrations = async () => {
    const res = await axios.post('http://localhost:9000/outingRegistration/page', {
        current: outingPages.value.currentPage,
        size: outingPages.value.pageSize,
        name: searchName.value
    })
    if (res.data.status === 200) {
        ctsStore.setOutingList(res.data.data)
        outingPages.value.totalOuting = res.data.total
    } else {
        ctsStore.getOutingList.value = []
    }
}
// 配置表单规则
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<OutingRegistration>>({
    customerId: [
        {
            required: true,
            message: '请选择客户姓名',
            trigger: 'change',
        },
    ],
    customerName: [
        {
            required: true,
            message: '请选择客户姓名',
            trigger: 'blur',
        },
    ],
    outingReason: [
        {
            required: true,
            message: '请填写外出事由',
            trigger: 'blur',
        }
    ],
    outingDate: [
        {
            required: true,
            message: '请选择外出时间',
            trigger: 'blur',
        }
    ],
    expectedReturnDate: [
        {
            required: true,
            message: '请选择预计返回时间',
            trigger: 'blur',
        },
        {
            validator: (rule, value, callback) => {
                if (!addOutingForm.outingDate || !value) {
                    callback()
                    return
                }
                const outing = new Date(addOutingForm.outingDate)
                const expectedReturnDate = new Date(value)
                if (outing > expectedReturnDate) {
                    callback(new Error('外出时间必须早于预计返回时间'))
                } else {
                    callback()
                }
            },
            trigger: 'change'
        }
    ],
    escortName: [
        {
            required: true,
            message: '请填写陪同人姓名',
            trigger: 'blur',
        }
    ],
    escortRelation: [
        {
            required: true,
            message: '请填写陪同人关系',
            trigger: 'blur',
        }
    ],
    escortPhone: [
        {
            required: true,
            message: '请填写陪同人联系电话',
            trigger: 'blur',
        }
    ],
})
const updateReturnDateRules = reactive<FormRules<OutingRegistration>>({
    actualReturnDate: [
        {
            required: true,
            message: '请填写实际返回时间',
            trigger: 'blur',
        }
    ]
})
const addOutingFormVisible = ref(false)   // 添加外出申请表单可见性
const addOutingForm = reactive({ // 暂存审批信息
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
    reviewTime: '',
    actualReturnDate: ''
})
const selectedCustomer = ref(null)
const onCustomerChange = (id: number) => {
    const customer = ctsStore.getAllCustomerList.value.find(c => c.customerId === id);
    if (customer) {
        addOutingForm.customerName = customer.name;
        addOutingForm.customerId = customer.customerId
        console.log('客户信息：', customer)
    } else {
        addOutingForm.customerName = '';
        console.log('未找到客户信息')
    }
}
const submitOutingFormVisible = ref(false)  // 确认提交表单可见性
const checkAddOutingForm = () => {   // 检查表单
    ruleFormRef.value?.validate((valid) => {
        if (valid) {
            console.log("表单验证通过");
            submitOutingFormVisible.value = true;
        } else {
            console.log("表单验证未通过");
        }
    })
}

const cancelAddOutingForm = () => {  // 关闭添加外出申请表单
    ruleFormRef.value?.resetFields()
    addOutingFormVisible.value = false
    selectedCustomer.value = null
    clearOutingForm()
}
const clearOutingForm = () => {
    addOutingForm.customerId = -1
    addOutingForm.outingReason = ''
    addOutingForm.outingDate = ''
    addOutingForm.expectedReturnDate = ''
    addOutingForm.escortName = ''
    addOutingForm.escortRelation = ''
    addOutingForm.escortPhone = ''
    addOutingForm.reviewStatus = -1
    addOutingForm.rejectReason = ''
    addOutingForm.reviewTime = ''
}
const addOutingRegistration = async () => {
    console.log('提交外出申请', addOutingForm)
    const res = await axios.post('http://localhost:9000/outingRegistration/add', addOutingForm)
    if (res.data.status === 200) {
        ElMessage.success('添加成功')
        submitOutingFormVisible.value = false
        addOutingFormVisible.value = false
        clearOutingForm()
        await loadOutingRegistrations()
    } else {
        ElMessage.error('添加失败')
    }
}

// 撤销外出申请
const deleteOutingRegistration = async (outing: OutingRegistration) => {
    ElMessageBox.confirm(
        '确定要撤销客户' + outing.customerName + '的外出申请吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        const res = await axios.post("http://localhost:9000/outingRegistration/delete", { id: outing.id })
        if (res.data.status === 200) {
            ElMessage.success('撤销成功')
            loadOutingRegistrations()
        } else {
            ElMessage.error('撤销失败')
        }
    })
        .catch(() => {
            ElMessage.info('已取消撤销')
        })
}

const updateReturnedDateVisible = ref(false)  // 登记回院时间表单可见性
const openUpdateReturnedDateForm = (outing: OutingRegistration) => {
    updateReturnDateForm.id = outing.id
    updateReturnDateForm.customerId = outing.customerId
    updateReturnDateForm.customerName = outing.customerName
    updateReturnDateForm.outingReason = outing.outingReason
    updateReturnDateForm.outingDate = outing.outingDate
    updateReturnDateForm.expectedReturnDate = outing.expectedReturnDate
    updateReturnDateForm.reviewStatus = outing.reviewStatus
    updateReturnedDateVisible.value = true
}
const cancelUpdateReturnedDate = () => {  // 取消登记回院时间
    updateReturnedDateVisible.value = false
    clearUpdateReturnedDateForm()
    ElMessage({
        type: 'info',
        message: '已取消登记',
    })
}
const updateReturnDateForm = reactive({
    id: -1,
    customerId: -1,
    customerName: '',
    outingReason: '',
    outingDate: '',
    expectedReturnDate: '',
    actualReturnDate: '',
    reviewStatus: -1,
})
const clearUpdateReturnedDateForm = () => {  // 清空实际返回表单
    updateReturnDateForm.id = -1
    updateReturnDateForm.customerId = -1
    updateReturnDateForm.customerName = ''
    updateReturnDateForm.outingReason = ''
    updateReturnDateForm.outingDate = ''
    updateReturnDateForm.expectedReturnDate = ''
    updateReturnDateForm.actualReturnDate = ''
    updateReturnDateForm.reviewStatus = -1
}
const updateReturnDateConfirmVisible = ref(false)
const checkUpdateActualReturnDate = () => {
    ruleFormRef.value?.validate((valid) => {
        if (valid) {
            console.log("表单验证通过");
            updateReturnDateConfirmVisible.value = true
        } else {
            console.log("表单验证未通过");
        }
    })
}
const updateActualReturnDate = async () => {
    console.log('提交回院时间', updateReturnDateForm)
    const res = await axios.post('http://localhost:9000/outingRegistration/update', updateReturnDateForm)
    if (res.data.status === 200) {
        ElMessage.success('登记成功')
        updateReturnDateConfirmVisible.value = false
        updateReturnedDateVisible.value = false
        clearUpdateReturnedDateForm()
        await loadOutingRegistrations()
    } else {
        ElMessage.error('登记失败')
    }
}

onMounted(async () => {
    await loadCustomers()
    await loadAllCustomers()
    await loadOutingRegistrations()
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
                <div class="ml-auto pr-6">
                    <InteractiveHoverButton @click="addOutingFormVisible = true" text="添加外出申请">
                        <template #svgIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-circle-plus-icon lucide-circle-plus">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12h8" />
                                <path d="M12 8v8" />
                            </svg>
                        </template>
                    </InteractiveHoverButton>
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
        <div>
            <el-dialog v-model="addOutingFormVisible" title="添加外出申请" width="35%" :append-to-body="true"
                label-position="left" @close="cancelAddOutingForm">
                <el-form :model="addOutingForm" :rules="rules" ref="ruleFormRef">
                    <el-divider></el-divider>
                    <el-form-item label="选择客户：" prop="customerName">
                        <el-select v-model="selectedCustomer" placeholder="请选择客户" filterable style="width: 100%"
                            @change="onCustomerChange">
                            <el-option v-for="customer in ctsStore.getAllCustomerList.value" :key="customer.customerId"
                                :label="customer.name" :value="customer.customerId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="外出事由：" prop="outingReason">
                        <el-input v-model="addOutingForm.outingReason" type="textarea" />
                    </el-form-item>
                    <el-form-item label="外出时间：" prop="outingDate">
                        <el-date-picker v-model="addOutingForm.outingDate" type="datetime" placeholder="选择日期和时间"
                            format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                    <el-form-item label="预计回院时间：" prop="expectedReturnDate">
                        <el-date-picker v-model="addOutingForm.expectedReturnDate" type="datetime" placeholder="选择日期和时间"
                            format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                    <el-form-item label="陪同人：" prop="escortName">
                        <el-input v-model="addOutingForm.escortName" />
                    </el-form-item>
                    <el-form-item label="与老人关系：" prop="escortRelation">
                        <el-input v-model="addOutingForm.escortRelation" />
                    </el-form-item>
                    <el-form-item label="陪同人电话：" prop="escortPhone">
                        <el-input v-model="addOutingForm.escortPhone" />
                    </el-form-item>
                    <el-divider></el-divider>
                    <el-form-item>
                        <div style="width: 100%; text-align: right">
                            <el-button color="black" @click="checkAddOutingForm">提交</el-button>
                            <el-button color="#e8e8e8" @click="cancelAddOutingForm">取消</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-dialog>

            <el-dialog v-model="submitOutingFormVisible" title="提示" width="500" top="40vh" :z-index="3000" append-to-body>
                <span>确定提交该外出申请吗？</span>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="submitOutingFormVisible = false">取消</el-button>
                        <el-button color="black" @click="addOutingRegistration">
                            提交
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
    </div>
    <!-- 登记回院时间表单 -->
    <div>
        <el-dialog v-model="updateReturnedDateVisible" title="登记回院时间" width="35%" :append-to-body="true"
            label-position="left">
            <el-form :model="updateReturnDateForm" :rules="updateReturnDateRules" ref="ruleFormRef">
                <el-divider></el-divider>
                <el-form-item label="选择客户：" prop="customerName">
                    <el-select v-model="updateReturnDateForm.customerName" placeholder="请选择客户" filterable
                        style="width: 100%" @change="onCustomerChange" disabled>
                        <el-option v-for="customer in ctsStore.getAllCustomerList.value" :key="customer.customerId"
                            :label="customer.name" :value="customer.customerId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="外出事由：" prop="outingReason">
                    <el-input v-model="updateReturnDateForm.outingReason" type="textarea" disabled />
                </el-form-item>
                <el-form-item label="外出时间：" prop="outingDate">
                    <el-date-picker v-model="updateReturnDateForm.outingDate" type="datetime" placeholder="选择日期和时间"
                        format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" disabled />
                </el-form-item>
                <el-form-item label="预计回院时间：" prop="expectedReturnDate">
                    <el-date-picker v-model="updateReturnDateForm.expectedReturnDate" type="datetime"
                        placeholder="选择日期和时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
                        disabled />
                </el-form-item>
                <el-form-item label="实际回院时间：" prop="actualReturnDate">
                    <el-date-picker v-model="updateReturnDateForm.actualReturnDate" type="datetime"
                        placeholder="选择日期和时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item>
                    <div style="width: 100%; text-align: right">
                        <el-button color="black" @click="checkUpdateActualReturnDate">提交</el-button>
                        <el-button color="#e8e8e8" @click="cancelUpdateReturnedDate">取消</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog v-model="updateReturnDateConfirmVisible" title="提示" width="500" top="40vh" :z-index="3000" append-to-body>
            <span>确定登记实际回院时间吗？</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="updateReturnDateConfirmVisible = false">取消</el-button>
                    <el-button color="black" @click="updateActualReturnDate">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>

</template>

<style lang="css" scoped></style>