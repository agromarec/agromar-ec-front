import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  url: string;
  options?: any; // Opciones adicionales para el cliente de socket.io
}

export const useSocket = ({ url, options }: UseSocketOptions) => {
  const socket = useRef<Socket | null>(null); // Referencia al socket
  const [online, setOnline] = useState<boolean>(false); // Estado de conexión

  useEffect(() => {
    // Conectar al servidor al montar
    socket.current = io(url, options);

    // Actualizar el estado de conexión
    socket.current.on('connect', () => {
      setOnline(true);
      console.log('Conectado al servidor');
    });

    socket.current.on('disconnect', () => {
      setOnline(false);
      console.log('Desconectado del servidor');
    });

    // Limpiar conexión al desmontar
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [url, options]);

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
