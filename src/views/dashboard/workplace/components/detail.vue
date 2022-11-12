<template>
  <a-modal
    v-model:visible="visible"
    title="游戏规则"
    :mask-closable="false"
    width="70%"
    top="15vh"
    :align-center="false"
    :on-before-ok="handleSubmit"
    @before-open="open"
    @cancel="close"
  >
    <div class="item-container">
      <a-form ref="formRef" auto-label-width :model="formData">
        <QuillEditor
          ref="contentEditor"
          v-model:content="formData.content"
          theme="snow"
          content-type="html"
          style="height: 500px"
        />
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { Message } from '@arco-design/web-vue';
  import { ref, unref, reactive, computed } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { strategyInfo, submitConfigure } from '@/api/configure';
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  const formRef = ref<FormInstance>();
  const contentEditor = ref();

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
      content: '',
    };
  };

  const formData = reactive(generateForm());

  const emit = defineEmits(['callBack']);

  const clearForm = () => {
    Object.assign(formData, generateForm());
    const refs: any = unref(formRef);
    refs.resetFields();
    contentEditor.value.setContents('');
  };

  const close = () => {
    clearForm();
    emit('callBack');
  };

  // 获取详情
  const getInfo = () => {
    setLoading(true);
    strategyInfo()
      .then((rs: any) => {
        Object.assign(formData, rs.data);
        contentEditor.value.setContents(rs.data.content);
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
