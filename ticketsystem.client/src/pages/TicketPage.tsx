import { useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import SideNavbar from "../components/SideNavbar";
import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import { Priority, Status } from "../utils/Types";
import { Ticket, User } from "../utils/Interfaces";
import Modal from "react-modal";
import RichTextEditor from "../components/RichTextEditor";
import RichTextDisplay from "../components/RichTextDisplay";
import Conversation from "../components/Conversation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function TicketPage() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { isLoading: isAuthLoading, authResponse } = useAuth();
  const [message, setMessage] = useState("");
  const [adminOnly, setAdminOnly] = useState(false);
  dayjs.extend(relativeTime);

  const [ticket, setTicket] = useState<Ticket>({
    title: "",
    description: "",
    status: 0,
    priority: 0,
    createdAt: new Date(),
    id: "",
    owner: undefined,
    assignee: undefined,
    messages: undefined,
  });

  const [ticketUpdate, setTicketUpdate] = useState<Ticket>({
    title: "",
    description: "",
    status: 0,
    priority: 0,
    createdAt: new Date(),
    id: "",
    owner: undefined,
    assignee: undefined,
  });

  const [agents, setAgents] = useState<User[]>();

  const ticketId = new URLSearchParams(useLocation().search).get("ticketId");

  const getTicket = async () => {
    const response = await fetch(`api/Ticket/GetTicketData?ticketId=${ticketId}`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const res: Ticket = await response.json();
      setTicket(res);
      setTicketUpdate(res);

      console.log(res);
    }
  };
  
  const getAgents = async () => {
    const response = await fetch(`api/User/GetAllAgents`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const res: User[] = await response.json();
      setAgents(res);
    }
  };
  

  useEffect(() => {
    getTicket();
    getAgents();
  }, []);

  if (isAuthLoading) {
    return <a>LOADING</a>;
  }
  if (!authResponse.hasAuth) {
    window.location.assign(`/`);
    return;
  }

  const updateTicket = async () => {

    const response = await fetch("api/Ticket/UpdateTicket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketUpdate),
    });

    if (response.ok) {
      window.location.assign(`/Ticket?ticketId=${ticketId}`);
      closeModal();
    }
  };

  const sendMessage = async () => {
    const response = await fetch("api/Ticket/SendMessage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: ticket.id, content: message, adminOnly: adminOnly }),
    });

    if (response.ok) {
      window.location.assign(`/Ticket?ticketId=${ticketId}`);
    }
  };

  Modal.setAppElement("body");

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setTicketUpdate(ticket);
  }

  return (
    <main className="h-[100%]">
      <div className="flex flex-row bg-gray-300">
        <SideNavbar authResponse={authResponse} />
        <div className="w-[100%] h-[100%] flex flex-col">
          <Navbar authResponse={authResponse} page={`Ticket > ${ticket?.id}`} />
          <div className="rounded-xl h-[100%] flex flex-row justify-end">
            <div className="w-full flex flex-col items h-[100%] justify-start items-center">
              <div className="w-[95%] flex justify-end mt-4 mb-1">

                {
                  authResponse.role === "Admin" ?
                  (                 
                    <button
                    className="rounded-md border-2 border-gray-400 w-[75px] h-[35px] text-gray-600"
                    onClick={openModal}
                  >
                    Edit
                  </button>
                  )
                  :
                  ""
               }  
              </div>

              <div className="w-[95%] h-[60%] bg-white rounded p-10 flex flex-row gap-10">
              <div className="w-[50px] h-[50px] bg-slate-300 rounded-full flex"><div className="m-auto text-3xl text-brand-800 opacity-50">{ticket.owner?.email[0].toUpperCase()}</div></div>
              <div className="h-fit w-full">
                  <h1 className="text-gray-600 text-xl font-bold">
                    {ticket?.title}
                  </h1>
                  <div className="text-gray-400 text-md flex">
                    <span className="text-brand-500 mr-1">
                      {ticket.owner?.email}
                    </span>
                    {`reported ${
                       dayjs().to(dayjs(ticket.createdAt))
                    }`}
                  </div>

                  <RichTextDisplay
                    content={ticket.description}
                    styling="w-[100%] text-black mt-5 overflow-auto max-h-[450px] text-lg"
                  />
                </div>
              </div>

              <div className="w-[95%] flex flex-col gap-4 justify-start mt-4 mb-1 p-2">
                <h1 className="text-gray-600 w-full border-b-2 border-gray-400 text-lg font-bold">
                  Conversations
                </h1>

                {ticket.messages
                  ? ticket.messages.map((message) => (
                      <Conversation key={message.id} message={message} />
                    ))
                  : ""}
              </div>

              <div className="w-full flex flex-col items-center p-3 mt-10">
                <h1 className="text-gray-600 w-[94%] border-b-2 border-gray-400 text-lg font-bold">
                  Send Message
                </h1>

                <RichTextEditor
                  initialValue={message}
                  onChange={(content: string) => setMessage(content)}
                  styling="w-[94%] h-[250px] text-black bg-gray-300 rounded-lg mb-[4%]"
                />


              {
                  authResponse.role === "Admin" ?
                  (                 
                    <div className="flex items-center mb-4">
                      <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4"
                      onChange={(e) => setAdminOnly(e.target.checked)}/>
                      <div className="ms-2 text-sm font-medium text-gray-700">Admin Only</div>
                    </div>
                  )
                  :
                  ""
               }       

                <button
                  onClick={sendMessage}
                  className="border-2 border-gray-400 bg-gray-200 text-black rounded h-[40px] w-[100px] mb-10"
                >
                  Send
                </button>
              </div>
            </div>

            <div className="sticky bottom-0 h-[93vh] w-[400px] bg-gray-100 shadow-lg rounded-lg p-6 flex flex-col items-center"></div>
          </div>

          <div className="fixed right-0 bottom-0 h-[93vh] w-[350px] bg-gray-100 shadow-lg rounded-lg p-6 flex flex-col items-center">
            <div className="w-full max-w-xs bg-white shadow-md rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <h1 className="text-gray-500 text-sm">Status:</h1>
                <p className="text-gray-700 text-sm flex items-center gap-2">
                  {Status[ticket?.status as Status]}
                </p>
              </div>

              <div className="flex justify-between mb-2">
                <h1 className="text-gray-500 text-sm">Priority:</h1>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      ticket?.priority === 0
                        ? "bg-green-400"
                        : ticket?.priority === 1
                        ? "bg-blue-400"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <p className="text-gray-700 text-sm">
                    {Priority[ticket?.priority as Priority]}
                  </p>
                </div>
              </div>

              <div className="flex justify-between mb-2">
                <h1 className="text-gray-500 text-sm">Due by:</h1>
                <p className="text-gray-700 text-sm">
                  {ticket.dueAt
                    ? new Date(ticket.dueAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })
                    : ""}
                </p>
              </div>

              <div className="flex justify-between">
                <h1 className="text-gray-500 text-sm">Agent:</h1>
                <p className="text-gray-700 text-sm">
                  {ticket.assignee?.email ?ticket.assignee?.email : "-Unassigned"}
                </p>
              </div>
            </div>

            <div className="w-full max-w-xs border-b mb-6"></div>

            <div className="flex flex-col items-center w-full">
              <h2 className="text-gray-700 text-lg font-semibold mb-4">
                Properties
              </h2>

              <div className="flex justify-between w-full max-w-xs mb-4">
                <div className="flex flex-col w-[48%]">
                  <label className="text-gray-500 text-xs mb-1">Priority</label>
                  <select
                    className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-brand-500 bg-white text-black"
                    disabled={authResponse.role !== "Admin"}
                    value={Priority[ticketUpdate.priority as Priority]}
                    onChange={(e) => {
                      setTicketUpdate({
                        ...ticket,
                        priority: parseInt(Priority[e.target.value as unknown as Priority]), 
                      });
                    }}>
                    {Object.values(Priority).filter(x => isNaN(Number(x))).map((priority) => (
                            <option key={priority} value={priority}>
                            {priority}
                            </option>
                        ))}
                </select>
                </div>

                <div className="flex flex-col w-[48%]">
                  <label className="text-gray-500 text-xs mb-1">Status</label>
                  <select
                    className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-brand-500 bg-white text-black"
                    disabled={authResponse.role !== "Admin"}
                    value={Status[ticketUpdate.status as Status]}
                    onChange={(e) => {
                      setTicketUpdate({
                        ...ticket,
                        status: parseInt(Status[e.target.value as unknown as Status]), 
                      });
                    }}>
                    {Object.values(Status).filter(x => isNaN(Number(x))).map((stat) => (
                            <option key={stat} value={stat}>
                            {stat}
                            </option>
                        ))}
                </select>
                </div>
              </div>
              <div className="flex flex-col w-[100%] mb-4">
                <label className="text-gray-500 text-xs mb-1">Agent</label>
                <select
                  className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-brand-500 bg-white text-black"
                  disabled={authResponse.role !== "Admin"}
                  value={ticketUpdate.assignee?.id || ''} // Use selectedAgent's ID
                  onChange={(e) =>
                    setTicketUpdate({
                      
                      ...ticketUpdate,
                       assignee: agents ? agents.find(agent => agent.id === e.target.value) as User : undefined,
                    })
                  }
                >
                  <option value="">--Please choose an agent--</option>
                  {agents ? agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.email}
                    </option>
                  )) : ""}
                </select>
              </div>
              <div className="flex flex-col w-[100%] mb-10">
                <label className="text-gray-500 text-xs mb-1">Due Date</label>
                <input className="text-black bg-white border border-gray-300 rounded-lg p-1" type="date"   
                style={{
                  backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"black\" viewBox=\"0 0 24 24\"><path d=\"M12 2L15 5H9l3-3z\"/><path d=\"M4 7h16v2H4z\"/><path d=\"M4 9v12h16V9H4zm14 10H6V11h12v8z\"/></svg>')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  backgroundSize: "1rem",
                }} 
                disabled={authResponse.role !== "Admin"}
                value={ticketUpdate.dueAt ? new Date(ticketUpdate.dueAt!).toISOString().split("T")[0] : ""} 
                onChange={(e) => {
                  const selectedDate = e.target.value; 

                  setTicketUpdate({
                    ...ticketUpdate,
                    dueAt: new Date(selectedDate), 
                  });
                }}/>
              </div>
               {
                  authResponse.role === "Admin" ?
                  (              <button
                    onClick={updateTicket}
                    className="w-full max-w-xs bg-brand-800 text-white rounded-lg p-2 font-semibold hover:bg-brand-600"
                  >
                    Save Changes
                  </button>)
                  :
                  ""
               }   
            </div>
          </div>
        </div>
      </div>

      <Modal
            id="modal"
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className={`absolute w-[40%] h-[100%] bg-gray-200 rounded-lg right-0 shadow-xl transition-transform duration-300 ${
              modalIsOpen ? "right-0" : "right-[500px]"
            }`}
            style={{
              overlay: {
                backgroundColor: "rgba(80, 112, 147, 0.35)",
              },
            }}
          >
            <div className="h-full w-full flex flex-col justify-between border-2 border-gray-400 shadow-lg">
              <div className="flex flex-col p-10 gap-6">
                <h1 className="text-gray-700 text-3xl font-bold">
                  Edit Ticket
                </h1>
                <div className="flex flex-col">
                  <div className="text-gray-600 text-sm pb-1 flex flex-row">
                    Subject<p className="text-brand-600 ml-1">*</p>
                  </div>
                  <input
                    type="text"
                    className="bg-white border-[1px] border-gray-300 rounded p-2 text-black w-[100%] shadow"
                    placeholder=""
                    value={ticketUpdate.title}
                    onChange={(e) =>
                      setTicketUpdate({
                        ...ticketUpdate,
                        title: e.target.value,
                      })
                    }
                  ></input>
                </div>

                <RichTextEditor
                  initialValue={ticket.description}
                  onChange={(content: string) =>
                    setTicketUpdate({ ...ticketUpdate, description: content })
                  }
                  styling="bg-gray-100 text-black w-[100%] h-[500px] shadow"
                />
              </div>

              <div className="w-full flex flex-row gap-4 justify-end p-3 bg-gray-300 border-2 border-gray-400 shadow-lg">
                <button
                  onClick={closeModal}
                  className=" border-2 border-gray-400 bg-gray-200 text-black rounded h-[40px] w-[100px]"
                >
                  Cancel
                </button>
                <button
                  onClick={updateTicket}
                  className="bg-gradient-to-t from-cyan-800 to-brand-900 rounded h-[40px] w-[100px]"
                >
                  Update
                </button>
              </div>
            </div>
          </Modal>
    </main>
  );
}
