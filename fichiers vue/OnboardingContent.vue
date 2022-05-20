<template>
  <div>
    <b-card no-body>
      <b-tabs class="customer-tab" ref="tab" card fill v-model="currentActive">
        <!--Essential Tab Active-->
        <b-tab lazy @click="goToEssential">
          <template #title>
            <font-awesome-icon class="mr-2" icon="bolt" size="lg" />
            {{ $t("onboarding.view.tab.essential") }}
          </template>
          <div v-if="this.currentActive === 0"><!--Important: avoid loading 'imports modals' multiple times -->
            <router-view @skip-step="skipStep"/>
          </div>
        </b-tab>
        <!--Advanced Tab True-->
        <div v-if="canViewAdvanced">
          <b-tab lazy @click="goToAdvanced">
            <template #title>
              <font-awesome-icon class="mr-2" icon="medal" size="lg" />
              {{ $t("onboarding.view.tab.advanced") }}
            </template>
            <div v-if="this.currentActive === 1">
              <router-view @skip-step="skipStep" />
            </div>
          </b-tab>
        </div>
        <!--Advanced Tab Disabled-->
        <div v-else>
          <b-tab disabled>
            <template #title>
              <div :class="{ '-disabled': !canViewAdvanced }">
                <font-awesome-icon class="mr-2" icon="medal" size="lg" />
                {{ $t("onboarding.view.tab.advanced") }}
              </div>
            </template>
            <div v-if="this.currentActive === 1">
              <router-view @skip-step="skipStep" />
            </div>
          </b-tab>
        </div>
        <!--Expert Tab True-->
        <div v-if="canViewExpert">
          <b-tab lazy @click="goToExpert">
            <template #title>
              <font-awesome-icon class="mr-2" icon="trophy" size="lg" />
              {{ $t("onboarding.view.tab.expert") }}
            </template>
            <div v-if="this.currentActive === 2">
              <router-view @skip-step="skipStep" />
            </div>
          </b-tab>
        </div>
        <!--Expert Tab Disabled-->
        <div v-else>
          <b-tab disabled>
            <template #title>
              <div :class="{ '-disabled': !canViewExpert }">
                <font-awesome-icon class="mr-2" icon="trophy" size="lg" />
                {{ $t("onboarding.view.tab.expert") }}
              </div>
            </template>
            <div v-if="this.currentActive === 2">
              <router-view @skip-step="skipStep" />
            </div>
          </b-tab>
        </div>
      </b-tabs>
    </b-card>
    <div v-if="essentialModal">
      <onboarding-success-modal
        :id="'essentialSuccessModal'"
        :nextTab="'onboardingAdvancedList'"
        :tab="'essential'" />
    </div>
    <div v-if="advancedModal">
      <onboarding-success-modal
        :id="'advancedSuccessModal'"
        :nextTab="'onboardingExpertList'"
        :tab="'advanced'" />
    </div>
    <div v-if="expertModal">
      <onboarding-success-modal
        :id="'expertSuccessModal'"
        :tab="'expert'" />
    </div>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBolt, faMedal, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import OnboardingSuccessModal from "@/modules/onboarding/components/OnboardingSuccessModal";

