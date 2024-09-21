import useAuth from "../hooks/useAuth";
import SideNavbar from "../components/SideNavbar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Ticket } from "../utils/Interfaces";
import DataTable from "../components/DataTable";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Modal from "react-modal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]); 
  const [ticket, setTicket] = useState<Ticket>(); 
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<string>("status"); 
  dayjs.extend(relativeTime);

  const ticketsPerPage = 20; 
  
  const getTicket = async () => {
    const response = await fetch('api/Ticket/GetAllTickets', {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const res: Ticket[] = data;

      res.sort((a, b) => a.status - b.status);

      setTickets(res);
    }
  };

  const deleteTicket = async () => {
    const response = await fetch(`api/Ticket/DeleteTicket?ticketId=${ticket?.id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      closeModal();
      window.location.assign(`/Tickets`);
    }
  };

  useEffect(() => {
    getTicket();
  }, []);

  const { isLoading: isAuthLoading, authResponse } = useAuth();
  const [modalIsOpen, setIsOpen] = useState(false);

  if (isAuthLoading) {
    return <a>LOADING</a>;
  }
  if (!authResponse.hasAuth) {
    window.location.assign(`/`);
    return null;
  }

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

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

  Modal.setAppElement("body");

  function openModal(ticketCopy: Ticket) {
    setIsOpen(true);
    setTicket(ticketCopy);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const sortTickets = (option: string) => {
    const sortedTickets = [...tickets]; // Make a shallow copy of tickets

    switch (option) {
      case "dateCreated":
        sortedTickets.sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));
        break;
      case "priority":
        sortedTickets.sort((a, b) => b.priority - a.priority);
        break;
      case "status":
        sortedTickets.sort((a, b) => a.status - b.status);
        break;
      default:
        break;
    }

    setTickets(sortedTickets); // Update the tickets with sorted ones
    setSortOption(option); // Update the selected sorting option
  };

  return (
    <main className="">
      <div className="flex flex-row bg-gray-300">
        <SideNavbar authResponse={authResponse} />
        <div className="w-[100%] flex flex-col">
          <Navbar authResponse={authResponse} page="Tickets" />
          <div className="w-full h-full flex flex-col items-end p-5">

            {/* Pagination Controls */}
            <div className="flex items-center space-x-4 m-2 text-gray-600">
              Sort By:
              <select
                className="rounded-md bg-gray-300 text-gray-600 cursor-pointer font-bold w-[125px]"
                onChange={(e) => sortTickets(e.target.value)} // Trigger sorting on selection change
              >
                <option value="status">Status</option>
                <option value="priority">Priority</option>
                <option value="dateCreated">Date Created</option>

              </select>

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
            <DataTable tickets={currentTickets} onOpenModal={openModal} authResponse={authResponse} />
          </div>
        </div>
      </div>

      <Modal
        id="modal"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] bg-gray-200 rounded-lg shadow-xl transition-transform duration-300`}
        style={{
          overlay: {
            backgroundColor: "rgba(80, 112, 147, 0.35)",
          },
        }}
      >
        <div className="h-full w-full flex flex-col justify-center items-center py-10">
          <h2 className="text-lg text-gray-800 font-semibold mb-10">
            Are you sure you want to delete?
          </h2>
          <div className="flex flex-row gap-4 justify-center">
            <button
              onClick={closeModal}
              className="border-2 border-gray-400 bg-gray-200 text-black rounded h-[40px] w-[100px]"
            >
              Cancel
            </button>
            <button
              onClick={deleteTicket}
              className="bg-gradient-to-t from-cyan-800 to-brand-900 rounded h-[40px] w-[100px]"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
