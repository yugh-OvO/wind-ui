<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title> 排行榜 </template>
      <template #extra>
        <a-radio-group
          v-model:model-value="source"
          type="button"
          @change="sourceChange as any"
        >
          <a-radio :value="1"> 微信 </a-radio>
          <a-radio :value="2"> 微博 </a-radio>
        </a-radio-group>
      </template>
      <a-space direction="vertical" :size="10" fill>
        <a-table
          :data="renderList"
          :scroll="{ y: 460 }"
          :pagination="false"
          :bordered="false"
        >
          <template #columns>
            <a-table-column title="排名" data-index="rank" :width="80" />
            <a-table-column title="昵称" data-index="nickname">
              <template #cell="{ record }">
                <a-avatar :size="32" style="margin-right: 3px">
                  <img alt="avatar" :src="record.avatar" />
                </a-avatar>
                {{ record.nickname }}
              </template>
            </a-table-column>
            <a-table-column
              title="最高收益率"
              data-index="profitRate"
              :width="120"
            >
              <template #cell="{ record }"> {{ record.profitRate }}% </template>
            </a-table-column>
            <a-table-column
              title="游戏次数"
              data-index="gameCount"
              :width="100"
            />
            <a-table-column
              title="中奖状态"
              data-index="winStatusName"
              :width="100"
            />
            <a-table-column title="注册时间" data-index="registerTime" />
            <a-table-column title="操作" data-index="operations" :width="100">
              <template #cell="{ record }">
                <a-link @click="detail(record.id)"> 查看 </a-link>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
  <Detail
    :id="currentId"
    :visible="detailVisible"
    @call-back="detailCallBack"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { memberRank, MemberRecord, MemberParams } from '@/api/member';
  import type { TableData } from '@arco-design/web-vue/es/table/interface';
  import Detail from '@/views/member/detail.vue';

  const source = ref(1);
  const currentId = ref(0);
  const detailVisible = ref(false);

  const { loading, setLoading } = useLoading();
  const renderList = ref<MemberRecord[]>();
  const fetchData = async (
    params: MemberParams = { current: 1, pageSize: 10, source: source.value }
  ) => {
    setLoading(true);
    try {
      const { data } = await memberRank(params);
      renderList.value = data.list;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const sourceChange = (sourceType: number) => {
    source.value = sourceType;
    fetchData();
  };
  fetchData();
  const detail = (id: number) => {
    currentId.value = id;
    detailVisible.value = true;
  };
  const detailCallBack = () => {
    currentId.value = 0;
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
