<template>
  <div>
    <!-- Progress Bar -->
    <onboarding-progress-bar
      :value="nbCompleted"
      :logo="logo"
      :max="steps.length"
    ></onboarding-progress-bar>
    <!-- Step 7 : Pulse-->
    <onboarding-item
      :step="stepsInfos.pulse"
      :status="status.pulse"
      :index="7"
    >
      <template v-slot:body>
        <onboarding-csm-score-body
          :step="stepsInfos.pulse"
        ></onboarding-csm-score-body>
      </template>
    </onboarding-item>
    <!-- Step 8 : Last Meeting-->
    <onboarding-item
      :step="stepsInfos.lastMeeting"
      :status="status.lastMeeting"
      :index="8"
    >
      <template v-slot:body>
        <onboarding-last-meeting-body
          :step="stepsInfos.lastMeeting"
        ></onboarding-last-meeting-body>
      </template>
    </onboarding-item>
    <!-- Step 10 : Task-->
    <onboarding-item
      :step="stepsInfos.task"
      :status="status.task"
      :index="10"
    >
      <template v-slot:body>
        <onboarding-task-body
          :step="stepsInfos.task"
        ></onboarding-task-body>
      </template>
    </onboarding-item>
    <!-- Step 12 : Alert-->
    <onboarding-item
      :step="stepsInfos.alert"
      :status="status.alert"
      :index="12"
    >
      <template v-slot:body>
        <onboarding-alert-body
          :step="stepsInfos.alert"
        ></onboarding-alert-body>
      </template>
    </onboarding-item>
  </div>
</template>
<script>
import OnboardingProgressBar from "@/modules/onboarding/components/OnboardingProgressBar";
import OnboardingItem from "@/modules/onboarding/components/OnboardingItem";
import OnboardingCsmScoreBody from "@/modules/onboarding/components/OnboardingCsmScoreBody";
import OnboardingLastMeetingBody from "@/modules/onboarding/components/OnboardingLastMeetingBody";
import OnboardingTaskBody from "@/modules/onboarding/components/OnboardingTaskBody";
import OnboardingAlertBody from "@/modules/onboarding/components/OnboardingAlertBody";

import store from "@/store";

export default {
  components: {
    OnboardingProgressBar,
    OnboardingItem,
    OnboardingCsmScoreBody,
    OnboardingLastMeetingBody,
    OnboardingTaskBody,
    OnboardingAlertBody
  },
  data: () => ({}),
  computed: {
    steps() {
      return this.$store.getters["onboarding/getSteps"].filter((s) => s.tab === "advanced");
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
      return this.$store.getters["onboarding/getVisuals"].find((v) => v.key === "ADVANCED");
    },
    //Calculate the percentage of completed steps
    nbCompleted() {
      return this.steps.filter((s) => ["DONE", "SKIPED"].includes(this.status[s.key]?.status)).length;
    },
  },
  mounted() {},
  methods: {
    // Skip a step
    async skipStep(stepKey, stepStatus) {
      this.$emit("skip-step", stepKey, stepStatus)
    },
  },
};
</script>

<style>
</style>