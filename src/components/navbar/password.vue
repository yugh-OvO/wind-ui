<template>
  <a-modal
    v-model:visible="visible"
    title="修改密码"
    :mask-closable="false"
    width="600px"
    top="15vh"
    :align-center="false"
    :on-before-ok="handleSubmit"
    @cancel="close"
    @close="clearForm"
  >
    <div class="item-container">
      <a-form ref="formRef" auto-label-width :model="formData">
        <a-form-item
          field="oldPassword"
          label="旧密码"
          :rules="[{ required: true, message: '请填写旧密码' }]"
          :validate-trigger="['change', 'input']"
        >
          <a-input-password
            v-model="formData.oldPassword"
            placeholder="请填写旧密码"
          />
        </a-form-item>
        <a-form-item
          field="newPassword"
          label="新密码"
          :rules="[
            { required: true, message: '请填写新密码' },
            { min: 8, message: '密码长度不能小于8位' },
            { max: 16, message: '密码长度不能大于24位' },
            {
              match: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
              message: '密码必须包含数字和字母',
            },
          ]"
          :validate-trigger="['change', 'input']"
        >
          <a-input-password
            v-model="formData.newPassword"
            placeholder="请填写新密码"
          />
          <template #extra>
            <div>8-16个字符，需包含字母和数字</div>
          </template>
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
  import { changePassword } from '@/api/user';

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

  const emit = defineEmits(['callBack']);

  const generateForm = () => {
    return {
      oldPassword: '',
      newPassword: '',
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

  const handleSubmit = async (done: (closed: boolean) => void) => {
    const res = await formRef.value?.validate();

    if (!res) {
      setLoading(true);
      changePassword(formData)
        .then(() => {
          Message.success('修改成功');
          setTimeout(() => {
            emit('callBack', true);
            setLoading(false);
          }, 50);
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
