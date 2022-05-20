import i18n from "@/i18n";
import Vue from 'vue';

const ONBOARDING_STEPS = [
  {
    key: "customer",
    tab: "essential",
    title: i18n.t("onboarding.essential.step.customer.title"),
    description: i18n.t("onboarding.essential.step.customer.description"),
    strategy: 'CLIENT',
    plan: 1,
    required: true,
    skip: false
  },
  {
    key: "contact",
    tab: "essential",
    title: i18n.t("onboarding.essential.step.contact.title"),
    description: i18n.t("onboarding.essential.step.contact.description"),
    strategy: 'CLIENT',
    plan: 1,
    required: true,
    skip: false,
  },
  {
    key: "team",
    tab: "essential",
    title: i18n.t("onboarding.essential.step.team.title"),
    description: i18n.t("onboarding.essential.step.team.description"),
    strategy: 'CLIENT',
    plan: 1,
    required: false,
    skip: true
  },
  {
    key: "messaging",
    tab: "essential",
    title: i18n.t("onboarding.essential.step.messaging.title"),
    description: i18n.t("onboarding.essential.step.messaging.description"),
    strategy: 'USER',
    plan: 1,
    required: false,
    skip: true,
  },
  {
    key: "tracking",
    tab: "essential",
    title: i18n.t("onboarding.essential.step.tracking.title"),
    description: i18n.t("onboarding.essential.step.tracking.description"),
    strategy: 'CLIENT',
    plan: 1,
    required: false,
    skip: true
  },
  {
    key: "agreement",
    tab: "essential",
    title: i18n.t("onboarding.essential.step.agreement.title"),
    description: i18n.t("onboarding.essential.step.agreement.description"),
    strategy: 'CLIENT',
    plan: 1,
    required: false,
    skip: false
  },
  {
    key: "pulse",
    tab: "advanced",
    title: i18n.t("onboarding.advanced.step.pulse.title"),
    description: i18n.t("onboarding.advanced.step.pulse.description"),
    strategy: 'USER',
    plan: 1,
    required: false,
    skip: false
  },
  {
    key: "lastMeeting",
    tab: "advanced",
    title: i18n.t("onboarding.advanced.step.last-meeting.title"),
    description: i18n.t("onboarding.advanced.step.last-meeting.description"),
    strategy: 'USER',
    plan: 1,
    required: false,
    skip: false
  },
  {
    key: "healthScore",
    tab: "expert",
    title: i18n.t("onboarding.advanced.step.health-score.title"),
    description: i18n.t("onboarding.advanced.step.health-score.description"),
    strategy: 'USER',
    plan: 1,
    required: false,
    skip: true
  },
  {
    key: "task",
    tab: "advanced",
    title: i18n.t("onboarding.expert.step.task.title"),
    description: i18n.t("onboarding.expert.step.task.description"),
    strategy: 'USER',
    plan: 1,
    required: false,
    skip: false
  },
  {
    key: "taskTemplate",
    tab: "expert",
    title: i18n.t("onboarding.expert.step.task-template.title"),
    description: i18n.t("onboarding.expert.step.task-template.description"),
    strategy: 'USER',
    plan: 1,
    required: false,
    skip: false
  },
  {
    key: "alert",
    tab: "advanced",
    title: i18n.t("onboarding.expert.step.alert.title"),
    description: i18n.t("onboarding.expert.step.alert.description"),
    strategy: 'USER',
    plan: 1,
    required: false,
    skip: false
  },
  {
    key: "playbook",
    tab: "expert",
    title: i18n.t("onboarding.expert.step.playbook.title"),
    description: i18n.t("onboarding.expert.step.playbook.description"),
    strategy: 'USER',
    plan: 2,
    required: false,
    skip: false
  }
];

const ONBOARDING_BADGES =  [
  {
    key: "essential"
  },
  {
    key: "advanced"
  },
  {
    key: "expert"
  }
];

const state = {
  initialized: false,
  show: true,
  badges: {},
  tabs: {},
  steps:{}
};

