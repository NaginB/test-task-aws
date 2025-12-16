"use client";

import { useRouter } from "next/navigation";
import { Movie } from "@/store/movieStore";
import Image from "next/image";
import { Film } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const handleClick = () => {
    router.push(`/movies/create?id=${movie.id}`);
  };

  // Determine the image source - handle both full URLs and relative paths
  const getImageSrc = () => {
    if (!movie.poster) return null;

    // Check if it's already a full URL (starts with http:// or https://)
    if (
      movie.poster.startsWith("http://") ||
      movie.poster.startsWith("https://")
    ) {
      return movie.poster;
    }

    // Otherwise, it's a relative path, prefix with API_URL
    return `${API_URL}${movie.poster}`;
  };

  const imageSrc = getImageSrc();

  return (
    <div
      onClick={handleClick}
      className="bg-card p-3 rounded-[16px] overflow-hidden cursor-pointer hover:scale-105 transition-transform"
    >
      <div className="aspect-[2/3] relative">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={movie.title}
            fill
            className="object-cover rounded-[16px]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-input">
            <Film className="w-16 h-16 text-text-secondary" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
        <p className="text-sm text-white font-extralight mt-3">
          {movie.publishingYear}
        </p>
      </div>
    </div>
  );
}
