import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import ButtonLogout from "@/components/ui/button-logout";
export default function Header() {
    return <div>
        <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/register">Register</Link></li>
            <li><ButtonLogout /></li>
        </ul>
        <ModeToggle />
       
    </div>;
}
