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
            <SheetTrigger>
                <div className="inline-flex items-center justify-center h-10 w-10 hover:bg-accent hover:text-accent-foreground md:hidden rounded-full cursor-pointer">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                </div>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}
