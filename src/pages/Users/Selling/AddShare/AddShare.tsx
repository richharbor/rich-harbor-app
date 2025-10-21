import { ScrollArea } from "@/components/ui/scroll-area"
import AddStockForm from "./AddShareForm"

interface AddSharePageProps {
  shareName?: string;
}

export default function AddSharePage({shareName} : AddSharePageProps) {
 


  return (
    <div className="flex flex-1 flex-col w-full">
      <div className="flex items-center justify-between border-b h-[60px] p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-base font-bold">Add Share</h2>
        </div>
      </div>
      <ScrollArea className="flex-1 max-h-[calc(100vh-8.5rem)]"> 
        <AddStockForm shareName = {shareName} />
      </ScrollArea>
    </div>
  )
}

