import { Loader } from "lucide-react";

interface SpinnerProps {
  isLoading: boolean;
}

export const Spinner = ({ isLoading }: SpinnerProps) => {
  return (
    <div className={`flex justify-center items-center h-[50vh]  ${isLoading ? 'block' : 'hidden'}`}>
      <Loader className="animate-spin" height={52} width={52} />
    </div>
  )
};
