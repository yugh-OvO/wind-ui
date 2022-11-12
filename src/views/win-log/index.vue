<template>
  <div class="container">
    <a-card class="general-card" title="中奖记录">
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
                <a-form-item field="receiver" label="收件人">
                  <a-input
                    v-model="formModel.receiver"
                    placeholder="请输入收件人"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="mobile" label="手机号码">
                  <a-input
                    v-model="formModel.mobile"
                    placeholder="请输入收件人手机号码"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="winTimeRange" label="中奖时间">
                  <a-range-picker
                    v-model="formModel.winTimeRange"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 34px" direction="vertical" />
        <a-col :flex="'198px'" style="display: inline-block; text-align: right">
          <a-space :size="24">
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
      <a-divider style="margin-top: 0; margin-bottom: 16px" />
      <a-row style="margin-bottom: 16px">
        <a-button type="primary" @click="exportData">
          <template #icon>
            <icon-cloud-download />
          </template>
          导出
        </a-button>
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
          <a-table-column title="编号" data-index="id" />
          <a-table-column title="奖品名称" data-index="name" />
          <a-table-column title="收件人" data-index="receiver" />
          <a-table-column title="手机号码" data-index="mobile" />
          <a-table-column title="收货地址" data-index="address" />
          <a-table-column title="中奖时间" data-index="winTime" />
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { Pagination } from '@/types/global';
  import useLoading from '@/hooks/loading';
  import {
    winLogList,
    WinLogRecord,
    WinLogParams,
    winLogExport,
  } from '@/api/win-log';

  const generateFormModel = () => {
    return {
      receiver: '',
      mobile: '',
      winTimeRange: [],
    };
  };

  const { loading, setLoading } = useLoading(true);
  const renderData = ref<WinLogRecord[]>([]);
  const formModel = ref(generateFormModel());
  const currentParam = ref('');
  const currentJsonResult = ref('');

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

  const fetchData = async (
    params: WinLogParams = { ...pagination, ...formModel.value }
  ) => {
    setLoading(true);
    try {
      const { data } = await winLogList(params);
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

  const reset = () => {
    formModel.value = generateFormModel();
    pagination.current = 1;
    search();
  };

  fetchData();

  const exportData = async (
    params: WinLogParams = { ...pagination, ...formModel.value }
  ) => {
    try {
      const { data } = await winLogExport(params);
      window.open(data.url);
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
  }
</style>
