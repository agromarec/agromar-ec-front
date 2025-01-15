import { Spinner } from "./Spinner";

export const ScreenLoader = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <>
      {
        isVisible &&
        <div className="fixed top-0 left-0 min-h-dvh min-w-full bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <Spinner isLoading={isVisible} />
        </div>
      }
    </>
  )
};
