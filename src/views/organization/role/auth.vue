<template>
  <a-modal
    v-model:visible="visible"
    title="设置权限"
    :mask-closable="false"
    width="600px"
    top="10vh"
    :align-center="false"
    :on-before-ok="handleSubmit"
    @before-open="open"
    @cancel="close"
    @close="clearForm"
  >
    <div class="item-container">
      <a-form ref="formRef" auto-label-width :model="formData">
        <a-form-item>
          <div class="tree-box">
            <a-tree
              v-model:checked-keys="formData.menuIds"
              :checkable="true"
              :default-expand-all="true"
              :data="menuOptions"
              :field-names="{ title: 'name', key: 'id', children: 'children' }"
            />
          </div>
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
  import { roleInfo, submitRole } from '@/api/role';

  const formRef = ref<FormInstance>();

  interface Props {
    visible: boolean;
    id: number;
    menuOptions: [];
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

  const { loading, setLoading } = useLoading(true);

  const emit = defineEmits(['callBack']);

  const generateForm = () => {
    return {
      id: null,
      name: '',
      remark: '',
      menuIds: [],
    };
  };

  const formData = reactive(generateForm());

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
    roleInfo(id.value)
      .then((rs: any) => {
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
      submitRole(id.value, formData)
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

<style scoped>
  .tree-box {
    height: 60vh;
    width: 100%;
    overflow: auto;
  }
</style>
