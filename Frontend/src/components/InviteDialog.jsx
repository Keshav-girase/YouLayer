import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

const InviteFormSchema = z.object({
  name: z.string().min(2, { message: 'Please enter the full name of the invitee.' }),
  email: z.string().email({ message: 'Enter a valid email address.' }),
  role: z.string().min(2, {
    message: "Specify a role like 'Editor', 'Manager', or 'Viewer'.",
  }),
  inviter: z.string().min(2, { message: "Let them know who's inviting them." }),
});

export default function InviteDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(InviteFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      inviter: '',
    },
  });

  const onSubmit = async data => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post('/invite/manager', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('token') || ''}`,
        },
      });
      if (response.status === 200) {
        toast.success('Invitation sent successfully!');
        setDialogOpen(false);
        form.reset();
      }
    } catch (err) {
      setError(
        'Failed to send invitation. Please try again. ' + (err.response?.data?.message || '')
      );
      toast.error('Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset error when dialog opens
  const handleDialogOpen = open => {
    setDialogOpen(open);
    if (open) setError(null);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:bg-accent">
          <UserPlus className="h-4 w-4" />
          Invite
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Team Invitation</DialogTitle>
          <DialogDescription>
            Invite your team members to join and collaborate on your channel.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <Spinner size="sm" className="bg-foreground" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invitee&lsquo;s Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sarah Johnson" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address of Invitee</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. sarah@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Editor, Manager, Viewer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inviter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-sm text-destructive mt-1.5 mb-1.5">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                Send Invitation
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
