<template>
  <div>
    <div v-if="!showLogos">
      <b-row class="pt-4 pb-4">
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
                @click="showMailLogos"
              >
                <font-awesome-icon class="mr-2" icon="paper-plane" />
                {{ $t("onboarding.customers.body.connect.mail") }}
              </button>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="-grey text-center mt-3">
              <img :src="logos.GMAIL.logo" />
              <img :src="logos.MICROSOFT.logo" />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="text-left">
          <b-button variant="outline-primary" size="lg" @click="skipStep">
            {{ $t("onboarding.essential.skip.step") }}
          </b-button>
        </b-col>
      </b-row>
    </div>
    <div v-else>
      <b-row>
        <b-col>
          <b-row>
            <b-col class="text-center">
              <b-btn
                @click="goto(connect.route)"
                variant="outline-primary"
                v-for="connect in connectMail"
                :key="connect.key"
                class="connect-logo mr-3 mt-2 mb-2"
              >
                <img class="connect-logo" :src="connect.logo" :alt="connect.alt"/>
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
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPaperPlane);
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
    connectMail() {
      let connections = this.$store.getters["connections/getConnects"].filter((c) => c.type === "MAIL");
      return connections;
    },
  },
  mounted() {},
  methods: {
    showMailLogos() {
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
    skipStep() {
      this.$emit("skip-step", this.step.key, "SKIPED");
      this.$root.$emit('bv::toggle::collapse', 'collapse-messaging')
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
</style>