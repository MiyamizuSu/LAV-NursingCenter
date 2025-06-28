<!-- 系统管理员端 床位管理 床位管理 -->
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
import { fakerZH_CN as faker } from '@faker-js/faker';
import { h, onMounted, ref, type Ref } from 'vue'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useBedManagementStore } from '@/lib/store'
import type { BedUser, StrictDate } from '@/lib/type'
import { valueUpdater } from '@/components/ui/table/utils'
import { cn } from '@/lib/utils'
import Switcher from '@/components/custom/Switcher.vue';
import DynamicButton from '@/components/custom/DynamicButton.vue';
const bdmStore = useBedManagementStore();
function _mockDataGenerator(mockData: BedUser[], times: number = 10, seed: number = 520) {
    for (let i = 0; i < times; i++) {
        const singleMock: BedUser = {
            Id: i + 1,
            Name: faker.person.fullName(),
            gender: faker.person.sex() as '女' | '男',
            bedMes: faker.string.uuid(),
            startUsedTime: faker.date.anytime().toISOString().slice(0, 10) as StrictDate,
            endUsedTime: faker.date.anytime().toISOString().slice(0, 10) as StrictDate,
        }
        mockData[i] = singleMock
    }
}
onMounted(() => {
    const mockData: BedUser[] = []
    _mockDataGenerator(mockData);
    bdmStore.setUsingBeds(mockData);
    console.log(mockData)
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
        cell: () => h('div', { class: 'flex-row flex ' }, [
            h(DynamicButton, {
                class: '',
            }, '床位调换'
            ),
            h(DynamicButton, {
                class: '',
            },
                '修改'
            )
        ]
        )
    }
]
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
    </div>

</template>
<style lang="css" scoped></style>