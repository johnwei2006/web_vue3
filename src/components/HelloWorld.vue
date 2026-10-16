<script setup lang="ts">
defineProps<{ msg: string }>();
</script>

<template>
  <el-alert :title="msg" type="success" :closable="false" />
</template>
