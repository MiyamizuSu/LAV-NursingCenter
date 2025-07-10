<!-- 系统管理员端 用户管理 基础信息维护 -->
<script setup lang="ts">
import type {
    ColumnDef,
    ColumnFiltersState,
    ExpandedState,
    Row,
    SortingState,
    VisibilityState,
} from '@tanstack/vue-table'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import {
    FlexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from '@tanstack/vue-table'
import { h, onMounted, ref } from 'vue'
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
import { axiosInstance } from '@/lib/core'
import { useUserManagementStore } from '@/lib/store'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'
import type { User } from '@/lib/type'
import { motion } from 'motion-v'
import { Checkbox } from '@/components/ui/checkbox'
import DynamicButton from '@/components/custom/DynamicButton.vue'
import { DialogPortal, DialogRoot } from 'reka-ui'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Form, useForm } from 'vee-validate'
import { FormField, FormMessage } from '@/components/ui/form'
import FormItem from '@/components/ui/form/FormItem.vue'
import FormLabel from '@/components/ui/form/FormLabel.vue'
import FormControl from '@/components/ui/form/FormControl.vue'
import IInput from '@/components/ui/insput/IInput.vue'
import RadioGroup from '@/components/ui/radio-group/RadioGroup.vue'
import RadioGroupItem from '@/components/ui/radio-group/RadioGroupItem.vue'
import Label from '@/components/ui/label/Label.vue'
import { toast } from 'vue-sonner'
import Popover from '@/components/ui/popover/Popover.vue'
import PopoverTrigger from '@/components/ui/popover/PopoverTrigger.vue'
import PopoverContent from '@/components/ui/popover/PopoverContent.vue'
import type { AxiosResponse } from 'axios'


const searchName = ref('')   // 搜索框输入
const curUser = ref<User>({
    userId: NaN,
    account: '',
    name: '',
    phoneNumber: '',
    gender: 0,
    email: '',
    userType: 0
})

const userMessageSchema = toTypedSchema(z.object({
    account: z.string().min(1, "请输入用户名"),
    name: z.string().min(1, "请输入用户真实姓名"),
    phoneNumber: z.string().length(11, '请输入正确的手机号'),
    gender: z.number(),
    email: z.string().email('请输入正确的邮箱地址')
}))

