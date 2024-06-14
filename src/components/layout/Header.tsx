import { Button } from "@mui/material";
import classNames from "classnames";
import { BsList } from 'react-icons/bs';
import { useSideBarToggle } from "./use-sidebar-toggle";
import UserOptions from '../shared/User';

export default function Header() {
  const { toggleCollapse, invokeToggleCollapse } = useSideBarToggle();

  const sideBarToogle = () => {
    invokeToggleCollapse();
  };

  const headerStyle = classNames(
    "fixed bg-white w-full px-4 shadow-lg border-4 border-black",
    "z-40", // Incrementado el z-index
    {
      ["sm:pl-[18rem]"]: !toggleCollapse,
      ["sm:pl-[6.6rem]"]: toggleCollapse,
    }
  );

  return (
    <header className={headerStyle}>
      <div className="flex items-center justify-between h-16">
        <Button
          onClick={sideBarToogle}
          className="order-2 sm:order-1 bg-white text-[#0D4488] hover:bg-[#5F8BB4] hover:text-gray-500 ml-3 rounded-md h-[30px] w-[30px] shadow-md shadow-black/10 transition duration-300 ease-in-out flex items-center justify-center"
        >
          <BsList />
        </Button>
        <div className="order-1 sm:order-2 mr-3">
          <UserOptions />
        </div>
      </div>
    </header>
  );
}