const pendingUpdates = {
    timerDebouncer: null,
    updates: {
        BADGE: [],
        USER: [],
        CLIENT: []
    }
}

const VISUALS = [
    {
        key: 'ESSENTIAL',
        alt: i18n.t("onboarding.essential.badge.title"),
        path: '/assets/images/onboarding/badge-essential.png',
    },
    {
        key: 'ADVANCED',
        alt: i18n.t("onboarding.advanced.badge.title"),
        path: '/assets/images/onboarding/badge-advanced.png',
    },
    {
        key: 'EXPERT',
        alt: i18n.t("onboarding.expert.badge.title"),
        path: '/assets/images/onboarding/badge-expert.png',
    },
];

const getters = {
  getBadges: () => {
    return ONBOARDING_BADGES;
  },
  getShow: () => {
    return state.show;
  },
  getBadgesStatus: (state) => {
    return state.badges;
  },
  getSteps: (state, getters, rootState, rootGetters) => {
    const clientPlan = rootGetters['clients/currentClient'].plan;
    return ONBOARDING_STEPS.filter((s) => s.plan <= clientPlan);
  },
  getStepsStatus: (state) => {
    return state.steps;
  },
  getTabs: (state) => {
    return state.tabs;
  },
  getVisuals: () => VISUALS,
};

const actions = {
  async ensureOnboardingStatus({ dispatch, state }) {
    if (!state.initialized) {
      await dispatch('initOnboardingStatus');
    }
  },
  async initOnboardingStatus({ commit }) {
    // Get config if not present
    const clientConfig = await this.dispatch('configs/ensureConfigs');
    const userConfig = await this.dispatch('configs/ensureUserConfigs');
    let badgesStatus = {};
    let stepsStatus = {};

    if (clientConfig.onboarding) {
      badgesStatus = { ...badgesStatus, ...(clientConfig.onboarding.badges || {}) };
      stepsStatus = { ...stepsStatus, ...(clientConfig.onboarding.steps || {}) };
    }
    if (userConfig.onboarding) {
      badgesStatus = { ...badgesStatus, ...(userConfig.onboarding.badges || {}) };
      stepsStatus = { ...stepsStatus, ...(userConfig.onboarding.steps || {}) };
    }
    // Init status in store
    commit('setBadgesStatus', badgesStatus);
    commit('setStepsStatus', stepsStatus);
    // Set init flag
    commit('setInitialized', true);
    commit('setShow', typeof userConfig?.onboarding?.show !== 'undefined' ? userConfig.onboarding.show : true);
  },
  async updateShow({ commit }, { value }) {
    try {
        const configUser = JSON.parse(JSON.stringify(this.getters['configs/getForUserAll']));
        configUser.onboarding = configUser.onboarding || {
            badges: {},
            steps: {},
        };
        configUser.onboarding.show = value;
        await this.dispatch( "configs/updateUserConfig", {
            config: configUser
        });

        commit('setShow', value);
      } catch (error) {
        throw 'A server error has occurred';
      }
  }, 
  async updateBadge({ commit }, { key }) {
    try {
        pendingUpdates.updates.BADGE.push({ key });

        if (pendingUpdates.timerDebouncer) {
            clearTimeout(pendingUpdates.timerDebouncer);
        }
        pendingUpdates.timerDebouncer = setTimeout(updateDebouncer.bind(this), 150);

        commit('setBadge', { key });
        this.commit( "users/addCurrentUserBadge", {
            badge: key
        });
      } catch (error) {
        throw 'A server error has occurred';
      }
  }, 
  async updateStep({ commit }, { key, status }) {
    try {
        // Get step stockage strategy
        const { strategy } = ONBOARDING_STEPS.find(s => s.key === key);

        pendingUpdates.updates[strategy].push({ key, status, strategy });

        if (pendingUpdates.timerDebouncer) {
            clearTimeout(pendingUpdates.timerDebouncer);
        }
        pendingUpdates.timerDebouncer = setTimeout(updateDebouncer.bind(this), 150);

        commit('setStepStatus', { key, status });
      } catch (error) {
        throw 'A server error has occurred';
      }
  },
  updateTab({ commit }, { key, status }) {
    try {
        commit('setTabStatus', { key, status });
      } catch (error) {
        throw 'A server error has occurred';
      }
  }, 
};

