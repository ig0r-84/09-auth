"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register({ email, password });

      const user = await getMe();
      setUser(user);

      router.push("/profile");
    } catch {
      setError("Не вдалося зареєструватися. Перевір введені дані.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Реєстрація</h1>

        <label className={css.formGroup}>
          Email
          <input
            className={css.input}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className={css.formGroup}>
          Пароль
          <input
            className={css.input}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>

        {error && <p className={css.error}>{error}</p>}

        <div className={css.actions}>
          <button
            className={css.submitButton}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Реєструємо..." : "Зареєструватися"}
          </button>
        </div>

        <p>
          Уже маєте акаунт? <Link href="/sign-in">Увійти</Link>
        </p>
      </form>
    </main>
  );
}
