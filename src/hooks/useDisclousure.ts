import { useState } from "react";

export const useDisclousure = () => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleDisclosure = () => {
    setIsOpen(!isOpen);
  };

  return {
    isOpen,
    toggleDisclosure,
  };

}
