<template>
  <a-modal
    v-model:visible="visible"
    title="发放设置"
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
          field="limit"
          label="每日发放上限"
          :rules="[{ required: true, message: '请填写每日发放上限' }]"
          :validate-trigger="['change', 'input']"
        >
          <a-input-number v-model="formData.limit" />
        </a-form-item>
        <a-form-item
          field="probability"
          label="中奖概率"
          :rules="[{ required: true, message: '请填写中奖概率' }]"
          :validate-trigger="['change', 'input']"
        >
          <a-input-number v-model="formData.probability" />
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
  import { prizeInfo, submitConfigure } from '@/api/configure';

  const formRef = ref<FormInstance>();

  interface Props {
    visible: boolean;
  }
  const props = defineProps<Props>();

  const visible = computed({
    get() {
      return props.visible;
    },
    set() {
      // do nothing
    },
  });

  const { loading, setLoading } = useLoading(true);

  const generateForm = () => {
    return {
      code: null,
      limit: null,
      probability: null,
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
    clearForm();
    emit('callBack');
  };

  // 获取详情
  const getInfo = () => {
    setLoading(true);
    prizeInfo()
      .then((rs: any) => {
        Object.assign(formData, rs.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const open = () => {
    getInfo();
  };
  const handleSubmit = async (done: (closed: boolean) => void) => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      submitConfigure(formData)
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
