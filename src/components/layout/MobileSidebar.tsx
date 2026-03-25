"use client";

import { useState } from "react";
import { Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function MobileSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden rounded-full" />}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}
