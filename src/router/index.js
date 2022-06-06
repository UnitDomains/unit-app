import { createRouter, createWebHistory } from "vue-router";

const ServerError = () => import("../views/errors/ServerError.vue");
const NotFound = () => import("../views/errors/NotFound.vue");
const ContractError = () => import("../views/errors/ContractError.vue");
const MetaMaskError = () => import("../views/errors/MetaMaskError.vue");

const Welcome = () => import("../views/Welcome.vue");
const About = () => import("../views/About.vue");

const Search = () => import("../views/search/Search.vue");

const NameContainer = () => import("../views/name/NameContainer.vue");
const Register = () => import("../views/name/Register.vue");
const NameDetails = () => import("../views/name/NameDetails.vue");
const Subdomains = () => import("../views/name/Subdomains.vue");

const AddressContainer = () => import("../views/address/AddressContainer.vue");
const AddressController = () =>
  import("../views/address/AddressController.vue");
const AddressRegistrant = () =>
  import("../views/address/AddressRegistrant.vue");

const ManagerContainer = () => import("../views/manager/ManagerContainer.vue");

const routes = [
  {
    path: "/",
    name: "welcome",
    component: Welcome,
    beforeEnter: (to, from, next) => {
      next();
    },
  },

  {
    path: "/search/:searchText",
    name: "search",
    component: Search,
    beforeEnter: (to, from, next) => {
      next();
    },
  },

  {
    path: "/name/:domainName",
    component: NameContainer,
    children: [
      {
        path: "register",
        component: Register,
      },
      {
        path: "details",
        component: NameDetails,
      },
      {
        path: "subdomains",
        component: Subdomains,
      },
    ],
  },

  {
    path: "/address/:account",
    component: AddressContainer,
    children: [
      {
        path: "registrant",
        component: AddressRegistrant,
      },
      {
        path: "controller",
        component: AddressController,
      },
      {
        path: "",
        component: AddressRegistrant,
      },
    ],
  },

  {
    path: "/manager",
    name: "manager",
    component: ManagerContainer,
    beforeEnter: (to, from, next) => {
      next();
    },
  },

  {
    path: "/servererror",
    name: "servererror",
    component: ServerError,
    beforeEnter: (to, from, next) => {
      next();
    },
  },
  {
    path: "/contracterror",
    name: "contracterror",
    component: ContractError,
    beforeEnter: (to, from, next) => {
      next();
    },
  },

  {
    path: "/metamaskerror",
    name: "metamaskerror",
    component: MetaMaskError,
    beforeEnter: (to, from, next) => {
      next();
    },
  },

  {
    path: "/about",
    name: "about",
    component: About,
    beforeEnter: (to, from, next) => {
      next();
    },
  },

  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
    beforeEnter: (to, from, next) => {
      next();
    },
  },
];

const isSubdomain = function (domainName) {
  return domainName?.split(".").length - 1 > 1;
};
/**
 * 创建路由
 */
const router = createRouter({
  // hash模式：createWebHashHistory，
  // history模式：createWebHistory
  history: createWebHistory("/"),
  // history:createWebHashHistory(),
  routes,
});

/**
 * 初始化钱包
 */
/*const InitWallet = function() {
  if (typeof web3 !== 'undefined') {
    if (web3.currentProvider.isMetaMask === true) {
      store.dispatch('setWallet', {
        value: true
      })
    } else {
      // Another web3 provider
      store.setWallet(false)
      store.setAccount(null)
    }
  } else {
    // No web 3 provider
    //  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    store.dispatch('setWallet', {
      value: false
    })
    store.dispatch('setAccount', {
      account: null
    })
  }
}*/

export default router;
