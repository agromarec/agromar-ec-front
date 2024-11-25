import { useSocket } from "@/hooks/useSocket";


export const ChatPage = () => {
  const { online } = useSocket({
    url: 'http://localhost:3001/socket.io/socket.io.js',
    // options: {
    //   transports: ['websocket'],
    // },
  });

  console.log({ online });


  return (
    <div>
      <h1>ChatPage</h1>
    </div>
  )
};
