import envConfig from "@/config"
import { cookies } from "next/headers"
import Profile from "./profile";
export default async function MePage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;
    console.log('sessionToken', sessionToken)
    const result = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cookies().get('sessionToken')?.value}`
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
    console.log('result', result)
    return <div>
        <h1>Profile</h1>
        <div>{result.payload.data?.name}</div>
        <Profile />
    </div>
}