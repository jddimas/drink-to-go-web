import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import auth from './middleware/auth';
import un_auth from './middleware/un_auth';

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [

    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: '',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: '/',
          component: () => import('./views/Sales.vue'),
          meta: {
            title: "Ventas",
            middleware: [auth]
          }
        },
        {
          path: '/ventas',
          name: 'sales',
          component: () => import('./views/Sales.vue'),
          meta: {
            middleware: [auth]
          }
        },
        {
          path: '/pedidos',
          name: 'orders',
          component: () => import('./views/Orders.vue'),
          meta: {
            title: "Pedidos",
            middleware: [auth]
          }
        },
        {
          path: '/productos',
          name: 'products',
          component: () => import('./views/Products.vue'),
          meta: {
            title: "Productos",
            middleware: [auth]
          }
        },
        {
          path: '/clientes',
          name: 'customers',
          component: () => import('./views/Customers.vue'),
          meta: {
            title: "Clientes",
            middleware: [auth]
          }
        }
      ]
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: '',
      component: () => import('@/layouts/full-page/FullPage.vue'),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/Login.vue'),
          meta: {
            title: "Login",
            middleware: [un_auth]
          }
        },
        {
          path: '/recuperar-contraseña',
          name: 'passwordRecovery',
          component: () => import('@/views/PasswordRecoveryPage.vue'),
          meta: {
            title: "Login",
            middleware: [un_auth]
          }
        },
        {
          path: '/actualizar-contraseña',
          name: 'passwordUpdate',
          component: () => import('@/views/PasswordUpdatePage.vue'),
          meta: {
            title: "Login",
            middleware: [un_auth]
          }
        },
        {
          path: '/pages/error-404',
          name: 'page-error-404',
          component: () => import('@/views/pages/Error404.vue')
        }
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: '*',
      redirect: '/pages/error-404'
    }
  ]
})

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
	const subsequentMiddleware = middleware[index];
	// If no subsequent Middleware exists,
	// the default `next()` callback is returned.
	if (!subsequentMiddleware) return context.next;

	return (...parameters) => {
		// Run the default Vue Router `next()` callback first.
		context.next(...parameters);
		// Then run the subsequent Middleware with a new
		// `nextMiddleware()` callback.
		const nextMiddleware = nextFactory(context, middleware, index + 1);
		subsequentMiddleware({ ...context, next: nextMiddleware });
	};
}

router.afterEach((to, from) => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

router.beforeEach((to, from, next) => {
	if (to.meta.middleware) {
		const middleware = Array.isArray(to.meta.middleware)
			? to.meta.middleware
			: [to.meta.middleware];

		const context = {
			from,
			next,
			router,
			to,
		};
		const nextMiddleware = nextFactory(context, middleware, 1);

		return middleware[0]({ ...context, next: nextMiddleware });
	}

	return next();
}); 

export default router
