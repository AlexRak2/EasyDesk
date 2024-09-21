import { redirect } from "react-router-dom";
import useAuth, { AuthResponse } from "../hooks/useAuth";
import { AiOutlineDashboard } from "react-icons/ai";
import { PiTicket } from "react-icons/pi";
import { IoCreateOutline } from "react-icons/io5";
import { SiHelpdesk } from "react-icons/si";
import { FaRegUser } from "react-icons/fa";

export default function SideNavbar(props: { authResponse: AuthResponse }) {
  const { authResponse, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <a>LOADING</a>;
  }
  if (!authResponse.hasAuth) {
    redirect("/Home");
    return;
  }

  return (
    <div className="sticky top-0 flex h-[100vh] w-[250px] flex-row bg-brand-950 z-40">
      <div className="p-3 w-full mt-10">
        <h1 className="text-white font-bold mb-10 text-xl flex items-center gap-2"><SiHelpdesk size={35} /> Easy Desk</h1>
        <h1 className="text-white font-bold mb-5">Menu</h1>
        {props.authResponse.role === "Admin" ? (
          <div className="flex flex-col gap-2">
            <div className="w-full flex flex-row items-center text-lg gap-2 p-2 hover:bg-brand-900 rounded">
              <AiOutlineDashboard size={25}/>
              <a href="/Home" className="">
                Dashboard
              </a>
            </div>

            <div className="w-full flex flex-row items-center text-lg  gap-2 p-2 hover:bg-brand-900 rounded">
              <PiTicket  size={25} />
              <a href="/Tickets" className="">
                Tickets
              </a>
            </div>

            <div className="w-full flex flex-row items-center text-lg  gap-2 p-2 hover:bg-brand-900 rounded">
              <IoCreateOutline  size={25} />
              <a href="/CreateTicket" className="">
                Create Ticket
              </a>
            </div>

            
            <div className="w-full flex flex-row items-center text-lg  gap-2 p-2 hover:bg-brand-900 rounded">
            <FaRegUser size={25} />
              <a href="/Users" className="">
                Users
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="w-full flex flex-row items-center text-lg  gap-2 p-2 hover:bg-brand-900 rounded">
              <PiTicket  size={25} />
              <a href="/Tickets" className="">
                My Tickets
              </a>
            </div>
            <div className="w-full flex flex-row items-center text-lg  gap-2 p-2 hover:bg-brand-900 rounded">
              <IoCreateOutline  size={25} />
              <a href="/CreateTicket" className="">
                Create Ticket
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
