import "../../public/styles/global.css";
import React, { useEffect } from "react"; // Asegúrate de que React y useEffect estén correctamente importados
import DashboardLayout from "./dashboard/layout"; // Asegúrate de que la ruta sea correcta
import { useRouter } from "next/router";
import { NextUIProvider } from "@nextui-org/react";
import { UserProvider, useUser } from "../context/UserContext";

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const isDashboardPage = router.pathname.startsWith("/dashboard");

  const getLayout =
    Component.getLayout ||
    ((page) => {
      return isDashboardPage ? (
        <DashboardLayout>
          {page}
        </DashboardLayout>
      ) : (
        page
      );
    });

  return (
    <NextUIProvider>
      <UserProvider initialUserRole={pageProps.userRole} initialUserEmail={pageProps.userEmail}>
        <ContextInitializer userRole={pageProps.userRole} userEmail={pageProps.userEmail}>
          {getLayout(<Component {...pageProps} />)}
        </ContextInitializer>
      </UserProvider>
    </NextUIProvider>
  );
};

const ContextInitializer = ({ userRole, userEmail, children }) => {
  const { setUserRole, setUserEmail } = useUser();

  useEffect(() => {
    if (userRole) setUserRole(userRole);
    if (userEmail) setUserEmail(userEmail);
  }, [userRole, userEmail, setUserRole, setUserEmail]);

  return children;
};

export default MyApp;
