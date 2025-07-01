<!-- 系统管理员端 床位管理 床位管理 -->
<script setup lang="ts">
import type {
    ColumnDef,
    ColumnFiltersState,
    ExpandedState,
    Row,
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
import { h, onMounted, reactive, ref } from 'vue'
import {
    DialogContent,
    DialogTitle} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useBedManagementStore } from '@/lib/store'
import type { BedUser } from '@/lib/type'
import { valueUpdater } from '@/components/ui/table/utils'
import { axiosInstance as axios } from '@/lib/core';
import { cn } from '@/lib/utils'
import Switcher from '@/components/custom/Switcher.vue';
import DynamicButton from '@/components/custom/DynamicButton.vue';
import { DialogPortal, DialogRoot, type DateValue } from 'reka-ui';
import { FormField, Form } from '@/components/ui/form';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormLabel from '@/components/ui/form/FormLabel.vue';
import FormControl from '@/components/ui/form/FormControl.vue';
import Label from '@/components/ui/label/Label.vue';
import IInput from '@/components/ui/insput/IInput.vue';
import Calendar from '@/components/ui/calendar/Calendar.vue';
import { PopoverTrigger, Popover } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-vue-next';
import PopoverContent from '@/components/ui/popover/PopoverContent.vue';
import type { BedChangeRequestBody, UpdateNeedMessage } from './type';
const bdmStore = useBedManagementStore();
const diglogOpen = ref<boolean>(false)
const changeDialogOpen = ref<boolean>(false)
const curCustomer = ref<BedUser>();
const bedChangeRequest = reactive<BedChangeRequestBody>({
    endDate: '',
    customerId: -1
})
function handleCalendarValueChange(v: DateValue | undefined) {
    bedChangeRequest.endDate = v?.toString() ?? ''
}
function openDialog(row: Row<BedUser>) {
    diglogOpen.value = true
    curCustomer.value = row.original
}
function openChangeDialog(row: Row<BedUser>) {
    changeDialogOpen.value = true;
    curCustomer.value = row.original;
    bedChangeRequest.endDate = curCustomer.value.endUsedTime
}
async function xhrBedMessage() {
    const res = (await axios.post('/bedUsageRecord/listAll')).data
    return res.data as any[]
}
function responseAdaptor(adapted: BedUser[], sources: any[]) {
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        const b: BedUser = {
            Id: i + 1,
            Name: source.customerName,
            gender: source.customerGender ? '男' : '女',
            bedMes: source.bedNumber,
            startUsedTime: source.startDate,
            endUsedTime: source.endDate || '没有结束',
            customerId: source.cutsomerId,
        }
        adapted[i] = b;
    }
}

onMounted(async () => {
    const bedData = [] as BedUser[]
    responseAdaptor(bedData, await xhrBedMessage())
    bdmStore.setUsingBeds(bedData);
    console.log(bedData)
})



