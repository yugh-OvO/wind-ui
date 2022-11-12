<template>
  <a-modal
    v-model:visible="visible"
    title="问题详情"
    :mask-closable="false"
    width="1000px"
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
          field="content"
          label="标题"
          :rules="[{ required: true, message: '请填写问题标题' }]"
          :validate-trigger="['change', 'input']"
        >
          <a-input v-model="formData.content" placeholder="请填写问题标题" />
        </a-form-item>

        <a-form-item
          v-for="(answer, index) of formData.answersArray"
          :key="index"
          :field="`answers.${index}.value`"
          :label="answer.value"
        >
          <a-input v-model="answer.label" placeholder="请填写选项内容" />
          <a-space class="tag">
            <a-input v-model="answer.tag" placeholder="请填写标签"
          /></a-space>
          <a-button :style="{ marginLeft: '10px' }" @click="handleDelete(index)"
            ><icon-delete
          /></a-button>
        </a-form-item>
      </a-form>
      <div>
        <a-link @click="handleAdd"><icon-plus-circle /> 添加选项</a-link>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { Message } from '@arco-design/web-vue';
  import { ref, unref, reactive, computed } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { questionInfo, submitQuestion } from '@/api/question';

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
      content: '',
      answersArray: [
        { value: 'A', label: '', tag: '' },
        { value: 'B', label: '', tag: '' },
        { value: 'C', label: '', tag: '' },
        { value: 'D', label: '', tag: '' },
      ],
      answers: '',
      correctAnswer: '',
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
    questionInfo(id.value)
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
      submitQuestion(id.value, formData)
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
  const handleAdd = () => {
    const value = String.fromCharCode(65 + formData.answersArray.length);
    formData.answersArray.push({
      value,
      label: '',
      tag: '',
    });
  };
  const handleDelete = (index: number) => {
    // 需要重新整理答案value及正确答案
    // formData.correctAnswer = '';
    if (formData.correctAnswer === formData.answersArray[index].value) {
      formData.correctAnswer = '';
    }
    formData.answersArray.splice(index, 1);
    formData.answersArray.forEach((item, i) => {
      item.value = String.fromCharCode(65 + i);
    });
    // 判断答案是否在被删除元素后方
    if (formData.correctAnswer.charCodeAt(0) > 65 + index) {
      formData.correctAnswer = String.fromCharCode(
        formData.correctAnswer.charCodeAt(0) - 1
      );
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'Detail',
  };
</script>

<style scoped lang="less">
  .answer-radio {
    margin-right: 20px;
  }
  .tag {
    margin-left: 10px;
    width: 260px;
  }
</style>
