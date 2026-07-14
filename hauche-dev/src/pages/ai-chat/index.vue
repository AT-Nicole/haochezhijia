<template>
  <View class="page">
    <!-- Chat Header -->
    <View class="chat-header">
      <View class="chat-back" @tap="goBack">
        <Text class="chat-back-text">‹</Text>
      </View>
      <Text class="chat-title">AI 智能顾问</Text>
      <View class="chat-header-spacer" />
    </View>

    <!-- Message List -->
    <ScrollView scroll-y class="chat-messages" :scroll-top="scrollTop" :scroll-with-animation="true">
      <!-- Welcome -->
      <View class="msg msg-ai">
        <View class="msg-avatar-ai">
          <Text class="msg-avatar-text">AI</Text>
        </View>
        <View class="msg-bubble">
          <Text class="msg-text">您好！我是豪车之家AI顾问，可以帮您：</Text>
          <Text class="msg-text">• 推荐适合您的豪华车型</Text>
          <Text class="msg-text">• 查询全国车源报价</Text>
          <Text class="msg-text">• 了解金融服务方案</Text>
          <Text class="msg-text">• 预约试驾体验</Text>
          <Text class="msg-text">请问有什么可以帮您？</Text>
        </View>
      </View>

      <!-- Messages -->
      <View v-for="(msg, idx) in messages" :key="idx" class="msg" :class="msg.role === 'user' ? 'msg-user' : 'msg-ai'">
        <View v-if="msg.role === 'ai'" class="msg-avatar-ai">
          <Text class="msg-avatar-text">AI</Text>
        </View>
        <View class="msg-bubble" :class="msg.role">
          <Text class="msg-text">{{ msg.content }}</Text>
        </View>
      </View>

      <!-- Typing Indicator -->
      <View v-if="isTyping" class="msg msg-ai">
        <View class="msg-avatar-ai">
          <Text class="msg-avatar-text">AI</Text>
        </View>
        <View class="msg-bubble">
          <Text class="typing-dots">正在思考中...</Text>
        </View>
      </View>

      <!-- Quick Replies -->
      <View v-if="messages.length === 0" class="quick-replies">
        <View class="quick-reply-btn" v-for="q in quickReplies" :key="q" @tap="sendQuickReply(q)">
          <Text class="quick-reply-text">{{ q }}</Text>
        </View>
      </View>

      <View style="height: 140rpx" />
    </ScrollView>

    <!-- Input Bar -->
    <View class="input-bar">
      <View class="input-row">
        <Input
          class="chat-input"
          v-model="inputText"
          placeholder="输入您的需求..."
          confirm-type="send"
          @confirm="sendMessage"
        />
        <View class="send-btn" :class="{ active: inputText.trim() }" @tap="sendMessage">
          <Text class="send-btn-text">发送</Text>
        </View>
      </View>
    </View>
  </View>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import Taro from '@tarojs/taro'

const messages = ref([])
const inputText = ref('')
const isTyping = ref(false)
const scrollTop = ref(0)

const quickReplies = [
  '我想买迈巴赫',
  '200万以内SUV推荐',
  '深圳有哪些保时捷',
  '了解金融服务',
  '预约试驾'
]

const AI_REPLIES = {
  '迈巴赫': '为您找到以下迈巴赫车型：\n\n1️⃣ 迈巴赫S480 · ¥288万\n深圳尊享名车 · 在库\nAI综合评分：96分\n\n2️⃣ 迈巴赫S680 · ¥368万\n深圳尊享名车 · 在库\n\n3️⃣ 迈巴赫GLS600 · ¥298万\n深圳尊享名车 · 在库\n\n建议选择S480，商务性价比最高。需要了解详情或预约试驾吗？',
  'SUV': '200万以内豪华SUV推荐：\n\n1️⃣ 奔驰G63 AMG · ¥258万\n动力最强，兼顾越野\n\n2️⃣ 路虎揽胜运动版 · ¥168万\n性价比最高，空间大\n\n3️⃣ 保时捷卡宴 · ¥158万\n操控优秀，品牌力强\n\n您更看重动力还是舒适？',
  '保时捷': '深圳保时捷在售车型：\n\n🏎️ 保时捷911 · ¥198万\n鹏程豪华汽车\n\n🏎️ 保时捷卡宴 · ¥158万\n鹏程豪华汽车\n\n🏎️ 保时捷Macan · ¥68万\n粤港澳大湾区车行\n\n需要我帮您预约试驾吗？',
  '金融': '我们的金融服务方案：\n\n💳 贷款购车：最低首付20%，年利率3.8%\n💰 以旧换新：全品牌评估，高价回收\n📋 保险服务：全险优惠套餐\n\n例如：迈巴赫S480 ¥288万\n首付20% = ¥57.6万\n月供约 ¥4.2万（36期）\n\n需要定制您的专属金融方案吗？',
  '试驾': '好的！请告诉我：\n\n1. 您想试驾哪款车型？\n2. 期望的试驾时间？\n3. 您的联系方式？\n\n或者您可以直接拨打VIP专线预约，我们会安排最近的认证车行为您服务。'
}

