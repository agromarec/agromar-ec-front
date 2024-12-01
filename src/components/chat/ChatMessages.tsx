import useChatStore from "@/store/chatStore";


export const ChatMessages = () => {
  const chatMessages = useChatStore(state => state.chatMessages);

  return (
    // <div className="flex gap-2 overflow-y-auto min-h-[calc(100dvh-12rem)] max-h-[calc(100dvh-12rem)] bg-blue-400">
    <div className="flex gap-2 overflow-y-auto flex-1 flex-col p-4">
      {
        chatMessages.map(chatMessage => (
          <div className={`
            flex ${chatMessage.isMe ? 'justify-end text-right bg-gray-200 ml-auto triangle-right before:border-t-gray-200' : 'justify-start text-left bg-green-300 triangle-left after:border-t-green-300'}
            rounded-lg p-2 flex-col relative w-fit
          `}>
            <p>{chatMessage.message}</p>
            <p className="text-xs text-gray-500">{chatMessage.isMe ? 'Ahora' : 'Anteriormente'}</p>
          </div>
        ))
      }
    </div>
  )
};
