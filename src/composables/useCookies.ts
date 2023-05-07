import { ref, watch, computed } from 'vue';
import { useCookie } from 'vue-cookie-next';

const allowCookies = ref<boolean>();

export default function useCookies(gtag: any) {
  const cookie = useCookie();

  if (cookie.isCookieAvailable('cookies_consent')) {
    allowCookies.value = cookie.getCookie('cookies_consent') === 'true';
  } else {
    allowCookies.value = undefined;
  }

  watch(allowCookies, () => {
    if (allowCookies.value != undefined) {
      cookie.setCookie('cookies_consent', allowCookies.value.toString(), {
        expire: new Date(2025, 1, 1),
      });
    }
  });

  const showBanner = computed(() => {
    return allowCookies.value === undefined;
  });

  const okClicked = () => (allowCookies.value = true);

  return {
    allowCookies,
    showBanner,
    okClicked,
  };
}