const sendQuickReply = (text) => {
  addUserMessage(text)
  setTimeout(() => generateAIReply(text), 800)
}

const sendMessage = () => {
  const text = inputText.value.trim()
  if (!text) return
  
  addUserMessage(text)
  inputText.value = ''
  
  setTimeout(() => generateAIReply(text), 800)
}

const addUserMessage = (text) => {
  messages.value.push({ role: 'user', content: text })
  scrollToBottom()
}

const generateAIReply = (userText) => {
  isTyping.value = true
  scrollToBottom()
  
  setTimeout(() => {
    let reply = '感谢您的咨询！我是AI顾问，正在学习中。您可以尝试问我：\n• 推荐车型\n• 查询报价\n• 金融方案\n• 预约试驾'
    
    for (const [keyword, response] of Object.entries(AI_REPLIES)) {
      if (userText.includes(keyword)) {
        reply = response
        break
      }
    }
    
    messages.value.push({ role: 'ai', content: reply })
    isTyping.value = false
    scrollToBottom()
  }, 1500)
}

const scrollToBottom = () => {
  nextTick(() => {
    scrollTop.value = 99999
  })
}

const goBack = () => Taro.navigateBack()
</script>

<style lang="scss" scoped>
@import '@/app.scss';

.page {
  min-height: 100vh;
  background: $color-background;
  display: flex;
  flex-direction: column;
}

/* ===== Chat Header ===== */
.chat-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  background: $color-surface;
  border-bottom: 1rpx solid $color-border;
}

.chat-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-back-text {
  font-size: 40rpx;
  color: $color-text-primary;
  line-height: 1;
}

.chat-title {
  flex: 1;
  text-align: center;
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text-primary;
}

.chat-header-spacer {
  width: 64rpx;
}

/* ===== Messages Area ===== */
.chat-messages {
  flex: 1;
  padding: 100rpx 32rpx 0;
}

.msg {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.msg-user {
  flex-direction: row-reverse;
}

/* Avatars */
.msg-avatar-ai {
  width: 64rpx;
  height: 64rpx;
  border-radius: $radius-full;
  background: $color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.msg-avatar-text {
  font-size: 20rpx;
  font-weight: 700;
  color: #fff;
}

/* Bubbles */
.msg-bubble {
  max-width: 75%;
  padding: 20rpx 24rpx;
  border-radius: $radius-lg;
}

.msg-bubble.user {
  background: $color-primary;
}

.msg-bubble.ai {
  background: $color-surface;
  border: 1rpx solid $color-border;
}

.msg-text {
  font-size: 26rpx;
  color: $color-text-primary;
  line-height: 1.6;
  white-space: pre-wrap;
}

.typing-dots {
  font-size: 24rpx;
  color: $color-text-tertiary;
}

/* ===== Quick Replies ===== */
.quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  padding: 16rpx 0;
}

.quick-reply-btn {
  padding: 12rpx 24rpx;
  background: rgba(218, 41, 28, 0.06);
  border: 1rpx solid $color-border;
  border-radius: $radius-full;
}

.quick-reply-text {
  font-size: 24rpx;
  color: $color-primary;
  font-weight: 500;
}

/* ===== Input Bar ===== */
.input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $color-surface;
  border-top: 1rpx solid $color-border;
  padding: 12rpx 24rpx;
  padding-bottom: calc(12rpx + env(safe-area-inset-bottom));
}

.input-row {
  display: flex;
  gap: 12rpx;
  align-items: center;
}

.chat-input {
  flex: 1;
  height: 72rpx;
  padding: 0 20rpx;
  background: $color-background-secondary;
  border: 1rpx solid $color-border;
  border-radius: $radius-full;
  font-size: 26rpx;
  color: $color-text-primary;
  box-sizing: border-box;
}

.send-btn {
  padding: 0 32rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-border;
  border-radius: $radius-full;
  opacity: 0.5;
  transition: opacity 0.2s;

  &.active {
    background: $color-primary;
    opacity: 1;
  }
}

.send-btn-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #fff;
}
</style>
