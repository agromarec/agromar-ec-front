import { Mail, MapPin, Phone } from "lucide-react";
import { Facebook, Google, Instagram, Twitter } from "../svgs";

export const AppFooter = () => {
  return (
    <footer className="min-h-[18rem] bg-primary text-white">
      <div className="flex items-center justify-between px-10 py-6 text-xs">
        <p>Conéctate con nosotros en las redes sociales:</p>

        <div className="flex gap-6 h-3 fill-white">
          <Facebook />
          <Twitter />
          <Google />
          <Instagram />
        </div>
      </div>

      <div className="border-white border-solid border-t-[1px]" />

      <div className="flex items-start justify-between px-10 py-6">
        <div className="flex flex-col gap-4 px-10 py-6 text-start text-xs">
          <p className="font-bold">AGROMAREC</p>
          <p>La mejor opción de productos Agrícolas y Acuícolas.</p>
        </div>

        <div className="flex flex-col gap-4 px-10 py-6 text-start text-xs">
          <p className="font-bold">PRODUCTOS</p>
          <p>Agrícolas</p>
          <p>Acuícolas</p>
        </div>

        <div className="flex flex-col gap-4 px-10 py-6 text-start text-xs">
          <p className="font-bold">INFORMACIÓN</p>
          <p>Términos y Condiciones</p>
          <p>Política de Privacidad</p>
          <p>Preguntas Fracuentes</p>
        </div>

        <div className="flex flex-col gap-4 px-10 py-6 text-start text-xs">
          <p className="font-bold">CONTACTO</p>
          <div className="flex gap-2 items-center">
            <MapPin size={20} />
            <p>Guayaquil, NY 10012, EC</p>
          </div>

          <div className="flex gap-2 items-center">
            <Mail size={20} />
            <p>info@example.com</p>
          </div>

          <div className="flex gap-2 items-center">
            <Phone size={20} />
            <p>+ 01 234 567 88</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center pb-8 text-sm">
        <p>© 2024 Copyright: AgroMarEC</p>
      </div>
    </footer>
  )
};
