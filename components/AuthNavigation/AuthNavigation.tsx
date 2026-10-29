"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
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
      console.error("Помилка під час виходу:", error);
    } finally {
      clearIsAuthenticated();
      router.push("/sign-in");
      router.refresh();
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link className={css.navigationLink} href="/sign-in">
            Увійти
          </Link>
        </li>
        <li className={css.navigationItem}>
          <Link className={css.navigationLink} href="/sign-up">
            Реєстрація
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link className={css.navigationLink} href="/profile">
          Профіль
        </Link>
      </li>
      <li className={css.navigationItem}>
        <span className={css.userEmail}>{user.email}</span>
        <button
          className={css.logoutButton}
          type="button"
          onClick={handleLogout}
        >
          Вийти
        </button>
      </li>
    </>
  );
}
