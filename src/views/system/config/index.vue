<template>
  <div class="container">
    <a-card class="general-card" title="参数设置">
      <a-row style="margin-bottom: 16px">
        <a-button type="primary" @click="detail(0)">
          <template #icon>
            <icon-plus />
          </template>
          新增
        </a-button>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="false"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #columns>
          <a-table-column title="名称" data-index="name" />
          <a-table-column title="键名" data-index="code" />
          <a-table-column title="键值" data-index="value" />
          <a-table-column title="系统内置参数" data-index="type">
            <template #cell="{ record }">
              <span>{{ record.type == 1 ? '是' : '否' }}</span>
            </template>
          </a-table-column>
          <a-table-column title="备注" data-index="remark" />
          <a-table-column title="创建时间" data-index="createTime" />
          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <a-link @click="detail(record.id)"> 编辑 </a-link>
              <a-popconfirm
                content="确定要删除此用户吗?"
                @ok="destroy(record.id)"
              >
                <a-link> 删除 </a-link>
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
  import { ref, reactive } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import {
    configList,
    ConfigRecord,
    ConfigParams,
    changeConfigStatus,
    destroyConfig,
  } from '@/api/config';
  import Detail from './detail.vue';

  const generateFormModel = () => {
    return {
      createTimeRange: [],
    };
  };

  const currentId = ref(0);
  const detailVisible = ref(false);
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<ConfigRecord[]>([]);
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

  const fetchData = async (
    params: ConfigParams = { ...pagination, ...formModel.value }
  ) => {
    setLoading(true);
    try {
      const { data } = await configList(params);
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

  const detail = (id: number) => {
    currentId.value = id;
    detailVisible.value = true;
  };
  const detailCallBack = (fresh: boolean) => {
    currentId.value = 0;
    detailVisible.value = false;
    if (fresh) {
      fetchData();
    }
  };
  const changeStatus = (id: number, status: number) => {
    changeConfigStatus(id, status).then(() => {
      Message.success('操作成功');
      search();
    });
  };
  const destroy = (id: number) => {
    destroyConfig(id).then(() => {
      Message.success('删除成功');
      search();
    });
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
  }
</style>
