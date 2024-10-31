'use client'

import { useEffect } from "react"
import envConfig from "@/config"
import { clientSessionToken } from "@/lib/http"

export default function Profile() {
    const sessionToken = clientSessionToken.value;
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionToken}`
            }
        }).then(async (res) => {
            const payload = await res.json();
            const data = {
              status: res.status,
              payload: payload
            }
            
            if(!res.ok) {
              throw data;
            }
                return data;
            });
            console.log(result);
        }
        fetchData();
    }, [sessionToken])
    return <div>Profile</div>
}