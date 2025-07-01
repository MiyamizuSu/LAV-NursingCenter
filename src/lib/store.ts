import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { CheckoutRegistration, Customer, OutingRegistration, Room, SpareBed } from "@/pages/ctm/type";
import type { BedUser, User } from "./type";
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
  const getUsingBeds=computed(()=>usingBeds);
  const getUsedBeds=computed(()=>usedBeds);
  const setUsingBeds=(newUsingBedsList:BedUser[])=>{
    usingBeds.value=newUsingBedsList
  }
  return {
    getUsedBeds,getUsingBeds,setUsingBeds
  }
})
