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
import { h, onMounted, reactive, ref, watchEffect, type Reactive } from 'vue'
import {
    DialogContent,
    DialogTitle
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useBedManagementStore } from '@/lib/store'
import type { Bed, BedUser, Room } from '@/lib/type'
import { valueUpdater } from '@/components/ui/table/utils'
import { axiosInstance as axios, axiosInstance, post, xhrWithAdapter } from '@/lib/core';
import { cn, debounce } from '@/lib/utils'
import Switcher from '@/components/custom/Switcher.vue';
import DynamicButton from '@/components/custom/DynamicButton.vue';
import { DialogPortal, DialogRoot, type AcceptableValue, type DateValue } from 'reka-ui';
import { FormField, Form } from '@/components/ui/form';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormLabel from '@/components/ui/form/FormLabel.vue';
import FormControl from '@/components/ui/form/FormControl.vue';
import Label from '@/components/ui/label/Label.vue';
import Calendar from '@/components/ui/calendar/Calendar.vue';
import { PopoverTrigger, Popover } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-vue-next';
import PopoverContent from '@/components/ui/popover/PopoverContent.vue';
import type { BedChangeRequestBody, BedExchangeRequest, CalendarDate, RoomResponse } from './type'
import Select from '@/components/ui/select/Select.vue'
import { bedsAdapter, dateConverter } from './helper'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectGroup from '@/components/ui/select/SelectGroup.vue'
import SelectLabel from '@/components/ui/select/SelectLabel.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
const bdmStore = useBedManagementStore();
const diglogOpen = ref<boolean>(false)
const changeDialogOpen = ref<boolean>(false)
const curCustomer = ref<BedUser>();
const bed_room_map: Reactive<Map<string, string[]>> = reactive(new Map())
const curRecordSelect = ref<'正在使用' | '使用历史'>('正在使用')
const bedUpdateRequest = reactive<BedChangeRequestBody>({
    endDate: '',
    id: NaN
})
const bedExchangeRequest = ref<BedExchangeRequest>({
    customerId: NaN,
    roomNumber: '',
    bedNumber: '',
    startDate: '',
    endDate: ''
})
const searchName = ref('')  // 搜索框输入
const resetCustomers = () => {
    searchName.value = ''
    reload()
}
const onInput = async (event: Event) => {
    const deLoad = debounce(loadBedMessage)
    deLoad()
}
const startDateChange = (e: any) => {
    e as CalendarDate
    bedExchangeRequest.value.startDate = dateConverter(e)
}
const endDateChange = (e: any) => {
    e as CalendarDate
    bedExchangeRequest.value.endDate = dateConverter(e)
}
const columns: ColumnDef<BedUser>[] = [
    {
        id: 'userID',
        accessorKey: 'Id',
        header: '序号',
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('userID')),
    },
    {
        id: 'name',
        accessorKey: 'name',
        header: '客户姓名',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('name')),
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
        header: '操作',
        enableHiding: false,
        cell: ({ row }) => {
            if (curRecordSelect.value === '正在使用') {
                return h('div', { class: 'flex-row flex ' }, [
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
            else {
                return h('div', { class: 'flex-row flex ' }, [
                    h(Button, {
                        class: '',
                        disabled: true,
                        variant: 'outline'
                    }, '床位调换'
                    ),
                    h(Button, {
                        class: '',
                        disabled: true,
                        variant: 'outline',
                    },
                        '修改'
                    )
                ])
            }
        }
    }
]
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})
const datatable = useVueTable({
    get data() {
        return curRecordSelect.value === '正在使用' ? bdmStore.getUsingBeds.value : bdmStore.getUsedBeds.value
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
datatable.setPageSize(7)
async function generateRoomsWithBeds() {
    const response = await axiosInstance.post("/room/listAll");
    const rooms = response.data.data as RoomResponse[];
    const rooms_cacheable: Room[] = []
    for (let room of rooms) {
        const r: Room = {
            id: room.id,
            roomNumber: room.roomNumber
        }
        rooms_cacheable.push(r);
    }

    bdmStore.setRoom(rooms_cacheable)
    for (let room of rooms_cacheable) {
        const response = await xhrWithAdapter('/bed/listSpareByRoomNumber', {
            roomNumber: room.roomNumber
        }, bedsAdapter)
        const room_bedsNumber = response.map((item) => {
            return item.bNumber
        })
        bed_room_map.set(room.roomNumber, room_bedsNumber);
    }
}
async function openDialog(row: Row<BedUser>) {
    diglogOpen.value = true
    if (bdmStore.getRooms === undefined) {
        await generateRoomsWithBeds()
    }
    curCustomer.value = row.original
}
function openChangeDialog(row: Row<BedUser>) {
    changeDialogOpen.value = true;
    curCustomer.value = row.original;
    bedUpdateRequest.endDate = curCustomer.value.endUsedTime
}
async function xhrBedMessage() {
    const res = (await axios.post('/bedUsageRecord/listAll')).data
    return res.data as any[]
}
async function loadBedMessage() {
    const res = await post<any[]>('/bedUsageRecord/page', {
        status: curRecordSelect.value==='正在使用'?1:0,
        customerName: searchName.value,
        startDate: '',
        current: 1,
        size: 7,
    })
    if (res.data.status) {
        const searchBeds = res.data.data
        const bedArray: BedUser[][] = [[], []]
        responseAdaptor(bedArray, searchBeds)
        console.log(bedArray)
        bdmStore.setUsedBeds(bedArray[0])
        bdmStore.setUsingBeds(bedArray[1])
        
    }
}
//0使用历史 1使用中
function responseAdaptor(adapted: BedUser[][], sources: any[]) {
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        const b: BedUser = {
            Id: source.id,
            customerId: source.customerId,
            name: source.customerName,
            gender: source.customerGender ? '男' : '女',
            bedMes: source.bedNumber,
            startUsedTime: source.startDate,
            endUsedTime: source.endDate || '没有结束',
        }
        adapted[source.status].push(b);
    }
}
function handleCalendarValueChange(v: DateValue | undefined) {
    bedUpdateRequest.endDate = v?.toString() ?? '';
}
function handleRoomSelect(v: AcceptableValue) {
    bedExchangeRequest.value.roomNumber = v as string;
}
function handleBedSelect(v: AcceptableValue) {
    bedExchangeRequest.value.bedNumber = v as string;
}
async function onSubmit() {
    const exchangeFloor=Number(bedExchangeRequest.value.roomNumber.split('')[0])
    bedExchangeRequest.value.customerId = curCustomer.value?.customerId as number
    const { promise, resolve, reject } = Promise.withResolvers<undefined>();
    toast.promise(promise, {
        loading: '提交中...',
        success: () => `床位更改完成`,
        error: () => '发生了错误'
    })
    const res = await axiosInstance.post("/bedUsageRecord/exchange", bedExchangeRequest.value)
    reloadFloorBed(exchangeFloor)
    reload()
    resolve(undefined);
    diglogOpen.value = false;
}
function handleCurRecordSelect(e: '正在使用' | '使用历史') {
    curRecordSelect.value = e
    const d=debounce(resetCustomers)
    d()
}
async function reloadFloorBed(exchangeFloor:number){
    const floorBed = await xhrWithAdapter('/bed/listByFloor', {
        floor: exchangeFloor,
    }, bedsAdapter)
    bdmStore.setFloorBedsWithNoneCache(exchangeFloor, floorBed);
}
async function handleBedUpdate() {
    bedUpdateRequest.id = curCustomer.value?.Id as number
    const { promise, resolve, reject } = Promise.withResolvers<undefined>();
    toast.promise(promise, {
        loading: '床位信息更新中',
        success: () => '床位信息更新完毕',
        error: () => "发生了错误"
    })
    const res = await axiosInstance.post('/bedUsageRecord/update', bedUpdateRequest);
    resolve(undefined)
    changeDialogOpen.value = false;
    reload();
}
async function reload() {
    const bedData: BedUser[][] = [[], []];
    responseAdaptor(bedData, await xhrBedMessage());
    bdmStore.setUsingBeds(bedData[1]);
    bdmStore.setUsedBeds(bedData[0]);
}
onMounted(async () => {
    reload();
})
</script>

<template>
    <div class="flex flex-col w-full gap-2">
        <div class="flex items-center py-10 gap-4">
            <div>
                <Input class="w-96 backdrop-blur-xl shadow-xl" placeholder="客户姓名" v-model="searchName"
                    @input="onInput" />
            </div>
            <div>
                <InteractiveHoverButton @click="resetCustomers" text="重置" text-before-color="#95e1d3"
                    text-after-color="#eaffd0" before-color="#eaffd0" after-color="#95e1d3">
                    <template #svgIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-rotate-ccw-icon lucide-rotate-ccw">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                    </template>
                </InteractiveHoverButton>
            </div>
        </div>

        <div class="flex mb-5">
            <Switcher left-value="正在使用" right-value="使用历史" @select-value-change="handleCurRecordSelect">

            </Switcher>
        </div>
        《
        <div class="flex w-full flex-col pr-6">
            <Table class="rounded-b-md rounded-t-md bg-white">
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
            <div class="flex items-center justify-end py-4 space-x-2 mr-9 ">
                <Button variant="outline" size="sm" :disabled="!datatable.getCanPreviousPage()"
                    @click="datatable.previousPage()">
                    上一页
                </Button>
                <Button variant="outline" size="sm" :disabled="!datatable.getCanNextPage()"
                    @click="datatable.nextPage()">
                    下一页
                </Button>
            </div>
        </div>
        <DialogRoot v-model:open="diglogOpen" !default-open>
            <DialogPortal>
                <DialogContent>
                    <DialogTitle>
                        床位调换
                    </DialogTitle>
                    <div>
                        <Form>
                            <div class="flex flex-col ">
                                <div class="flex flex-col">
                                    <div class="flex flex-row justify-between">
                                        <div class="flex flex-row ">
                                            <div class="flex flex-col leading-20">
                                                <div class="flex flex-row gap-4">
                                                    <p> 客户姓名:</p>
                                                    <Label>
                                                        {{ curCustomer?.name }}
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
                                        <div class="flex flex-col gap-10 ">
                                            <FormField v-slot="{ componentField }" name="nRoom">
                                                <FormItem>
                                                    <FormLabel>
                                                        新房号
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select @update:model-value="handleRoomSelect">
                                                            <SelectTrigger class="min-w-[10rem]">
                                                                <SelectValue placeholder="请选择一个房间">

                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>房号</SelectLabel>
                                                                    <SelectItem v-for="room in bdmStore.getRooms"
                                                                        :value="room.roomNumber">
                                                                        {{ room.roomNumber }}
                                                                    </SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                </FormItem>
                                            </FormField>
                                            <FormField v-slot="{ componentField }" name="nBed">
                                                <FormItem>
                                                    <FormLabel>
                                                        新床号
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select @update:model-value="handleBedSelect">
                                                            <SelectTrigger class="min-w-[10rem]">
                                                                <SelectValue placeholder="请选择一个床位">

                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>床号</SelectLabel>
                                                                    <SelectItem
                                                                        v-for="bedNumber in bed_room_map.get(bedExchangeRequest.roomNumber)"
                                                                        :value="bedNumber">
                                                                        {{ bedNumber }}
                                                                    </SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
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
                                                                    <span>{{ `${bedExchangeRequest.startDate}`
                                                                    }}</span>
                                                                </div>
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <Calendar @update:model-value="startDateChange"
                                                                :weekday-format="'short'">
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
                                                                    <span>{{ `${bedExchangeRequest.endDate}` }}</span>
                                                                </div>
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <Calendar :weekday-format="'short'"
                                                                @update:model-value="endDateChange">
                                                            </Calendar>
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                            </FormItem>
                                        </FormField>
                                    </div>
                                </div>
                                <div class="justify-end flex">
                                    <DynamicButton @click.prevent="onSubmit">
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
                                <label>{{ curCustomer?.name }}</label>
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
                                        <p>{{ bedUpdateRequest.endDate }}</p>
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
                            <DynamicButton @click.prevent="handleBedUpdate"> 提交</DynamicButton>
                        </div>

                    </div>
                </DialogContent>

            </DialogPortal>
        </DialogRoot>
    </div>

</template>
<style lang="css" scoped></style>