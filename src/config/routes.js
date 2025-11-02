export const ROUTES = {
  DASHBOARD: 'dashboard',
  UPLOAD: 'upload',
  KNOWLEDGE_MESH: 'mesh',
  FLASHCARDS: 'flashcards',
  SETTINGS: 'settings',
  DATA: 'data',
  AUTH: 'auth'
};

export const ROUTE_CONFIG = [
  {
    id: ROUTES.DASHBOARD,
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    requiresAuth: false,
    adminOnly: false
  },
  {
    id: ROUTES.UPLOAD,
    label: 'Add Material',
    icon: 'Upload',
    requiresAuth: false,
    adminOnly: false
  },
  {
    id: ROUTES.KNOWLEDGE_MESH,
    label: 'Knowledge Mesh',
    icon: 'Network',
    requiresAuth: false,
    adminOnly: false
  },
  {
    id: ROUTES.FLASHCARDS,
    label: 'Flashcards',
    icon: 'BookOpen',
    requiresAuth: false,
    adminOnly: false
  },
  {
    id: ROUTES.DATA,
    label: 'Data',
    icon: 'Database',
    requiresAuth: true,
    adminOnly: true
  },
  {
    id: ROUTES.SETTINGS,
    label: 'Settings',
    icon: 'Settings',
    requiresAuth: false,
    adminOnly: false
  }
];

export const getAccessibleRoutes = (isAuthenticated, isAdmin) => {
  return ROUTE_CONFIG.filter(route => {
    if (route.adminOnly && !isAdmin) return false;
    if (route.requiresAuth && !isAuthenticated) return false;
    return true;
  });
};
