<template>
  <div class="container">
    <a-card class="general-card" title="成员管理">
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
        :pagination="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #columns>
          <a-table-column title="编号" data-index="id" />
          <a-table-column title="用户名" data-index="username" />
          <a-table-column title="昵称" data-index="nickname" />
          <a-table-column title="手机号码" data-index="mobile" />
          <a-table-column title="状态" data-index="isRecommen">
            <template #cell="{ record }">
              <span v-if="record.status === 1" class="circle pass" />
              <span v-else class="circle warn" />
              {{ record.status === 1 ? '正常' : '禁用' }}
            </template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="createTime" />
          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <div v-if="record.id != 1">
                <a-link @click="detail(record.id)"> 编辑 </a-link>
                <a-popconfirm
                  v-if="record.status === 1"
                  content="确定要禁用此成员吗?"
                  @ok="changeStatus(record.id, 2)"
                >
                  <a-link> 禁用 </a-link>
                </a-popconfirm>
                <a-popconfirm
                  v-else
                  content="确定要恢复此成员吗?"
                  @ok="changeStatus(record.id, 1)"
                >
                  <a-link> 恢复 </a-link>
                </a-popconfirm>
                <a-popconfirm
                  content="确定要删除此用户吗?"
                  @ok="destroy(record.id)"
                >
                  <a-link> 删除 </a-link>
                </a-popconfirm>
              </div>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <Detail
      :id="currentId"
      :visible="detailVisible"
      :role-options="roleOptions"
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
    userList,
    UserRecord,
    UserParams,
    changeUserStatus,
    destroyUser,
  } from '@/api/user';
  import { getRoleOptions } from '@/api/role';
  import Detail from './detail.vue';

  const generateFormModel = () => {
    return {
      createTimeRange: [],
    };
  };

  const currentId = ref(0);
  const detailVisible = ref(false);
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<UserRecord[]>([]);
  const formModel = ref(generateFormModel());

  const roleOptions = ref([]);

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
    params: UserParams = { ...pagination, ...formModel.value }
  ) => {
    setLoading(true);
    try {
      const { data } = await userList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleOptions = async () => {
    const { data } = await getRoleOptions();
    roleOptions.value = data;
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
  fetchRoleOptions();

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
    changeUserStatus(id, status).then(() => {
      Message.success('操作成功');
      search();
    });
  };
  const destroy = (id: number) => {
    destroyUser(id).then(() => {
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
