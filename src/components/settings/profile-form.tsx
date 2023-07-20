/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters",
    })
    .max(30, {
      message: "Name must not be more than 30 characters",
    }),
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters",
    })
    .max(30, {
      message: "Username must not be more than 30 characters",
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { data: profileData, isLoading } = api.profile.getProfile.useQuery();
  const utils = api.useContext();
  const updateProfile = api.profile.update.useMutation({
    onSuccess: async () => {
      toast({
        title: "Profile updated",
      });
      await utils.profile.invalidate();
    },
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        form.setError("username", {
          message: err.message,
        });
      }
      toast({
        title: "Failed to update",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      username: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!profileData) return;
    if (profileData.name) form.setValue("name", profileData.name);
    if (profileData.username) form.setValue("username", profileData.username);
  }, [form, profileData]);

  function onSubmit(data: ProfileFormValues) {
    updateProfile.mutate(data);
  }

  return !isLoading ? (
    <div className="space-y-8">
      {profileData && profileData.image && profileData.name && (
        <Avatar className="h-32 w-32">
          <AvatarImage src={profileData.image} alt={profileData.name} />
        </Avatar>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public username. It is used for your links to
                  other people who make confessions or things for you
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!form.formState.isDirty || form.formState.isLoading}
          >
            Update profile
          </Button>
        </form>
      </Form>
    </div>
  ) : (
    <p>Loading ...</p>
  );
}
