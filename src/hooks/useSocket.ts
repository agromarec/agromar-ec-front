import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  url: string;
}

export const useSocket = ({ url }: UseSocketOptions) => {
  const socket = useRef<Socket | null>(null); // Referencia al socket
  const [online, setOnline] = useState<boolean>(false); // Estado de conexión

  useEffect(() => {
    // Conectar al servidor al montar
    socket.current = io(url, {
      query: {
        transports: ['websocket'],
        token: localStorage.getItem('token'),
      },
      withCredentials: true,
    });

    // Actualizar el estado de conexión
    socket.current.on('connect', () => {
      setOnline(true);
    });

    socket.current.on('disconnect', () => {
      setOnline(false);
    });

    // Limpiar conexión al desmontar
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [url]);

  // Función para enviar eventos
  const emit = (event: string, data: any) => {
    socket.current?.emit(event, data);
  };

  // Función para escuchar eventos
  const on = (event: string, callback: (data: any) => void) => {
    socket.current?.on(event, callback);
  };

  // Función para dejar de escuchar eventos
  const off = (event: string) => {
    socket.current?.off(event);
  };

  return { socket: socket.current, emit, on, off, online };
};
