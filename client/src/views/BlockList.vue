<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <div>
        <h1 style="color:white;margin-bottom:8px;">屏蔽名单管理</h1>
        <p style="color:rgba(255,255,255,0.8);">管理已屏蔽的发布者，被屏蔽者的盲盒不会出现在你的市场列表中</p>
      </div>
      <router-link to="/">
        <button class="btn btn-secondary">返回市场</button>
      </router-link>
    </div>

    <div v-if="loading" style="text-align:center;padding:60px;color:white;">
      加载中...
    </div>

    <div v-else-if="blocks.length === 0" class="empty-state card">
      <h2>暂无屏蔽记录</h2>
      <p>你还没有屏蔽任何发布者，在盲盒详情页可以屏蔽不想看到的发布者</p>
    </div>

    <div v-else class="card">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:2px solid #f0f0f0;">
            <th style="text-align:left;padding:16px 12px;color:#666;font-weight:600;">发布者名称</th>
            <th style="text-align:left;padding:16px 12px;color:#666;font-weight:600;">屏蔽时间</th>
            <th style="text-align:right;padding:16px 12px;color:#666;font-weight:600;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="block in blocks" :key="block.id" style="border-bottom:1px solid #f5f5f5;">
            <td style="padding:16px 12px;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">
                  {{ block.blockedUserName.charAt(0) }}
                </div>
                <span style="font-weight:500;">{{ block.blockedUserName }}</span>
              </div>
            </td>
            <td style="padding:16px 12px;color:#666;">{{ formatDate(block.createdAt) }}</td>
            <td style="padding:16px 12px;text-align:right;">
              <button
                class="btn btn-primary"
                :disabled="unblockingId === block.id"
                @click="handleUnblock(block)"
                style="padding:6px 16px;font-size:13px;"
              >
                {{ unblockingId === block.id ? '取消中...' : '取消屏蔽' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBlocks, unblockUser } from '../api/index.js'
import { userStore } from '../store/user.js'

const blocks = ref([])
const loading = ref(true)
const unblockingId = ref(null)

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return y + '-' + m + '-' + d + ' ' + hh + ':' + mm
}

async function loadBlocks() {
  loading.value = true
  try {
    blocks.value = await getBlocks(userStore.user.id)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function handleUnblock(block) {
  if (!confirm(`确定要取消屏蔽「${block.blockedUserName}」吗？取消后，该用户发布的盲盒将重新出现在市场列表中。`)) {
    return
  }
  unblockingId.value = block.id
  try {
    await unblockUser(userStore.user.id, block.blockedUserId)
    blocks.value = blocks.value.filter(b => b.id !== block.id)
    alert('已取消屏蔽')
  } catch (e) {
    alert('操作失败：' + (e.response && e.response.data ? e.response.data.error : e.message))
  } finally {
    unblockingId.value = null
  }
}

onMounted(loadBlocks)
</script>
