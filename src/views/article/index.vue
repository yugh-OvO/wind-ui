<template>
  <div class="container">
    <a-card class="general-card" title="文章管理">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="20">
              <a-col :span="8">
                <a-form-item field="name" label="文章名称">
                  <a-input
                    v-model="formModel.name"
                    placeholder="请输入文章名称"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="createTimeRange" label="发布时间">
                  <a-range-picker
                    v-model="formModel.createTimeRange"
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
      >
        <template #columns>
          <a-table-column title="文章编号" data-index="id" />
          <a-table-column title="名称" data-index="title" />
          <a-table-column title="状态" data-index="status">
            <template #cell="{ record }">
              <span v-if="record.status === 1" class="circle pass" />
              <span v-else class="circle warn" />
              {{ record.status === 1 ? '显示' : '隐藏' }}
            </template>
          </a-table-column>
          <a-table-column title="发布时间" data-index="createTime" />
          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <span class="table-button" @click="detail(record.id)">
                编辑
              </span>
              <a-popconfirm
                v-if="record.status === 1"
                content="确定要隐藏此文章吗?"
                @ok="changeStatus(record.id, 2)"
              >
                <span class="table-button"> 隐藏 </span>
              </a-popconfirm>
              <a-popconfirm
                v-else
                content="确定要显示此文章吗?"
                @ok="changeStatus(record.id, 1)"
              >
                <span class="table-button"> 显示 </span>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <Detail
      :id="currentId"
      :category-options="categoryOptions"
      :visible="detailVisible"
      @call-back="detailCallBack"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import { Message } from '@arco-design/web-vue';
  import {
    articleList,
    ArticleRecord,
    ArticleParams,
    changeArticleStatus,
    getArticleCategoryOptions,
  } from '@/api/article';
  import Detail from './detail.vue';

  const generateFormModel = () => {
    return {
      createTimeRange: [],
      name: '',
    };
  };

  const currentId = ref(0);
  const detailVisible = ref(false);
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<ArticleRecord[]>([]);
  const formModel = ref(generateFormModel());

  const categoryOptions = ref([]);

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };

  const pagination = reactive({
    ...basePagination,
  });

  const fetchData = async (
    params: ArticleParams = { ...pagination, ...formModel.value }
  ) => {
    setLoading(true);
    try {
      const { data } = await articleList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const getCategoryOptions = async () => {
    const { data } = await getArticleCategoryOptions();
    categoryOptions.value = data;
  };

  const search = () => {
    pagination.current = 1;
    fetchData();
  };

  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData();
  };

  const reset = () => {
    formModel.value = generateFormModel();
    pagination.current = 1;
    search();
  };

  fetchData();
  getCategoryOptions();

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
    changeArticleStatus(id, status).then(() => {
      Message.success('操作成功');
      search();
    });
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
  }

  .table-button {
    margin-right: 12px;
    color: rgb(var(--arcoblue-6));
    cursor: pointer;

    &:hover {
      color: rgb(var(--arcoblue-5));
    }
  }
</style>
