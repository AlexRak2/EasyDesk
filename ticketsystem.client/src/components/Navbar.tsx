import { AuthResponse } from "../hooks/useAuth";


export default function Navbar(props: {authResponse: AuthResponse, page: string}) {

    const logout = async () => {

        const response = await fetch("api/logout", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            window.location.assign("/");
        }
    }

    
    return (

        <div className="sticky top-0 flex items-center justify-between h-[75px] w-[100%] flex-row bg-brand-950 z-40">
            <h1 className="text-white p-3 font-semibold tracking-wider ">{props.page}</h1>
            <div className="flex flex-row mr-5 items-center gap-3">
                <h1 className="text-white  p-3 ">{props.authResponse.email} | {props.authResponse.role}</h1>
                <button type="submit" onClick={logout} className="bg-brand-800 h-[30px] px-3 rounded shadow">logout</button>
            </div>
        </div>
    )
} 