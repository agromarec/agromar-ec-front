import useChatStore from "@/store/chatStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from 'react';


export const ChatForm = ({ onSubmit }: { onSubmit: (to: number, msg: string) => void }) => {
  const chatingWith = useChatStore(state => state.chatingWith);
  const [message, setMessage] = useState('');

  return (
    <div className="px-4 py-2 border-b-2 bg-gray-200 flex-1">
      <form
        className="space-y-8 mt-4"
        onSubmit={e => {
          e.preventDefault();
          if (!chatingWith) return;
          onSubmit(Number(chatingWith.id), message);
          setMessage('');
        }}
      >
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Escribe aquí tu mensaje"
            disabled={!chatingWith}
            className="h-12 w-full default-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button 
            className="text-xl font-normal" size={'lg'} 
            type="submit"
            disabled={!chatingWith}
          >
            Enviar
          </Button>
        </div>
      </form>
    </div>
  )
};
