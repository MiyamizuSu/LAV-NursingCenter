import { computed, reactive, ref, type Reactive } from "vue";
import { defineStore } from "pinia";
import type { CheckoutRegistration, Customer, OutingRegistration, SpareBed } from "@/pages/ctm/type";
import type { Bed, BedUser, Room, User, Customer as MyCustomer, NursingLevel } from "./type";

export const usecustomerManagementStore = defineStore('customManagentStore', () => {
  const customerList = ref<Customer[]>([])
  const allCustomerList = ref<Customer[]>([])
  const checkoutList = ref<CheckoutRegistration[]>([])
  const outingList = ref<OutingRegistration[]>([])
  const roomList = ref<Room[]>([])
  const spareBed = ref<SpareBed[]>([])
  const getCustomerList = computed(() => customerList)
  const getAllCustomerList = computed(() => allCustomerList)
  const getCheckoutList = computed(() => checkoutList)
  const getOutingList = computed(() => outingList)
  const getRoomList = computed(() => roomList)
  const getSpareBedList = computed(()=>spareBed)
  const addNewCutomer = (newCutomer: Customer) => {
    customerList.value.push(newCutomer)
  }
  const setAllCustomerList = (newList: Customer[]) => {
    allCustomerList.value = newList
  }
  const setNewList = (newList: Customer[]) => {
    customerList.value = newList
  }
  const setCheckoutList = (newList: CheckoutRegistration[]) => {
    checkoutList.value = newList
  }
  const setOutingList = (newList: OutingRegistration[]) => {
    outingList.value = newList
  }
  const setRoomList = (newList: Room[]) => {
    roomList.value=newList
  }
  const setSpareBedList=(newList:SpareBed[])=>{
    spareBed.value=newList
  }
  return {
    getCustomerList, getCheckoutList, getOutingList, getAllCustomerList, getRoomList, getSpareBedList, addNewCutomer, setNewList, setOutingList, setAllCustomerList, setCheckoutList, setRoomList, setSpareBedList
  }
})
export const useCustomerNurseStore = defineStore('customerNurseStore', () =>{
  const customerList = ref<Customer[]>([])
  const allCustomerList = ref<Customer[]>([])
  const checkoutList = ref<CheckoutRegistration[]>([])
  const outingList = ref<OutingRegistration[]>([])
  const getCustomerList = computed(() => customerList)
  const getAllCustomerList = computed(() => allCustomerList)
  const getCheckoutList = computed(() => checkoutList)
  const getOutingList = computed(() => outingList)
  const currentNurseId = ref(0)
  const getCurrentNurseId=computed(()=>currentNurseId);
  const setCurrentNurseId=(newNurseId:number)=>{
    currentNurseId.value=newNurseId
  }
  const setCustomerList = (newList: Customer[]) => {
    customerList.value = newList
  }
  const setOutingList = (newList: OutingRegistration[]) => {
    outingList.value = newList
  }
  const setAllCustomerList = (newList: Customer[]) => {
    allCustomerList.value = newList
  }
  const setCheckoutList = (newList: CheckoutRegistration[]) => {
    checkoutList.value = newList
  }

  return {
    getCustomerList, getCheckoutList, getOutingList, getAllCustomerList, getCurrentNurseId, setCustomerList, setCheckoutList, setOutingList, setAllCustomerList, setCurrentNurseId
  }
})

export const useBedManagementStore=defineStore("bedUseStore",()=>{
  const usingBeds=ref<BedUser[]>([]);
  const usedBeds=ref<BedUser[]>([]);
  const floorBeds=ref<Bed[]>([]);
  const _floorBeds_cache:Map<number,Bed[]>=new Map();
  const room_cache = reactive<Room[]>([])
  const getUsingBeds=computed(()=>usingBeds);
  const getUsedBeds=computed(()=>usedBeds);
  const getFloorBeds=computed(()=>floorBeds);
  const getRooms=computed(()=>{
    return room_cache.length!==0?room_cache:undefined
  });
  function _getCacheOrXhr(floor:number):1|0{
    if(_floorBeds_cache.has(floor)){
      floorBeds.value=_floorBeds_cache.get(floor) as Bed[]
      return 1;
    }
    else{
      return 0;
    }
  }
  function _update_cache(floor:number){
    _floorBeds_cache.set(floor,floorBeds.value);
  }
  const setFloorBedsWithCache=(floor:number)=>{
    return !!_getCacheOrXhr(floor)
  }
  const setRoom=(rooms:Room[])=>{
    room_cache.push(...rooms)
  }
  const setFloorBedsWithNoneCache=(floor:number,newFloorBeds:Bed[])=>{
    floorBeds.value=newFloorBeds;
    _update_cache(floor);
  }
  const setUsedBeds=(newUsedBedList:BedUser[])=>{
    usedBeds.value=newUsedBedList
  }
  const setUsingBeds=(newUsingBedsList:BedUser[])=>{
    usingBeds.value=newUsingBedsList
  }
  return {
    getUsedBeds,getUsingBeds,setUsingBeds,getFloorBeds,setFloorBedsWithCache,setFloorBedsWithNoneCache,getRooms,setRoom,setUsedBeds
  }
})

export const useUserManagementStore=defineStore("userManagementStore",()=>{
  const userList = ref<User[]>([])
  const getUserList=computed(()=>userList);
  function setUserList(newList:User[]){
    userList.value=newList
  }
  return {
    getUserList,setUserList
  }
})
export const useLevelProgramStore = defineStore('levelProgramStore', () =>{
  const currentLevel = ref({} as NursingLevel)
  const getCurrentLevel = computed(() => currentLevel)
  const setCurrentLevel = (newLevel: NursingLevel) => {
    currentLevel.value = newLevel
  }
  return {
    getCurrentLevel, setCurrentLevel
  }
})
export const useNursingCustomersStore = defineStore('nursingCustomersStore', () =>{
  const currentNurse = ref({} as User)
  const getCurrentNurse = computed(() => currentNurse)
  const setCurrentNurse = (newNurse: User) => {
    currentNurse.value = newNurse
  }
  return {
    getCurrentNurse, setCurrentNurse
  }
})
export const useCustomerProgramsStore = defineStore('customerProgramsStore', () =>{
  const currentCustomer = ref({} as MyCustomer)
  const getCurrentCustomer = computed(() => currentCustomer)
  const setCurrentCustomer = (newCustomer: MyCustomer) => {
    currentCustomer.value = newCustomer
  }
  return {
    getCurrentCustomer, setCurrentCustomer
  }
})
