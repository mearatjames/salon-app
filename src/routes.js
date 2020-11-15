import Vue from "vue";
import Router from "vue-router";
import Dashboard from "./components/Dashboard.vue";
import Add from "./components/Add.vue";
import List from "./components/List.vue";
import Login from "./components/Login.vue";
import User from "./components/User.vue";
import NotFound from "./components/NotFound.vue"
import Sales from "./components/Sales.vue"
// import Expense from "./components/Expense.vue"
import SalesList from "./components/SalesList.vue"
import Products from "./components/Products.vue"
import firebase from "firebase/app";
import 'firebase/auth'

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
      path: "/add",
      component: Add,
      name: "Add",
      meta: {
        requiresAuth: true,
      },
    },
    // {
    //   path: "/expense",
    //   component: Expense,
    //   name: "Expense",
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    {
      path: "/list",
      component: List,
      name: "List",
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/sales",
      component: Sales,
      name: "Sales",
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/sales/list",
      component: SalesList,
      name: "SalesList",
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/sales/products",
      component: Products,
      name: "Products",
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/user",
      component: User,
      name: "User",
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
    { path: '/404', component: NotFound },  
    { path: '*', redirect: '/404' },  
  ],
});

// Nav Guard
router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!firebase.auth().currentUser || !localStorage.getItem('user')) {
      // Go to login
      next({
        path: "/login",
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (firebase.auth().currentUser) {
      next({
        path: "/",
      });
    } else {
      // Proceed to route
      next();
    }
  } else  {
    // Proceed to route
    next();
  }
});

export default router;
