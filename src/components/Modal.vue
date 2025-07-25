<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative text-gray-900">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-400 hover:text-blue-400 text-2xl">
        <i class="fas fa-times"></i>
      </button>
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show: { type: Boolean, default: false }
  }
}
</script> 