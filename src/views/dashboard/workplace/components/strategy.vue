<template>
  <a-spin style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title> 游戏规则 </template>
      <template #extra>
        <a-link @click="edit"><icon-edit /> 编辑</a-link>
      </template>
      <a-space direction="vertical" :size="10" fill>
        <div class="strategy-box" v-html="content"></div>
      </a-space>
    </a-card>
  </a-spin>
  <Detail :visible="detailVisible" @call-back="detailCallBack"></Detail>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { strategyInfo } from '@/api/configure';
  import Detail from './detail.vue';

  const content = ref('');
  const detailVisible = ref(false);
  const fetchData = async () => {
    try {
      const { data } = await strategyInfo();
      content.value = data.content;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  fetchData();
  const edit = () => {
    detailVisible.value = true;
  };
  const detailCallBack = () => {
    fetchData();
    detailVisible.value = false;
  };
</script>

<style scoped lang="less">
  .general-card {
    min-height: 600px;
  }

  :deep(.arco-table-tr) {
    height: 44px;

    .arco-typography {
      margin-bottom: 0;
    }
  }

  .increases-cell {
    display: flex;
    align-items: center;

    span {
      margin-right: 4px;
    }
  }
</style>

<style scoped>
  >>> .strategy-box {
    width: 100%;
    height: 510px;
    overflow: auto;
  }
  >>> .strategy-box img {
    max-width: 100%;
  }
</style>
