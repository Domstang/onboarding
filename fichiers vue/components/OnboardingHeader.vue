<template>
  <div class="text-center mb-4">
    <b-card :title="$t('onboarding.header.title')" class="pt-2">
      <b-card-body>
        {{ $t('onboarding.header.description', { firstname: user.firstName }) }}
      </b-card-body>
      <template #footer>
          <div class="text-muted text-left">
              <b-form-checkbox size="sm" v-model="showNext" @change="onToggleShowNextTime">
              {{ $t('onboarding.header.show-next') }}
            </b-form-checkbox>
          </div>
      </template>
    </b-card>
  </div>
</template>
<script>
export default {
  data: () => ({
      showNext: true
  }),
  computed: { 
    user() {
        return this.$store.getters['users/currentUser'] || {};
    },
    show() {
        return this.$store.getters['onboarding/getShow'];
    }
  },
  watch: {
      show(value) {
          this.showNext = value;
      }
  },
  async mounted() {
      await this.$store.dispatch('onboarding/ensureOnboardingStatus');
      this.showNext = this.show;
  },
  methods: {
      onToggleShowNextTime() {
          this.$store.dispatch("onboarding/updateShow", {
            value: this.showNext
        });
      }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/components/bootstrap4/functions";
@import "../../../assets/components/bootstrap4/variables";

h4 {
  font-size: $h3-font-size;
  font-weight: $font-weight-bold;
  color: $gray-600;
}
</style>