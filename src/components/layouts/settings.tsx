import { SidebarNav } from "../settings/sidebar-nav";
import { Separator } from "../ui/separator";
import Layout from "./layout";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
  },
  {
    title: "Account",
    href: "/settings/account",
  },
];

interface SettingsProps {
  children?: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsProps) {
  return (
    <Layout>
      <div className="space-y-6 pt-4 sm:px-8">
        <div className="px-4">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and things
          </p>
        </div>
        <Separator />
        <div className="flex flex-col space-y-8 px-4 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="sm:-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </Layout>
  );
}
