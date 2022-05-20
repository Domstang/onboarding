<template>
  <div>
    <b-modal :id="id" size="lg" class="modal-header">
      <b-row>
        <b-col class="mb-5">
          <div v-if="tab === 'essential'" class="text-center badge">
            <img src="/assets/images/onboarding/badge-essential-lg.png" />
          </div>
          <div v-if="tab === 'advanced'" class="text-center badge">
            <img src="/assets/images/onboarding/badge-advanced-lg.png" />
          </div>
          <div v-if="tab === 'expert'" class="text-center badge">
            <img src="/assets/images/onboarding/badge-expert-lg.png" />
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-5">
          <div class="text-center mt-5">
            <h1>{{ $t("onboarding.success.modal.title") }}</h1>
          </div>
          <div class="text-center mb-4">
            <h4>
              {{ $t("onboarding.success.modal.subtitle-part1") }} <b>{{ badgeName }}</b> {{ $t("onboarding.success.modal.subtitle-part2") }}
            </h4>
          </div>
        </b-col>
      </b-row>
      <template #modal-footer="{ cancel }">
        <b-button size="sm" variant="outline-secondary" @click="cancel()">
            {{ $t("onboarding.success.modal.close") }}
        </b-button>
        <!-- Button with custom close trigger value -->
        <b-button size="sm" v-if="nextTab" variant="secondary" @click="goto(nextTab)">
            {{ $t("onboarding.success.modal.next-step") }}
        </b-button>
    </template>
    </b-modal>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      require: true,
    },
    nextTab: {
      type: String,
      require: true,
    },
    tab: {
      type: String,
      require: true,
    }
  },
  computed: {
    badgeName() {
      return this.tab.charAt(0).toUpperCase() + this.tab.slice(1);
    },
  },
  mounted() {
    this.updateBadge();
  },
  methods: {
    async updateBadge(){
      await this.$store.dispatch("onboarding/updateBadge", {
        key: this.tab,
      });
    },
    goto(value) {
      this.$root.$emit('bv::hide::modal', this.id, '#btnShow')
      this.$router.push({ name: value });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .modal-header {
  display: block;
  box-sizing: border-box;
  height: 240px;
  background-color: #ebf5ff;
  background-image: url("/assets/images/onboarding/fireworks.png");
  background-position: center;
  background-repeat: no-repeat;
  clip-path: ellipse(84% 100% at 50% 0%);
}
h1 {
  color: #214a81;
  font-size: 54px;
  font-weight: 800;
}
.badge {
  position: absolute;
  right: 0;
  left: 0;
  top: -150px;
  filter: drop-shadow(0 0 0.85rem rgba(0, 0, 0, 0.151));
}
</style>