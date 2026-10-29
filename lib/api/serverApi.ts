import { cookies } from "next/headers";
import api from "@/lib/api/api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function fetchNotes(
  search: string,
  page: number,
  tag: string,
): Promise<NotesHttpResponse> {
  const response = await api.get<NotesHttpResponse>("/notes", {
    params: {
      search,
      perPage: 12,
      page,
      ...(tag !== "all" && { tag }),
    },
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me", {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
}

export async function checkSession(): Promise<User | null> {
  try {
    const response = await api.get<User | null>("/auth/session", {
      headers: {
        Cookie: await getCookieHeader(),
      },
    });

    return response.data ?? null;
  } catch {
    return null;
  }
}
