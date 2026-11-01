import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, verifyToken } from "./auth";

/** Call at the top of every admin page and Server Action. */
export async function assertAdmin() {
  const jar = await cookies();
  if (!(await verifyToken(jar.get(COOKIE)?.value))) redirect("/admin/login");
}
