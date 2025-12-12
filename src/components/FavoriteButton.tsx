"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export default function FavoriteButton({
  ilanId,
  className,
}: {
  ilanId: number;
  className?: string;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBusy) return;

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("لطفاً ابتدا وارد شوید");
      return;
    }

    const user = JSON.parse(userStr);
    if (!user?.id) return;

    try {
      setIsBusy(true);
      if (isFavorite) {
        await fetch(`/api/favoriler?ilanId=${ilanId}`, {
          method: "DELETE",
          headers: { "x-user-id": user.id.toString() },
        });
        setIsFavorite(false);
      } else {
        await fetch("/api/favoriler", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id.toString(),
          },
          body: JSON.stringify({ ilanId }),
        });
        setIsFavorite(true);
      }

      window.dispatchEvent(new Event("favoriGuncelle"));
    } catch (err) {
      console.error("Favori işlemi hatası:", err);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <button onClick={toggle} className={className} aria-label="Favori">
      <Heart
        className={`h-4 w-4 transition-colors ${
          isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"
        }`}
      />
    </button>
  );
}


