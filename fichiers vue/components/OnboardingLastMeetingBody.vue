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
              @click="goto()"
            >
              {{ $t("onboarding.last-meeting.body.button") }}
            </button>
          </b-col>
        </b-row>
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
  computed: {
    customers() {
      return this.$store.getters['customers/getAll'];
    },
  },
  mounted() {},
  methods: {
    goto() {
        const lastTouchCustomers = this.customers.filter(c => c.lastTouchTs && c.stage !== 'churn').sort((a, b) => {
            return b.lastTouchTs - a.lastTouchTs;
        });
        if (lastTouchCustomers.length) this.$router.push({ name: 'customerInteractions', params: { customerId: lastTouchCustomers[0].id } });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>