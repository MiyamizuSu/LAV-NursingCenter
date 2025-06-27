import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { BedUser } from "./type";
// const appState = ref<Set<string>>(new Set<string>());
// export function useAppState() {
//   return {
//     get: function () {
//       return appState.value;
//     },
//     addState: function (memoryName: string) {
//       appState.value.add(memoryName);
//     },
//     deleteState: function (memoryName: string) {
//       appState.value.delete(memoryName);
//     },
//     appState: appState,
//   };
// }

// export const useBedLayoutStore = defineStore("bedStore", ()=>{
//   const lNodes:Set<LNodepos>=new Set();
//   const canvasNode=ref<posistion>();
//   const getLNodes=computed(()=>[...lNodes]);
//   const getCanvasNode=computed(()=>canvasNode);

//   const addNewNodes=(newLNode:LNodepos)=>{
//     lNodes.add(newLNode);
//   }
//   const setCansvasNode=(pos:posistion)=>{
//     canvasNode.value=pos
//   }
//   const setLNodeFromCode=(nodeCode:string,newPos:posistion)=>{
//     for(let lNode of lNodes){
//       if(lNode.nodeMes.nodeCode===nodeCode){
//         lNode.nodePosition=newPos;
//         break;
//       }
//     }
//   }
//   return{
//     getLNodes,addNewNodes,getCanvasNode,setCansvasNode,setLNodeFromCode
//   }
// });

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
