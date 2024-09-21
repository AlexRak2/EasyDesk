import React from "react";
import { Ticket } from "../utils/Interfaces";
import { Priority, Status } from "../utils/Types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaRegTrashAlt } from "react-icons/fa";
import { AuthResponse } from "../hooks/useAuth";

interface DataTableProps {
  tickets: Ticket[];
  onOpenModal: (ticket: Ticket) => void;
  authResponse: AuthResponse;
}


const DataTable: React.FC<DataTableProps> = ({ tickets, onOpenModal, authResponse }) => {
  dayjs.extend(relativeTime);

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex text-white p-4 border-b-2 border-gray-400">
        <div className="flex-1 text-gray-700">Title</div>
        <div className="flex-1 text-gray-700">Requester</div>
        <div className="flex-1 text-gray-700">Status</div>
        <div className="flex-1 text-gray-700">Priority</div>
        <div className="flex-1 text-gray-700">Assigned To</div>
        <div className="flex-1 text-gray-700">Due Date</div>
        <div className="flex-2 text-gray-700">Actions</div>
      </div>

      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className={`flex items-center p-4 ${ticket.status == Status.Closed ? "bg-gray-400 opacity-50" : "bg-gray-200"} hover:bg-gray-200 transition-colors rounded shadow-md`}
        >
          <div className="flex-1">
            <a href={`/Ticket?ticketId=${ticket.id}`} className="hover:text-blue-400 text-gray-800 ">
              {ticket.title}
            </a>
          </div>
          <div className="flex-1 flex items-center gap-2 text-gray-900 text-sm overflow-hidden whitespace-nowrap text-ellipsis">
            {ticket.owner && (
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                <div className="text-xl text-brand-400 opacity-50">
                  {ticket.owner.email[0].toUpperCase()}
                </div>
              </div>
            )}
            {ticket.owner?.email}
          </div>
          <div className="flex-1 text-gray-900 text-sm">{Status[ticket.status as Status]}</div>
          <div className="flex-1 flex items-center text-black ">
            {/* <div
              className={`w-[15px] h-[15px] rounded-full mr-1 ${ticket.priority === 0 ? 'bg-green-400' : ticket.priority === 1 ? 'bg-blue-400' : 'bg-red-500'}`}
            /> */}
            <span className={`px-3 py-1 rounded-full mr-1 ${ticket.priority === 0 ? 'bg-green-400' : ticket.priority === 1 ? 'bg-blue-400' : 'bg-red-500'} text-sm`}>
              {Priority[ticket.priority as Priority]}
            </span>
          </div>
          <div className="flex-1 flex items-center gap-2 text-gray-900 text-sm overflow-hidden whitespace-nowrap text-ellipsis">
            {ticket.assignee && (
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                <div className="text-xl text-brand-400 opacity-50">
                  {ticket.assignee.email[0].toUpperCase()}
                </div>
              </div>
            )}
            {ticket.assignee ? ticket.assignee?.email : "-Unassigned"}
          </div>
            <div className="flex-1 text-gray-900 text-sm">
            {dayjs().to(dayjs(ticket.dueAt))}
          </div>
          <div className="flex-2 text-gray-900 text-sm w-[50px]">
           {
            authResponse.role === "Admin" ? 
            <button onClick={() => onOpenModal(ticket)}>
              <FaRegTrashAlt />
            </button>
            :
            ""
           } 
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataTable;
