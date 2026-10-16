<script setup lang="ts">
import { onMounted, ref } from 'vue';

/**
 * 4 位图形验证码（纯前端生成，用于演示与防自动化）。
 * 生产环境应将验证码的生成与校验迁移到后端，避免前端被绕过。
 */
const props = withDefaults(defineProps<{ length?: number }>(), { length: 4 });

const canvasRef = ref<HTMLCanvasElement | null>(null);
const code = ref('');
const chars = '0123456789';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomColor(min: number, max: number): string {
  return `rgb(${randomInt(min, max)},${randomInt(min, max)},${randomInt(min, max)})`;
}

function generateCode(): string {
  let result = '';
  for (let i = 0; i < props.length; i++) {
    result += chars[randomInt(0, chars.length)];
  }
  return result;
}

function draw(): void {
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  const { width, height } = canvas;
  // 背景
  ctx.fillStyle = '#f5f7fa';
  ctx.fillRect(0, 0, width, height);

  // 干扰线
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = randomColor(150, 230);
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  // 噪点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = randomColor(120, 220);
    ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
  }

  // 文字（每个字符随机旋转 + 颜色）
  const fontSize = 26;
  ctx.textBaseline = 'middle';
  ctx.font = `${fontSize}px "PingFang SC", Arial, sans-serif`;
  for (let i = 0; i < code.value.length; i++) {
    ctx.save();
    ctx.fillStyle = randomColor(20, 120);
    const x = (width / (code.value.length + 1)) * (i + 1);
    const y = height / 2;
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.5);
    ctx.fillText(code.value[i], -fontSize / 2, 0);
    ctx.restore();
  }
}

function refresh(): void {
  code.value = generateCode();
  draw();
}

function validate(input: string): boolean {
  return !!input && input.trim() === code.value;
}

onMounted(refresh);

defineExpose({ refresh, validate });
</script>

<template>
  <canvas
    ref="canvasRef"
    width="110"
    height="40"
    class="captcha-canvas"
    title="点击刷新验证码"
    @click="refresh"
  />
</template>

<style scoped>
.captcha-canvas {
  width: 110px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.captcha-canvas:hover {
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.18);
  transform: translateY(-1px);
}
</style>