const columns: ColumnDef<BedUser>[] = [
    {
        id: 'userID',
        accessorKey: 'Id',
        header: '序号',
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('userID')),
    },
    {
        id: 'userName',
        accessorKey: 'Name',
        header: '客户姓名',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('userName')),
    }, {
        id: 'userGender',
        accessorKey: 'gender',
        header: '性别',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('userGender'))
    },
    {
        id: 'bedMes',
        accessorKey: 'bedMes',
        header: '床位详情',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('bedMes')),

    },
    {
        id: 'startUsedTime',
        accessorKey: 'startUsedTime',
        header: '床位使用起始时间',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('startUsedTime'))
    },
    {
        id: 'endUsedTime',
        accessorKey: 'endUsedTime',
        header: '床位使用结束时间',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('endUsedTime'))
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => h('div', { class: 'flex-row flex ' }, [
            h(DynamicButton, {
                class: '',
                onclick: () => openDialog(row)
            }, '床位调换'
            ),
            h(DynamicButton, {
                class: '',
                onclick: () => openChangeDialog(row)
            },
                '修改'
            )
        ]
        )
    }
]
function onSubmit(values: UpdateNeedMessage) {

}
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})
const datatable = useVueTable({
    get data() {
        return bdmStore.getUsingBeds
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
</script>

<template>
    <div class="flex flex-col w-full gap-2">
        <div class="flex">
            <Switcher>

            </Switcher>
        </div>
        <div class="flex w-full">
            <Table>
                <TableHeader>
                    <TableRow v-for="headerGroup in datatable.getHeaderGroups()" :id="headerGroup.id">
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
                    <template v-if="datatable.getRowModel().rows?.length">
                        <template v-for="row in datatable.getRowModel().rows" :key="row.id">
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
                        <TableCell :colspan="columns.length" class="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
        <DialogRoot v-model:open="diglogOpen" !default-open>
            <DialogPortal>
                <DialogContent>
                    <DialogTitle>
                        床位调换
                    </DialogTitle>
                    <div>
                        <Form @submit="(values: any) => onSubmit(values)" v-slot="{ values }">
                            <div class="flex flex-col ">
                                <div class="flex flex-col">
                                    <div class="flex flex-row justify-between">
                                        <div class="flex flex-row ">
                                            <div class="flex flex-col leading-20">
                                                <div class="flex flex-row gap-4">
                                                    <p> 客户姓名:</p>
                                                    <Label>
                                                        {{ curCustomer?.Name }}
                                                    </Label>
                                                </div>
                                                <div class="flex flex-row gap-4">
                                                    <p>性别:</p>
                                                    <Label>
                                                        {{ curCustomer?.gender }}
                                                    </Label>
                                                </div>
                                                <div class="flex flex-row gap-4">
                                                    <p>旧床位详情:</p>
                                                    <Label>
                                                        {{ curCustomer?.bedMes }}
                                                    </Label>
                                                </div>
                                            </div>

                                        </div>
                                        <div>
                                            <FormField v-slot="{ componentField }" name="nRoom">
                                                <FormItem>
                                                    <FormLabel>
                                                        新房号
                                                    </FormLabel>
                                                    <FormControl>
                                                        <IInput v-bind="componentField"></IInput>
                                                    </FormControl>
                                                </FormItem>
                                            </FormField>
                                            <FormField v-slot="{ componentField }" name="nBed">
                                                <FormItem>
                                                    <FormLabel>
                                                        新床号
                                                    </FormLabel>
                                                    <FormControl>
                                                        <IInput v-bind="componentField"></IInput>
                                                    </FormControl>
                                                </FormItem>
                                            </FormField>
                                        </div>
                                    </div>
                                    <div class=" flex flex-col leading-10">
                                        <FormField v-slot="{ componentField }" name="startDate">
                                            <FormItem>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger>
                                                            <div class="flex flex-row items-center justify-between">
                                                                <div class="flex flex-row items-center gap-3">
                                                                    <CalendarIcon class="h-4 w-4 opacity-50">
                                                                    </CalendarIcon>
                                                                    <div>新床位使用开始日期</div>
                                                                </div>
                                                                <div>
                                                                    <span>{{ `${componentField.modelValue ?? ''}`
                                                                    }}</span>
                                                                </div>
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <Calendar v-bind="componentField" :weekday-format="'short'">
                                                            </Calendar>
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                            </FormItem>
                                        </FormField>
                                        <FormField v-slot="{ componentField }" name="endDate">
                                            <FormItem>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger>
                                                            <div class="flex flex-row items-center justify-between">
                                                                <div class="flex flex-row items-center gap-3">
                                                                    <CalendarIcon class="h-4 w-4 opacity-50">
                                                                    </CalendarIcon>
                                                                    <div>新床位使用结束日期</div>
                                                                </div>
                                                                <div>
                                                                    <span>{{ `${componentField.modelValue ?? ''}`
                                                                    }}</span>
                                                                </div>
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <Calendar v-bind="componentField" :weekday-format="'short'">
                                                            </Calendar>
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                            </FormItem>
                                        </FormField>
                                    </div>
                                </div>
                                <div class="justify-end flex">
                                    <DynamicButton type="submit">
                                        提交
                                    </DynamicButton>
                                </div>

                            </div>
                        </Form>
                    </div>
                </DialogContent>
            </DialogPortal>
        </DialogRoot>
        <DialogRoot v-model:open="changeDialogOpen">
            <DialogPortal>
                <DialogContent>
                    <DialogTitle>修改信息</DialogTitle>
                    <div class="flex flex-row justify-between">
                        <div class="flex-col leading-15">
                            <div class="flex-row flex gap-6">
                                <p>客户姓名:</p>
                                <label>{{ curCustomer?.Name }}</label>
                            </div>
                            <div class="flex-row flex gap-6">
                                <p>性别:</p>
                                <label>{{ curCustomer?.gender }}</label>
                            </div>
                        </div>
                        <div class="felx flex-col leading-15">
                            <div class="flex flex-row gap-6">
                                <p>床位详情:</p>
                                <label>{{ curCustomer?.bedMes }}</label>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col leading-10">
                        <div class="flex-row flex gap-6">
                            <p>当前床位使用起始时间:</p>
                            <label>{{ curCustomer?.startUsedTime }}</label>
                        </div>
                        <Popover>
                            <PopoverTrigger>
                                <div class="flex flex-row items-center gap-6">
                                    <p> 当前床位使用结束时间:</p>
                                    <div class="flex flex-row items-center">
                                        <p>{{ bedChangeRequest.endDate }}</p>
                                        <CalendarIcon class="h-4 w-4 opacity-50"></CalendarIcon>
                                    </div>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Calendar :weekday-format="'short'" @update:model-value="handleCalendarValueChange">
                                </Calendar>
                            </PopoverContent>
                        </Popover>

                        <div class="flex justify-end">
                            <DynamicButton type="submit"> 提交</DynamicButton>
                        </div>

                    </div>
                </DialogContent>

            </DialogPortal>
        </DialogRoot>
    </div>

</template>
<style lang="css" scoped></style>