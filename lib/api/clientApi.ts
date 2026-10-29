import api from "@/lib/api/api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface UpdateUserRequest {
  username: string;
}

export const fetchNotes = async (
  search: string,
  page: number,
  tag: string,
): Promise<NotesHttpResponse> => {
  const response = await api.get<NotesHttpResponse>("/notes", {
    params: {
      search,
      perPage: 12,
      page,
      ...(tag !== "all" && { tag }),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);

  return response.data;
};

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response = await api.post<Note>("/notes", noteData);

  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${noteId}`);

  return response.data;
};

export const register = async (credentials: RegisterRequest): Promise<User> => {
  const response = await api.post<User>("/auth/register", credentials);

  return response.data;
};

export const login = async (credentials: LoginRequest): Promise<User> => {
  const response = await api.post<User>("/auth/login", credentials);

  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const response = await api.get<User | null>("/auth/session");

  return response.data ?? null;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");

  return response.data;
};

export const updateMe = async (userData: UpdateUserRequest): Promise<User> => {
  const response = await api.patch<User>("/users/me", userData);

  return response.data;
};
