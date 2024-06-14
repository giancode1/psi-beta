import React from "react";
import { SideNavItem } from "../../types/types";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSideBarToggle } from "./use-sidebar-toggle";
import axios from "axios"; // Importa axios para hacer la solicitud HTTP
import { useRouter } from "next/router"; // Importa useRouter para redireccionar
import { Button } from "@nextui-org/react";

export const SideBarMenuItem = ({ item }: { item: SideNavItem }) => {
  const { toggleCollapse } = useSideBarToggle();
  const linkStyle =
    "flex items-center min-h-[40px] h-full text-[#71717A] py-2 px-4 hover:text-[#006FEE] rounded-xl transition duration-200";
  const activeLinkStyle =
    "rounded-md text-white bg-[#0D4488] hover:text-black hover:bg-[#E4E4E7] ";
  const ddLinkStyle = linkStyle;
  const NavDropDownItem =
    "text-[#6e769e] py-2 px-4 hover:text-white transition duration-200 ";

  const pathName = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const router = useRouter(); // Obtén el objeto router

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  // Maneja el clic en el botón "Salir"
  const handleLogout = async () => {
    try {
      // Hace la solicitud HTTP al endpoint de logout
      await axios.post("/api/getLogOut");
      // Redirige al usuario a la página de inicio de sesión usando router.push
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      {item.title === "Salir" ? ( // Verifica si es el botón "Salir"
        <Button
        radius="lg"
          className={`${linkStyle}`}
          onClick={handleLogout}
        >
          {item.icon}
          {!toggleCollapse && (
            <span className="ml-3 leading-6 font-semibold">{item.title}</span>
          )}
        </Button>
      ) : (
        <>
          {item.submenu ? (
            <div className="rounded-md min-w-[18px]">
              <a
                className={`${ddLinkStyle} ${
                  pathName.includes(item.path || "") ? activeLinkStyle : ""
                } `}
                onClick={toggleSubMenu}
              >
                {item.icon}
                {!toggleCollapse && (
                  <>
                    <span className="ml-3 text-base leading-6 font-semibold">
                      {item.title}
                    </span>
                  </>
                )}
              </a>
              {subMenuOpen && !toggleCollapse && (
                <div className="bg-[#3a3f48] border-l-4"></div>
              )}
            </div>
          ) : (
            <Link
              href={item.path || "/"}
              className={`${linkStyle} ${
                item.path === pathName ? activeLinkStyle : ""
              }`}
            >
              {item.icon}
              {!toggleCollapse && (
                <span className="ml-3 leading-6 font-semibold">
                  {item.title}
                </span>
              )}
            </Link>
          )}
        </>
      )}
    </>
  );
};