const mutations = {
  setInitialized(state, value) {
    state.initialized = value;
  },
  setShow(state, value) {
    state.show = value;
  },
  setBadgesStatus(state, status) {
    state.badges = status;
  },
  setStepsStatus(state, status) {
    state.steps = status;
  },
  setTabStatus(state, status) {
    state.tabs = status;
  },
  setBadge(state, { key }) {
    Vue.set(state.badges, key, true);
  },
  setStepStatus(state, { key, status }) {
    Vue.set(state.steps, key, state.steps[key] || {})
    Vue.set(state.steps[key], 'status', status)
    Vue.set(state.steps[key], 'ts', new Date())
  },
};

const init = async (ctx, store) => {
    store.subscribeAction(async(action) => {
        switch (action.type) {
            //Import customers
            case "customers/add": {
                let customerStepStatus = store.getters["configs/getAll"]?.onboarding?.steps
                if(customerStepStatus.customer?.status !== 'DONE') {
                    await store.dispatch("onboarding/updateStep", {
                        key: 'customer',
                        status: 'DONE',
                    });
                }
                break;
            }
            //Import contacts
            case "contacts/add": {
                let contactStepStatus = store.getters["configs/getAll"]?.onboarding?.steps
                if(contactStepStatus.contact?.status !== 'DONE') {
                    await store.dispatch("onboarding/updateStep", {
                        key: 'contact',
                        status: 'DONE',
                    });
                }
                break;
            }
            //Messaging
            case "connections/add": {
                let messagingStepStatus = store.getters["configs/getForUserAll"]?.onboarding?.steps
                if(messagingStepStatus?.messaging?.status !== 'DONE' || messagingStepStatus?.messaging?.status !== 'SKIPED') {
                    const connects = store.getters["connections/getConnects"].filter((c) => c.type === 'MAIL');
                    let connections = action.payload.connection.type;
                    if(connects.find(c => c.id === connections)) {
                        await store.dispatch("onboarding/updateStep", {
                            key: 'messaging',
                            status: 'DONE',
                        });
                    }
                }
                break;
            }
            //Import agreements
            case "agreements/add": {
                let agreementStepStatus = store.getters["configs/getAll"]?.onboarding?.steps
                if(agreementStepStatus.agreement?.status !== 'DONE') {
                    await store.dispatch("onboarding/updateStep", {
                        key: 'agreement',
                        status: 'DONE',
                    });
                }
                break;
            }
            //CSM Pulse
            case "customers/updateScore": {
                let pulseStepStatus = store.getters["configs/getForUserAll"]?.onboarding?.steps
                if(pulseStepStatus?.pulse?.status !== 'DONE'){
                    await store.dispatch("onboarding/updateStep", {
                        key: 'pulse',
                        status: 'DONE',
                    });
                }
                break;
            }
            //Last Meeting Score Add
            case "interactions/add": {
                let lastMeetingStepStatus = store.getters["configs/getForUserAll"]?.onboarding?.steps
                if(lastMeetingStepStatus?.lastMeeting?.status !== 'DONE'){
                    await store.dispatch("onboarding/updateStep", {
                        key: 'lastMeeting',
                        status: 'DONE',
                    });
                }
                break;
            }
            //Last Meeting Score Update
            case "interactions/update": {
                let lastMeetingStepStatus = store.getters["configs/getForUserAll"]?.onboarding?.steps
                if(lastMeetingStepStatus?.lastMeeting?.status !== 'DONE'){
                    await store.dispatch("onboarding/updateStep", {
                        key: 'lastMeeting',
                        status: 'DONE',
                    });
                }
                break;
            }
            //Health Score
            case "customerProfiles/add": {
                let healthStepStatus = store.getters["configs/getForUserAll"]?.onboarding?.steps
                if(healthStepStatus?.healthScore?.status !== 'DONE'){
                    await store.dispatch("onboarding/updateStep", {
                        key: 'healthScore',
                        status: 'DONE',
                    });
                }
                break;
            }
            case "customerProfiles/update": {
                let healthStepStatus = store.getters["configs/getForUserAll"]?.onboarding?.steps
                if(healthStepStatus?.healthScore?.status !== 'DONE'){
                    await store.dispatch("onboarding/updateStep", {
                        key: 'healthScore',
                        status: 'DONE',
                    });
                }
                break;
            }
            //First Task
            case "tasks/add": {
                let taskStepStatus = store.getters["configs/getForUserAll"]?.onboarding?.steps
                if(taskStepStatus?.task?.status !== 'DONE'){
                    await store.dispatch("onboarding/updateStep", {
                        key: 'task',
                        status: 'DONE',
                    });
                }
                break;
            }
            //First Project Task
            case "tasks/addTemplate": {
                let taskStepStatus = store.getters["configs/getForUserAll"]?.onboarding?.steps
                if(taskStepStatus?.taskTemplate?.status !== 'DONE'){
                    await store.dispatch("onboarding/updateStep", {
                        key: 'taskTemplate',
                        status: 'DONE',
                    });
                }
                break;
            }
            //Alert
            case "alerts/add": {
                let alertStepStatus = store.getters["configs/getForUserAll"]?.onboarding?.steps
                if(alertStepStatus?.alert?.status !== 'DONE'){
                    await store.dispatch("onboarding/updateStep", {
                        key: 'alert',
                        status: 'DONE',
                    });
                }
                break;
            }
            //Playbook
            case "playbooks/add": {
                let playbookStepStatus = store.getters["configs/getForUserAll"]?.onboarding?.steps
                if(playbookStepStatus?.playbook?.status !== 'DONE'){
                    await store.dispatch("onboarding/updateStep", {
                        key: 'playbook',
                        status: 'DONE',
                    });
                }
                break;
            }
            default:
                return
          }
    })
};

