import { Button } from "../ui/button";
import { AlignJustify, LogOut } from 'lucide-react';
import { HousePlug } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { logoutUser } from "@/store/auth-slice";

function menuItems(){
    return <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
        {
            shoppingViewHeaderMenuItems.map(menuItem=> <Link className="text-sm font-medium"key={menuItem.id} to={menuItem.path}>{menuItem.label}</Link>)
        }
        </nav>
}

function AdminHeader({setOpen}){

    const dispatch = useDispatch();

    function handleLogout() {
        dispatch(logoutUser())
    }
    
    return <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
        <Button onClick={()=>setOpen(true)} className="lg:hidden sm:block" >
          <AlignJustify /> 
          <span className="sr-only">Toggle Menu</span> 
        </Button>
        <div className="flex flex-1 justify-end">
            <Button  
            onClick={handleLogout}
            className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow">
                <LogOut  />
                Logout
            </Button>
        </div>
    </header>
}
 export default AdminHeader;