import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { CheckoutRegistration, Customer, OutingRegistration } from "@/pages/ctm/type";
import type { BedUser } from "./type";
export const usecustomerManagementStore = defineStore('customManagentStore', () => {
  const customerList = ref<Customer[]>([])
  const allCustomerList = ref<Customer[]>([])
  const checkoutList = ref<CheckoutRegistration[]>([])
  const outingList = ref<OutingRegistration[]>([])
  const getCustomerList = computed(() => customerList)
  const getAllCustomerList = computed(() => allCustomerList)
  const getCheckoutList = computed(() => checkoutList)
  const getOutingList = computed(() => outingList)
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
  return {
    getCustomerList, getCheckoutList, getOutingList, getAllCustomerList, addNewCutomer, setNewList, setOutingList, setAllCustomerList, setCheckoutList
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
    getCustomerList, getCheckoutList, getOutingList, getAllCustomerList,setCustomerList, setCheckoutList, setOutingList, setAllCustomerList
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
