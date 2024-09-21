import { useEffect, useState } from "react";

export interface AuthResponse{
    email: string,
    hasAuth: boolean,
    role: string
}
export default function useAuth() {

    const [isLoading, setIsloading] = useState(true);

    const [authResponse, setAuthResponse] = useState<AuthResponse>({
        email: "",
        hasAuth: false,
        role: ""
    })

    useEffect(() => {
        fetch("api/pingauth", {
            method: "POST"
        })
            .then(resp => {
                if (resp.ok) {
                    resp.json().then(result => {
                        setAuthResponse(result);
                        setIsloading(false);
                    })
                }
            })
    }, [])

    return { authResponse, isLoading };
}