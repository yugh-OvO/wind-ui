<template>
  <div class="container">
    <a-card class="general-card" title="角色管理">
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
          <a-table-column title="名称" data-index="name" />
          <a-table-column title="创建时间" data-index="createTime" />
          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <div v-if="record.id != 1">
                <a-link @click="detail(record.id)"> 编辑 </a-link>
                <a-link @click="auth(record.id)"> 设置权限 </a-link>
                <a-popconfirm
                  content="确定要删除此角色吗?"
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
      @call-back="detailCallBack"
    />
    <Auth
      :id="currentId"
      :menu-options="menuOptions"
      :visible="authVisible"
      @call-back="authCallBack"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import { roleList, RoleRecord, RoleParams, destroyRole } from '@/api/role';
  import { menuList, MenuRecord } from '@/api/menu';
  import Detail from './detail.vue';
  import Auth from './auth.vue';

  const generateFormModel = () => {
    return {
      createTimeRange: [],
    };
  };

  const currentId = ref(0);
  const detailVisible = ref(false);
  const authVisible = ref(false);
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<RoleRecord[]>([]);
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

  const menuOptions = ref<MenuRecord[]>([]);

  const fetchData = async (
    params: RoleParams = { ...pagination, ...formModel.value }
  ) => {
    setLoading(true);
    try {
      const { data } = await roleList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuList = async () => {
    try {
      const { data } = await menuList();
      menuOptions.value = data;
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
  fetchMenuList();

  const detail = (id: number) => {
    currentId.value = id;
    detailVisible.value = true;
  };

  const auth = (id: number) => {
    currentId.value = id;
    authVisible.value = true;
  };

  const detailCallBack = (fresh: boolean) => {
    currentId.value = 0;
    detailVisible.value = false;
    if (fresh) {
      fetchData();
    }
  };

  const authCallBack = () => {
    currentId.value = 0;
    authVisible.value = false;
  };

  const destroy = (id: number) => {
    destroyRole(id).then(() => {
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
