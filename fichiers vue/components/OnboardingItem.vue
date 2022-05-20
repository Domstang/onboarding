<template>
  <div>
    <b-card
      no-body
      class="overflow-hidden mb-2"
    >
      <b-row no-gutters align-h="between" v-b-toggle="accordion" :class="{'-default-cursor' : done, '-disabled' : disable}">
        <b-col>
          <b-card-body>
            <h5>
              <!-- Step done -->
              <div v-if="done">
                {{ step.title }}
                <!-- Done Tag -->
                <b-form-tag
                  v-if="tag === 'DONE' || tag === 'SKIPED'"
                  :disabled="true"
                  input-id="tags-basic"
                  class="ml-2"
                  :class="'-badge'"
                >
                  {{ $t("onboarding.content.item.tag.done") }}</b-form-tag
                >
              </div>
              <div v-else>
                <!-- Step unlocked -->
                <div
                  v-if="!disable"
                >
                  <b-link>
                    {{ step.title }}
                  </b-link>
                  <!-- Required Tag -->
                  <b-form-tag
                    v-if="step.required && tag === 'TODO'"
                    :disabled="true"
                    input-id="tags-basic"
                    class="ml-2"
                    :class="'-badge'"
                  >
                    {{ $t("onboarding.content.item.tag.required") }}</b-form-tag
                  >
                  <!-- Todo Tag -->
                  <b-form-tag
                    v-if="!tag"
                    :disabled="true"
                    input-id="tags-basic"
                    class="ml-2"
                    :class="'-badge'"
                  >
                    {{ $t("onboarding.content.item.tag.todo") }}</b-form-tag
                  >
                  <!-- Waiting Tag -->
                  <b-form-tag
                    v-if="tag === 'WAITING'"
                    :disabled="true"
                    input-id="tags-basic"
                    class="ml-2"
                    :class="'-badge'"
                  >
                    <font-awesome-icon
                      class="mr-2"
                      icon="hourglass-half"
                      size="1x"
                    />
                    {{ $t("onboarding.content.item.tag.waiting") }}</b-form-tag
                  >
                  <!-- Processing Tag -->
                  <b-form-tag
                    v-if="tag === 'PROCESSING'"
                    :disabled="true"
                    input-id="tags-basic"
                    class="ml-2"
                    :class="'-badge'"
                  >
                    <font-awesome-icon class="mr-2" icon="spinner" size="1x" />
                    {{ $t("onboarding.content.item.tag.processing") }}</b-form-tag
                  >
                </div>
                <!-- Step locked = no link! -->
                <div v-else>
                  {{ step.title }}
                </div>
              </div>
            </h5>
            <b-card-text>
              {{ step.description }}
            </b-card-text>
          </b-card-body>
        </b-col>
        <!-- Icon status -->
        <b-col cols="2">
          <b-card-body class="text-right">
            <div v-if="done">
              <font-awesome-icon
                class="mr-2 -green"
                icon="check-circle"
                size="2x"
              />
              <b-card-text class="step-subheading"
                >{{ $t("onboarding.content.item.step") }}
                {{ index }}</b-card-text
              >
            </div>
            <div v-else>
              <div
                v-if="step.required"
              >
                <font-awesome-icon
                  class="mr-2"
                  icon="arrow-alt-circle-right"
                  size="2x"
                  style="color: var(--blue)"
                />
              </div>
              <div v-else-if="disable">
                <font-awesome-icon
                  class="mr-2"
                  icon="lock"
                  size="2x"
                  style="color: var(--gray)"
                />
              </div>
              <div v-else>
                <font-awesome-icon
                  class="mr-2"
                  icon="arrow-alt-circle-right"
                  size="2x"
                  style="color: var(--gray)"
                />
              </div>
              <b-card-text class="step-subheading"
                >{{ $t("onboarding.content.item.step") }}
                {{ index }}</b-card-text
              >
            </div>
          </b-card-body>
        </b-col>
      </b-row>
      <b-collapse :id="`collapse-${step.key}`" accordion="steps">
        <b-card class="slot-body m-3">
          <slot name="body"></slot>
        </b-card>
      </b-collapse>
    </b-card>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowAltCircleRight,
  faLock,
  faCheck,
  faCheckCircle,
  faHourglassHalf,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faArrowAltCircleRight,
  faLock,
  faCheck,
  faCheckCircle,
  faHourglassHalf,
  faSpinner
);
export default {
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
  props: {
    step: {
      type: Object,
      require: true,
    },
    status: {
      type: Object,
      require: true,
    },
    index: {
      type: Number,
      require: true,
      default: 1,
    },
    disable: {
      type: Boolean,
      require: true,
    },
  },
  data: () => ({}),
  computed: {
    tag() {
      return this.status?.status;
    },
    done() {
      return ["DONE", "SKIPED"].includes(this.status?.status);
    },
    accordion(){
      let accordion = `collapse-${this.step.key}`;
      return !this.done && !this.disable ? accordion : false
    },
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
@import "../../../assets/components/bootstrap4/functions";
@import "../../../assets/components/bootstrap4/variables";

.-disabled {
  opacity: 0.5;
  cursor: default;
}
.-default-cursor {
  cursor: default;
}
.-green {
  color: $green;
}
.-badge {
  background-color: transparent;
  border: 1px solid $gray-500;
  font-size: 12px;
}
.slot-body {
  border: none;
  background-color: $gray-100;
}
.step-subheading {
  font-weight: $font-weight-bold;
  color: $gray-400;
}
</style>