import { getUserFromToken } from './token'; // Asegúrate de que la ruta sea correcta

const roleRoutes = {
  rectorado: '/dashboard/estadistica/nuevosFecha',
  supervisor: '/dashboard/admisiones/expediente',
  analista: '/dashboard/admisiones/expediente',
  caces: '/dashboard/caces',
  ti: '/dashboard/',
  // Agrega más roles y sus rutas correspondientes aquí
};

export function redirectToDashboard(context) {
  const token = context.req.cookies.token;
  if (token) {
    const user = getUserFromToken(context.req);
    if (user) {
      const redirectRoute = roleRoutes[user.role] || '/dashboard';
      return {
        redirect: {
          destination: redirectRoute,
          permanent: false,
        },
        props: { userRole: user.role, userEmail: user.emailint }
      };
    }
  }
  return null;
}

export function redirectToLogin(context) {
  const token = context.req.cookies.token;
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const user = getUserFromToken(context.req);
  if (user) {
    return {
      props: { userRole: user.role, userEmail: user.emailint }
    };
  }

  return null;
}

export const withRoleProtection = (allowedRoles) => {
  return async (context) => {
    const { req } = context;
    const token = req.cookies.token;
    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const user = getUserFromToken(req);

    if (!user || !allowedRoles.includes(user.role)) {
      const redirectRoute = roleRoutes[user.role] || '/dashboard';
      return {
        redirect: {
          destination: redirectRoute,
          permanent: false,
        },
      };
    }

    return {
      props: { userRole: user.role, userEmail: user.emailint }
    };
  };
};
