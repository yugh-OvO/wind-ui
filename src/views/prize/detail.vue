<template>
  <a-modal
    v-model:visible="visible"
    title="奖品详情"
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
          :rules="[{ required: true, message: '请填写奖品名称' }]"
          :validate-trigger="['change', 'input']"
        >
          <a-input v-model="formData.name" placeholder="请填写奖品名称" />
        </a-form-item>
        <a-form-item field="num" label="奖品数量">
          <a-input-number v-model="formData.num" :min="1" />
        </a-form-item>
        <a-form-item field="image" label="奖品图片">
          <a-upload
            :custom-request="customRequest"
            list-type="picture-card"
            :show-upload-button="true"
            :show-file-list="false"
            @success="uploadSuccess"
          >
            <template #upload-button>
              <div class="arco-upload-list-item">
                <div
                  v-if="formData.image"
                  class="arco-upload-list-picture custom-upload-avatar"
                >
                  <img :src="formData.image" />
                  <div class="arco-upload-list-picture-mask">
                    <IconEdit />
                  </div>
                </div>
                <div v-else class="arco-upload-picture-card">
                  <div class="arco-upload-picture-card-text">
                    <IconPlus />
                    <div style="margin-top: 10px; font-weight: 600"
                      >点击上传</div
                    >
                  </div>
                </div>
              </div>
            </template>
          </a-upload>
        </a-form-item>
        <a-form-item field="description" label="奖品介绍">
          <a-textarea
            v-model="formData.description"
            placeholder="请填写奖品介绍信息"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import type {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  import { uploadApi } from '@/api/upload';
  import { Message } from '@arco-design/web-vue';
  import { ref, unref, reactive, computed } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { prizeInfo, submitPrize } from '@/api/prize';

  const formRef = ref<FormInstance>();

  interface Props {
    visible: boolean;
    id: number;
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
      num: 1,
      image: '',
      description: '',
    };
  };

  const formData = reactive(generateForm());

  const clearForm = () => {
    fileList.value = [];
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
    prizeInfo(id.value)
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
      submitPrize(id.value, formData)
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
  const file = {
    uid: '',
    name: '',
    url: '',
  };
  const fileList = ref<FileItem[]>([file]);
  const uploadSuccess = (fileItem: FileItem) => {
    formData.image = fileItem.response.data.url;
  };
  const customRequest = (options: RequestOption) => {
    const controller = new AbortController();

    (async function requestWrap() {
      const {
        onProgress,
        onError,
        onSuccess,
        fileItem,
        name = 'file',
      } = options;
      onProgress(20);
      const formData = new FormData();
      formData.append(name as string, fileItem.file as Blob);

      try {
        const res = await uploadApi(formData, {
          controller,
        });
        onSuccess(res);
      } catch (error) {
        onError(error);
      }
    })();
    return {
      abort() {
        controller.abort();
      },
    };
  };
</script>

<script lang="ts">
  export default {
    name: 'Detail',
  };
</script>
