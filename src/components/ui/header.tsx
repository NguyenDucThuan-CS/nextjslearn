import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function Header() {
    return <div>
        <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/register">Register</Link></li>
        </ul>
        <ModeToggle />
       
    </div>;
}
