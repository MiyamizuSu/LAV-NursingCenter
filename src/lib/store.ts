import { ref } from "vue";
import { defineStore } from "pinia";
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
export const useBedLayoutStore = defineStore("bedStore", ()=>{
    
});
