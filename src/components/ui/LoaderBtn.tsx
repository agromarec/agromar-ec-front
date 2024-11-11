import { Loader } from "lucide-react";
import { Button } from "./button";

interface LoaderBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
}

export const LoaderBtn = ({ isLoading = false, ...props }: LoaderBtnProps) => {
  return (
    <Button disabled={isLoading} {...props}>
      <Loader className={`h-4 w-4 animate-spin ${isLoading ? 'block' : 'hidden'}`} />
      <span className={`${isLoading ? 'hidden' : 'block'}`}>{props.children}</span>
    </Button>
  )
};
