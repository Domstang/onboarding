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
              @click="goto('settingsCustomerProfiles')"
            >
              {{ $t("onboarding.health-score.body.button") }}
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
export default {
  props: {
    step: {
        type: Object,
        require: true,
    },
  },
  data: () => ({}),
  computed: {},
  mounted() {},
  methods: {
    skipStep() {
      this.$emit("skip-step", this.step.key, "SKIPED");
      this.$root.$emit('bv::toggle::collapse', 'collapse-healthScore')
    },
    goto(value) {
      this.$router.push({ name: value });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>