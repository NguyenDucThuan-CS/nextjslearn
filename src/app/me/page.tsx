import accountApiRequest from "@/apiRequests/account";
import { cookies } from "next/headers"
import Profile from "./profile";

export default async function MePage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value || '';
    const result = await accountApiRequest.me(sessionToken as string);
    return <div>
        <h1>Profile</h1>
        {<div>{result.payload.data?.name}</div>}
        <Profile />
    </div>
}   