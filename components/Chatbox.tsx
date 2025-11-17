import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

 const ChatBox =() => {
    return (
        <div className="chatbox"> 
 <InputGroup>
        <InputGroupInput placeholder="Ask anything..." />
        <InputGroupAddon align="inline-end">
          <div className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full">
            {/* <IconCheck className="size-3" /> */}
          </div>
        </InputGroupAddon>
      </InputGroup>
        </div>
    )
}

export default ChatBox;