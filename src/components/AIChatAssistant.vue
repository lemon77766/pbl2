<template>
  <div class="ai-chat-assistant">
    <!-- 悬浮按钮 -->
    <div 
      v-if="!isOpen" 
      class="chat-button"
      @click="toggleChat"
      :class="{ 'pulsing': hasNewMessage }"
    >
      <div class="ai-icon">AI</div>
      <span class="button-text">诗词助手</span>
    </div>

    <!-- 聊天窗口 -->
    <div v-if="isOpen" class="chat-window">
      <!-- 标题栏 -->
      <div class="chat-header">
        <div class="header-content">
          <div class="ai-avatar">AI</div>
          <div class="header-info">
            <h3>诗词AI助手</h3>
            <span class="status">在线</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="action-btn" @click="minimizeChat">
            <span>−</span>
          </button>
          <button class="action-btn close-btn" @click="toggleChat">
            <span>×</span>
          </button>
        </div>
      </div>

      <!-- 消息区域 -->
      <div class="chat-messages" ref="messagesContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['message', message.type]"
        >
          <div class="message-avatar">
            <div v-if="message.type === 'ai'" class="ai-avatar-small">AI</div>
            <div v-else class="user-avatar">你</div>
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input">
        <div class="input-wrapper">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="输入关于诗词的问题..."
            @keyup.enter="sendMessage"
            class="message-input"
          />
          <button 
            @click="sendMessage" 
            class="send-button"
            :disabled="!inputMessage.trim()"
          >
            <span>发送</span>
          </button>
        </div>
        <div class="quick-actions">
          <button 
            v-for="action in quickActions" 
            :key="action.text"
            @click="sendQuickMessage(action.text)"
            class="quick-action"
          >
            {{ action.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'

const isOpen = ref(false)
const hasNewMessage = ref(false)
const inputMessage = ref('')
const messages = ref<Array<{type: string, text: string, time: string}>>([])
const messagesContainer = ref<HTMLElement>()

const quickActions = [
  { text: '推荐一首唐诗' },
  { text: '解释这首诗的意思' },
  { text: '关于李白的诗词' },
  { text: '如何赏析诗词' }
]

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasNewMessage.value = false
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const minimizeChat = () => {
  isOpen.value = false
}

const sendMessage = () => {
  if (!inputMessage.value.trim()) return

  const userMessage = {
    type: 'user',
    text: inputMessage.value,
    time: getCurrentTime()
  }
  messages.value.push(userMessage)
  
  // 模拟AI回复
  setTimeout(() => {
    const aiResponse = getAIResponse(inputMessage.value)
    const aiMessage = {
      type: 'ai',
      text: aiResponse,
      time: getCurrentTime()
    }
    messages.value.push(aiMessage)
    scrollToBottom()
    
    // 如果有新消息且窗口关闭，显示脉冲效果
    if (!isOpen.value) {
      hasNewMessage.value = true
    }
  }, 1000)

  inputMessage.value = ''
  scrollToBottom()
}

const sendQuickMessage = (text: string) => {
  inputMessage.value = text
  sendMessage()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const getCurrentTime = () => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

const getAIResponse = (question: string) => {
  const responses = [
    '这是一首非常优美的诗词，展现了诗人对自然景色的深刻感悟。',
    '这首诗表达了诗人内心的情感波动，通过意象的运用传达了深刻的哲理。',
    '从这首诗中我们可以感受到中国传统文化的深厚底蕴和审美情趣。',
    '这首诗的韵律和节奏都非常讲究，体现了古典诗词的音乐美。',
    '诗人通过这首诗抒发了对人生、对自然的独特见解和感悟。',
    '这首诗的意境深远，让人读后回味无穷，值得细细品味。',
    '从修辞手法来看，这首诗运用了比喻、拟人等手法，增强了表现力。',
    '这首诗反映了当时的社会背景和诗人的个人经历，具有历史价值。'
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<style scoped lang="scss">
.ai-chat-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--primary-color);
  color: white;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  &.pulsing {
    animation: pulse 2s infinite;
  }
}

.ai-icon {
  width: 24px;
  height: 24px;
  background: white;
  color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
}

.button-text {
  font-weight: 600;
}

.chat-window {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: var(--primary-color);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar {
  width: 32px;
  height: 32px;
  background: white;
  color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.header-info h3 {
  margin: 0;
  font-size: 16px;
}

.status {
  font-size: 12px;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8f9fa;
}

.message {
  display: flex;
  margin-bottom: 16px;
  gap: 8px;
}

.message-avatar {
  flex-shrink: 0;
}

.ai-avatar-small, .user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
}

.ai-avatar-small {
  background: var(--primary-color);
  color: white;
}

.user-avatar {
  background: #e9ecef;
  color: var(--text-color);
}

.message-content {
  max-width: 80%;
}

.message-text {
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  line-height: 1.4;
}

.message.ai .message-text {
  background: var(--primary-color);
  color: white;
}

.message-time {
  font-size: 11px;
  color: var(--text-light);
  margin-top: 4px;
  text-align: right;
}

.chat-input {
  padding: 16px;
  border-top: 1px solid #e9ecef;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.message-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  outline: none;
  
  &:focus {
    border-color: var(--primary-color);
  }
}

.send-button {
  padding: 12px 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-action {
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--primary-color), 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--primary-color), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-color), 0);
  }
}

@media (max-width: 768px) {
  .ai-chat-assistant {
    bottom: 10px;
    right: 10px;
  }
  
  .chat-window {
    width: calc(100vw - 20px);
    height: 70vh;
  }
}
</style>