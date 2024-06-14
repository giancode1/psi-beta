import classNames from "classnames";
import { ReactNode } from "react";
import { useSideBarToggle } from "./use-sidebar-toggle";

export default function PageWrapper({children}: {children: ReactNode}) {
  const{toggleCollapse}=useSideBarToggle();
  const bodyStyle = classNames("bg-slate-50 flex-grow text-black p-2 mt-16 overflow-y-auto", {
    ["sm:pl-[18rem]"]: !toggleCollapse,
    ["sm:pl-[6.6rem]"]: toggleCollapse,
});


  return (
    <div className={bodyStyle} style={{ zIndex: 10 }} >
        {children}
    </div>
  )
}
