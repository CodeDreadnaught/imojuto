import { listUsersAndRoles } from "@/actions/users";
import { UserManagementClient } from "@/app/(admin)/admin/users/UserManagementClient";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminUsersPage() {
  const { users, roles } = await listUsersAndRoles();

  return (
    <div>
      <PageHeader title="User Management" description="Create officer and administrator accounts, and deactivate users without deleting history." />
      <UserManagementClient users={users} roles={roles} />
    </div>
  );
}
