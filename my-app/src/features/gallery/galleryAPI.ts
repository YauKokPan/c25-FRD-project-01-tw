import { useQuery } from "@tanstack/react-query";

interface Gallery {
  id: number;
  hotel_id: number;
  hotel_name: string;
  hotel_img:string;  
}

export function UseGalleryInfo() {
  const { data, error, isLoading, isFetching } = useQuery<Gallery[], Error>({
    queryKey: ["galleryInfo"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_SERVER}/gallery/allGallery`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("API response:", res);

        if (!res.ok) {
          throw new Error("Error fetching gallery data");
        }

        const result = await res.json();
        console.log("Parsed JSON:", result);

        return result || [];
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        return [];
      }
    },
  });

  if (isLoading || isFetching || error || !data) {
    return [];
  }
  console.log("Data:", data);
  return data;
}
