<template>
  <a-modal
    v-model:visible="visible"
    title="资讯详情"
    :mask-closable="false"
    width="70%"
    top="15vh"
    :align-center="false"
    :on-before-ok="handleSubmit"
    @before-open="open"
    @cancel="close"
    @close="clearForm"
  >
    <div class="item-container">
      <a-form ref="formRef" auto-label-width :model="formData">
        <a-form-item field="thumb" label="封面图">
          <a-upload
            :custom-request="customRequest"
            list-type="picture-card"
            :file-list="fileList"
            :show-upload-button="true"
            :show-file-list="false"
            @change="uploadChange"
          >
            <template #upload-button>
              <a-avatar :size="100" class="info-avatar">
                <template #trigger-icon>
                  <icon-camera />
                </template>
                <img v-if="fileList.length" :src="fileList[0].url" />
              </a-avatar>
            </template>
          </a-upload>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              field="title"
              label="名称"
              :rules="[{ required: true, message: '请填写资讯名称' }]"
              :validate-trigger="['change', 'input']"
            >
              <a-input v-model="formData.title" placeholder="请填写资讯名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="category1" label="分类">
              <a-select
                v-model="formData.category1"
                :options="categoryOptions"
                placeholder="请选择分类"
              >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item field="seoKeywords" label="关键词">
          <a-input
            v-model="formData.seoKeywords"
            placeholder="请填写资讯关键词，多个关键词用英文逗号隔开"
          />
        </a-form-item>
        <a-form-item field="seoDescription" label="描述">
          <a-textarea
            v-model="formData.seoDescription"
            placeholder="请填写资讯描述"
          />
        </a-form-item>
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
  import type {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  import { uploadApi } from '@/api/upload';
  import { Message } from '@arco-design/web-vue';
  import { ref, unref, reactive, computed } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { QuillEditor } from '@vueup/vue-quill';
  import { articleInfo, submitArticle } from '@/api/article';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import IconEdit from '@arco-design/web-vue/es/icon/icon-edit';
  import IconPlus from '@arco-design/web-vue/es/icon/icon-plus';

  const formRef = ref<FormInstance>();
  const contentEditor = ref();

  const file = {
    uid: '-2',
    name: 'avatar.png',
    url: '',
  };
  const fileList = ref<FileItem[]>([file]);
  const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
    fileList.value = [fileItem];
  };
  const customRequest = (options: RequestOption) => {
    // docs: https://axios-http.com/docs/cancellation
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
      const onUploadProgress = (event: ProgressEvent) => {
        let percent;
        if (event.total > 0) {
          percent = (event.loaded / event.total) * 100;
        }
        onProgress(parseInt(String(percent), 10), event);
      };

      try {
        // https://github.com/axios/axios/issues/1630
        // https://github.com/nuysoft/Mock/issues/127

        const res = await uploadApi(formData, {
          controller,
          onUploadProgress,
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

  interface Props {
    visible: boolean;
    id: number;
    categoryOptions: [];
    tagsOptions: [];
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
      title: '',
      seoKeywords: '',
      seoDescription: '',
      content: '',
      category1: null,
      originUrl: '',
    };
  };

  const formData = reactive(generateForm());

  const clearForm = () => {
    Object.assign(formData, generateForm());
    const refs: any = unref(formRef);
    refs.resetFields();
    contentEditor.value.setContents('');
  };

  const close = () => {
    emit('callBack');
  };

  // 获取详情
  const getInfo = () => {
    setLoading(true);
    articleInfo(id.value)
      .then((rs: any) => {
        Object.assign(formData, rs.data);
        contentEditor.value.setContents(rs.data.content);
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
      submitArticle(id.value, formData)
        .then(() => {
          Message.success('提交成功');
          setTimeout(() => {
            emit('callBack', true);
            setLoading(false);
          }, 1000);
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
