<template>
  <div class="container">
    <a-card class="general-card" title="菜单管理">
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
        :data="renderData"
        :pagination="false"
        :bordered="false"
      >
        <template #columns>
          <a-table-column title="名称" data-index="name" :width="350" />
          <a-table-column title="权限标识" data-index="mark" />
          <a-table-column title="创建时间" data-index="createTime" />
          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <a-link @click="detail(record.id)"> 编辑 </a-link>
              <a-popconfirm
                content="确定要删除此菜单吗?"
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
      :menu-options="renderData"
      @call-back="detailCallBack"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import { menuList, MenuRecord, MenuParams, destroyMenu } from '@/api/menu';
  import Detail from './detail.vue';

  const generateFormModel = () => {
    return {
      createTimeRange: [],
    };
  };

  const currentId = ref(0);
  const detailVisible = ref(false);
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<MenuRecord[]>([]);
  const formModel = ref(generateFormModel());

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await menuList();
      renderData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
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
  const destroy = (id: number) => {
    destroyMenu(id).then(() => {
      Message.success('操作成功');
      fetchData();
    });
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
  }
</style>
