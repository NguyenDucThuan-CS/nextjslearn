'use client'
import { useRouter } from "next/navigation";

export default function ButtonNavigate() {
    const router = useRouter();
    const handleNavigate = () => {
        router.push('/login');
    }
    return <button onClick={handleNavigate}>Navigate</button>;
}


