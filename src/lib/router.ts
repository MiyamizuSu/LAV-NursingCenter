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
import MealReservation from '@/pages/MealReservation.vue'
import { axiosInstance as axios } from '@/lib/core'

import type { User } from './type'
import { use } from 'echarts'
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
    {
        path: "/mealReservation",
        component: MealReservation
    }
]
export const router = createRouter({
    // history:createMemoryHistory(),
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
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

    if (to.path == '/') {
        if (sessionStorage.getItem('userType') == null && sessionStorage.getItem('customerActive') == null && localStorage.getItem('tokenu') == null && localStorage.getItem('tokenc') == null) {
            router.push('/login')
        } else {
            console.log("/ tokenu: ", localStorage.getItem('tokenu'))
            console.log("/ tokenc: ", localStorage.getItem('tokenc'))
            if (localStorage.getItem('tokenu') != null && localStorage.getItem('tokenu') != undefined) {
                axios.post("/user/load", {}).then(res => {
                    // console.log(res)
                    // console.log(localStorage.getItem('customerUsing'))
                    if (res.data.status == 200) {
                        console.log("userType: ", res.data.data.userType)
                        if (res.data.data.userType == 0) {
                            // console.log(localStorage.getItem('AdminUsing'))

                            if (localStorage.getItem('AdminUsing') == null) {
                                sessionStorage.setItem('userType', res.data.data.userType)
                                localStorage.setItem('user0', JSON.stringify(res.data.data))
                                localStorage.setItem('AdminUsing', "1")
                                // console.log(localStorage.getItem('AdminUsing'))
                                router.push('/main')
                            } else {
                                // console.log(localStorage.getItem('AdminUsing'))
                                router.push('/login')
                            }
                        } else if (res.data.data.userType == 1) {
                            // console.log(localStorage.getItem('NurseUsing'))
                            if (localStorage.getItem('NurseUsing') == null) {
                                sessionStorage.setItem('userType', res.data.data.userType)
                                localStorage.setItem('user1', JSON.stringify(res.data.data))
                                localStorage.setItem('NurseUsing', "1")
                                router.push('/main')
                            } else {
                                router.push('/login')
                            }
                        }
                    }
                })
            }
            else if (localStorage.getItem('tokenc') != null && localStorage.getItem('tokenc') != undefined) {
                axios.post("/customer/load", {}).then(res => {
                    // console.log(res)
                    // console.log(localStorage.getItem('customerUsing'))
                    if (res.data.status == 200) {
                        if (localStorage.getItem('customerUsing') == null) {
                            localStorage.setItem('customer', JSON.stringify(res.data.data))
                            sessionStorage.setItem('customerActive', '1')
                            localStorage.setItem('customerUsing', '1')
                            router.push('/mealReservation');
                            // console.log(sessionStorage.getItem('customerActive'))
                        } else {
                            router.push('/login')
                        }

                    }
                })
            }
        }
    } else if (to.path === '/mealReservation') {
        // console.log("mealReservation")
        let customerJson = ''
        if (sessionStorage.getItem('customerActive') == '1') {
            // console.log("customerActive=1")
            customerJson = localStorage.getItem('customer') as string
            localStorage.setItem('customerUsing', "1")
        }
        console.log(customerJson)
        if (customerJson == null || customerJson == undefined || customerJson == '') {
            router.push('/login')
        }
    }

    else if (nextRoute.indexOf(to.path) == -1) {
        let userJson = ''
        // console.log("路由守卫", sessionStorage.getItem('userType'))
        // await axios.post('/user/load', {}).then(res => {
        //     if (res.data.status == 200) {
        //         let user = res.data.data
        //         userJson = JSON.stringify(user)
        //         sessionStorage.setItem("userType", user.userType)
        //         if (user.userType == 0) {
        //             localStorage.setItem('user0', userJson)
        //             localStorage.setItem('AdminUsing', "1")
        //         } else if (user.userType == 1) {
        //             localStorage.setItem('user1', userJson)
        //             localStorage.setItem('NurseUsing', "1")
        //         }
        //     }
        // })
        // console.log("路由", userJson)
        if (sessionStorage.getItem('userType') == '0') {
            userJson = localStorage.getItem('user0') as string
            localStorage.setItem('AdminUsing', "1")
        } else if (sessionStorage.getItem('userType') == '1') {
            userJson = localStorage.getItem('user1') as string
            localStorage.setItem('NurseUsing', "1")
        }

        if (userJson == null || userJson == undefined || userJson == '') {
            // console.log("路由守卫", userJson)
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