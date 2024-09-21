import useAuth from "../hooks/useAuth";
import SideNavbar from "../components/SideNavbar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { UserRoleUpdate, UserWithRole } from "../utils/Interfaces";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaRegTrashAlt } from "react-icons/fa";

export default function UsersPage() {

  const [users, setUsers] = useState<UserWithRole[]>([]); 
  const [roles, setRoles] = useState(); 
  const [currentPage, setCurrentPage] = useState(1);
  dayjs.extend(relativeTime);

  const ticketsPerPage = 20; 
  
  const getUsers = async () => {
    const response = await fetch('api/User/GetAllUsers', {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
        console.log(data)
        const res: UserWithRole[] = data;  
        setUsers(res);
    }
  };

  const getRoles = async () => {
    const response = await fetch('api/User/GetAllRoles', {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

  if (response.ok) {
    const data = await response.json();
      setRoles(data);
  }
};


  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  const { isLoading: isAuthLoading, authResponse } = useAuth();

  if (isAuthLoading) {
    return <a>LOADING</a>;
  }
  if (!authResponse.hasAuth) {
    window.location.assign(`/`);
    return null;
  }

  if (authResponse.role != "Admin") {
    window.location.assign(`/Tickets`);
    return null;
  }

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentUsers = users.slice(indexOfFirstTicket, indexOfLastTicket);

  const totalPages = Math.ceil(users.length / ticketsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };



  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      
      const user: UserRoleUpdate = { id: userId, role: newRole };

      const response = await fetch('api/User/UpdateUserRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      window.location.assign(`/Users`);


    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <main className="">
      <div className="flex flex-row bg-gray-300">
        <SideNavbar authResponse={authResponse} />
        <div className="w-[100%] flex flex-col">
          <Navbar authResponse={authResponse} page="Users" />
          <div className="w-full h-full flex flex-col items-end p-5">

            {/* Pagination Controls */}
            <div className="flex items-center space-x-4 m-2 text-gray-600">

              <span className="text-gray-700">
                {currentPage} - {totalPages} of {totalPages}
              </span>

              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1} 
                className="p-2 rounded-md border-2 border-gray-400"
              >
                <MdKeyboardArrowLeft className="text-gray-600" />
              </button>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages} 
                className="p-2 rounded-md border-2 border-gray-400"
              >
                <MdKeyboardArrowRight className="text-gray-600" />
              </button>
            </div>

            {/* Tickets Table */}
            {/* <DataTable tickets={currentTickets} onOpenModal={openModal} /> */}

            <div className="flex flex-col space-y-2 w-full">
              <div className="flex text-white p-4 border-b-2 border-gray-400">
                  <div className="flex-1 text-gray-700">Name</div>
                  <div className="flex-1 text-gray-700">Email</div>
                  <div className="flex-1 text-gray-700">Role</div>
                  <div className="flex-2 text-gray-700">Actions</div>
                </div>

                {currentUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center p-4 bg-gray-200 hover:bg-gray-200 transition-colors rounded shadow-md`}
                  >
                    {/* name */}
                    <div className="flex-1 flex items-center gap-2 text-gray-900 text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                        <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                          <div className="text-xl text-brand-400 opacity-50">
                            {user.email[0].toUpperCase()}
                          </div>
                        </div>
                      {user.email}
                    </div>

                    
                    {/* EMAIL */}
                    <div className="flex-1 text-gray-900">
                      {user.email}
                    </div>

                    
                    <div className="flex-1 text-gray-900">
                      <select
                        className="rounded-md bg-gray-200 text-gray-600 cursor-pointer font-bold w-[75px]"
                        onChange={(e) => updateUserRole(user.id as string, e.target.value)} // Pass both user.id and the selected role
                        defaultValue={user.roles} // Assuming currentRole is a field containing the current role
                        >
                        {roles ? 
                        roles.map((role) => (
                          <option value={role}>{role}</option>

                        )): "User"}
                      </select>
                    </div>
                    
                    <div className="flex-2 text-gray-900 text-sm w-[50px]">
                      <button onClick={() => onOpenModal(ticket)}>
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
          </div>

          
        </div>
      </div>
    </main>
  );
}
