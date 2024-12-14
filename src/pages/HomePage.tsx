import ReactFullpage from '@fullpage/react-fullpage';
import { Button } from "@/components/ui/button";

export const HomePage = () => {
  return (
    <>
      {/* <div className="bg-[#0f1a2c] relative max-h-[calc(100dvh-3rem)] h-[calc(100dvh-3rem)]"> */}

      <ReactFullpage
        scrollOverflow
        credits={{}}
        scrollBar
        sectionsColor={['rgb(15, 26, 44, 0.75)', 'rgb(15, 26, 44, 0.75)', 'rgb(15, 26, 44, 0.75)', 'rgb(15, 26, 44, 0.75)']}
        render={({ state, fullpageApi }) => {
          return (
            <div className="home-background min-h-full min-w-full">
              <div className="section">
                <div className="flex flex-col justify-center items-center text-white text-center absolute top-0 left-0 right-0 bottom-0 z-10 gap-12 animate-top-fade-in duration-1000">
                  <h2 className="text-6xl font-bold">La mejor opción de productos Agrícolas y Acuícolas</h2>
                  <p className="text-2xl">Productos 100% Ecuatorianos</p>
                </div>
              </div>

              <div className="section">
                <div className="flex flex-col justify-center items-center text-white text-center absolute top-0 left-0 right-0 bottom-0 z-10 gap-12 animate-top-fade-in duration-1000">
                  <Divider text="Personas Naturales" />
                  <div className="grid grid-cols-2 gap-12 px-12">
                    <Button variant="outline" className="bg-transparent text-xl font-normal py-10 px-4 text-wrap text-start" size={'lg'}>
                      Soy una empresa que busca productos Agrícolas y Acuícolas de otras empresas o clientes
                    </Button>

                    <Button variant="outline" className="bg-transparent text-xl font-normal py-10 px-4 text-wrap text-start" size={'lg'}>
                      Ver Productos
                    </Button>

                    <Button variant="outline" className="bg-transparent text-xl font-normal py-10 px-4 text-wrap text-start" size={'lg'}>
                      Ver Productos
                    </Button>

                    <Button variant="outline" className="bg-transparent text-xl font-normal py-10 px-4 text-wrap text-start" size={'lg'}>
                      Ver Productos
                    </Button>
                  </div>
                </div>
              </div>

              <div className="section">
                <div className="flex flex-col justify-center items-center text-white text-center absolute top-0 left-0 right-0 bottom-0 z-10 gap-12 animate-top-fade-in duration-1000">
                  <Divider text="Soluciones para empresas" />
                  <div className="grid grid-cols-2 gap-12 px-12 -mt-4">
                    <Button variant="outline" className="bg-transparent text-xl font-normal py-10 px-4 text-wrap text-start" size={'lg'}>
                      Soy una empresa que busca productos Agrícolas y Acuícolas de otras empresas o clientes
                    </Button>

                    <Button variant="outline" className="bg-transparent text-xl font-normal py-10 px-4 text-wrap text-start" size={'lg'}>
                      Ver Productos
                    </Button>

                    <Button variant="outline" className="bg-transparent text-xl font-normal py-10 px-4 text-wrap text-start" size={'lg'}>
                      Ver Productos
                    </Button>

                    <Button variant="outline" className="bg-transparent text-xl font-normal py-10 px-4 text-wrap text-start" size={'lg'}>
                      Ver Productos
                    </Button>
                  </div>
                </div>
              </div>

              <div className="section">
                <h1>Sección 4</h1>
              </div>
            </div>
          );
        }}
      />
    </>
  )
};


const Divider = (props: { text: string }) => (
  <div className="flex items-center my-4 w-[95%] gap-4">
    <div className="flex-grow border-t border-gray-300"></div>
    <span className="px-4 text-gray-400 text-3xl">{props.text}</span>
    <div className="flex-grow border-t border-gray-300"></div>
  </div>
)