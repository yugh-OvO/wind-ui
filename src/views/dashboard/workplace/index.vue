<template>
  <div class="container">
    <div class="left-side">
      <div class="panel">
        <Banner />
        <Statistics />
      </div>
      <a-grid
        :cols="24"
        :col-gap="16"
        :row-gap="16"
        style="margin-top: 16px; padding-bottom: 10px"
      >
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 14, xl: 14, xxl: 14 }"
        >
          <Rank />
        </a-grid-item>
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 10, xl: 10, xxl: 10 }"
        >
          <Strategy />
        </a-grid-item>
      </a-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Banner from './components/banner.vue';
  import Statistics from './components/statistics.vue';
  import Rank from './components/rank.vue';
  import Strategy from './components/strategy.vue';
</script>

<script lang="ts">
  export default {
    name: 'Dashboard',
  };
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    padding: 16px 20px;
    padding-bottom: 0;
    background-color: var(--color-fill-2);
  }

  .left-side {
    flex: 1;
    overflow: auto;
  }

  .panel {
    overflow: auto;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.panel-border) {
    margin-bottom: 0;
    border-bottom: 1px solid rgb(var(--gray-2));
  }

  .moduler-wrap {
    background-color: var(--color-bg-2);
    border-radius: 4px;

    :deep(.text) {
      color: rgb(var(--gray-8));
      font-size: 12px;
      text-align: center;
    }

    :deep(.wrapper) {
      margin-bottom: 8px;
      text-align: center;
      cursor: pointer;

      &:last-child {
        .text {
          margin-bottom: 0;
        }
      }

      &:hover {
        .icon {
          color: rgb(var(--arcoblue-6));
          background-color: #e8f3ff;
        }

        .text {
          color: rgb(var(--arcoblue-6));
        }
      }
    }

    :deep(.icon) {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-bottom: 4px;
      color: rgb(var(--dark-gray-1));
      font-size: 16px;
      line-height: 32px;
      text-align: center;
      background-color: rgb(var(--gray-1));
      border-radius: 4px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  .mobile {
    .container {
      display: block;
    }
  }
</style>
