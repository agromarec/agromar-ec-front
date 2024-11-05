import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <>
      <div className="bg-[#0f1a2c] relative max-h-[calc(100dvh-3rem)] h-[calc(100dvh-3rem)]">
        <div className="home-background min-h-full min-w-full" />

        <div className="flex flex-col justify-center items-center text-white text-center absolute top-0 left-0 right-0 bottom-0 z-10 gap-12 animate-top-fade-in duration-1000">
          <h2 className="text-6xl font-bold">La mejor opción de productos Agrícolas y Acuícolas</h2>
          <p className="text-2xl">Productos 100% Ecuatorianos</p>

          <Link to={'/productos'}>
            <Button variant="outline" className="bg-transparent text-xl font-normal" size={'lg'}>
              Ver Productos
            </Button>
          </Link>
        </div>
      </div>

      <div className="h-96">
        fjasfjsal
      </div>
    </>
  )
};
