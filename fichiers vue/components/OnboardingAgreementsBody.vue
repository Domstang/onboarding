<template>
  <div>
      <b-alert show variant="light">
      <font-awesome-icon class="mr-1" icon="info-circle" />
        <i18n path="onboarding.see.documentation" tag="span">
            <template v-slot:link>
                <a target="_blank" href="https://docs.skalin.io/en/user/getting-started/agreements/">{{ $t('onboarding.see.documentation.label' )}}</a>
            </template>
        </i18n>
    </b-alert>
    <b-row class="pt-4 pb-4">
          <b-col class="text-center">
            <button
              type="button"
              class="
                custom-btn
                btn-shadow
                align-items-center
                btn btn-primary
              "
              @click="handleImportAgreements"
            >
              <font-awesome-icon class="mr-2" icon="cloud-upload-alt" />
              {{ $t("onboarding.agreements.body.import.agreements") }}
            </button>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCloudUploadAlt);
export default {
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
  props: {
    step: {
        type: Object,
        require: true,
    },
  },
  data: () => ({
    selected: "",
  }),
  computed: {},
  mounted() {},
  methods: {
    handleImportAgreements() {
      this.$emit("import-agreements");
    },
  },
};
</script>
<style lang="scss" scoped>
.-grey {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
  opacity: 0.6;
}
.custom-btn {
   width: 210px;
}
</style>