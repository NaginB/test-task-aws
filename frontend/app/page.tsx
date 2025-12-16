"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useMovieStore } from "@/store/movieStore";
import api from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import Header from "@/components/Header";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <MovieList />
    </ProtectedRoute>
  );
}

function MovieList() {
  const router = useRouter();
  const { movies, total, page, totalPages, setMovies, setLoading, loading } =
    useMovieStore();
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMovies = useCallback(
    async (pageNum: number) => {
      setLoading(true);
      try {
        const response = await api.get(`/movies?page=${pageNum}&limit=8`);
        console.log("Movies response:", response.data);
        if (response.data) {
          setMovies(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    },
    [setMovies, setLoading]
  );

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage, fetchMovies]);

  if (loading && movies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (total === 0 && !loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 md:px-10 py-8">
          <Header
            title="My movies"
            showPlusIcon={true}
            onPlusClick={() => router.push("/movies/create")}
            showLogout={true}
          />
          <div className="flex flex-col items-center justify-center min-h-[60vh] mt-8">
            <p className="heading-2 text-white">Your movie list is empty</p>
            <button
              onClick={() => router.push("/movies/create")}
              className="bg-primary text-white px-6 py-3 mt-10 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Add a new movie
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-10 pt-8 pb-48">
        <Header
          title="My movies"
          showPlusIcon={true}
          onPlusClick={() => router.push("/movies/create")}
          showLogout={true}
        />
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
