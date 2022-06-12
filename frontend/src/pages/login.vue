<template>
  <div flex flex-row justify-center w-full>
    <SectionBody mt-20 w-96>
      <div mt-5 mb-4>
        <Input title="Email" type="email" mb-4 @on-input="form.email = $event" />
        <Input title="Password" type="password" @on-input="form.password = $event" :show_eye="true" />
      </div>
      <div w-full flex justify-center items-center>
        <SmallText v-show="errorMsg.length" mb-5 text-red-500 text-justify>{{ errorMsg }}</SmallText>
      </div>
      <div flex flex-col justify-center items-center>
        <Button
          bg-green-400
          class="transition" :class="{ 'w-1/2': !showSpinner, 'w-[4rem]': showSpinner }"
          :enable="enableButton" :listen_to_enter="true"
          @on-click="tryLogin"
        >
          <span v-if="!showSpinner" class="text">Login</span>
          <div v-else class="w-[40px] h-[24px] spinner">
            <EllipsisSpinner background="#fff" :x="8" :y="8" />
          </div>
        </Button>
      </div>
    </SectionBody>
  </div>
</template>

<route>
{
  meta: {
    layout: "login"
  }
}
</route>

<script setup lang="ts">
import { useUserStore } from '../store/user.store';

const router = useRouter();

const userStore = useUserStore();
const errorMsg = ref("");
const showSpinner = ref(0);
const form = reactive({
  email: "",
  password: ""
});

const enableButton = computed(() => (form.email.length && form.password.length && (showSpinner.value != 1)) ? true : false);
const tryLogin = () => {
  // Assuming that server takes a while to respond to the request, we make clicking the button do nothing.
  if (showSpinner.value)
    return;

  errorMsg.value = "";
  showSpinner.value = 1;

  function emailValid(email: string) {
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return emailRegex.test(email);
  };

  function passwordValid(password: string) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  if (!passwordValid(form.password))
    errorMsg.value = "Invalid password format specified. Passwords need to have a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character. Please try again.";

  if (!emailValid(form.email))
    errorMsg.value = "Invalid email format specified. Please try again.";

  if (!errorMsg.value) {
    userStore.login(form.email, form.password)
    .then(() => {
      // Move to dashboard index.
      setTimeout(() => showSpinner.value = 0, 500);
      router.push("/dashboard")
    })
    .catch((err) => {
      if (err.message == "EMAIL_NON_EXISTENT")
        errorMsg.value = "The email provided does not exist. Please try again with the correct email.";
      else
        errorMsg.value = "Invalid password provided. Please try again with the correct password.";
      setTimeout(() => showSpinner.value = 0, 500);
    })
  } else {
    setTimeout(() => showSpinner.value = 0, 500);
  }
};
</script>

<style>
.transition {
  transition: width 0.3s ease-in-out, background-color 0.3s ease-in-out;
}
</style>
