<script setup lang="ts">
import { onMounted, ref } from 'vue';

const question = ref<string>('');
const answer = ref<string>('');
const isLoading = ref<boolean>(false);
const showModal = ref<boolean>(false);
const errMessage = ref<string | null>(null);

const callChatGPTAPI = async function (prompt: string) {
  isLoading.value = true;
  errMessage.value = null;

  const response = await fetch('https://api.openai.com/v1/completions', {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_APP_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0.9,
      model: 'text-davinci-003',
    }),
  });

  
  const data = await response.json();
  isLoading.value = false;

  if (data.error) {
    errMessage.value = 'There is an error, please retry later';
    return;
  }


  answer.value = data.choices[0].text;
  isLoading.value = false;
  showModal.value = true;
}

onMounted(() => {
  document.body.setAttribute('style', 'margin:0;padding:0;')
});
</script>

<template>
  <section class="wrapper container" v-loading="isLoading" element-loading-background="#333">
    <ElRow>
      <ElCol :span="24">
        <h1>Ask your question to <span>chatGPT</span></h1>
        <ElInput
          @keydown.enter="callChatGPTAPI(question)"
          size="large"
          clearable
          v-model="question"
          placeholder="Type your question here"
          show-word-limit
          type="text"
        />
        <small v-if="errMessage" class="">{{ errMessage }}</small>
      </ElCol>
    </ElRow>
  </section>
  <ElDialog v-model="showModal" center>
    <main>{{ answer }}</main>
  </ElDialog>
</template>

<style scoped>
@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

.wrapper {
  background: linear-gradient(-45deg, #eeaeca, #e73c7e, #94bbe9, #23d5ab);
	background-size: 400% 400%;
	animation: gradient 15s ease infinite;
	height: 100vh;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
}

.container {
  padding: 0 15px;
  margin: 0 auto;
}

small {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: #2b1d1d;
}
:deep(.el-col > h1) {
  color: #18222c;
  margin: 0;
  text-align: center;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

:deep(.el-row) {
  align-items: center;
  display: flex;
  max-width: 584px;
  margin-bottom: .7rem;
  width: 100%;
}

:deep(.el-input__wrapper) {
  border-radius: 24px;
}

:deep(.el-input) {
  display: flex;
  justify-content: center;
}

p {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.5;
  margin: 0;
  padding: 0;
  text-align: center;
}
</style>
