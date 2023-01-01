<template>
  <div class="panel">
    <div class="background-op">
      <a-space :size="12" direction="vertical" align="center">
        <a-avatar :size="64">
          <template #trigger-icon>
            <icon-camera />
          </template>
          <img
            :src="
              userInfo.avatar ||
              'https://horsevision.oss-cn-hangzhou.aliyuncs.com/yhc/avatar.webp'
            "
          />
        </a-avatar>
        <a-typography-title class="title" :heading="5">
          个人信息
        </a-typography-title>
        <a-typography-title class="nickname" :heading="6">
          {{ userInfo.nickname }}
        </a-typography-title>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store';

  const userInfo = useUserStore();
</script>

<style scoped lang="less">
  .panel {
    margin-top: 20px;
    height: 75vh;
    color: var(--gray-10);
    background: url(https://horsevision.oss-cn-hangzhou.aliyuncs.com/shiguangji/2022/1/1669730758_936_wallpaper-butterfly.jpeg)
      no-repeat;
    background-size: cover;
    border-radius: 4px;

    :deep(.arco-avatar-trigger-icon-button) {
      color: rgb(var(--arcoblue-6));

      :deep(.arco-icon) {
        vertical-align: -1px;
      }
    }
    .user-msg {
      .arco-icon {
        color: rgb(var(--gray-10));
      }
      .arco-typography {
        margin-left: 6px;
      }
    }
    .background-op {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: rgba(75, 85, 99, 0.8);
    }
    .title {
      color: #fff;
      margin-top: 20px;
      margin-bottom: 0;
    }
    .nickname {
      color: rgba(255, 255, 255, 0.75);
      margin: 0;
    }
  }
</style>
