<!-- 系统管理员端 客户管理 退住登记 -->
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
import { computed, h, onMounted, reactive, ref, watch } from 'vue'
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
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { CheckoutRegistration, Customer } from './type'
import { usecustomerManagementStore } from '@/lib/store'
import dayjs from 'dayjs'
import { debounce } from '@/lib/utils'


const searchName = ref('')
const customerPages = ref({
    currentPage: 1,
    pageSize: 10,
    totalCustomer: 0
})
const checkoutPages = ref({
    currentPage: 1,
    pageSize: 10,
    totalCheckout: 0
})
const ctmStore = usecustomerManagementStore()

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
        }
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
            var displayCheckoutType = ''
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
        accessorKey: 'bedNumber',
        header: () => h('div', {}, '床号'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('bedNumber')),
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
                            onClick: () => openApprovalForm(row.original),
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
        return ctmStore.getCustomerList.value
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
const checkoutTable = useVueTable({  // 退住信息表
    get data() {
        return ctmStore.getCheckoutList.value
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
        ctmStore.setNewList(res.data.data)
        customerPages.value.totalCustomer = res.data.total
    } else {
        ctmStore.getCustomerList.value = []
    }
}
// 获取分页退住审批数据
const loadCheckoutRegistrations = async () => {
    const res = await axios.post('http://localhost:9000/checkoutRegistration/page', {
        current: checkoutPages.value.currentPage,
        size: checkoutPages.value.pageSize,
        name: searchName.value
    })

    if (res.data.status === 200) {
        ctmStore.setCheckoutList(res.data.data)
        checkoutPages.value.totalCheckout = res.data.total
        // ctmStore.getCheckoutList.value = res.data.data.map((item: any) => ({
        //     ...item,
        //     checkinDate: '',  // 补字段
        //     bedNumber: ''
        // }))
        
        // ctmStore.getCheckoutList.value.forEach(checkout => {
        //     const customer = ctmStore.getCustomerList.value.find(c => c.customerId === checkout.customerId)
        //     console.log("要找的客户信息", customer)
        //     if (customer) {
        //         checkout.checkinDate = customer.checkinDate
        //         checkout.bedNumber = customer.bedNumber
        //     }
        // })
    } else {
        ctmStore.getCheckoutList.value = []
    }
}

const formRef = ref<FormInstance>()
const isPassed = ref(false)
const rules: FormRules = {
    reviewStatus: [
        { required: true, message: '请选择审批结果', trigger: 'blur' }
    ],
    rejectReason: [
        {
            validator: (rule, value, callback) => {
                if (approvalForm.reviewStatus === '1' && !value) {
                    callback(new Error('请填写拒绝原因'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}
// 配置表单校验规则
const checkOutApprovalVisible = ref(false) // 退住审批表单可见性
const approvalForm = reactive({ // 暂存审批信息
    id: '',
    customerName: '',
    checkoutType: '',
    checkoutDate: '',
    checkoutReason: '',
    reviewStatus: '',
    rejectReason: '',
    reviewTime: ''
})
const openApprovalForm = (checkout: CheckoutRegistration) => {  // 打开审批界面
    Object.assign(approvalForm, checkout)
    checkOutApprovalVisible.value = true
}
const cancelApprove = () => {   // 取消审批
    checkOutApprovalVisible.value = false
    approvalForm.id = ''
    approvalForm.customerName = ''
    approvalForm.checkoutType = ''
    approvalForm.checkoutDate = ''
    approvalForm.checkoutReason = ''
    approvalForm.reviewStatus = ''
    approvalForm.rejectReason = ''
    approvalForm.reviewTime = ''
}

// 检查用户输入
const checkUpdateForm = () => {
    formRef.value?.validate((valid: boolean) => {
        if (valid) {
            console.log('校验通过，提交数据', approvalForm)
            submitApprovalVisible.value = true
        } else {
            console.warn('校验失败')
        }
    })
}
const checkoutTypeLabel = computed(() => {
    switch (Number(approvalForm.checkoutType)) {
        case 0:
            return '正常退住'
        case 1:
            return '死亡退住'
        case 2:
            return '保留床位'
        default:
            return '未知'
    }
})

const submitApprovalVisible = ref(false)  // 确认提交审批结果表单的可见性
const updateApproval = async () => {  // 提交审批
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss')  // 获取当前审批时间
    approvalForm.reviewTime = currentTime
    const res = await axios.post('http://localhost:9000/checkoutRegistration/update', approvalForm)
    if (res.data.status === 200) {
        ElMessage.success('提交审批成功')
        submitApprovalVisible.value = false
        cancelApprove()
        await loadCheckoutRegistrations()
    } else {
        ElMessage.error('提交审批失败')
    }
}

watch(() => approvalForm.reviewStatus, (newVal: string) => {
    if (newVal === '1') {
        isPassed.value = false
    } else if (newVal === '2') {
        isPassed.value = true
    }
})

onMounted(async () => {
    await loadCustomers() // 加载客户数据
    await loadCheckoutRegistrations() // 加载退住申请数据
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
            </div>
        </div>
        <div class="flex gap-4 flex-row items-start w-full">
            <!-- 左侧：客户信息列表 -->
            <div class="w-1/3">
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
            <!-- 右侧：退住审批表格 -->
            <div class="w-2/3 pr-6">
                <div class="text-white px-4 py-2 font-semibold rounded-t-md" style="background-color: #409EFF;">
                    退住申请审批
                </div>
                <div class="rounded-b-md border">
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
    </div>

    <!-- 审批退住申请表单 -->
    <div>
        <el-dialog v-model="checkOutApprovalVisible" title="审批退住申请" width="30%" :append-to-body="true"
            label-position="left" @close="cancelApprove">
            <el-form :model="approvalForm" :rules="rules" ref="formRef">
                <!-- 分隔符 -->
                <el-divider></el-divider>

                <el-form-item label="客户姓名：" prop="customerName">
                    <el-input v-model="approvalForm.customerName" disabled />
                </el-form-item>
                <el-form-item label="退住类型：" prop="checkoutType">
                    <el-input v-model="checkoutTypeLabel" disabled />
                </el-form-item>
                <el-form-item label="退住时间：" prop="checkoutDate">
                    <el-col :span="11">
                        <el-date-picker v-model="approvalForm.checkoutDate" type="date" placeholder=""
                            style="width: 100%" disabled />
                    </el-col>
                </el-form-item>
                <el-form-item label="退住原因：" prop="checkoutReason">
                    <el-input v-model="approvalForm.checkoutReason" type="textarea" disabled />
                </el-form-item>

                <el-form-item label="是否通过该申请：" prop="reviewStatus">
                    <el-radio-group v-model="approvalForm.reviewStatus">
                        <el-radio value='2'>通过</el-radio>
                        <el-radio value='1'>不通过</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="不予通过的原因：" prop="rejectReason">
                    <el-input v-model="approvalForm.rejectReason" type="textarea" :disabled="isPassed" />
                </el-form-item>
                <!-- 分隔符 -->
                <el-divider></el-divider>
                <el-form-item>
                    <div style="width: 100%; text-align: right">
                        <el-button type="primary" @click="checkUpdateForm">提交审批</el-button>
                        <el-button @click="cancelApprove">取消</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog v-model="submitApprovalVisible" title="提示" width="500" top="40vh" :z-index="3000" append-to-body>
            <span>确定提交对该客户退住申请的审批吗？</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="submitApprovalVisible = false">取消</el-button>
                    <el-button type="primary" @click="updateApproval">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>




</template>
<style lang="css" scoped></style>