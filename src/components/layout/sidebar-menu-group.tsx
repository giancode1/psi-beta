import React from "react";
import { SideNavItemGroup } from "../../types/types";
import { SideBarMenuItem } from "./sidebar-menu-item";
import classNames from "classnames";
import { useSideBarToggle } from "./use-sidebar-toggle";
import { useUser } from '../../context/UserContext'; // Importa el contexto del usuario

const SideBarMenuGroup = ({ menuGroup }: { menuGroup: SideNavItemGroup }) => {
  const { toggleCollapse } = useSideBarToggle();
  const { userRole } = useUser(); // Obtén el rol del usuario desde el contexto

  const menuGrouopTitleStyle = classNames("py-4 tracking-[.1rem] font-semibold uppercase text-sm text-blue-900 ", {
    'text-center': toggleCollapse
  });

  return (
    <>
      {(menuGroup.roles.includes(userRole) || userRole === 'ti') && ( // Verifica si el rol del usuario puede ver este grupo
        <>
          <h3 className={menuGrouopTitleStyle}>{!toggleCollapse ? menuGroup.title : '...'}</h3>
          {menuGroup.menuList.map((item, index) => (
            item.roles.includes(userRole) || userRole === 'ti' ? ( // Verifica si el rol del usuario puede ver este ítem
              <SideBarMenuItem key={index} item={item} />
            ) : null
          ))}
        </>
      )}
    </>
  );
};

export default SideBarMenuGroup;
