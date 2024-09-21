import useAuth from "../hooks/useAuth";
import SideNavbar from "../components/SideNavbar";
import Navbar from "../components/Navbar";
import CardWidget from "../components/CardWidget";
import DonutChart from "../components/DonutChart";
import { Priority, Status } from "../utils/Types";
import LineGraph from "../components/LineGraph";
import { useEffect, useState } from "react";
import { Ticket } from "../utils/Interfaces";



export default function HomePage() {

    const { isLoading: isAuthLoading, authResponse } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]); 

    const [ticketsDueToday, setTicketsDueToday] = useState<number>(); 
    const [ticketsOverdue, setTicketsOverdue] = useState<number>(); 
    const [ticketsClosed, setTicketsClosed] = useState<number>(); 
    const [ticketsUnassigned, setTicketsUnassigned] = useState<number>(); 
    const [myTickets, setMyTickets] = useState<number>(); 

    const [prioPie, setPrioPie] = useState<number[]>([]);
    const [statusPie, setStatusPie] = useState<number[]>([]);
    const [monthChart, setMonthChart] = useState<number[]>([]);



      
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
        
          setTickets(res);
          console.log(res);
          
          countTicketsDueToday(res);
          countTicketsOverdue(res);
          countClosedTickets(res);
          countUnassignedTickets(res);
          countMyTickets(res);
          countStatusChartData(res);
          countPrioChartData(res);
          getClosedTicketsPerMonth(res);
        }
      };

      const countTicketsDueToday = (tickets: Ticket[]) => {

        const today = new Date();
        const dueTodayTickets = tickets.filter((ticket) => {
            const dueAt = ticket.dueAt ? new Date(ticket.dueAt) : null; 
            return dueAt && 
                dueAt.getMonth() === today.getMonth() && 
                dueAt.getDate() === today.getDate();
        });

        setTicketsDueToday(dueTodayTickets.length);

      }

      const countTicketsOverdue = (tickets: Ticket[]) => {

        const today = new Date();
        const overdueTickets = tickets.filter((ticket) => {
            const dueAt = ticket.dueAt ? new Date(ticket.dueAt) : null; 
            return dueAt && 
                dueAt.getMonth() >= today.getMonth() && 
                dueAt.getDate() > today.getDate();
        });
    
        setTicketsOverdue(overdueTickets.length);

      }

      
      const countClosedTickets = (tickets: Ticket[]) => {

            const closedTickets = tickets.filter((ticket) => ticket.status === Status.Closed);

            setTicketsClosed(closedTickets.length);
        }

        const countUnassignedTickets = (tickets: Ticket[]) => {

            const unassignedTickets = tickets.filter((ticket) => ticket.assignee === null);

            setTicketsUnassigned(unassignedTickets.length);
        }

        const countMyTickets = (tickets: Ticket[]) => {
            
            const myTickets = tickets.filter((ticket) => ticket.owner?.email == authResponse.email);

            setMyTickets(myTickets.length);
        }

        const countPrioChartData = (tickets: Ticket[]) => {

            let lowCount = 0;
            let medCount = 0;
            let highCount = 0;
        
            tickets.forEach((ticket) => {
                if (ticket.priority === Priority.Low) {
                    lowCount++;
                } else if (ticket.priority === Priority.Medium) {
                    medCount++;
                } else if (ticket.priority === Priority.High) {
                    highCount++;
                }
            });

            const values = [lowCount, medCount, highCount];
            setPrioPie(values);
        }

        const countStatusChartData = (tickets: Ticket[]) => {

            let deployedCount = 0;
            let pendingCount = 0;
            let queueCount = 0;
            let inProgressCount = 0;
            let uatCount = 0;
        
            tickets.forEach((ticket) => {
                if (ticket.status === Status.Deployed) {
                    deployedCount++;
                } else if (ticket.status === Status.PendingRelease) {
                    pendingCount++;
                } else if (ticket.status === Status.InQueue) {
                    queueCount++;
                } else if (ticket.status === Status.InProgress) {
                    inProgressCount++;
                }else if (ticket.status === Status.UAT) {
                    uatCount++;
                }
            });

            const values = [deployedCount, pendingCount, queueCount, inProgressCount, uatCount];
            setStatusPie(values);
        }
    
        const getClosedTicketsPerMonth = (tickets: Ticket[]): number[] => {
            const closedTickets = tickets.filter(ticket => ticket.status === Status.Closed);
            
            const monthlyCounts = new Array(12).fill(0);
          
            closedTickets.forEach(ticket => {

                const date = ticket.createdAt ? new Date(ticket.createdAt) : null; 
              const monthIndex: number = date?.getMonth() as number; 
              monthlyCounts[monthIndex] += 1; 
            });
          
            setMonthChart(monthlyCounts);

            return (monthlyCounts);
          };
      
    const priorityLabels = Object.values(Priority).filter(x => isNaN(Number(x))) as unknown as string[];
    const statusLabels = ["Deployed" , "Pending Release", "In Queue", "In Progress", "UAT"];

    useEffect(() => {
        getTicket();
      });


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
    return (
      <main className="">
        <div className="flex flex-row bg-gray-300">
          <SideNavbar authResponse={authResponse} />
          <div className="w-[100%]">
            <Navbar authResponse={authResponse} page="Dashboard" />
            <div className="flex flex-col w-full p-5 gap-10 items-center h-[80%] pt-[5%]">
              <div className="flex flex-row gap-5 justify-center">
                <CardWidget message="Total Tickets" value={tickets.length} />
                <CardWidget message="Tickets Due Today" value={ticketsDueToday as number} />
                <CardWidget message="Passed Due Tickets" value={ticketsOverdue as number} />
                <CardWidget message="Closed Tickets" value={ticketsClosed as number} />
                <CardWidget message="Unassigned Tickets" value={ticketsUnassigned as number} />
                <CardWidget message="My Tickets"value={myTickets as number} />
              </div>
              
              <div className="flex flex-row gap-5">
                <div className="w-[400px] bg-gray-300 shadow rounded-lg p-3 border border-gray-400">
                    <h1 className="text-gray-700 font-bold">Total tickets by status</h1> 
                    <DonutChart labels={priorityLabels} series={prioPie} />
                </div>
                <div className="w-[760px] bg-gray-300 shadow rounded-lg p-3 border border-gray-400">
                    <h1 className="text-gray-700 font-bold">Total tickets this year</h1> 
                    <LineGraph data={monthChart} />
                </div>
                <div className="w-[400px] bg-gray-300 shadow rounded-lg p-3 border border-gray-400">
                    <h1 className="text-gray-700 font-bold">Total tickets by priority</h1> 
                    <DonutChart labels={statusLabels} series={statusPie} />
                </div>

              </div>

            </div>
          </div>
        </div>
      </main>
    );
}
