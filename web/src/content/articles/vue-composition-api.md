---
title: Vue 3 组合式 API 实践笔记
date: 2026-09-20
summary: 把逻辑按功能组织，而不是按选项类型堆在一起。
tags: [Vue]
---

## 从选项式到组合式

组合式 API 最大的变化不是语法，而是组织方式：把同一个功能的响应式状态、计算属性和副作用放在一起，而不是分散在 `data`、`computed`、`methods` 里。

## 一个常见的封装

```js
export function useCounter(initial = 0) {
  const count = ref(initial);
  const double = computed(() => count.value * 2);
  const inc = () => count.value++;
  return { count, double, inc };
}
```

需要复用的逻辑抽成这样的函数即可，不必再依赖 mixin。
