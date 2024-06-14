import Image from "next/image";
import React from 'react';
import styles from "../../styles/sidebar.module.css";
import logoISTE from "../../../public/images/logoISTE.png";
import { SIDENAV_ITEMS } from "../../types/sidebar_constrants";
import { SideBarMenuItem } from "./sidebar-menu-item";
import classNames from "classnames";
import LOGO from '../../../public/images/LOGO.png';
import SideBarMenuGroup from "./sidebar-menu-group";
import { useSideBarToggle } from "./use-sidebar-toggle";

export default function Sidebar() {
  const { toggleCollapse } = useSideBarToggle();
  const asideSyle = classNames(
    "sidebar overflow-y-auto overflow-x-auto fixed bg-[#fff] text-gray-500 z-50 h-full shadow-lg border-4 border-black transition duration-300 ease-in-out",
    {
      ["w-[17rem]"]: !toggleCollapse,
      ["sm:w-[5.4rem] sm:left-0 left-[-100%] "]: toggleCollapse,
    }
  );
  return (
    <aside className={asideSyle}>
      <div className="sidebar-top relative flex items-center py-5 px-6 ">
        <Image src={LOGO} width={30} alt="logo" />
        {!toggleCollapse && <h3 className="pl-2 font-bold text-2xl text-[#0D4488] min-w-max">
          Dashboard
        </h3>}
      </div>
      <nav className="flex flex-col gap-2 transition duration-300">
        <div className="flex flex-col gap-2 px-4">
          {SIDENAV_ITEMS.map((item, index) => {
            return <SideBarMenuGroup key={index} menuGroup={item}></SideBarMenuGroup>;
          })}
        </div>
      </nav>
    </aside>
  );
}
