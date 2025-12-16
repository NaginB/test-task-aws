"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useMovieStore } from "@/store/movieStore";
import api from "@/lib/api";
import Image from "next/image";

interface MovieForm {
  title: string;
  publishingYear: number;
}

export default function EditMoviePage() {
  return (
    <ProtectedRoute>
      <EditMovieForm />
    </ProtectedRoute>
  );
}

function EditMovieForm() {
  const router = useRouter();
  const params = useParams();
  const movieId = parseInt(params.id as string);
  const { updateMovie } = useMovieStore();
  const [poster, setPoster] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentPoster, setCurrentPoster] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<MovieForm>();

  useEffect(() => {
    fetchMovie();
  }, [movieId]);

  const fetchMovie = async () => {
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

      const response = await api.patch(`/movies/${movieId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateMovie(response.data);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update movie");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-8">Edit</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg p-4 md:p-8 max-w-4xl"
        >
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <div className="relative aspect-square">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : currentPoster ? (
                  <div className="relative aspect-square">
                    <Image
                      src={currentPoster}
                      alt="Current poster"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="py-12">
                    <p className="text-gray-500">Drag an image here</p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  {...register("title", {
                    required: "Title is required",
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Publishing year"
                  {...register("publishingYear", {
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
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800"
                />
                {errors.publishingYear && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.publishingYear.message}
                  </p>
                )}
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border-2 border-white bg-transparent text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
