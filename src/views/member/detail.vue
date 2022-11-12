<template>
  <a-modal
    v-model:visible="visible"
    title="用户信息"
    :mask-closable="false"
    :footer="false"
    width="70%"
    top="15vh"
    :align-center="false"
    @before-open="open"
    @cancel="close"
  >
    <div class="item-container">
      <a-space :size="16" direction="vertical" fill>
        <a-descriptions
          :loading="loading"
          title="账号基础信息"
          :align="{ label: 'right' }"
        >
          <a-descriptions-item label="昵称">
            <span>
              <a-avatar :size="32" style="margin-right: 3px">
                <img alt="avatar" :src="formData.avatar" />
              </a-avatar>
              {{ formData.nickname }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item label="性别">
            <span>{{ formData.gender === 1 ? '男' : '女' }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="注册时间">
            <span>{{ formData.registerTime }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="最高收益率">
            <span>{{ formData.profitRate }}%</span>
          </a-descriptions-item>
          <a-descriptions-item label="游戏次数">
            <span>{{ formData.gameCount }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="中奖状态">
            <span>{{ formData.winStatusName }}</span>
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions title="游戏记录" :label-style="{ display: 'none' }">
          <a-table
            style="min-height: 520px"
            row-key="id"
            :loading="loading"
            :pagination="pagination"
            :data="renderData"
            :bordered="false"
            :scroll="{ y: 410 }"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
          >
            <template #columns>
              <a-table-column title="收益率" data-index="profitRate">
                <template #cell="{ record }">
                  <span>{{ record.profitRate }}%</span>
                </template>
              </a-table-column>
              <a-table-column title="时间" data-index="createTime" />
            </template>
          </a-table>
        </a-descriptions>
      </a-space>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    memberInfo,
    gameLog,
    GameLogRecord,
    GameLogParams,
  } from '@/api/member';
  import { Pagination } from '@/types/global';

  interface Props {
    visible: boolean;
    id: number;
  }
  const props = defineProps<Props>();

  const id = computed({
    get() {
      return props.id;
    },
    set() {
      // do nothing
    },
  });

  const visible = computed({
    get() {
      return props.visible;
    },
    set() {
      // do nothing
    },
  });

  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };

  const pagination = reactive({
    ...basePagination,
    hideOnSinglePage: true,
    showTotal: true,
    showJumper: true,
    showPageSize: true,
  });

  const { loading, setLoading } = useLoading(true);
  const renderData = ref<GameLogRecord[]>([]);

  const fetchData = async (
    params: GameLogParams = {
      ...pagination,
      memberId: props.id,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await gameLog(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } finally {
      setLoading(false);
    }
  };

  const onPageSizeChange = (pageSize: number) => {
    pagination.current = 1;
    pagination.pageSize = pageSize;
    fetchData();
  };

  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData();
  };

  const generateForm = () => {
    return {
      nickname: '',
      avatar: '',
      gender: 0,
      registerTime: '',
      profitRate: 0,
      gameCount: 0,
      winStatusName: '',
    };
  };

  const formData = reactive(generateForm());

  const emit = defineEmits(['callBack']);

  const close = () => {
    emit('callBack');
  };
  // 获取详情
  const getInfo = () => {
    setLoading(true);
    memberInfo(id.value)
      .then((rs: any) => {
        Object.assign(formData, rs.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const open = () => {
    if (id.value) {
      getInfo();
      fetchData();
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'Detail',
  };
</script>