const { isFieldDirty } = useForm({
    validationSchema: userMessageSchema
})
const updateDialogOpen = ref<boolean>(false);
const dialogUsingMode = ref<'add' | 'update'>('add')
const defaultUser: User = {
    userId: NaN,
    account: '',
    name: '',
    phoneNumber: '',
    gender: 1,
    email: '',
    userType: 1
}
const handleUpdateDialogOpen = (row?: Row<User>) => {
    if (row !== undefined) {
        dialogUsingMode.value = 'update'
        updateDialogOpen.value = true
        curUser.value = row?.original as User;
    }
    else {
        dialogUsingMode.value = 'add'
        updateDialogOpen.value = true
        curUser.value = defaultUser
    }

}
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
                    DynamicButton,
                    {
                        onclick: () => handleUpdateDialogOpen(row)
                    },
                    '修改'
                ),
                h(
                    Popover,
                    {

                    },
                    [
                        h(
                            PopoverTrigger,
                            {

                            },
                            [
                                h(
                                    DynamicButton,
                                    {

                                    },
                                    '删除'
                                )
                            ]
                        ),
                        h(
                            PopoverContent,
                            {
                                class: "flex flex-row gap-4 items-center"
                            },
                            [
                                '请确认是否删除',
                                h(
                                    DynamicButton,
                                    {
                                        onclick: () => handleRemoveUser(row.original.userId)
                                    },
                                    '确认'
                                )
                            ]
                        )
                    ]

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

// 重置搜索框
function resetUsers() {
    searchName.value = ''
    loadUsers()
}
async function onInput(event: Event) {
    const deLoad = debounce(loadUsers)
    deLoad()
}
// 获取分页用户数据
async function loadUsers() {
    const res = await axiosInstance.post('/user/page', {
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
async function handleRemoveUser(userId: number) {
    const { promise, resolve, reject } = Promise.withResolvers<undefined>();
    toast.promise(promise, {
        loading: '删除中...',
        success: () => '删除成功',
        error: (reason: string) => reason
    })
    const res = await axiosInstance.post('/user/delete', {
        userId: userId
    })
    if (res.data.status !== 200) {
        reject(res.data.msg)
    }
    else {
        resolve(undefined);
    }
}
async function handleUpdateSubmit(userValue: User) {
    const { promise, resolve, reject } = Promise.withResolvers<undefined>();
    if (dialogUsingMode.value === 'update') {
        userValue.userId = curUser.value.userId;
        toast.promise(promise, {
            loading: '修改中...',
            success: () => "修改成功",
            error: "修改失败,请联系管理员"
        })
        const res = await axiosInstance.post('/user/update', userValue)
        if (res.status !== 200) {
            reject()
        }
        else {
            resolve(undefined)
        }
    }
    else {
        toast.promise(promise, {
            loading: '添加中...',
            success: () => "添加成功",
            error: "添加失败,请联系管理员"
        })
        const res = await axiosInstance.post('/user/add', userValue)
        if (res.data.status !== 200) {
            reject()
        }
        else {
            resolve(undefined);
        }
    }
    updateDialogOpen.value = false
    await loadUsers()
}
async function handleBatchDelete() {
    const { promise, resolve, reject } = Promise.withResolvers<undefined>();
    const deleteTasks: Promise<AxiosResponse>[] = [];
    if (userTable.getSelectedRowModel().rows.length === 0) {
        toast.warning('你还未选择任何一项');
        return;
    }
    toast.promise(promise, {
        loading: () => '批量删除执行中',
        success: '批量删除完成',
        error: (reason: string) => reason
    })
    userTable.getSelectedRowModel().rows.forEach((row) => {
        deleteTasks.push(axiosInstance.post("/user/delete", {
            userId: row.original.userId
        }))
    })
    try {
        const res = await Promise.all(deleteTasks)
        if (res.every(item => item.data.status === 200)) {
            resolve(undefined)
        }
        else {
            reject('批量删除失败')
        }
    }
    catch (e) {
        reject('批量删除失败')
    }
    await loadUsers();
}
async function handleAddNewUser() {
    handleUpdateDialogOpen()

}
onMounted(async function () {
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
                    <InteractiveHoverButton @click="handleAddNewUser" text="添加" text-before-color="#71C9CE"
                        text-after-color="#CBF1F5" before-color="#CBF1F5" after-color="#71C9CE">
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
                    <InteractiveHoverButton @click="handleBatchDelete" text="批量删除" text-before-color="#FF4F0F"
                        text-after-color="#FFE3BB" before-color="#FFE3BB" after-color="#FF4F0F">
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
        <DialogRoot v-model:open="updateDialogOpen">
            <DialogPortal>
                <DialogContent>
                    <DialogTitle>
                        修改用户信息
                    </DialogTitle>
                    <Form @submit="(values: any) => handleUpdateSubmit(values)" :initial-values="curUser"
                        :validation-schema="userMessageSchema">
                        <div class="flex flex-col  gap-6">
                            <div>
                                <FormField v-slot="{ componentField }" name="account" :validate-on-blur="!isFieldDirty">
                                    <FormItem v-auto-animate>
                                        <FormLabel>
                                            用户名
                                        </FormLabel>
                                        <FormControl>
                                            <IInput v-bind="componentField">
                                                {{ componentField }}
                                            </IInput>
                                        </FormControl>
                                    </FormItem>
                                    <FormMessage />
                                </FormField>
                            </div>
                            <div>
                                <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
                                    <FormItem v-auto-animate>
                                        <FormLabel>
                                            真实姓名
                                        </FormLabel>
                                        <FormControl v-bind="componentField">
                                            <IInput>
                                                {{ componentField }}
                                            </IInput>
                                        </FormControl>
                                    </FormItem>
                                    <FormMessage />
                                </FormField>
                            </div>
                            <div>
                                <FormField v-slot="{ componentField }" name="phoneNumber"
                                    :validate-on-blur="!isFieldDirty">
                                    <FormItem v-auto-animate>
                                        <FormLabel>
                                            电话号码
                                        </FormLabel>
                                        <FormControl v-bind="componentField">
                                            <IInput>
                                                {{ componentField }}
                                            </IInput>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>
                            </div>
                            <div>
                                <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
                                    <FormItem v-auto-animate>
                                        <FormLabel>
                                            邮箱地址
                                        </FormLabel>
                                        <FormControl v-bind="componentField">
                                            <IInput>
                                                {{ componentField }}
                                            </IInput>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>
                            </div>
                            <div>
                                <FormField name="gender" type="radio" v-slot="{ componentField }"
                                    :validate-on-blur="!isFieldDirty">
                                    <FormItem v-auto-animate>
                                        <FormLabel>
                                            用户性别
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup :default-value="curUser.gender" v-bind="componentField">
                                                <div class="flex flex-row gap-9">
                                                    <div class="flex flex-row">
                                                        <RadioGroupItem id="man" :value="1"></RadioGroupItem>
                                                        <Label for="man">男</Label>
                                                    </div>
                                                    <div class="flex flex-row">
                                                        <RadioGroupItem id="woman" :value="0"></RadioGroupItem>
                                                        <Label for="woman">女</Label>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>
                            </div>
                            <div>
                                <FormField name="userType" type="radio" v-slot="{ componentField }"
                                    :validate-on-blur="!isFieldDirty">
                                    <FormItem v-auto-animate>
                                        <FormLabel>
                                            员工类型
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup :default-value="curUser.userType" v-bind="componentField">
                                                <div class="flex flex-row gap-6">
                                                    <div class="flex flex-row">
                                                        <RadioGroupItem id="nurse" :value="1"></RadioGroupItem>
                                                        <Label for="nurse">护工</Label>
                                                    </div>
                                                    <div class="flex flex-row">
                                                        <RadioGroupItem id="admin" :value="0"></RadioGroupItem>
                                                        <Label for="admin">管理员</Label>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>
                            </div>
                            <div class="flex flex-row justify-end">
                                <DynamicButton type="submit">
                                    提交
                                </DynamicButton>
                            </div>

                        </div>

                    </Form>
                </DialogContent>
            </DialogPortal>
        </DialogRoot>
    </div>





</template>

<style lang="css" scoped></style>