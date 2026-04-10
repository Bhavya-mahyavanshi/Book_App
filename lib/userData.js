import { getToken } from "./authenticate";

export async function addToFavourites(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${getToken()}`,
    },
  });

  if (res.status === 200) {
    return await res.json();
  } else {
    return [];
  }
}

export async function removeFromFavourites(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${getToken()}`,
    },
  });

  if (res.status === 200) {
    return await res.json();
  } else {
    return [];
  }
}

export async function getFavourites() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${getToken()}`,
    },
  });

  if (res.status === 200) {
    return await res.json();
  } else {
    return [];
  }
}
