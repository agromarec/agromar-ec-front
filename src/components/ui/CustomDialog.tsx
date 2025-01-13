import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";

interface Props {
  isOpen: boolean;
  title?: JSX.Element | string;
  content?: JSX.Element | string | (() => JSX.Element);
  onOpenChange: (isOpen: boolean) => void;
  className?: string;
}

export const CustomDialog = ({ isOpen, onOpenChange, title, content, className }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {
              typeof content === 'function' ? content() : content
            }
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
};




