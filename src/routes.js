import Vue from "vue";
import Router from "vue-router";
import Dashboard from "./components/Dashboard.vue";
import Transaction from "./components/Transaction.vue";
import Modify from "./components/Modify.vue";
import Login from "./components/Login.vue";
import firebase from "firebase";

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/",
      component: Dashboard,
      name: "Dashboard",
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/transaction",
      component: Transaction,
      name: "Transaction",
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/modify",
      component: Modify,
      name: "Modify",
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      component: Login,
      name: "Login",
      meta: {
        requiresGuest: true,
      },
    },
  ],
});

// Nav Guard
router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!firebase.auth().currentUser) {
      // Go to login
      next({
        path: "/login",
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (firebase.auth().currentUser) {
      // Go to login
      next({
        path: "/",
      });
    } else {
      // Proceed to route
      next();
    }
  } else {
    // Proceed to route
    next();
  }
});

export default router;
