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
    } else if (!isEditMode) {
      // If not in edit mode, set loading to false immediately
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
        // Check if it's already a full URL (starts with http:// or https://)
        if (
          movie.poster.startsWith("http://") ||
          movie.poster.startsWith("https://")
        ) {
          setCurrentPoster(movie.poster);
        } else {
          // Otherwise, it's a relative path, prefix with API_URL
          setCurrentPoster(`${API_URL}${movie.poster}`);
        }
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
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setPoster(file);
        setPreview(URL.createObjectURL(file));
        setCurrentPoster(null);
      }
    },
    maxFiles: 1,
  });

  const onSubmit = async (data: MovieForm) => {
    try {
      setError("");
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("publishingYear", data.publishingYear.toString());
      if (poster) {
        formData.append("poster", poster);
      }

      if (isEditMode && movieId) {
        const response = await api.patch(`/movies/${movieId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        updateMovie(response.data);
      } else {
        const response = await api.post("/movies", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-10 py-8 h-full">
        <Header title={movieId ? "Edit" : "Create a new movie"} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg p-4 md:p-8 w-full h-[60vh] mt-8"
        >
          <div className="flex gap-20">
            <div className="h-full">
              <div
                {...getRootProps()}
                className={`border-2 bg-white/10 flex items-center justify-center border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors w-[450px] h-[500px] ${
                  isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : currentPoster ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={currentPoster}
                      alt="Current poster"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-white">Drag an image here</p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6 w-full max-w-[450px] pl-10">
              <div>
                <FormInput
                  name="title"
                  label=""
                  placeholder="Title"
                  register={register}
                  rules={{
                    required: "Title is required",
                  }}
                  error={errors.title}
                />
              </div>
              <div>
                <FormInput
                  name="publishingYear"
                  label=""
                  type="number"
                  placeholder="Publishing year"
                  register={register}
                  rules={{
                    required: "Publishing year is required",
                    valueAsNumber: true,
                    min: {
                      value: 1888,
                      message: "Publishing year must be at least 1888",
                    },
                    max: {
                      value: new Date().getFullYear() + 10,
                      message: `Publishing year must be at most ${
                        new Date().getFullYear() + 10
                      }`,
                    },
                  }}
                  error={errors.publishingYear}
                  className="!w-3/5"
                />
              </div>
              <div className="flex gap-4 pt-5 w-10/12">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-white bg-transparent text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
