<template>
  <div class="container">
    <a-row style="margin-bottom: 16px">
      <a-col :span="7">
        <Panel />
      </a-col>
      <a-col :span="17">
        <a-card class="form-wrapper">
          <a-form
            ref="formRef"
            layout="vertical"
            auto-label-width
            :model="formData"
          >
            <a-col>
              <a-form-item field="nickname" label="昵称">
                <a-input v-model="formData.nickname" placeholder="请填写昵称" />
              </a-form-item>
              <a-form-item field="mobile" label="手机号码">
                <a-input
                  v-model="formData.mobile"
                  placeholder="请填写手机号码"
                />
              </a-form-item>
              <a-form-item field="email" label="邮箱">
                <a-input v-model="formData.email" placeholder="请填写邮箱" />
              </a-form-item>
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="handleSubmit">
                    保存
                  </a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import { submitProfile } from '@/api/profile';
  import { getUserInfo } from '@/api/user';
  import { useUserStore } from '@/store';
  import Panel from './panel.vue';

  const userInfo = useUserStore();

  const formRef = ref<FormInstance>();

  const { loading, setLoading } = useLoading(true);

  const generateForm = () => {
    return {
      id: null,
      mobile: '',
      nickname: '',
      email: '',
    };
  };

  const formData = reactive(generateForm());

  const handleSubmit = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      submitProfile(formData)
        .then(() => {
          Message.success('提交成功');
          userInfo.email = formData.email;
          userInfo.nickname = formData.nickname;
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const getProfileInfo = () => {
    getUserInfo()
      .then((rs: any) => {
        Object.assign(formData, rs.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  getProfileInfo();
</script>

<script lang="ts">
  export default {
    name: 'Profile',
  };
</script>

<style scoped lang="less">
  .container {
    width: 60%;
    margin: 0 auto;
  }
  .wrapper {
    padding: 20px 0 0 20px;
    min-height: 580px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
  .form-wrapper {
    margin: 20px 0 20px 20px;
    padding: 20px;
    height: 75vh;
  }
</style>