async function updateDebouncer() {
    pendingUpdates.timerDebouncer = null;
    let configUser;
    let config;

    if (pendingUpdates.updates.BADGE?.length) {
        configUser = JSON.parse(JSON.stringify(this.getters['configs/getForUserAll']));
        configUser.onboarding = configUser.onboarding || {
            badges: {},
            steps: {},
        };
        for(const badgeUpdate of pendingUpdates.updates.BADGE) {
            configUser.onboarding.badges = { ...configUser.onboarding.badges, [badgeUpdate.key]: true };
        }
        pendingUpdates.updates.BADGE = [];
    }
    if (pendingUpdates.updates.USER?.length) {
        if (!configUser) {
            configUser = JSON.parse(JSON.stringify(this.getters['configs/getForUserAll']));
            configUser.onboarding = configUser.onboarding || {
                badges: {},
                steps: {},
            };
        }
        for(const userUpdate of pendingUpdates.updates.USER) {
            configUser.onboarding.steps = { ...configUser.onboarding.steps, [userUpdate.key]: { status: userUpdate.status, ts: new Date() } };
        }
        pendingUpdates.updates.USER = [];
    }
    if (pendingUpdates.updates.CLIENT?.length) {
        config = JSON.parse(JSON.stringify(this.getters['configs/getAll']));
        config.onboarding = config.onboarding || {
            badges: {},
            steps: {},
        };
        for(const clientUpdate of pendingUpdates.updates.CLIENT) {
            config.onboarding.steps = { ...config.onboarding.steps, [clientUpdate.key]: { status: clientUpdate.status, ts: new Date() } };
        }
        pendingUpdates.updates.CLIENT = [];
    }
    if (configUser) await this.dispatch( "configs/updateUserConfig", {
        config: configUser
    });
    if (config) await this.dispatch("configs/update", {
        config
    });
}

export default {
  namespaced: true,
  getters,
  actions,
  state,
  mutations,
  init
};
