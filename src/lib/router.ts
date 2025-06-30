import { createMemoryHistory, createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import MainPage from '@/pages/MainPage.vue'
import NursingLevel from '@/pages/nsm/NursingLevel.vue'
import LevelManagePrograms from '@/pages/nsm/LevelManagePrograms.vue'
import NursingPrograms from '@/pages/nsm/NursingPrograms.vue'
import CustomerNursingSet from '@/pages/nsm/CustomerNursingSet.vue'
import CheckInPage from '@/pages/ctm/CheckInPage.vue'
import NursingRecord from '@/pages/nsm/NursingRecord.vue'
import ServiceObjectSetting from '@/pages/htm/ServiceObjectSetting.vue'
import ManageNursingCustomers from '@/pages/htm/ManageNursingCustomers.vue'
import ServiceFocus from '@/pages/htm/ServiceFocus.vue'
import ManageCustomerPrograms from '@/pages/htm/ManageCustomerPrograms.vue'
import BedLayoutDiagram from '@/pages/bdm/BedLayoutDiagram.vue'
import BedManagement from '@/pages/bdm/BedManagement.vue'
import CheckOutPage from '@/pages/ctm/CheckOutPage.vue'
import MealCalendar from '@/pages/mlm/MealCalendar.vue'
import MealSet from '@/pages/mlm/MealSet.vue'
import BasicInformationMaintain from '@/pages/usm/BasicInformationMaintain.vue'
import GoOutPage from '@/pages/ctm/GoOutPage.vue'
import NursingRecord2 from '@/pages/hts/NursingRecord.vue'
import DailyNursing from '@/pages/hts/DailyNursing.vue'
import FoodManage from '@/pages/mlm/FoodManage.vue'
import MealReservationManage from '@/pages/mlm/MealReservationManage.vue'
import ErrorPage from '@/pages/ErrorPage.vue'
import GoOutApplication from '@/pages/cts/GoOutApplication.vue'
import CheckOutApplication from '@/pages/cts/CheckOutApplication.vue'
import type { User } from './type'
export const routes: RouteRecordRaw[] = [
    {
        path: '/login', component: LoginPage
    },
    {
        path: '/main', component: MainPage,
        children: [{
            path: 'checkIn',
            component: CheckInPage,
        },
        {
            path: 'bedLayoutDiagram',
            component: BedLayoutDiagram
        },
        {
            path: 'bedManagement',
            component: BedManagement
        },
        {
            path: 'checkOut',
            component: CheckOutPage,
        },
        {
            path: 'goOut',
            component: GoOutPage
        },
        {
            path: 'serviceFocus',
            component: ServiceFocus,
        },
        {
            path: 'manageCustomerPrograms',
            component: ManageCustomerPrograms
        },
        {
            path: 'serviceObjectSetting',
            component: ServiceObjectSetting,
        },
        {
            path: 'manageNursingCustomers',
            component: ManageNursingCustomers
        },
        {
            path: 'mealCalendar',
            component: MealCalendar,
        },
        {
            path: 'mealSet',
            component: MealSet,
        },
        {
            path: 'customerNursingSet',
            component: CustomerNursingSet,
        },
        {
            path: 'nursingLevel',
            component: NursingLevel,
        },
        {
            path: 'levelManagePrograms',
            component: LevelManagePrograms
        },
        {
            path: 'nursingPrograms',
            component: NursingPrograms,
        },
        {
            path: 'nursingRecord',
            component: NursingRecord,
        },
        {
            path: 'basicInformationMaintain',
            component: BasicInformationMaintain
        },
        {
            path: 'nursingRecord2',
            component: NursingRecord2
        },
        {
            path: 'dailyNursing',
            component: DailyNursing
        },
        {
            path: 'foodManage',
            component: FoodManage
        },
        {
            path: 'mealReservationManage',
            component: MealReservationManage
        },
        {
            path: 'goOutApplication',
            component: GoOutApplication
        },
        {
            path: 'checkOutApplication',
            component: CheckOutApplication
        },
        ]
    },
    {
        path: "/errorPage",
        component: ErrorPage
    },
]
export const router = createRouter({
    // history:createMemoryHistory(),
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // 管理员专属路径
    const adminPaths = ['/checkIn', '/checkOut', '/goOut', '/bedLayoutDiagram',
        '/bedManagement', '/nursingLevel', '/nursingPrograms', '/customerNursingSet',
        '/nursingRecord', '/mealCalendar', '/mealSet', '/serviceObjectSetting',
        '/serviceFocus', '/basicInformationMaintain', '/foodManage',
        '/mealReservationManage']

    // 护工专属路径
    const nursePaths = ['/dailyNursing', '/checkOutApplication',
        '/goOutApplication', '/nursingRecord2']

    const nextRoute = ['/login', '/errorPage'];

    if (nextRoute.indexOf(to.path) == -1) {
        let userJson = sessionStorage.getItem('user')
        if (userJson == null || userJson == undefined) {
            router.push('/login')
        }
        else {
            let user = JSON.parse(userJson!) as User
            // 权限路径校验逻辑
            let isAdmin = user.userType === 0
            let fullPath = to.fullPath

            // 精确匹配路径
            let isAdminPath = adminPaths.some(p => fullPath === `/main${p}`)
            let isNursePath = nursePaths.some(p => fullPath === `/main${p}`)

            if (isAdmin && isNursePath) {
                router.push('/errorPage')
            } else if (!isAdmin && isAdminPath) {
                router.push('/errorPage')
            }
        }
    }
    next()
})