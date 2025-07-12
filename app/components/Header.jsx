import { Info, LogOut, Moon, Plus, Sun, Video, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
function Header() {
    const { theme, setTheme } = useTheme();
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);
    const userPlaceHolder = session?.user?.name.split(" ").map((name) => {
        name[0]
    }).join("")
    const handleLogout = async () => {
        await signOut({ callbackUrl: "/user-auth" })
    }
    const formatDate = () => {
        const now = new Date();
        return now.toLocaleString("en-US", {
            hour: "numeric",
            weekday: "short",
            minute: "numeric",
            hour12: true,
            month: "short",
            day: "numeric"
        });
    };

    return (
        <div className='p-6 flex items-center justify-between bg-white dark:bg-gray-900 border-b dark:border-gray-700'>
            <div className='flex items-center space-x-4 '>
                <Link href={"/"} className='flex items-center space-x-2'>
                    <Video className='w-8 h-8 text-blue-500' />
                    <span className='hidden md:block text-xl font-semibold text-gray-800 dark:text-white'>
                        Google Meet
                    </span>
                </Link>
            </div>
            <div className="flex items-center space-x-4">
                <span className='text-md text-gray-500 dark:text-gray-200 '>
                    {formatDate()}
                </span>
                <Button variant="ghost" size={"icon"} onClick={() => setTheme(theme === "dark" ? "link" : "dark")}>
                    {theme === "dark" ? (
                        <Sun className='w-5 h-5 text-orange-500' />
                    ) : (
                        <Moon className='w-5 h-5 text-blue-500' />
                    )}
                </Button>
                <Button variant={"ghost"} size={"icon"} className="hidden md:block">
                    <Info className='w-5 h-5 ml-2' />
                </Button>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                        <div className='flex flex-col items-center'>
                            <Avatar className="cursor-pointer">
                                {session?.user?.image ? (
                                    <AvatarImage className=" justify-center items-center flex" src={session.user.image} alt={session.user.name} />
                                ) : (
                                    <AvatarFallback className="text-2xl dark:bg-gray-300">
                                        {userPlaceHolder}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 p-4 space-y-4">
    <div className="flex justify-end">
      <Button
        className="rounded-full p-2"
        variant="ghost"
        size="icon"
        onClick={() => setOpen(false)}
      >
        <X className="h-5 w-5" />
      </Button>
    </div>

    <div className="flex flex-col items-center space-y-2">
      <Avatar className="w-20 h-20">
        {session?.user?.image ? (
          <AvatarImage
            className="w-full h-full object-cover rounded-full"
            src={session?.user?.image}
            alt={session?.user?.name}
          />
        ) : (
          <AvatarFallback className="text-2xl dark:bg-gray-300">
            {userPlaceHolder}
          </AvatarFallback>
        )}
      </Avatar>
      <h1 className="text-lg font-semibold text-center">
        Hi, {session?.user?.name}
      </h1>
      <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {session?.user?.email}
      </span>
    </div>

    <div className="flex">
      <Button className="w-1/2 h-12 rounded-l-full" variant="outline">
        <Plus className="mr-1" />
        Add Account
      </Button>
      <Button
        className="w-1/2 h-12 rounded-r-full"
        variant="outline"
        onClick={handleLogout}
      >
        <LogOut className="mr-1" />
        SignOut
      </Button>

    </div>
    <div className="text-center text-sm text-gray-500">
    <Link href={"#"} className='hover:bg-gray-300 p-2 rounded-lg'>
    Privacy Policy
    </Link>
     <Link href={"#"} className='hover:bg-gray-300 p-2 rounded-lg '>
    Terms or Servicess
    </Link>
    </div>
  </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export default Header;
