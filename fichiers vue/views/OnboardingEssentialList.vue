<template>
  <div>
    <!-- Progress Bar -->
    <onboarding-progress-bar
      :value="nbCompleted"
      :logo="logo"
      :max="steps.length"
    ></onboarding-progress-bar>
    <!-- Step 1 : Customer-->
    <onboarding-item
      :step="stepsInfos.customer"
      :status="status.customer"
      :index="1"
    >
      <template v-slot:body>
        <onboarding-customers-body
          :step="stepsInfos.customer"
          :logos="crmLogos"
          @import-customers="handleImportCustomers"
        ></onboarding-customers-body>
      </template>
    </onboarding-item>
    <!-- Step 2 : Contact-->
    <onboarding-item
      :step="stepsInfos.contact"
      :status="status.contact"
      :index="2"
    >
    <template v-slot:body>
        <onboarding-contacts-body
          :step="stepsInfos.contact"
          :logos="crmLogos"
          @import-contacts="handleImportContacts"
        ></onboarding-contacts-body>
      </template>
    </onboarding-item>
    <!-- Step 3 : Team-->
    <onboarding-item :step="stepsInfos.team" :status="status.team" :index="3">
      <template v-slot:body>
        <onboarding-team-body
          :step="stepsInfos.team"
          @skip-step="skipStep"
        ></onboarding-team-body>
      </template>
    </onboarding-item>
    <!-- Step 4 : Messaging-->
    <onboarding-item
      :step="stepsInfos.messaging"
      :status="status.messaging"
      :disable="unlockSteps"
      :index="4"
    >
      <template v-slot:body>
        <onboarding-mails-body
          :step="stepsInfos.messaging"
          :logos="messagingLogos"
          @skip-step="skipStep"
        ></onboarding-mails-body>
      </template>
    </onboarding-item>
    <!-- Step 5 : Tracking-->
    <onboarding-item
      :step="stepsInfos.tracking"
      :status="status.tracking"
      :disable="unlockSteps"
      :index="5"
    >
      <template v-slot:body>
        <onboarding-tag-body
          :step="stepsInfos.tracking"
          @skip-step="skipStep"
        ></onboarding-tag-body>
      </template>
    </onboarding-item>
    <!-- Step 6 : Agreements -->
    <onboarding-item
      :step="stepsInfos.agreement"
      :status="status.agreement"
      :index="6"
    >
     <template v-slot:body>
        <onboarding-agreements-body
          :step="stepsInfos.agreements"
          @import-agreements="handleImportAgreements"
        ></onboarding-agreements-body>
      </template>
    </onboarding-item>
    <!-- Modals -->
    <import-customers-modal />
    <import-contacts-modal />
    <import-agreements-modal />
    <div v-if="modal">
      <onboarding-success-modal :id="modalId"/>
    </div>
  </div>
</template>
<script>
import OnboardingProgressBar from "@/modules/onboarding/components/OnboardingProgressBar";
import OnboardingItem from "@/modules/onboarding/components/OnboardingItem";
import OnboardingCustomersBody from "@/modules/onboarding/components/OnboardingCustomersBody";
import OnboardingContactsBody from "@/modules/onboarding/components/OnboardingContactsBody";
import OnboardingTeamBody from "@/modules/onboarding/components/OnboardingTeamBody";
import OnboardingMailsBody from "@/modules/onboarding/components/OnboardingMailsBody";
import OnboardingTagBody from "@/modules/onboarding/components/OnboardingTagBody";
import OnboardingAgreementsBody from "@/modules/onboarding/components/OnboardingAgreementsBody";
import ImportCustomersModal from "@/modules/settings/components/ImportCustomersModal";
import ImportContactsModal from "@/modules/settings/components/ImportContactsModal";
import ImportAgreementsModal from "@/modules/settings/components/ImportAgreementsModal";
import OnboardingSuccessModal from "@/modules/onboarding/components/OnboardingSuccessModal";
import { paginator } from '@/libs/utils/Array';

