<template>
  <div>
    <page-simple></page-simple>
    <div class="content">
      <b-row class="mb-3">
        <b-col>
          <onboarding-badge :badges="badges" :status="badgesStatus"></onboarding-badge>
          <onboarding-help></onboarding-help>
        </b-col>
        <b-col md="6" lg="9">
          <onboarding-header></onboarding-header>
          <onboarding-content :steps="steps" :status="stepsStatus"></onboarding-content>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import PageSimple from "@/Layout/Components/PageSimple.vue";
import OnboardingBadge from "@/modules/onboarding/components/OnboardingBadge";
import OnboardingHelp from "@/modules/onboarding/components/OnboardingHelp";
import OnboardingHeader from "@/modules/onboarding/components/OnboardingHeader";
import OnboardingContent from "@/modules/onboarding/OnboardingContent";

export default {
  components: {
    PageSimple,
    OnboardingBadge,
    OnboardingHelp,
    OnboardingHeader,
    OnboardingContent,
  },
  computed: {
    badges() {
      return this.$store.getters["onboarding/getBadges"];
    },
    badgesStatus() {
      return this.$store.getters["onboarding/getBadgesStatus"];
    },
    steps() {
      return this.$store.getters["onboarding/getSteps"];
    },
    stepsStatus() {
      return this.$store.getters["onboarding/getStepsStatus"];
    }
  },
  async mounted() {
    await this.$store.dispatch('onboarding/ensureOnboardingStatus');
  }
};
</script>
<style lang="scss" scoped>
</style>