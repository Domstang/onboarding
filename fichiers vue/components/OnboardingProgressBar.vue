<template>
  <b-container fluid class="mt-3 mb-3">
    <b-row align-v="center" align-h="between">
      <b-col class="pl-0">
        <b-progress :max="max">
          <b-progress-bar
            :value="value"
            :class="completed ? '-progress-completed' : '-in-progress'"
          ></b-progress-bar>
        </b-progress>
      </b-col>
      <b-col cols="1" class="text-right pr-0">
        <img :src="logo.path" />
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  props: {
    max: {
      type: Number,
      require: true,
    },
    value: {
      type: Number,
      require: true,
    },
    logo: {
      type: Object,
    },
  },
  data: () => ({}),
  computed: {
    completed(){
      return this.value === this.max ? true : false;
    }
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
@import "../../../assets/components/bootstrap4/functions";
@import "../../../assets/components/bootstrap4/variables";
.-in-progress {
  background-color: $blue;
}
.-progress-completed {
  background-color: $green;
}
</style>