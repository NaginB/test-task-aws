"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useMovieStore } from "@/store/movieStore";
import api from "@/lib/api";
import Image from "next/image";
import FormInput from "@/forms/FormInput";
import Header from "@/components/Header";

interface MovieForm {
  title: string;
  publishingYear: number;
}

export default function CreateMoviePage() {
  return (
    <ProtectedRoute>
      <CreateMovieForm />
    </ProtectedRoute>
  );
}

function CreateMovieForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get("id")
    ? parseInt(searchParams.get("id") as string)
    : null;

  const isEditMode = movieId !== null;
  const { addMovie, updateMovie } = useMovieStore();

  const [poster, setPoster] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentPoster, setCurrentPoster] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<MovieForm>();

  useEffect(() => {
    if (isEditMode && movieId) {
      fetchMovie();
    } else {
      setLoading(false);
    }
  }, [movieId, isEditMode]);

  const fetchMovie = async () => {
    if (!movieId) return;
    try {
      const response = await api.get(`/movies/${movieId}`);
      const movie = response.data;

      setValue("title", movie.title);
      setValue("publishingYear", movie.publishingYear);

      if (movie.poster) {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        setCurrentPoster(
          movie.poster.startsWith("http")
            ? movie.poster
            : `${API_URL}${movie.poster}`
        );
      }
    } catch (error) {
      console.error("Failed to fetch movie:", error);
      setError("Failed to load movie");
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setPoster(file);
        setPreview(URL.createObjectURL(file));
        setCurrentPoster(null);
      }
    },
  });

  const onSubmit = async (data: MovieForm) => {
    try {
      setError("");

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("publishingYear", data.publishingYear.toString());
      if (poster) formData.append("poster", poster);

      if (isEditMode && movieId) {
        const response = await api.patch(`/movies/${movieId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        updateMovie(response.data);
      } else {
        const response = await api.post("/movies", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        addMovie(response.data);
      }

      router.push("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (isEditMode ? "Failed to update movie" : "Failed to create movie")
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-10 py-8">
        <Header title={movieId ? "Edit Movie" : "Create a new movie"} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 rounded-lg p-4 md:p-8 w-full"
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-20">
            {/* Poster Upload */}
            <div className="w-full md:w-auto">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg bg-white/10 flex items-center justify-center cursor-pointer transition-colors
                w-full md:w-[450px]
                h-[260px] sm:h-[340px] md:h-[500px]
                ${
                  isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />

                {preview || currentPoster ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={preview || currentPoster!}
                      alt="Poster"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <p className="text-white text-center px-4">
                    Drag & drop an image here or click to upload
                  </p>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 w-full max-w-[450px] md:pl-10">
              <FormInput
                name="title"
                placeholder="Title"
                register={register}
                rules={{ required: "Title is required" }}
                error={errors.title}
              />

              <FormInput
                name="publishingYear"
                type="number"
                placeholder="Publishing year"
                register={register}
                rules={{
                  required: "Publishing year is required",
                  valueAsNumber: true,
                  min: { value: 1888, message: "Minimum year is 1888" },
                  max: {
                    value: new Date().getFullYear() + 10,
                    message: "Year too far in future",
                  },
                }}
                error={errors.publishingYear}
                className="w-full sm:!w-3/5"
              />

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
