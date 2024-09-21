import useAuth from "../hooks/useAuth";
import SideNavbar from "../components/SideNavbar";
import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import { Priority, Status } from "../utils/Types";
import { Ticket, User } from "../utils/Interfaces";
import RichTextEditor from "../components/RichTextEditor";


export default function CreateTicketPage() {
    const { isLoading: isAuthLoading, authResponse } = useAuth();

    const [agents, setAgents] = useState<User[]>();
    
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15);
  
    const [ticket, setTicket] = useState<Ticket>({
      title: "",
      description: "",
      status: 2,
      priority: 0,
      createdAt: new Date(),
      dueAt: dueDate,
      assignee: undefined
      });


    
    const createTicket = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const response = await fetch('api/Ticket/CreateTicket', {
          method: "post",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(ticket)
      });

      if (response.ok)
      {
        const res = await response.json();
        window.location.assign(`/Ticket?ticketId=${res}`);
      }
  }
  const getAgents = async () => {
    const response = await fetch(`api/User/GetAllAgents`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const res: User[] = await response.json();
      setAgents(res);

      console.log(res);
    }
  };

    useEffect(() => {
      getAgents();
    }, []);
    if (isAuthLoading) {
        return <a>LOADING</a>;
    }
    if (!authResponse.hasAuth) {
      window.location.assign(`/`);
      return;
    }
    

  return (
    <main className="">
      <div className="flex flex-row bg-gray-300">
        <SideNavbar authResponse={authResponse} />
        <div className="w-[100%] flex flex-col">
          <Navbar authResponse={authResponse} page="Create a Ticket" />
          <div className="rounded-xl p-5 w-[70%] m-auto">

            <form
              method="post"
              className="flex flex-col gap-6 items-center w-full"
              onSubmit={createTicket}
            >
              <div className="flex flex-col">
                <div className="text-gray-600 text-sm pb-1 flex flex-row">Subject<p className="text-brand-600 ml-1">*</p></div>
                <input
                  type="text"
                  className="bg-white border-[1px] border-gray-300 rounded p-2 text-black w-[550px] shadow"
                  placeholder=""
                  value={ticket.title}
                  onChange={(e) =>
                    setTicket({
                      ...ticket,
                      title: e.target.value,
                    })
                  }></input>
                
              </div>

              <div className="flex flex-col">
                <p className="text-gray-600 text-sm pb-1 flex flex-row">Description<p className="text-brand-600 ml-1">*</p></p>
                <RichTextEditor
                  initialValue={ticket.description}
                  onChange={(content: string) =>
                    setTicket({ ...ticket, description: content })
                  }               
                  styling="w-[550px] h-[200px] shadow-xl mb-[6%] text-black"
                />
              </div>

              {authResponse.role == "Admin" ? (
                <div>
                    <div className="flex flex-col mb-3">
                        <p className="text-gray-600 text-sm pb-1">Agent</p>
                <select
                  className="bg-white border-[1px] border-gray-300 rounded p-4 text-black w-[550px] shadow"
                  disabled={authResponse.role !== "Admin"}
                  value={ticket.assignee?.id || ''} // Use selectedAgent's ID
                  onChange={(e) =>
                    setTicket({
                      
                      ...ticket,
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

                    <div className="flex flex-col">
                        <p className="text-gray-600 text-sm pb-1">Status</p>
                        <select
                            id=""
                            className="bg-white border-[1px] border-gray-300 rounded p-4 text-black w-[550px] shadow mb-3"
                            value={Status[ticket.status as Status]}
                            onChange={(e) => {
                              setTicket({
                                ...ticket,
                                status: parseInt(Status[e.target.value as unknown as Status]), 
                              });
                            }}>
                            {Object.values(Status).filter(x => isNaN(Number(x))).map((stats) => (
                                    <option key={stats} value={stats}>
                                    {stats}
                                    </option>
                                ))}
                        </select>
                        <p className="text-gray-600 text-sm pb-1">Due Date</p>
                          <input className="text-black bg-white border border-gray-300 rounded shadow p-4" type="date"   
                          style={{
                            backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"black\" viewBox=\"0 0 24 24\"><path d=\"M12 2L15 5H9l3-3z\"/><path d=\"M4 7h16v2H4z\"/><path d=\"M4 9v12h16V9H4zm14 10H6V11h12v8z\"/></svg>')",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 0.5rem center",
                            backgroundSize: "1rem",
                          }} 
                          disabled={authResponse.role !== "Admin"}
                          value={ticket.dueAt ? new Date(ticket.dueAt!).toISOString().split("T")[0] : ""} 
                          onChange={(e) => {
                            const selectedDate = e.target.value; 
                            
                            setTicket({
                              ...ticket,
                              dueAt: new Date(selectedDate), 
                            });
                          }}/>
                    </div>
                    
                </div>
                
              ) : (
                <div></div>
              )}

              <div className="flex flex-col gap-1">
                <p className="text-gray-600 text-sm pb-1">Priority</p>
                <select
                  id=""
                  className="bg-white border-[1px] border-gray-300 rounded p-4 text-black w-[550px] shadow"
                  value={Priority[ticket.priority as Priority]}
                  onChange={(e) => {
                    setTicket({
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

              <button
                type="submit"
                className="bg-gradient-to-t from-cyan-800 to-brand-900 rounded p-4 w-[550px]">
                Create Ticket
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
