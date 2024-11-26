import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";


export const ChatPage = () => {
  const { online, emit, on } = useSocket({
    url: 'http://localhost:3001/',
    // options: {
    //   transports: ['websocket'],
    // },
  });

  useEffect(() => {    
    on('receiveMessage', (data: string) => {
      console.log('Recibido:', data);
    });

    // eslint-disable-next-line
  }, []);

  console.log({ online });


  return (
    <div>
      <h1>ChatPage</h1>

      <Button 
        onClick={() => {
          emit('sendMessage', 'Hello from client');
        }}
      >Send</Button>
    </div>
  )
};