library.add(faBolt, faMedal, faTrophy);
export default {
  components: {
    "font-awesome-icon": FontAwesomeIcon,
    OnboardingSuccessModal,
  },
  props: {
    steps: {
      type: Array,
      require: true,
    },
    status: {
      type: Object,
      require: true,
    },
  },
  data: () => ({
    currentActive: 0,
    essentialModal: false,
    advancedModal: false,
    expertModal: false,
  }),
  async beforeMount() {
    await this.initCurrentStep();
  },
  async mounted() {
    this.initTabs();
  },
  beforeUpdate() {
    this.checkCompleted();
    this.initTabs();
  },
  computed: {
    canViewAdvanced() {
      return this.checkBadgeEssential && this.status.customer?.status === "DONE" &&
        this.status.contact?.status === "DONE"
        ? true
        : false;
    },
    canViewExpert() {
      return this.checkBadgeAdvanced && this.status.customer?.status === "DONE" &&
        this.status.contact?.status === "DONE"
        ? true
        : false;
    },
    // Check the badge status
    checkBadgeEssential(){
      return this.$store.getters["onboarding/getBadgesStatus"].essential ? true : false
    },
    checkBadgeAdvanced(){
      return this.$store.getters["onboarding/getBadgesStatus"]?.advanced ? true : false
    },
    checkBadgeExpert(){
      return this.$store.getters["onboarding/getBadgesStatus"].expert ? true : false
    },
    checkUserLastTab() {
      return this.$store.getters["onboarding/getTabs"]?.key;
    },
    nbCompleted() {
      return this.steps.filter((s) => ["DONE", "SKIPED"].includes(this.status[s.key]?.status));
    },
  },

  methods: {
    goToEssential() {
        this.$router.push({ name: 'onboardingEssentialList' })
        this.$store.dispatch("onboarding/updateTab", {
            key: 'essential',
            status: true
        })
    },
    goToAdvanced() {
        this.$router.push({ name: 'onboardingAdvancedList' })
        this.$store.dispatch("onboarding/updateTab", {
            key: 'advanced',
            status: true
        })
    },
    goToExpert() {
        this.$router.push({ name: 'onboardingExpertList' })
        this.$store.dispatch("onboarding/updateTab", {
            key: 'expert',
            status: true
        })
    },
    async initCurrentStep() {
        // Ensure onboarding status are present before tests
        await this.$store.dispatch('onboarding/ensureOnboardingStatus');

        this.currentActive === 0;

        if (this.checkUserLastTab) {
            switch(this.checkUserLastTab) {
                case 'essential':
                    this.currentActive = 0;
                    break;
                case 'advanced':
                    this.currentActive = 1;
                    break;
                case 'expert':
                    this.currentActive = 2;
                    break;
            }
        }
        else {
            // Défault tab
            // Essential not finish or expert completed
            if (this.checkBadgeExpert || !this.checkBadgeEssential) {
                this.currentActive = 0;
            }
            if (this.checkBadgeEssential && this.checkBadgeAdvanced && !this.checkBadgeExpert) {
                this.currentActive = 2;
            }
            else if (this.checkBadgeEssential && !this.checkBadgeAdvanced) {
                this.currentActive = 1;
            }
        }

        // Check can view tab
        if (this.currentActive === 1 && !this.canViewAdvanced) {
            this.currentActive = 0;
        }
        else if (this.currentActive === 2 && !this.canViewExpert) {
            this.currentActive = 0;
        }
        
        if (this.currentActive === 0 && this.$route.name !== 'onboardingEssentialList') {
            this.$router.push({ name: 'onboardingEssentialList' });
        }
        else if (this.currentActive === 1 && this.$route.name !== 'onboardingAdvancedList') {
            this.$router.push({ name: 'onboardingAdvancedList' });
        }
        else if (this.currentActive === 2 && this.$route.name !== 'onboardingExpertList') {
            this.$router.push({ name: 'onboardingExpertList' });
        }
    },
    initTabs() {
      switch (this.$route.name) {
        case "onboardingAdvancedList":
          this.currentActive = 1;
          break;
        case "onboardingExpertList":
          this.currentActive = 2;
          break;
        default:
          this.currentActive = 0;
      }
      // Fix bug tabs: force update active tab
      this.$refs.tab.currentTab = this.currentActive;
    },
    // Skip a step
    async skipStep(stepKey, stepStatus) {
      await this.$store.dispatch("onboarding/updateStep", {
        key: stepKey,
        status: stepStatus,
      });
      this.checkCompleted();
    },
    // Check if the badge is awarded
    checkCompleted() {
      if (!this.checkBadgeEssential){
        const badge = 'essential';
        let essentialCompleted = this.nbCompleted.filter(s => s.tab === badge).length;
        let stepLength = this.steps.filter(s => s.tab === badge).length;
        if (essentialCompleted === stepLength) {
          this.essentialModal = true;
          this.showEssentialModal();
        }
      } 
      if (this.canViewAdvanced && !this.checkBadgeAdvanced){
        const badge = 'advanced';
        let advancedCompleted = this.nbCompleted.filter(s => s.tab === badge).length;
        let stepLength = this.steps.filter(s => s.tab === badge).length;
        if (advancedCompleted === stepLength) {
          this.advancedModal = true;
          this.showAdvancedModal();
        }
      }
      if (this.canViewExpert && !this.checkBadgeExpert){
        const badge = 'expert';
        let expertCompleted = this.nbCompleted.filter(s => s.tab === badge).length;
        let stepLength = this.steps.filter(s => s.tab === badge).length;
        if (expertCompleted === stepLength) {
          this.expertModal = true;
          this.showExpertModal();
        }
      }
    },
    //Shows a modal when all the steps are completed to congratulate the user
    async showEssentialModal() {
      this.$nextTick(() => {
        this.$bvModal.show('essentialSuccessModal');
      });
    },
    async showAdvancedModal() {
      this.$nextTick(() => {
        this.$bvModal.show('advancedSuccessModal');
      });
    },
    async showExpertModal() {
      this.$nextTick(() => {
        this.$bvModal.show('expertSuccessModal');
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.-disabled {
  opacity: 0.5;
}
</style>