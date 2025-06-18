/* eslint-disable react/react-in-jsx-scope */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { CheckCircle } from 'lucide-react';

// eslint-disable-next-line react/prop-types
export default function PublishProgressDialog({ open, onOpenChange, progress=0, onDone, error }) {
  const completed = progress >= 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full rounded-md overflow-hidden">
        <DialogHeader>
          <DialogTitle>Publishing Video</DialogTitle>
          <DialogDescription>
            {completed
              ? 'Upload complete! Your video has been published.'
              : 'Please wait while we upload and publish your video.'}
          </DialogDescription>
        </DialogHeader>

        {(!completed && error === null )&& (
          <div className="mt-4 p-8">
            <div className="flex justify-center items-center">
              <Spinner size="lg" className="bg-black dark:bg-white" />
            </div>
          </div>
        )}

        {completed && (
          <div className="flex flex-col justify-center items-center mt-4">
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="text-green-400 w-16 h-16 animate-ping-slow drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              <p className="text-lg font-semibold text-center bg-gradient-to-r from-green-400 via-white to-green-400 bg-clip-text text-transparent animate-pulse">
                Video successfully published!
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col justify-center items-center mt-4">
            <div className="flex flex-col items-center space-y-4">
              {/* <CheckCircle className="text-green-400 w-16 h-16 animate-ping-slow drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" /> */}
              <p className="text-lg font-semibold text-center bg-gradient-to-r from-red-500  to-red-500 bg-clip-text text-transparent animate-pulse">
                { error }
              </p>
            </div>
          </div>
        )}

        {/* Always render DialogClose — just hide the button when not completed */}
        <DialogClose asChild>
          <div>
            <Button
              onClick={onDone}
              variant="outline"
              className={`mt-10 ${!completed ? 'hidden' : ''}`}
            >
              Done
            </Button>
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
