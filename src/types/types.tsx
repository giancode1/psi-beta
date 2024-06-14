export type SideNavItem = {
    title: string;
    path?: string;
    icon?: JSX.Element;
    submenu?: boolean;
    subMenuItem?: SideNavItem[];
    roles: string[];  // Añadido para control de roles
}

export type SideNavItemGroup = {
    title: string;
    roles: string[];  // Añadido para control de roles
    menuList: SideNavItem[];
}
