import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';


function App() {
  const checkAuth =  useAuthStore(state => state.checkAuth); 
  
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <RouterProvider router={router} />

      <Toaster
        position="top-right"
        richColors
        closeButton
      />
    </>
  )
}

export default App
