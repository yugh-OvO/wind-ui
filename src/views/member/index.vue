<template>
  <div class="container">
    <a-card class="general-card" title="用户列表">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
            :auto-label-width="true"
          >
            <a-row :gutter="50">
              <a-col :span="8">
                <a-form-item field="nickname" label="昵称">
                  <a-input
                    v-model="formModel.nickname"
                    placeholder="请输入昵称"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" label="用户状态">
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    placeholder="请选择用户状态"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="registerTimeRange" label="注册时间">
                  <a-range-picker
                    v-model="formModel.registerTimeRange"
                    style="width: 100%"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="50">
              <a-col :span="8">
                <a-form-item field="source" label="来源">
                  <a-select
                    v-model="formModel.source"
                    placeholder="请选择注册来源"
                    :allow-clear="true"
                  >
                    <a-option :value="1" label="微信"></a-option>
                    <a-option :value="2" label="微博"></a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="winStatus" label="中奖状态">
                  <a-select
                    v-model="formModel.winStatus"
                    placeholder="请选择中奖状态"
                    :allow-clear="true"
                  >
                    <a-option :value="1" label="未中奖"></a-option>
                    <a-option :value="2" label="待领奖"></a-option>
                    <a-option :value="3" label="已领奖"></a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #columns>
          <a-table-column title="昵称" data-index="nickname">
            <template #cell="{ record }">
              <a-avatar :size="32" style="margin-right: 3px">
                <img alt="avatar" :src="record.avatar" />
              </a-avatar>
              {{ record.nickname }}
            </template>
          </a-table-column>
          <a-table-column title="来源" data-index="source">
            <template #cell="{ record }">
              {{ record.source == 1 ? '微信' : '微博' }}
            </template>
          </a-table-column>
          <a-table-column title="最高收益率" data-index="profitRate">
            <template #cell="{ record }"> {{ record.profitRate }}% </template>
          </a-table-column>
          <a-table-column title="游戏次数" data-index="gameCount" />
          <a-table-column title="中奖状态" data-index="winStatusName" />
          <a-table-column title="注册时间" data-index="registerTime" />
          <a-table-column title="状态" data-index="status">
            <template #cell="{ record }">
              <span v-if="record.status === 1" class="circle pass" />
              <span v-else class="circle warn" />
              {{ record.status === 1 ? '正常' : '已封号' }}
            </template>
          </a-table-column>
          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <a-link @click="detail(record.id)"> 查看 </a-link>
              <a-popconfirm
                v-if="record.status === 1"
                content="确定要封禁此账号吗?"
                @ok="changeStatus(record.id, 2)"
              >
                <a-link> 封号 </a-link>
              </a-popconfirm>
              <a-popconfirm
                v-else
                content="确定要恢复此账号吗?"
                @ok="changeStatus(record.id, 1)"
              >
                <a-link> 恢复 </a-link>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <Detail
      :id="currentId"
      :visible="detailVisible"
      @call-back="detailCallBack"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import {
    memberList,
    MemberRecord,
    MemberParams,
    changeMemberStatus,
  } from '@/api/member';
  import Detail from './detail.vue';

  const generateFormModel = () => {
    return {
      nickname: '',
      registerTimeRange: [],
      status: '',
      source: null,
      winStatus: null,
    };
  };
  const currentId = ref(0);
  const detailVisible = ref(false);
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<MemberRecord[]>([]);
  const formModel = ref(generateFormModel());
  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
    hideOnSinglePage: true,
    showTotal: true,
    showJumper: true,
    showPageSize: true,
  });

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: '正常',
      value: 1,
    },
    {
      label: '已封号',
      value: 2,
    },
  ]);
  const fetchData = async (
    params: MemberParams = { ...pagination, ...formModel.value }
  ) => {
    setLoading(true);
    try {
      const { data } = await memberList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    pagination.current = 1;
    fetchData();
  };

  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData();
  };

  const onPageSizeChange = (pageSize: number) => {
    pagination.current = 1;
    pagination.pageSize = pageSize;
    fetchData();
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
    pagination.current = 1;
    search();
  };
  const detail = (id: number) => {
    currentId.value = id;
    detailVisible.value = true;
  };
  const detailCallBack = () => {
    currentId.value = 0;
    detailVisible.value = false;
  };
  const changeStatus = (id: number, status: number) => {
    changeMemberStatus(id, status).then(() => {
      Message.success('操作成功');
      search();
    });
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
  }
</style>
