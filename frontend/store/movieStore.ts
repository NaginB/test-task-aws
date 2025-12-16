import { create } from 'zustand';

export interface Movie {
  id: number;
  title: string;
  publishingYear: number;
  poster?: string;
  createdAt: string;
  updatedAt: string;
}

interface MovieState {
  movies: Movie[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  setMovies: (data: { movies: Movie[]; total: number; page: number; totalPages: number }) => void;
  setLoading: (loading: boolean) => void;
  addMovie: (movie: Movie) => void;
  updateMovie: (movie: Movie) => void;
  removeMovie: (id: number) => void;
}

export const useMovieStore = create<MovieState>((set) => ({
  movies: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  setMovies: (data) => set(data),
  setLoading: (loading) => set({ loading }),
  addMovie: (movie) =>
    set((state) => ({
      movies: [movie, ...state.movies],
      total: state.total + 1,
    })),
  updateMovie: (movie) =>
    set((state) => ({
      movies: state.movies.map((m) => (m.id === movie.id ? movie : m)),
    })),
  removeMovie: (id) =>
    set((state) => ({
      movies: state.movies.filter((m) => m.id !== id),
      total: state.total - 1,
    })),
}));

