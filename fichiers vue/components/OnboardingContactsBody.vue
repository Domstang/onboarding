<template>
  <div>
      <b-alert show variant="light">
      <font-awesome-icon class="mr-1" icon="info-circle" />
        <i18n path="onboarding.see.documentation" tag="span">
            <template v-slot:link>
                <a target="_blank" href="https://docs.skalin.io/en/user/getting-started/customers/">{{ $t('onboarding.see.documentation.label' )}}</a>
            </template>
        </i18n>
    </b-alert>
    <b-row v-if="!showLogos" class="pt-4 pb-4">
      <b-col>
        <b-row>
          <b-col class="text-center">
            <button
              type="button"
              class="
                btn-shadow
                d-inline-flex
                align-items-center
                btn btn-primary
              "
              @click="showCrmLogos"
            >
              {{ $t("onboarding.customers.body.connect.crm") }}
            </button>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="-grey text-center mt-3">
            <img :src="logos.HUBSPOT.logo" />
            <img :src="logos.SALESFORCE.logo" />
            <img :src="logos.PIPEDRIVE.logo" />
          </b-col>
        </b-row>
      </b-col>
      <div class="vertical-divider"></div>
      <b-col class="text-center">
        <button
          type="button"
          class="btn-shadow d-inline-flex align-items-center btn btn-primary"
          @click="handleImportContacts"
        >
          <font-awesome-icon class="mr-2" icon="cloud-upload-alt" />
          {{ $t("onboarding.contacts.body.upload.file") }}
        </button>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col>
        <b-row>
          <b-col class="text-center">
            <b-btn
              @click="goto(connect.route)"
              variant="outline-primary"
              v-for="connect in connectCrm"
              :key="connect.key"
              class="connect-logo mr-3 mt-2 mb-2"
            >
              <img
                class="connect-logo"
                :src="connect.logo"
              />
            </b-btn>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="text-left">
            <b-button variant="outline-primary" size="lg" @click="onBack">
              <b-icon icon="arrow-left" />
            </b-button>
          </b-col>
        </b-row>
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
    logos: {
      type: Object,
      require: true,
    },
  },
  data: () => ({
    selected: "",
    showLogos: false,
  }),
  computed: {
    connectCrm() {
      let connections = this.$store.getters["connections/getConnects"].filter((c) => c.type === "CRM")
      return connections;
    },
  },
  mounted() {},
  methods: {
    showCrmLogos() {
      this.showLogos = true;
    },
    onBack() {
      this.showLogos = false;
    },
    goto(integrationRoute) {
      if (integrationRoute) {
        this.$router.push({ name: integrationRoute });
      } else {
        return null;
      }
    },
    handleImportContacts() {
      this.$emit("import-contacts");
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/components/bootstrap4/functions";
@import "../../../assets/components/bootstrap4/variables";

.vertical-divider {
  border-right: 1px solid $gray-300;
}
.-grey {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
  opacity: 0.6;
}
</style>