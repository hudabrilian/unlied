import Head from "next/head";
import SettingsLayout from "~/components/layouts/settings";
import ProfileForm from "~/components/settings/profile-form";
import { Separator } from "~/components/ui/separator";

export default function ProfileSettingsPage() {
  return (
    <SettingsLayout>
      <Head>
        <title>Settings</title>
      </Head>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account settings
          </p>
        </div>
        <Separator />
        <ProfileForm />
      </div>
    </SettingsLayout>
  );
}
