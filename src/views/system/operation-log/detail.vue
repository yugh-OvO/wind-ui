<template>
  <a-modal
    v-model:visible="visible"
    title="操作详情"
    width="940px"
    top="15vh"
    :align-center="false"
    :footer="false"
    @cancel="close"
  >
    <div class="item-container">
      <div class="json-viewer mr-40">
        <span>请求参数</span>
        <pre>{{ formatBody(param) }}</pre>
      </div>
      <div class="json-viewer">
        <span>返回结果</span>
        <pre>{{ formatBody(jsonResult) }}</pre>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';

  const formRef = ref<FormInstance>();

  interface Props {
    visible: boolean;
    param: string;
    jsonResult: string;
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

  const emit = defineEmits(['callBack']);

  const close = () => {
    emit('callBack');
  };

  const formatBody = (str: string) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'Detail',
  };
</script>

<style scoped lang="less">
  .json-viewer {
    width: 420px;
    display: inline-block;
    padding-left: 20px;
    span {
      font-size: 15px;
      font-weight: 600;
    }
    pre {
      padding: 15px;
      font-size: 15px;
      background-color: #fdf6e3;
      color: var(--color-neutral-8);
      border-radius: 10px;
      height: 600px;
      overflow: auto;
    }
  }
  .mr-40 {
    margin-right: 40px;
  }
</style>
