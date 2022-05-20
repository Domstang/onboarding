<template>
  <b-card class="mb-4">
    <b-row>
      <b-col class="text-center">
        <font-awesome-icon class="mt-2 iconColor" icon="info-circle" size="3x" />
      </b-col>
    </b-row>
    <div class="text-center mt-3">
      <h6>{{ $t("onboarding.help.title") }}</h6>
    </div>
    <b-card-text class="text-center p-2">
      {{ $t("onboarding.help.description") }}
    </b-card-text>
    <b-row>
      <b-col class="text-center mb-2">
        <b-button href="https://docs.skalin.io/en/user/getting-started/overview/" target="_blank" variant="primary">{{ $t("onboarding.help.button") }}</b-button>
      </b-col>
    </b-row>
  </b-card>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faInfoCircle);
export default {
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/components/bootstrap4/functions";
@import "../../../assets/components/bootstrap4/variables";
.iconColor {
  color: $gray-400;
}
</style>