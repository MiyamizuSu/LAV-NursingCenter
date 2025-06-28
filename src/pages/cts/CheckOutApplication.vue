<!-- 健康管家端 客户管理模块 退住申请 -->
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
import { h, nextTick, onMounted, reactive, ref, watch, type Ref } from 'vue'
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
import type { CheckoutRegistration, Customer } from './type'

const ctsStore = useCustomerNurseStore()
const customerPages = ref({
    currentPage: 1,
    pageSize: 8,
    totalCustomer: 0
})
const checkoutPages = ref({
    currentPage: 1,
    pageSize: 8,
    totalCheckout: 0
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
const checkoutColumns: ColumnDef<CheckoutRegistration>[] = [
    {
        accessorKey: 'index',
        header: () => h('div', {}, '序号'),
        cell: ({ row }) => {
            const pageSize = checkoutPages.value.pageSize
            const currentPage = checkoutPages.value.currentPage
            return h('div', {}, row.index + 1 + (currentPage - 1) * pageSize)
        },
    },
    {
        accessorKey: 'customerName',
        header: () => h('div', {}, '姓名'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('customerName')),
    },
    {
        accessorKey: 'checkinDate',
        header: () => h('div', {}, '入住时间'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('checkinDate')),
    },
    {
        accessorKey: 'checkoutDate',
        header: () => h('div', {}, '退住时间'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('checkoutDate')),
    },
    {
        accessorKey: 'checkoutType',
        header: () => h('div', {}, '退住类型'),
        cell: ({ row }) => {
            const checkoutTypeValue = row.getValue('checkoutType')
            let displayCheckoutType = ''
            if (checkoutTypeValue === 0) {
                displayCheckoutType = '正常退住'
            } else if (checkoutTypeValue === 1) {
                displayCheckoutType = '死亡退住'
            } else if (checkoutTypeValue === 2) {
                displayCheckoutType = '保留床位'
            }
            return h('div', { class: 'capitalize' }, displayCheckoutType)
        }
    },
    {
        accessorKey: 'checkoutReason',
        header: () => h('div', {}, '退住原因'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('checkoutReason')),
    },
    {
        accessorKey: 'reviewTime',
        header: () => h('div', {}, '审批时间'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('reviewTime')),
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
        accessorKey: 'rejectReason',
        header: () => h('div', {}, '未通过原因'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('rejectReason')),
    },
    {
        accessorKey: 'bedNumber',
        header: () => h('div', {}, '床位号'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('bedNumber')),
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
                        onClick: () => deleteCheckoutRegistration(row.original)
                    }, '撤销申请')
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
const checkoutTable = useVueTable({
    get data() {
        return ctsStore.getCheckoutList
    },
    columns: checkoutColumns,
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
const changeCheckoutPage = (page: number) => {
    checkoutPages.value.currentPage = page
    loadCheckoutRegistrations()
}
const searchName = ref('')  // 搜索框输入
// 处理重置搜索
const resetCustomers = () => {
    searchName.value = ''
    loadCustomers()
    loadCheckoutRegistrations()
}
const onInput = async (event: Event) => {
    const deLoad = debounce(loadCustomers)
    const deLoad1 = debounce(loadCheckoutRegistrations)
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
        console.log('所有客户数据', res.data.data)
        ctsStore.setAllCustomerList(res.data.data)
    } else {
        console.log('查询失败')
    }
}
const loadCheckoutRegistrations = async () => {
    const res = await axios.post('http://localhost:9000/checkoutRegistration/page', {
        current: checkoutPages.value.currentPage,
        size: checkoutPages.value.pageSize,
        name: searchName.value
    })
    if (res.data.status === 200) {
        ctsStore.setCheckoutList(res.data.data)
        checkoutPages.value.totalCheckout = res.data.total
    } else {
        console.log('查询退住信息失败')
        ctsStore.getCheckoutList.value = []
    }
}
// 配置表单规则
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<CheckoutRegistration>>({
    customerId: [
        {
            required: true,
            message: '请选择客户姓名',
            trigger: 'change'
        }
    ],
    customerName: [
        {
            required: true,
            message: '请选择客户姓名',
            trigger: 'blur',
        },
    ],
    checkoutType: [
        {
            required: true,
            message: '请选择退住类型',
            trigger: 'blur'
        }
    ],
    checkoutDate: [
        {
            required: true,
            message: '请输入退住时间',
            trigger: 'blur'
        }
    ],
    checkoutReason: [
        {
            required: true,
            message: '请输入退住原因',
            trigger: 'blur'
        }
    ],
})
const addCheckoutFormVisible = ref(false)   // 添加退住申请表单可见性
const addCheckoutForm = reactive({ // 暂存审批信息
    customerId: -1,
    customerName: '',
    checkinDate: '',
    checkoutType: '',
    checkoutDate: '',
    checkoutReason: '',
    bedNumber: '',
})
const selectedCustomer = ref(null)  // 已在下拉框选中的客户
const onCustomerChange = (id: number) => {
    const customer = ctsStore.getAllCustomerList.value.find(c => c.customerId === id);
    if (customer) {
        addCheckoutForm.customerName = customer.name
        addCheckoutForm.customerId = customer.customerId
        addCheckoutForm.bedNumber = customer.bedNumber
        addCheckoutForm.checkinDate = customer.checkinDate
        console.log('客户信息：', customer)
    } else {
        addCheckoutForm.customerName = '';
        console.log('未找到客户信息')
    }
}
const submitCheckoutFormVisible = ref(false)  // 确认提交表单可见性
const checkCheckoutForm = () => {   // 检查表单
    ruleFormRef.value?.validate((valid) => {
        if (valid) {
            console.log("表单验证通过");
            submitCheckoutFormVisible.value = true;
        } else {
            console.log("表单验证未通过");
        }
    })
}
const cancelAddCheckoutForm = () => {  // 关闭添加外出申请表单
    ruleFormRef.value?.resetFields()
    addCheckoutFormVisible.value = false
    selectedCustomer.value = null
    clearCheckoutForm()
}
const clearCheckoutForm = () => {  // 清空退住申请表单
    addCheckoutForm.customerId = -1
    addCheckoutForm.customerName = ''
    addCheckoutForm.checkoutType = ''
    addCheckoutForm.checkoutDate = ''
    addCheckoutForm.checkoutReason = ''
    addCheckoutForm.bedNumber = ''
}
const addCheckoutRegistration = async () => {
    const res = await axios.post('http://localhost:9000/checkoutRegistration/add', addCheckoutForm)
    if (res.data.status === 200) {
        ElMessage.success('添加成功')
        submitCheckoutFormVisible.value = false
        addCheckoutFormVisible.value = false
        clearCheckoutForm()
        await loadCheckoutRegistrations()
    } else {
        ElMessage.error('添加失败')
    }
}
// 撤销退住申请
const deleteCheckoutRegistration = async (checkout: CheckoutRegistration) => {
    ElMessageBox.confirm(
        '确定要撤销客户' + checkout.customerName + '的外出申请吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        const res = await axios.post('http://localhost:9000/checkoutRegistration/delete', { id: checkout.id })
        if (res.data.status === 200) {
            ElMessage.success('撤销成功')
            loadCheckoutRegistrations()
        } else {
            ElMessage.error('撤销失败')
        }

    }).catch(() => {
        ElMessage.info('已取消撤销')
    })
}

onMounted(async () => {
    await loadCustomers()
    await loadAllCustomers()
    await loadCheckoutRegistrations()
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
                    <InteractiveHoverButton @click="addCheckoutFormVisible = true" text="添加退住申请">
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
                            <TableRow v-for="headerGroup in checkoutTable.getHeaderGroups()" :key="headerGroup.id">
                                <TableHead v-for="header in headerGroup.headers" :key="header.id">
                                    <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                                        :props="header.getContext()" />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <template v-if="checkoutTable.getRowModel().rows?.length">
                                <template v-for="row in checkoutTable.getRowModel().rows" :key="row.id">
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
                                <TableCell :colspan="checkoutColumns.length" class="h-24 text-center">
                                    暂无审批信息
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div class="flex items-center justify-end space-x-2 py-4">
                    <div class="flex-1 text-sm text-muted-foreground">
                        共
                        {{ checkoutTable.getFilteredRowModel().rows.length }}
                        行
                    </div>
                    <div class="space-x-2">
                        <Button variant="outline" size="sm" :disabled="checkoutPages.currentPage <= 1"
                            @click="changeCheckoutPage(checkoutPages.currentPage - 1)">
                            前一页
                        </Button>
                        <Button variant="outline" size="sm"
                            :disabled="checkoutPages.currentPage * checkoutPages.pageSize >= checkoutPages.totalCheckout"
                            @click="changeCheckoutPage(checkoutPages.currentPage + 1)">
                            后一页
                        </Button>
                    </div>
                </div>
            </div>
        </div>


        <!-- 添加外出申请表单 -->
        <div>
            <el-dialog v-model="addCheckoutFormVisible" title="添加退住申请" width="35%" :append-to-body="true"
                label-position="left" @close="cancelAddCheckoutForm">
                <el-form :model="addCheckoutForm" :rules="rules" ref="ruleFormRef">
                    <el-divider></el-divider>
                    <el-form-item label="选择客户：" prop="customerName">
                        <el-select v-model="selectedCustomer" placeholder="请选择客户" filterable style="width: 100%"
                            @change="onCustomerChange">
                            <el-option v-for="customer in ctsStore.getAllCustomerList.value" :key="customer.customerId"
                                :label="customer.name" :value="customer.customerId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="退住类型：" prop="checkoutType">
                        <el-select v-model="addCheckoutForm.checkoutType" placeholder="请选择退住类型" filterable
                            style="width: 100%">
                            <el-option label="正常退住" :value=0 />
                            <el-option label="死亡退住" :value=1 />
                            <el-option label="保留床位" :value=2 />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="退住时间：" prop="checkoutDate">
                        <el-date-picker v-model="addCheckoutForm.checkoutDate" type="date" placeholder="选择日期和时间"
                            format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                    </el-form-item>
                    <el-form-item label="退住原因：" prop="checkoutReason">
                        <el-input v-model="addCheckoutForm.checkoutReason" type="textarea" />
                    </el-form-item>
                    <el-divider></el-divider>
                    <el-form-item>
                        <div style="width: 100%; text-align: right">
                            <el-button color="black" @click="checkCheckoutForm">提交</el-button>
                            <el-button color="#e8e8e8" @click="cancelAddCheckoutForm">取消</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-dialog>

            <el-dialog v-model="submitCheckoutFormVisible" title="提示" width="500" top="40vh">
                <span>确定提交该退住申请吗？</span>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="submitCheckoutFormVisible = false">取消</el-button>
                        <el-button color="black" @click="addCheckoutRegistration">
                            提交
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<style lang="css" scoped></style>