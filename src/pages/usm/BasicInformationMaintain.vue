<!-- 系统管理员端 用户管理 基础信息维护 -->
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
import { axiosInstance as axios } from '@/lib/core'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { useCustomerNurseStore, useUserManagementStore } from '@/lib/store'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'
import type { User } from '@/lib/type'
import { motion } from 'motion-v'
import { Checkbox } from '@/components/ui/checkbox'

const usmStore = useUserManagementStore()
const userPages = ref({
    currentPage: 1,
    pageSize: 10,
    totalUser: 0,
})
const userColumns: ColumnDef<User>[] = [
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
            const pageSize = userPages.value.pageSize
            const currentPage = userPages.value.currentPage
            return h('div', {}, row.index + 1 + (currentPage - 1) * pageSize)
        }
    },
    {
        accessorKey: 'name',
        header: () => h('div', {}, '姓名'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
    },
    {
        accessorKey: 'phoneNumber',
        header: () => h('div', {}, '电话'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('phoneNumber')),
    },
    {
        accessorKey: 'gender',
        header: () => h('div', {}, '性别'),
        cell: ({ row }) => {
            const genderValue = row.getValue('gender')
            const displayGender = genderValue === 1 ? '男' : genderValue === 0 ? '女' : '未知'
            return h('div', { class: 'capitalize' }, displayGender)
        },
    },
    {
        accessorKey: 'email',
        header: () => h('div', {}, '邮箱'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('email')),
    },
    {
        accessorKey: 'userType',
        header: () => h('div', {}, '员工类型'),
        cell: ({ row }) => {
            const userTypeValue = row.getValue('userType')
            const displayUserType = userTypeValue === 1 ? '护工' : '未知'
            return h('div', { class: 'capitalize' }, displayUserType)
        },
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
                        // onClick: () => openUpdateForm(row.original),
                    },
                    '修改'
                ),
                h(
                    'button',
                    {
                        class: 'px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition',
                        // onClick: () => openDeleteForm(row.original),
                    },
                    '移除'
                ),
            ]),
    },
]
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})
const userTable = useVueTable({  // 客户信息表
    get data() {
        return usmStore.getUserList
    },
    columns: userColumns,
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
// 用户信息列表页码改变时
const changeUserPage = (page: number) => {
    userPages.value.currentPage = page
    loadUsers()
}
const searchName = ref('')   // 搜索框输入
// 重置搜索框
const resetUsers = () => {
    searchName.value = ''
    loadUsers()
}
const onInput = async (event: Event) => {
    const deLoad = debounce(loadUsers)
    deLoad()
}
// 获取分页用户数据
const loadUsers = async () => {
    const res = await axios.post('/user/page', {
        current: userPages.value.currentPage,
        size: userPages.value.pageSize,
        name: searchName.value,
        userType: 1
    })
    if (res.data.status === 200) {
        usmStore.setUserList(res.data.data)
        userPages.value.totalUser = res.data.total
    } else {
        usmStore.setUserList([])
    }
}



onMounted(async () => {
    await loadUsers()
})
</script>

<template>
    <!-- 用户信息列表 -->
    <div class="w-full pr-10">
        <div class="flex gap-2 items-center py-4 justify-between">
            <div class="flex items-center gap-2">
                <div>
                    <Input class="max-w-sm" placeholder="用户姓名" v-model="searchName" @input="onInput" />
                </div>
                <div>
                    <motion.div :whilePress="{ scale: 0.9, rotate: 3 }">
                        <InteractiveHoverButton @click="resetUsers" text="重置" text-before-color="#95e1d3"
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
                    </motion.div>
                </div>
            </div>
            <div class="ml-auto">
                <motion.div :whilePress="{ scale: 0.9, rotate: 3 }">
                    <InteractiveHoverButton @click="" text="添加" text-before-color="#71C9CE" text-after-color="#CBF1F5"
                        before-color="#CBF1F5" after-color="#71C9CE">
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
                </motion.div>
            </div>
        </div>

        <div class="mb-5 flex items-center gap-4">
            <div class="ml-auto">
                <motion.div :whilePress="{ scale: 0.9, rotate: 3 }">
                    <InteractiveHoverButton @click="" text="批量删除" text-before-color="#FF4F0F" text-after-color="#FFE3BB"
                        before-color="#FFE3BB" after-color="#FF4F0F">
                        <template #svgIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2">
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                        </template>
                    </InteractiveHoverButton>
                </motion.div>
            </div>
        </div>

        <div class="text-white px-4 py-2 font-semibold rounded-t-md" style="background-color: #409EFF;">
            用户信息
        </div>
        <div class="rounded-b-md border">
            <Table class="bg-white rounded-b-md dark:bg-slate-800">
                <TableHeader>
                    <TableRow v-for="headerGroup in userTable.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id"
                            :data-pinned="header.column.getIsPinned()" :class="cn(
                                { 'sticky bg-background/95': header.column.getIsPinned() },
                                header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                            )">
                            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                                :props="header.getContext()" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="userTable.getRowModel().rows?.length">
                        <template v-for="row in userTable.getRowModel().rows" :key="row.id">
                            <TableRow :data-state="row.getIsSelected() && 'selected'">
                                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id"
                                    :data-pinned="cell.column.getIsPinned()" :class="cn(
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
                        <TableCell :colspan="userColumns.length" class="h-24 text-center">
                            查无此人
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <div class="flex items-center justify-end space-x-2 py-4">
            <div class="flex-1 text-sm text-muted-foreground">
                共
                {{ userTable.getFilteredRowModel().rows.length }}
                行，已选中
                {{ userTable.getFilteredSelectedRowModel().rows.length }}
                行
            </div>
            <div class="space-x-2">
                <Button variant="outline" size="sm" :disabled="userPages.currentPage <= 1"
                    @click="changeUserPage(userPages.currentPage - 1)">
                    前一页
                </Button>
                <Button variant="outline" size="sm"
                    :disabled="userPages.currentPage * userPages.pageSize >= userPages.totalUser"
                    @click="changeUserPage(userPages.currentPage + 1)">
                    后一页
                </Button>
            </div>
        </div>
    </div>





</template>

<style lang="css" scoped></style>