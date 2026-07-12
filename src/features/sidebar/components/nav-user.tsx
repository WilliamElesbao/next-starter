import { getCurrentSession } from "@/actions/get-session.action";
import { NavUserDropdown } from "./nav-user-dropdown";

export async function NavUser() {
  const { user } = await getCurrentSession();
  if (!user) return null;

  return (
    <NavUserDropdown
      name={user.name}
      email={user.email}
      image={user.image ?? null}
    />
  );
}
