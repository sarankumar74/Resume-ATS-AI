import { useAuth } from "@/lib/auth";
import { SEO } from "@/components/SEO";

export default function Settings() {
  const { user } = useAuth();
  const username =
    (user?.user_metadata?.username as string) ||
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    (user?.email ? user.email.split("@")[0] : "—");

  return (
    <div className="space-y-6">
      <SEO title="Settings — ResumeIQ" canonical="/settings" />
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account.</p>
      </div>
      <div className="glass rounded-2xl p-6 space-y-3">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Username</div>
          <div className="mt-1 font-medium">{username}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Email</div>
          <div className="mt-1 font-medium">{user?.email ?? "—"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">User ID</div>
          <div className="mt-1 font-mono text-xs text-muted-foreground">{user?.id}</div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">More settings coming soon — notification preferences, password change, subscription.</p>
    </div>
  );
}
