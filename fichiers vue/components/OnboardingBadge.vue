<template>
  <b-card class="mb-4 pt-2" footer-tag="Footer"
        :border-variant="allCompleted ? 'success' : 'tr ansparent'"
        :footer-bg-variant="allCompleted ? 'light' : 'tr ansparent'">
    <b-row>
      <b-col
        class="text-center"
        :class="{ '-disabled': !status['essential'] }"
      >
        <img :src="essentialLogo.path" :alt="essentialLogo.alt"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        class="text-right"
        :class="{ '-disabled': !status['advanced'] }"
      >
        <img :src="advancedLogo.path" :alt="advancedLogo.alt"/>
      </b-col>
      <b-col class="text-left" :class="{ '-disabled': !status['expert'] }">
        <img :src="expertLogo.path" :alt="expertLogo.alt"/>
      </b-col>
    </b-row>
    <b-card-text class="text-center mt-3 pb-2">
      {{ $t("onboarding.badge.title") }}<br />
      {{ nbrOfUnlockedBadges }}/{{ totalOfBadges }}
    </b-card-text>
    <template #footer>
      <b-card-text class="text-center">
        <font-awesome-icon class="mr-2" icon="info-circle" v-if="!allCompleted" />
        {{ $t(allCompleted ? 'onboarding.badge.footer.completed' : 'onboarding.badge.footer') }}
      </b-card-text>
    </template>
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
  props: {
    badges: {
      type: Array,
      require: true,
    },
    status: {
      type: Object,
      require: true,
    },
  },
  computed: {
    //Get the Essential Logo
    essentialLogo() {
      let essentialLogo = this.$store.getters["onboarding/getVisuals"]?.find((logo) => logo.key === "ESSENTIAL");
      return essentialLogo;
    },
    //Get the Advanced Logo
    advancedLogo() {
      let advancedLogo = this.$store.getters["onboarding/getVisuals"]?.find((logo) => logo.key === "ADVANCED");
      return advancedLogo;
    },
    //Get the Expert Logo
    expertLogo() {
      let expertLogo = this.$store.getters["onboarding/getVisuals"]?.find((logo) => logo.key === "EXPERT");
      return expertLogo;
    },
    //Number of badges that have been unlocked by user
    nbrOfUnlockedBadges() {
      return Object.values(this.status).filter(b => !!b).length;
    },
    //Show the total number of badges that can be earned
    totalOfBadges() {
      return this.badges?.length || 0;
    },
    allCompleted() {
        return this.nbrOfUnlockedBadges >= this.totalOfBadges;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/components/bootstrap4/functions";
@import "../../../assets/components/bootstrap4/variables";

.card-footer {
  border: none;
  background-color: $gray-100;
}
.-disabled {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
  opacity: 0.6;
}
</style>