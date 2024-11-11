import useUiStore from "@/store/uiStore"
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogCancel, AlertDialogDescription, AlertDialogTitle } from "./alert-dialog"
import { LoaderBtn } from "./LoaderBtn";

export const AppAlertDialog = () => {
  const { title, description, open, btnAcceptText, btnCancelText, onAccept, isLoading } = useUiStore(state => state.dialogOptions);
  const onClose = useUiStore(state => state.onCloseDialog);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>{btnCancelText}</AlertDialogCancel>
          <LoaderBtn isLoading={isLoading} onClick={onAccept}>{btnAcceptText}</LoaderBtn>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}