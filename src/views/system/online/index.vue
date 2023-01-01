<template>
  <div class="container">
    <a-card class="general-card" title="在线用户">
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
                <a-form-item field="loginTimeRange" label="登录时间">
                  <a-range-picker
                    v-model="formModel.loginTimeRange"
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
          <a-table-column title="用户名" data-index="username" />
          <a-table-column title="ip" data-index="ip" />
          <a-table-column title="地点" data-index="location" />
          <a-table-column title="浏览器" data-index="browser" />
          <a-table-column title="操作系统" data-index="os" />
          <a-table-column title="登录时间" data-index="loginTime" />
          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <a-popconfirm
                content="确定要强制该用户下线吗?"
                @ok="forceQuit(record.token)"
              >
                <a-link>强制下线</a-link>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import { Message } from '@arco-design/web-vue';
  import { onlineList, OnlineRecord, OnlineParams, quit } from '@/api/online';

  const generateFormModel = () => {
    return {
      name: '',
      title: '',
      loginTimeRange: [],
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
  const renderData = ref<OnlineRecord[]>([]);
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
    params: OnlineParams = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formModel.value,
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await onlineList(params);
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
  const forceQuit = (token: string) => {
    quit(token).then(() => {
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
