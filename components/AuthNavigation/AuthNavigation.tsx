"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearIsAuthenticated();
      router.push("/sign-in");
      router.refresh();
    }
  }

  return (
    <>
      {isAuthenticated && user ? (
        <>
          <li className={css.navigationItem}>
            <a href="/profile" className={css.navigationLink}>
              Profile
            </a>
          </li>

          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user.email}</p>
            <button
              className={css.logoutButton}
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <a href="/sign-in" className={css.navigationLink}>
              Login
            </a>
          </li>

          <li className={css.navigationItem}>
            <a href="/sign-up" className={css.navigationLink}>
              Sign up
            </a>
          </li>
        </>
      )}
    </>
  );
}
