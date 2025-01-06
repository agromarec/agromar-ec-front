import ReactFullpage from '@fullpage/react-fullpage';
import { Button } from "@/components/ui/button";
import { CircleChevronDown } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

export const HomePage = () => {
  const navigate = useNavigate();


  useEffect(() => {
    document.querySelector('.fp-watermark')?.remove();
  }, []);

  return (
    <>
      <ReactFullpage
        scrollOverflow
        credits={{ enabled: false }}
        scrollBar
        sectionsColor={['rgb(15, 26, 44, 0.75)', 'rgb(15, 26, 44, 0.75)', 'rgb(15, 26, 44, 0.75)', 'rgb(15, 26, 44, 0.75)']}
        render={({ fullpageApi }) => {
          return (
            <div className="home-background min-h-full min-w-full">

              {/* FIRST SECTION */}
              <div className="section">
                <div className="flex flex-col justify-center items-center text-white text-center absolute top-0 left-0 right-0 bottom-0 z-10 gap-12 animate-top-fade-in duration-1000">
                  <h2 className="text-6xl font-bold">La mejor opción de productos Agrícolas y Acuícolas</h2>
                  <p className="text-2xl">Productos 100% Ecuatorianos</p>

                  <div
                    className='flex flex-col items-center justify-center gap-4 w-full animate-pulse hover:cursor-pointer'
                    onClick={() => fullpageApi.moveSectionDown()}
                  >
                    <CircleChevronDown className='h-20 w-20' />
                    <p>Desliza para ver más</p>
                  </div>
                </div>
              </div>

              {/* SECOND SECTION */}
              <div className="section">
                <Section
                  title='Personas Naturales'
                  data={[
                    {
                      text: 'Busco productos Agrícolas y Acuícolas de empresas o negocios',
                      onClick: () => navigate('/usuarios/empresa')
                    },
                    {
                      text: 'Busco a personas como yo que me puedan ofrecer productos Agrícolas y Acuícolas',
                      onClick: () => navigate('/usuarios/cliente')
                    }
                  ]}
                  onClick={() => fullpageApi.moveSectionDown()}
                />
              </div>

              {/* THIRD SECTION */}
              <div className="section">
                <Section
                  title='Empresas y Negocios'
                  data={[
                    {
                      text: 'Busco productos Agrícolas y Acuícolas de otras empresas o negocios',
                      onClick: () => navigate('/usuarios/empresa')
                    },
                    {
                      text: 'Necito realizar comercio electrónico con el gobierno',
                      onClick: () => navigate('/usuarios/gobierno')
                    }
                  ]}
                  onClick={() => fullpageApi.moveSectionDown()}
                />
              </div>

              <div className="section">
                <Section
                  title='Gobiernos'
                  data={[
                    {
                      text: 'Busco productos Agrícolas y Acuícolas de otros Gobierno',
                      onClick: () => navigate('/usuarios/gobierno')
                    },
                    {
                      text: 'Busco realizar comercios electrónicos con empresas y negocios',
                      onClick: () => navigate('/usuarios/empresa')
                    }
                  ]}
                />
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
    <span className="px-4 text-gray-100 text-6xl">{props.text}</span>
    <div className="flex-grow border-t border-gray-300"></div>
  </div>
);


const Section = (props: { title: string, data: { text: string; onClick: () => void }[], onClick?: () => void }) => {
  const status = useAuthStore(state => state.status);
  const onOpenAuthModal = useAuthStore(state => state.onOpen);

  return (
    <div className="flex flex-col justify-center items-center text-white text-center absolute top-0 left-0 right-0 bottom-0 z-10 gap-12 animate-top-fade-in duration-1000">
      <Divider text={props.title} />
      <div className="grid grid-cols-2 gap-12 px-12 -mt-4">
        {
          props.data.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              size={'lg'}
              className="bg-transparent text-2xl text-center font-normal py-10 px-4 text-wrap hover:font-bold hover:transition-all duration-300"
              onClick={(() => {
                if(status !== 'authenticated') onOpenAuthModal();
                item.onClick();
              })}
            >
              {item.text}
            </Button>
          ))
        }
      </div>

      {
        props.onClick && (
          <div
            className='flex flex-col items-center justify-center gap-4 w-full animate-pulse hover:cursor-pointer'
            onClick={props.onClick}
          >
            <CircleChevronDown className='h-20 w-20' />
            <p>Desliza para ver más</p>
          </div>

        )
      }
    </div>
  )
}