<template>
  <div class="container">
    <a-card class="general-card" title="操作日志">
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
                <a-form-item field="title" label="系统模块">
                  <a-input
                    v-model="formModel.title"
                    placeholder="请输入系统模块"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="name" label="操作人员">
                  <a-input
                    v-model="formModel.name"
                    placeholder="请输入操作人员"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="operationTimeRange" label="操作时间">
                  <a-range-picker
                    v-model="formModel.operationTimeRange"
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
      <a-divider style="margin-top: 0" />
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
          <a-table-column title="系统模块" data-index="title" />
          <a-table-column title="操作类型" data-index="operatorType">
            <template #cell="{ record }">
              <a-tag :color="typeTag[record.businessType]">{{
                typeText[record.businessType]
              }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="请求方式" data-index="requestMethod" />
          <a-table-column title="操作人员" data-index="name" />
          <a-table-column title="ip" data-index="ip" />
          <a-table-column title="地点" data-index="location" />
          <a-table-column title="操作时间" data-index="operationTime" />
          <a-table-column title="状态" data-index="status">
            <template #cell="{ record }">
              <span v-if="record.status === 1" class="circle pass" />
              <span v-else class="circle warn" />
              {{ record.status === 1 ? '成功' : '失败' }}
            </template>
          </a-table-column>
          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <a-link @click="detail(record.param, record.jsonResult)">
                详情
              </a-link>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <Detail
      :json-result="currentJsonResult"
      :param="currentParam"
      :visible="detailVisible"
      @call-back="detailCallBack"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import {
    operationLogList,
    OperationLogRecord,
    OperationLogParams,
  } from '@/api/operation-log';
  import Detail from './detail.vue';

  const generateFormModel = () => {
    return {
      name: '',
      title: '',
      operationTimeRange: [],
    };
  };

  const typeText: string[] = [
    '其他',
    '新增',
    '修改',
    '删除',
    '授权',
    '导出',
    '导入',
    '强退',
    '生成代码',
    '清空',
  ];
  const typeTag: string[] = [
    'gray',
    'lime',
    'purple',
    'magenta',
    'cyan',
    'green',
    'blue',
    'red',
    'orange',
    'gold',
  ];

  const detailVisible = ref(false);
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<OperationLogRecord[]>([]);
  const formModel = ref(generateFormModel());
  const currentParam = ref('');
  const currentJsonResult = ref('');

  const pagination = reactive({
    current: 1,
    pageSize: 20,
    total: 0,
    hideOnSinglePage: true,
    showTotal: true,
    showJumper: true,
    showPageSize: true,
  });

  const fetchData = async (
    params: OperationLogParams = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formModel.value,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await operationLogList(params);
      renderData.value = data.list;
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

  const detail = (param: string, jsonResult: string) => {
    currentParam.value = param;
    currentJsonResult.value = jsonResult;
    detailVisible.value = true;
  };
  const detailCallBack = () => {
    detailVisible.value = false;
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
  }
</style>
