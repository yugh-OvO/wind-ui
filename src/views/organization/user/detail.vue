<template>
  <a-modal
    v-model:visible="visible"
    title="成员详情"
    :mask-closable="false"
    width="900px"
    top="15vh"
    :align-center="false"
    :on-before-ok="handleSubmit"
    @before-open="open"
    @cancel="close"
    @close="clearForm"
  >
    <div class="item-container">
      <a-form ref="formRef" auto-label-width :model="formData">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              field="username"
              label="用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
              :validate-trigger="['change', 'input']"
            >
              <a-input v-model="formData.username" placeholder="请填写用户名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              field="nickname"
              label="昵称"
              :rules="[{ required: true, message: '请填写昵称' }]"
              :validate-trigger="['change', 'input']"
            >
              <a-input v-model="formData.nickname" placeholder="请填写昵称" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="mobile" label="手机号码">
              <a-input v-model="formData.mobile" placeholder="请填写手机号码" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="email" label="邮箱">
              <a-input v-model="formData.email" placeholder="请填写邮箱" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="roleIds" label="角色">
              <a-select
                v-model="formData.roleIds"
                :options="roleOptions"
                placeholder="请选择标签"
                multiple
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-if="id == null || id == 0" :span="12">
            <a-form-item
              field="password"
              label="初始密码"
              :rules="[{ required: true, message: '请填写初始密码' }]"
              :validate-trigger="['change', 'input']"
            >
              <a-input-password
                v-model="formData.password"
                placeholder="请填写初始密码"
              />
            </a-form-item>
          </a-col>
        </a-row>
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
  import { generate } from '@vue/compiler-dom';
  import useLoading from '@/hooks/loading';
  import { userInfo, submitUser } from '@/api/user';

  const formRef = ref<FormInstance>();

  interface Props {
    visible: boolean;
    id: number;
    roleOptions: [];
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
      nickname: '',
      username: '',
      mobile: '',
      email: '',
      password: '',
      roleIds: [],
      remark: '',
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
    userInfo(id.value)
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
      submitUser(id.value, formData)
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