export default {
  components: {
    OnboardingProgressBar,
    OnboardingItem,
    OnboardingCustomersBody,
    OnboardingContactsBody,
    OnboardingTeamBody,
    OnboardingMailsBody,
    OnboardingTagBody,
    OnboardingAgreementsBody,
    ImportCustomersModal,
    ImportContactsModal,
    ImportAgreementsModal,
    OnboardingSuccessModal,
  },
  data: () => ({
    modalId: "essential",
    modal: false,
  }),
  computed: {
    currentUserId() {
        return this.$store.getters["users/currentUserId"];
    },
    badgesStatus() {
      return this.$store.getters["onboarding/getBadgesStatus"];
    },
    steps() {
      return this.$store.getters["onboarding/getSteps"].filter((s) => s.tab === "essential");
    },
    status() {
      return this.$store.getters["onboarding/getStepsStatus"];
    },
    // Unlock steps when required tasks are done
    unlockSteps() {
      return this.status.customer?.status === "DONE" &&
        this.status.contact?.status === "DONE"
        ? false
        : true;
    },
    stepsInfos() {
      return this.steps.reduce((prev, cur) => {
        prev[cur.key] = cur;
        return prev;
      }, {});
    },
    crmLogos() {
      let logos = this.$store.getters["connections/getConnects"].filter((c) => c.type === "CRM");
      return logos.reduce((prev, cur) => {
        prev[cur.id] = cur;
        return prev;
      }, {});
    },
    messagingLogos() {
      let logos = this.$store.getters["connections/getConnects"].filter((c) => c.type === "MAIL");
      return logos.reduce((prev, cur) => {
        prev[cur.id] = cur;
        return prev;
      }, {});
    },
    logo() {
      return this.$store.getters["onboarding/getVisuals"].find((v) => v.key === "ESSENTIAL");
    },
    //Number of completed steps
    nbCompleted() {
      return this.steps.filter((s) => ["DONE", "SKIPED"].includes(this.status[s.key]?.status)).length;
    },
    customers() {
      return this.$store.getters['customers/getAll'];
    },
    users() {
      return this.$store.getters['users/getAll'];
    },
    connections(){
      return this.$store.getters['connections/getAll'];
    }
  },
  async mounted() {
    // Ensure onboarding status are present before tests
    await this.$store.dispatch('onboarding/ensureOnboardingStatus');
    await this.$store.dispatch("connections/ensureConnections");
    this.checkCompleted();
  },
  methods: {
    // Skip a step
    async skipStep(stepKey, stepStatus) {
      this.$emit("skip-step", stepKey, stepStatus)
    },
    // Check the badge status
    checkBadgeStatus(){
      return this.badgesStatus?.essential ? true : false
    },
    // Check the status of the steps and attribute the badge
    checkCompleted() {
      if (!this.checkBadgeStatus()){
        this.checkCustomers();
        this.checkContacts();
        this.checkTeam();
        this.checkTracking();
        this.checkAgreements();
        this.checkMails();
      }
    },
    async checkCustomers(){
      let customerStepStatus = this.status.customer?.status;
      if (customerStepStatus !== 'DONE'){
        if(!this.customers?.length && this.connections?.find(c => c.type === 'CRM')){
          await this.$store.dispatch("onboarding/updateStep", {
            key: 'customer',
            status: 'PROCESSING',
          });
        }
        if(this.customers.length > 0){
          await this.$store.dispatch("onboarding/updateStep", {
            key: 'customer',
            status: 'DONE',
          });
        }
      }
    },
    async checkContacts(){
      let contactStepStatus = this.status.contact?.status;
      const pg = paginator(5)
      const { data } = await this.$store.dispatch('contacts/fetchContacts', { customerId: this.customerId, ctx: pg.toCtx() });
      if (contactStepStatus !== 'DONE'){
        if(!data.length && this.connections?.find(c => c.type === 'CRM')){
          await this.$store.dispatch("onboarding/updateStep", {
            key: 'contact',
            status: 'PROCESSING',
          });
        }
        if(data.length > 0){
          await this.$store.dispatch("onboarding/updateStep", {
            key: 'contact',
            status: 'DONE',
          });
        }
      }
    },
    async checkTeam(){
      let teamStepStatus = this.status.team?.status;
      if (!['DONE', 'SKIPED'].includes(teamStepStatus)){
          // 2 users at min
        if(this.users.length > 1){
          await this.$store.dispatch("onboarding/updateStep", {
            key: 'team',
            status: 'DONE',
          });
        }
      }
    },
    async checkTracking(){
      let trackingStepStatus = this.status.tracking?.status
      if (!['DONE', 'SKIPED'].includes(trackingStepStatus)){
        if(this.customers.some((element) => element.lastActivityTs)){
          await this.$store.dispatch("onboarding/updateStep", {
            key: 'tracking',
            status: 'DONE',
          });
        }
      }
    },
    async checkMails(){
      let messagingStepStatus = this.status.messaging?.status
      if (!['DONE', 'SKIPED'].includes(messagingStepStatus)){
        const connectIdTypes = this.$store.getters["connections/getConnects"].filter((c) => c.type === 'MAIL').map(c => c.id);
        if(this.connections?.find(c => connectIdTypes.includes(c.type) && c.userId ===  this.currentUserId)){
          await this.$store.dispatch("onboarding/updateStep", {
            key: 'messaging',
            status: 'DONE',
          });
        }
      }
    },
    async checkAgreements(){
      let agreementsStepStatus = this.status.agreement?.status;
      if (agreementsStepStatus !== 'DONE') {
        let mrr = this.customers.find(element => element.mrr);
        if(mrr){
          await this.$store.dispatch("onboarding/updateStep", {
            key: 'agreement',
            status: 'DONE',
          });
        }
      }
    },
    //Show Imports Modals
    handleImportCustomers() {
      this.$nextTick(() => {
        this.$bvModal.show("importCustomers");
      });
    },
    handleImportContacts() {
      this.$nextTick(() => {
        this.$bvModal.show("importContacts");
      });
    },
    handleImportAgreements() {
      this.$nextTick(() => {
        this.$bvModal.show("importAgreements");
      });
    },
  },
};
</script>
<style lang="">
</style>