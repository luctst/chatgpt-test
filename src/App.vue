<script setup lang="ts">
import { onMounted, ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import useCookies from './composables/useCookies';
import { useHead } from '@vueuse/head';
import { marked } from 'marked';

useHead({
  script: [
    {
      async: true,
      src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${import.meta.env.VITE_APP_GA_ADSENCE_ID}`,
      crossorigin: `anonymous`,
    },  
  ]
})

const { t } = useI18n();
const gtag = inject<any>('gtag');
const question = ref<string>('');
const answer = ref<string>('');
const isLoading = ref<boolean>(false);
const showModal = ref<boolean>(false);
const errMessage = ref<string | null>(null);
const { showBanner, okClicked } = useCookies(gtag);

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
    errMessage.value = t('apiError');
    gtag.event('error_chatgpt', { 'event_label': 'error chatgpt api', 'value': 'error chatgpt api' });
    return;
  }

  marked.setOptions({
    breaks: true,
    gfm: true,
  });
  answer.value = marked(data.choices[0].text);
  isLoading.value = false;
  showModal.value = true;
}

const trackGA = () => {
  if (import.meta.env.DEV) return;
  gtag.event('click_input', { 'event_label': 'click on input', 'value': 'click on input' });
  gtag.event('click_input', { 'send_to': 'AW-861021674/NOi3CODE4ZwYEOrLyJoD' });
};

onMounted(() => {
  document.body.setAttribute('style', 'margin:0;padding:0;');
});
</script>

<template>
  <ElContainer v-loading="isLoading" element-loading-background="#333" class="wrapper">
    <ElMain>
      <ElRow>
        <ElCol :span="24" class="col--form--content">
          <h1>{{ $t('title') }}</h1>
          <small>{{ $t('input.wait') }}</small>
          <ElInput
            @focus="trackGA"
            @keydown.enter="callChatGPTAPI(question)"
            size="large"
            v-model="question"
            :placeholder="$t('input.placeholder')"
            :show-word-limit="true"
            clearable
            maxLength="100"
            type="text"
          />
          <small v-if="errMessage" class="">{{ errMessage }}</small>
        </ElCol>
      </ElRow>
    </ElMain>
    <ElFooter>
      <ElMenu mode="horizontal" :ellipsis="false" background-color="transparent" text-color="#18222c">
        <ElMenuItem index="1"><a href="https://luctst.notion.site/Terms-and-conditions-73a4337bc06c435982e792b9fdf91f1b" target="_blank">{{ $t('footer.about') }}</a></ElMenuItem>
        <ElMenuItem index="2">
          <ElDropdown>
            <span class="el-dropdown--link">{{ $t('footer.share.button') }}</span>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem>
                  <ShareNetwork 
                  network="facebook"
                  url="https://letsusechatgpt.com"
                  :title="$t('footer.share.title')"
                  :description="$t('footer.share.description')">
                    {{ $t('footer.share.facebook') }}
                  </ShareNetwork>
                </ElDropdownItem>
                <ElDropdownItem>
                  <ShareNetwork 
                  network="twitter"
                  url="https://letsusechatgpt.com"
                  :title="$t('footer.share.title')">
                    {{ $t('footer.share.twitter') }}
                  </ShareNetwork>
                </ElDropdownItem>
                <ElDropdownItem>
                  <ShareNetwork 
                  network="whatsapp"
                  url="https://letsusechatgpt.com"
                  :title="$t('footer.share.title')"
                  :description="$t('footer.share.description')">
                    {{ $t('footer.share.whatsapp') }}
                  </ShareNetwork>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </ElMenuItem>
      </ElMenu>
    </ElFooter>
  </ElContainer>
  <ElDialog v-model="showModal" center>
    <main v-html="answer" class="modal--content--answer"></main>
  </ElDialog>
  <ElDialog v-model="showBanner" :append-to-body="true">
    <template #header>
      <header>
        <div>{{ $t('cookies.title') }}</div>
      </header>
    </template>
    <main>
      <div>{{ $t('cookies.description') }} <a href="https://luctst.notion.site/Cookie-policy-a8d2190b62d14d03bd9961e2e33fe5a8" target="_blank">Cliquez içi</a></div>
    </main>
    <template #footer>
      <footer class="dialog-footer">
        <el-button type="primary" @click="okClicked">{{ $t('cookies.btnAgree') }}</el-button>
      </footer>
    </template>
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
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
}

.col--form--content {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  font-size: 1.8rem;
  margin-bottom: .3rem;
}

:deep(.el-col > small) {
  font-size: .7rem;
}

:deep(.el-main) {
  align-items: center;
  display: flex;
  max-width: 584px;
  width: 100%;
}

:deep(.el-main > .el-row) {
  width: 100%;
}

:deep(.el-input__wrapper) {
  border-radius: 24px;
}

:deep(.el-input) {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
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

:deep(.el-menu) {
  align-items: center;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  border-bottom: none;
}

:deep(.el-menu-item) {
  border-bottom: none;
}

:deep(.el-menu-item > a) {
  text-decoration: none;
}

:deep(.el-dropdown) {
  color: #18222c;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

:deep(.el-dropdown--link) {
  color: #18222c;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.modal--content--answer {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  color: #18222c;
  font-size: 1.1rem;
  line-height: 1.5rem;
}
</style>
