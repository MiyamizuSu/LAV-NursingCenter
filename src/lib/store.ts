import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { CheckoutRegistration, Customer, OutingRegistration } from "@/pages/ctm/type";
const appState = ref<Set<string>>(new Set<string>());
export function useAppState() {
  return {
    get: function () {
      return appState.value;
    },
    addState: function (memoryName: string) {
      appState.value.add(memoryName);
    },
    deleteState: function (memoryName: string) {
      appState.value.delete(memoryName);
    },
    appState: appState,
  };
}
export const useBedLayoutStore = defineStore("bedStore", () => {

});
export const usecustomerManagementStore = defineStore('customManagentStore', () => {
  const customerList = ref<Customer[]>([])
  const checkoutList = ref<CheckoutRegistration[]>([])
  const outingList = ref<OutingRegistration[]>([])
  const getCustomerList = computed(() => customerList)
  const getCheckoutList = computed(() => checkoutList)
  const getOutingList = computed(() => outingList)
  const addNewCutomer = (newCutomer: Customer) => {
    customerList.value.push(newCutomer)
  }
  const setNewList = (newList: Customer[]) => {
    customerList.value = newList
  }
  const setCheckoutList = (newList: CheckoutRegistration[]) => {
    checkoutList.value = newList
  }
  // const setReviewTime = (id: number, newTime: string) => {
  //   const target = checkoutList.value.find(item => item.id === id)
  //   if(target){
  //     target.reviewTime = newTime
  //   }
  // }
  const setOutingList = (newList: OutingRegistration[]) => {
    outingList.value = newList
  }
  return {
    getCustomerList, getCheckoutList, getOutingList, addNewCutomer, setNewList, setOutingList
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

  return {
    getCustomerList, getCheckoutList, getOutingList, getAllCustomerList,setCustomerList, setOutingList, setAllCustomerList
  }
})