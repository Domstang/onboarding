<template>
  <div>
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
              @click="goto('users')"
            >
              {{ $t("onboarding.team.body.create.team") }}
            </button>
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
    goto(value) {
      this.$router.push({ name: value });
    },
    skipStep() {
      this.$emit("skip-step", this.step.key, "SKIPED");
      this.$root.$emit('bv::toggle::collapse', 'collapse-team')
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