<template>
  <span class="keyword-tag" @click="handleClick">
    <el-tooltip
      v-if="showTooltip"
      :content="tooltipContent"
      placement="top"
      effect="light"
    >
      <el-tag
        :type="type"
        :size="size"
        :closable="closable"
        @close="handleClose"
        class="keyword-content"
      >
        <slot>{{ keyword }}</slot>
      </el-tag>
    </el-tooltip>
    <el-tag
      v-else
      :type="type"
      :size="size"
      :closable="closable"
      @close="handleClose"
      class="keyword-content"
    >
      <slot>{{ keyword }}</slot>
    </el-tag>
  </span>
</template>

<script setup lang="ts">
interface Props {
  keyword: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'large' | 'default' | 'small'
  closable?: boolean
  showTooltip?: boolean
  tooltipContent?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'default',
  closable: false,
  showTooltip: false,
  tooltipContent: ''
})

const emit = defineEmits<{
  click: [keyword: string]
  close: [keyword: string]
}>()

const handleClick = () => {
  emit('click', props.keyword)
}

const handleClose = () => {
  emit('close', props.keyword)
}
</script>

<style lang="scss" scoped>
.keyword-tag {
  display: inline-block;
  margin: 2px 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  .keyword-content {
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: var(--shadow-sm);
    }
  }
}

// 诗词关键词特殊样式
.keyword-tag.poem-keyword {
  .el-tag {
    background-color: var(--annotation-bg);
    border-color: var(--annotation-border);
    color: var(--primary-color);
    font-style: italic;
  }
}

.keyword-tag.author-tag {
  .el-tag {
    background-color: rgba(var(--secondary-color), 0.1);
    border-color: rgba(var(--secondary-color), 0.3);
    color: var(--secondary-color);
  }
}

.keyword-tag.dynasty-tag {
  .el-tag {
    background-color: rgba(var(--accent-color), 0.1);
    border-color: rgba(var(--accent-color), 0.3);
    color: var(--accent-color);
  }
}
</style>