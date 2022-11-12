<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <!-- <img
          alt="logo"
          src=""
          width="33"
        /> -->
        <a-typography-title
          :style="{ margin: 0, fontSize: '18px' }"
          :heading="5"
        >
          讲述时光的故事
        </a-typography-title>
        <icon-menu-fold
          v-if="appStore.device === 'mobile'"
          style="font-size: 22px; cursor: pointer"
          @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <ul class="right-side">
      <li>
        <a-tooltip content="点击设置奖品发放参数">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="setting"
          >
            <icon-settings />
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-popover title="扫码体验游戏">
          <a-button class="nav-btn" type="outline" :shape="'circle'">
            <icon-qrcode />
          </a-button>
          <template #content>
            <img :src="code" style="width: 150px" />
          </template>
        </a-popover>
      </li>
      <li>
        <a-tooltip
          :content="
            theme === 'light' ? '点击切换为暗黑模式' : '点击切换为亮色模式'
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="handleToggleTheme"
          >
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip
          :content="isFullscreen ? '点击退出全屏模式' : '点击切换全屏模式'"
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="toggleFullScreen"
          >
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-dropdown trigger="click">
          <a-avatar
            :size="32"
            :style="{
              marginRight: '8px',
              cursor: 'pointer',
              backgroundColor: '#d3dafe!important',
            }"
          >
            <img alt="avatar" :src="avatar" />
          </a-avatar>
          <template #content>
            <a-doption>
              <a-space @click="password">
                <icon-lock />
                <span> 修改密码 </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span> 退出登录 </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
  <Password :visible="passwordVisible" @call-back="passwordCallBack" />
  <Setting :visible="settingVisible" @call-back="settingCallBack" />
</template>

<script lang="ts" setup>
  import { computed, ref, inject } from 'vue';
  import { useDark, useToggle, useFullscreen } from '@vueuse/core';
  import { useAppStore, useUserStore } from '@/store';
  import useUser from '@/hooks/user';
  import Password from './password.vue';
  import Setting from './setting.vue';

  const appStore = useAppStore();
  const userStore = useUserStore();
  const { logout } = useUser();
  const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
  const avatar = computed(() => {
    return userStore.avatar
      ? userStore.avatar
      : 'https://horsevision.oss-cn-hangzhou.aliyuncs.com/yhc/avatar.webp';
  });
  const code = 'https://horsevision.oss-cn-hangzhou.aliyuncs.com/yhc/code.png';
  const theme = computed(() => {
    return appStore.theme;
  });
  const isDark = useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
      // overridden default behavior
      appStore.toggleTheme(dark);
    },
  });
  const toggleTheme = useToggle(isDark);
  const handleToggleTheme = () => {
    toggleTheme();
  };
  const refBtn = ref();
  const triggerBtn = ref();
  const settingVisible = ref(false);
  const handleLogout = () => {
    logout();
  };
  const toggleDrawerMenu = inject('toggleDrawerMenu');
  const passwordVisible = ref(false);
  const passwordCallBack = () => {
    passwordVisible.value = false;
  };
  const password = () => {
    passwordVisible.value = true;
  };
  const setting = () => {
    settingVisible.value = true;
  };
  const settingCallBack = () => {
    settingVisible.value = false;
  };
</script>

<style scoped lang="less">
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
  }

  .left-side {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }

  .right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      padding: 0 10px;
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }

    .nav-btn {
      color: rgb(var(--gray-8));
      font-size: 16px;
      border-color: rgb(var(--gray-2));
    }

    .trigger-btn,
    .ref-btn {
      position: absolute;
      bottom: 14px;
    }

    .trigger-btn {
      margin-left: 14px;
    }
  }
</style>

<style lang="less">
  .message-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }
</style>
