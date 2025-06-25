<!-- 系统管理员端 客户管理 外出登记 -->
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
import { computed, h, onMounted, reactive, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
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
import type { CheckoutRegistration, Customer, OutingRegistration } from './type'
import { usecustomerManagementStore } from '@/lib/store'
import dayjs from 'dayjs'

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
const outingTable = useVueTable({  // 退住信息表
    get data() {
        return ctmStore.getOutingList
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
// 获取分页客户数据
const loadCustomers = async () => {
    axios.post('http://localhost:9000/customer/pageAll', {
        current: customerPages.value.currentPage,
        size: customerPages.value.pageSize,
    }).then((res) => {
        if (res.data.status === 200) {
            ctmStore.setNewList(res.data.data)
            customerPages.value.totalCustomer = res.data.total
            updateCustomerTable(ctmStore.getCustomerList.value)
        } else {
            ctmStore.getCustomerList.value = []
        }
    })
    // searchName.value = ''
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
            ctmStore.setOutingList(res.data.data)
            outingPages.value.totalOuting = res.data.total
            updateOutingTable(ctmStore.getOutingList.value)
        } else {
            ctmStore.getOutingList.value = []
        }
    })
    //searchName.value = ''
}
// 更新客户信息列表
const updateCustomerTable = (rows: any[]) => {
    customerTable.setOptions(prev => ({
        ...prev,
        data: rows
    }))
}
// 更新外出审批列表
const updateOutingTable = (rows: any[]) => {
    outingTable.setOptions(prev => ({
        ...prev,
        data: rows
    }))
}

const outingApprovalVisible = ref(false)  //外出审批表单可见性
const approvalForm = reactive<OutingRegistration>({ // 暂存审批信息
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
const openApprovalForm = (outing: OutingRegistration) => {  // 打开审批界面
    Object.assign(approvalForm, outing)
    outingApprovalVisible.value = true
}
const cancelApprove = () => {   // 取消审批
    outingApprovalVisible.value = false
    approvalForm.id = -1
    approvalForm.customerName = ''
    approvalForm.outingReason = ''
    approvalForm.outingDate = ''
    approvalForm.expectedReturnDate = ''
    approvalForm.escortName = ''
    approvalForm.escortRelation = ''
    approvalForm.escortPhone = ''
    approvalForm.reviewStatus = -1
    approvalForm.rejectReason = ''
}
// 配置表单规则
const ruleFormRef = ref<FormInstance>()
const isPassed = ref(false)
const rules = reactive<FormRules<OutingRegistration>>({
    reviewStatus:[
        {
            required: true,
            message: '请选择是否通过审批',
            trigger: 'change',
        },
    ],
    rejectReason: [],
})


const submitApprovalVisible = ref(false)  // 确认提交审批结果表单的可见性
const updateApproval = () => {  // 提交审批
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss')  // 获取当前审批时间
    approvalForm.reviewTime = currentTime
    if(isPassed){approvalForm.rejectReason = ''}
    axios.post('http://localhost:9000/outingRegistration/update', approvalForm).then((res) => {
        if (res.data.status === 200) {
            console.log('提交审批成功')
            loadOutingRegistrations()
        } else {
            console.log('提交审批失败')
        }
    })
    submitApprovalVisible.value = false
    cancelApprove()
}
const checkUpdateForm = () =>{
    ruleFormRef.value?.validate((valid) => {
    if (valid) {
      console.log("表单验证通过");
      submitApprovalVisible.value = true;
    } else {
      console.log("表单验证未通过");
    }
  })
  console.log("表单验证");
}

watch(() => approvalForm.reviewStatus, (newVal) =>{
    console.log("审批类型", approvalForm.reviewStatus)
    if(approvalForm.reviewStatus === 1){
        isPassed.value = false
        rules.rejectReason = [
        {
          required: true,
          message: '请填写拒绝原因',
          trigger: 'blur',
        },
      ]
    }else if(approvalForm.reviewStatus === 2){
        isPassed.value = true
        rules.rejectReason = []
    }
})

onMounted(() => {
    loadCustomers()
    loadOutingRegistrations()
})

</script>

<template>
    <div class="w-full flex gap-4 flex-row items-start">
        <!-- 左侧：客户信息列表 -->
        <div class="w-1/4">
            <div class="flex items-center py-4">
                <Input class="max-w-sm" placeholder="客户姓名" @update:model-value="val => {
                    customerTable.getColumn('name')?.setFilterValue(val)
                    outingTable.getColumn('customerName')?.setFilterValue(val)
                }" />
            </div>

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
            <!-- 占位搜索框（invisible 保持布局但不显示） -->
            <div class="flex items-center py-4 invisible">
                <Input class="max-w-sm" placeholder="占位"
                    :model-value="outingTable.getColumn('customerName')?.getFilterValue() as string"
                    @update:model-value=" outingTable.getColumn('customerName')?.setFilterValue($event)" />
            </div>
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
    <!-- 审批退住申请表单 -->
    <div>
        <el-dialog v-model="outingApprovalVisible" title="审批外出申请" width="30%" :append-to-body="true"
            label-position="left" @close="cancelApprove">
            <el-form :model="approvalForm" :rules="rules" ref="ruleFormRef">
                <!-- 分隔符 -->
                <el-divider></el-divider>

                <el-form-item label="客户姓名：" prop="customerName">
                    <el-input v-model="approvalForm.customerName" disabled />
                </el-form-item>
                <el-form-item label="外出事由：" prop="outingReason">
                    <el-input v-model="approvalForm.outingReason" type="textarea" disabled />
                </el-form-item>
                <el-form-item label="外出时间：" prop="outingDate">
                    <el-col :span="11">
                        <el-date-picker v-model="approvalForm.outingDate" type="date" placeholder=""
                            style="width: 100%" disabled />
                    </el-col>
                </el-form-item>
                <el-form-item label="预计回院时间：" prop="expectedReturnDate">
                    <el-col :span="11">
                        <el-date-picker v-model="approvalForm.expectedReturnDate" type="date" placeholder=""
                            style="width: 100%" disabled />
                    </el-col>
                </el-form-item>
                <el-form-item label="陪同人：" prop="escortName">
                    <el-input v-model="approvalForm.escortName" disabled />
                </el-form-item>
                <el-form-item label="与老人关系：" prop="escortRelation">
                    <el-input v-model="approvalForm.escortRelation" disabled />
                </el-form-item>
                <el-form-item label="陪同人电话：" prop="escortPhone">
                    <el-input v-model="approvalForm.escortPhone" disabled />
                </el-form-item>

                <el-form-item label="是否通过该申请：" prop="reviewStatus">
                    <el-radio-group v-model="approvalForm.reviewStatus">
                        <el-radio :value='2'>通过</el-radio>
                        <el-radio :value='1'>不通过</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="不予通过的原因：" prop="rejectReason">
                    <el-input v-model="approvalForm.rejectReason" type="textarea" :disabled="isPassed"/>
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

        <el-dialog v-model="submitApprovalVisible" title="提示" width="500" top="40vh">
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