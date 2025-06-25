<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { ref } from "vue";

interface Props {
  text?: string;
  class?: string;
  textAfterColor?: string;
  textBeforeColor?:string;
  beforeColor?: string;
  afterColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  text: "",
  textAfterColor: "#FFFFFF",
  beforeColor: "#FFFFFF",
  afterColor: "#F7CFD8",  
  textBeforeColor:"#F7CFD8" 
});

const buttonRef = ref<HTMLButtonElement>();
</script>

<template>
  <button
    ref="buttonRef"
    :class="cn(
      `group relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold`,
      props.class
    )"
    :style="{
      backgroundColor: props.beforeColor,
      color: props.textBeforeColor
    }"
  >
    <div class="flex items-center gap-2">
      <div
        :style="{ backgroundColor: props.afterColor }"
        class="size-2 scale-100 rounded-lg transition-all duration-300 group-hover:scale-[100.8]"
      ></div>
      <span
        class="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0"
      >
        {{ props.text }}
      </span>
    </div>

    <div
      class="absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100"
      :style="{ color: props.textAfterColor }"
    >
      <span class="whitespace-nowrap">{{ props.text }}</span>
      <slot name="svgIcon"></slot>
    </div>
  </button>
</template>
