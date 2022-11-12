<template>
  <a-modal
    v-model:visible="visible"
    title="菜单详情"
    :mask-closable="false"
    width="600px"
    top="15vh"
    :align-center="false"
    :on-before-ok="handleSubmit"
    @before-open="open"
    @cancel="close"
    @close="clearForm"
  >
    <div class="item-container">
      <a-form ref="formRef" auto-label-width :model="formData">
        <a-form-item
          field="name"
          label="名称"
          :rules="[{ required: true, message: '请填写菜单名称' }]"
          :validate-trigger="['change', 'input']"
        >
          <a-input v-model="formData.name" placeholder="请填写菜单名称" />
        </a-form-item>
        <a-form-item field="parentId" label="上级菜单">
          <a-cascader
            v-model="formData.parentId"
            :check-strictly="true"
            :options="menuOptions"
            :field-names="{ label: 'name', value: 'id' }"
            placeholder="请选择上级菜单"
          />
        </a-form-item>
        <a-form-item field="type" label="类型">
          <a-radio-group v-model="formData.type" :options="typeOptions" />
        </a-form-item>
        <a-form-item field="seoKeywords" label="排序">
          <a-input-number
            v-model="formData.sort"
            placeholder="请填写排序值，越大越靠前"
          />
        </a-form-item>
        <a-form-item field="mark" label="权限标识">
          <a-input v-model="formData.mark" placeholder="请填写权限标识" />
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-textarea v-model="formData.remark" placeholder="请填写备注信息" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { Message } from '@arco-design/web-vue';
  import { ref, unref, reactive, computed } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { menuInfo, submitMenu } from '@/api/menu';

  const formRef = ref<FormInstance>();

  interface Props {
    visible: boolean;
    id: number;
    menuOptions: any[];
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

  const typeOptions = [
    {
      label: '目录',
      value: 1,
    },
    {
      label: '菜单',
      value: 2,
    },
    {
      label: '按钮',
      value: 3,
    },
  ];

  const { loading, setLoading } = useLoading(true);

  const generateForm = () => {
    return {
      id: null,
      name: '',
      parentId: null,
      sort: 0,
      type: 0,
      mark: '',
      remark: '',
    };
  };

  const formData = reactive(generateForm());

  const emit = defineEmits(['callBack']);

  const clearForm = () => {
    Object.assign(formData, generateForm());
    const refs: any = unref(formRef);
    refs.resetFields();
  };

  const close = () => {
    emit('callBack');
  };

  // 获取详情
  const getInfo = () => {
    setLoading(true);
    menuInfo(id.value)
      .then((rs: any) => {
        rs.data.parentId = rs.data.parentId > 0 ? rs.data.parentId : null;
        Object.assign(formData, rs.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const open = () => {
    if (id.value) {
      getInfo();
    }
  };
  const handleSubmit = async (done: (closed: boolean) => void) => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      submitMenu(id.value, formData)
        .then(() => {
          Message.success('提交成功');
          setTimeout(() => {
            emit('callBack', true);
            setLoading(false);
          }, 200);
        })
        .finally(() => {
          setLoading(false);
          done(true);
        });
    } else {
      done(false);
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'Detail',
  };
</script>
