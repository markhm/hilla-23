import { Flow } from '@vaadin/flow-frontend';
import { Route } from '@vaadin/router';
import Role from './generated/dk/mhm/hilla/data/Role';
import { appStore } from './stores/app-store';
import './views/helloworldpublic/hello-world-public-view';
import './views/main-layout';

const { serverSideRoutes } = new Flow({
  imports: () => import('../target/frontend/generated-flow-imports'),
});

export type ViewRoute = Route & {
  title?: string;
  icon?: string;
  requiresLogin?: boolean;
  rolesAllowed?: Role[];
  children?: ViewRoute[];
};

export const hasAccess = (route: Route) => {
  const viewRoute = route as ViewRoute;
  if (viewRoute.requiresLogin && !appStore.loggedIn) {
    return false;
  }

  if (viewRoute.rolesAllowed) {
    return viewRoute.rolesAllowed.some((role) => appStore.isUserInRole(role));
  }
  return true;
};

export const views: ViewRoute[] = [
  // place routes below (more info https://hilla.dev/docs/routing)
  {
    path: '',
    component: 'hello-world-public-view',
    icon: '',
    title: '',
  },
  {
    path: 'hello-world-public',
    component: 'hello-world-public-view',
    icon: 'la la-globe',
    title: 'Hello World Public',
  },
  {
    path: 'hello-world-user',
    component: 'hello-world-user-view',
    rolesAllowed: [Role.USER],
    icon: 'la la-globe',
    title: 'Hello World User',
    action: async (_context, _command) => {
      if (!hasAccess(_context.route)) {
        return _command.redirect('login');
      }
      await import('./views/helloworlduser/hello-world-user-view');
      return;
    },
  },
  {
    path: 'hello-world-admin',
    component: 'hello-world-admin-view',
    rolesAllowed: [Role.ADMIN],
    icon: 'la la-globe',
    title: 'Hello World Admin',
    action: async (_context, _command) => {
      if (!hasAccess(_context.route)) {
        return _command.redirect('login');
      }
      await import('./views/helloworldadmin/hello-world-admin-view');
      return;
    },
  },
];
export const routes: ViewRoute[] = [
  {
    path: 'login',
    component: 'login-view',
    icon: '',
    title: 'Login',
    action: async (_context, _command) => {
      await import('./views/login/login-view');
      return;
    },
  },

  {
    path: '',
    component: 'main-layout',
    children: [
      ...views,
      // for server-side, the next magic line sends all unmatched routes:
      ...serverSideRoutes, // IMPORTANT: this must be the last entry in the array
    ],
  },
];
