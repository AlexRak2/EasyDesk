import { useState } from "react";
import { IsEmailValid } from "../utils/EmailUtil"

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const url = "api/login?useCookies=true";

    const handleEmailChange = (value: string) => {
        setEmail(value);
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        const data = {
            email: email,
            password: password
        }

        e.preventDefault();
        console.log("Attempt log in");

        if (!IsEmailValid(email))
        {
            console.log("bad email");
        }

        const response = await fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (response.ok)
        {
            window.location.assign("/home");
        }
    }

    return (
        <main className="flex h-[100vh] w-[100vw] justify-center bg-[#e8ecec]">

            <div className="flex flex-col items-center content-start gap-8 mt-[100px]">
                <h1 className="text-2xl text-cyan-800 drop-shadow-lg">Easy Desk</h1>

                <h1 className="text-xl text-cyan-900 drop-shadow-lg font-bold">Sign in to your Easy Desk account</h1>

                <div className="bg-white rounded-xl shadow-lg p-5">
                    <form method="post" onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <p className="text-gray-600 text-sm pb-1">Email</p>
                            <input type="email" className="bg-white border-[1px] border-gray-300 rounded p-2 text-black w-[350px]" placeholder=""
                                onChange={(e) => handleEmailChange(e.target.value)}></input>
                        </div>

                        <div className="flex flex-col">
                            <p className="text-gray-600 text-sm pb-1">Password</p>
                            <input type="text" className="bg-white border-[1px] border-gray-300 rounded p-2 text-black w-[350px]" placeholder=""
                                onChange={(e) => handlePasswordChange(e.target.value)}></input>
                        </div>

                        <button type="submit" className="bg-gradient-to-t from-cyan-800 to-brand-900 rounded p-1">Submit</button>

                        <h1 className="text-sm text-cyan-950 drop-shadow-lg mx-auto">New user? <a href="/Register" >Create an account</a></h1>


                    </form>
                </div>

                <p className="text-[10px] text-cyan-900 drop-shadow-lg">
                    By clicking 'Continue', I accept the Easy Desk Terms of Service and Privacy Notice
                </p>

            </div>


        </main>
    )
}