<template>
  <div>
    <!-- Progress Bar -->
    <onboarding-progress-bar
      :value="nbCompleted"
      :logo="logo"
      :max="steps.length"
    ></onboarding-progress-bar>
    
    <!-- Step 9 : Health Score-->
    <onboarding-item
      :step="stepsInfos.healthScore"
      :status="status.healthScore"
      :index="9"
    >
      <template v-slot:body>
        <onboarding-health-score-body
          :step="stepsInfos.healthScore"
          @skip-step="skipStep"
        ></onboarding-health-score-body>
      </template>
    </onboarding-item>
    <!-- Step 11 : Task Template-->
    <onboarding-item
      :step="stepsInfos.taskTemplate"
      :status="status.taskTemplate"
      :index="11"
    >
      <template v-slot:body>
        <onboarding-task-project-body
          :step="stepsInfos.taskTemplate"
        ></onboarding-task-project-body>
      </template>
    </onboarding-item>
    <!-- Step 13 : Playbook-->
    <div v-if="stepsInfos.playbook">
      <onboarding-item
        :step="stepsInfos.playbook"
        :status="status.playbook"
        :index="13"
      >
        <template v-slot:body>
          <onboarding-playbook-body
            :step="stepsInfos.playbook"
          ></onboarding-playbook-body>
        </template>
      </onboarding-item>
    </div>
  </div>
</template>
<script>
import OnboardingProgressBar from "@/modules/onboarding/components/OnboardingProgressBar";
import OnboardingItem from "@/modules/onboarding/components/OnboardingItem";
import OnboardingTaskProjectBody from "@/modules/onboarding/components/OnboardingTaskProjectBody";
import OnboardingPlaybookBody from "@/modules/onboarding/components/OnboardingPlaybookBody";
import OnboardingHealthScoreBody from "@/modules/onboarding/components/OnboardingHealthScoreBody";
import store from "@/store";

export default {
  components: {
    OnboardingProgressBar,
    OnboardingItem,
    OnboardingTaskProjectBody,
    OnboardingHealthScoreBody,
    OnboardingPlaybookBody,
  },
  data: () => ({}),
  computed: {
    steps() {
      return this.$store.getters["onboarding/getSteps"].filter((s) => s.tab === "expert");
    },
    status() {
      return this.$store.getters["onboarding/getStepsStatus"];
    },
    stepsInfos() {
      return this.steps.reduce((prev, cur) => {
        prev[cur.key] = cur;
        return prev;
      }, {});
    },
    logo() {
      return this.$store.getters["onboarding/getVisuals"].find((v) => v.key === "EXPERT");
    },
    //Calculate the percentage of completed steps
    nbCompleted() {
      return this.steps.filter((s) => ["DONE", "SKIPED"].includes(this.status[s.key]?.status)).length;
    },
  },
  mounted() {},
  methods: {
      async skipStep(stepKey, stepStatus) {
        this.$emit("skip-step", stepKey, stepStatus)
      }
  },
};
</script>
<style>
</style>