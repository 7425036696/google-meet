'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Copy, Link2, LinkIcon, Plus, Video } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

function MeetingActions() {
    const router = useRouter()
    const [generatedMeetingUrl, setGeneratedMeetingUrl] = useState("")

    const { data: session } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [meetingLink, setMeetingLink] = useState("")
    const [baseUrl, setBaseUrl] = useState("")
    const handleCreateMeetingForLater = () => {
        const roomId = crypto.randomUUID()
        console.log("this is room id", roomId)
        const url = `${baseUrl}/video-meeting/${roomId}`
        setGeneratedMeetingUrl(url)
        setIsDialogOpen(true)
        toast.success("meeting created successfully")
    }
    const copyToClipBoard = () => {
        navigator.clipboard.writeText(generatedMeetingUrl)
        toast.info("link copied to clipboard")
    }
    useEffect(() => {
        setBaseUrl(window.location.origin)
    }, [])
    const handleJoinMeeting =() =>{
if(meetingLink){
    setIsLoading(true)
    const formatedLink = meetingLink.includes("http")
    ?meetingLink :`${baseUrl}/video-meeting/${meetingLink}`
    router.push(formatedLink)
    toast.info('Joining meeting ...')

}
else{
    toast.error("please enter a valid link or code")
}
 
}
const handleStartMeeting  = () => {
    setIsLoading(true)
    const roomId  = crypto.randomUUID()
    const meetingUrl = `${baseUrl}/video-meeting/${roomId}`
    router.push(meetingUrl)
    toast.info("joining meeting ...")
}
    return (
        <>
            <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="w-full sm:w-auto" size={"lg"}>
                            <Video className='w-5 h-5 mr-2' />
                            New meeting
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleCreateMeetingForLater()}>
                            <Link2 className='w-4 h-4 mr-2' />
                            Create a meeting for later
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStartMeeting()}>
                            <Plus className='w-4 h-4 mr-2' />
                            Start an instantly meeting
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex w-full sm:w-auto items-center border rounded-md overflow-hidden shadow-sm">
                    <div className="relative w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <LinkIcon className="w-4 h-4" />
                        </span>
                        <Input
                            placeholder="Enter a code or link"
                            className="pl-10 pr-4 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="secondary"
                        className="rounded-none rounded-r-md h-full"
                        onClick={() => handleJoinMeeting()}
                    >
                        Join
                    </Button>
                </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-sm rounded-lg p-4">
                    <DialogHeader>
                        <DialogTitle className="font-normal text-3xl">
                            Here's your joining information
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Send this to people you want to meet with. Be sure to save it so you can use it later,too.
                        </p>
                        <div className="flex items-center justify-between bg-gray-10 dark:bg-gray-800 p-4 rounded-lg ">
                            <span className='text-gray-700 dark:text-gray-200 break-all'>
                                {generatedMeetingUrl.slice(0, 30)}...
                            </span>
                            <Button variant="ghost" className="hover:bg-gray-200" onClick={() => copyToClipBoard()}>
                                <Copy className='w-5 h-5 text-orange-500' />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )

}

export default MeetingActions
