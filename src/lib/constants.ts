import type { Anime } from "./api";

export const posterFallback =
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=85";

export const demoAnime: Anime[] = [
  {
    title: "Frieren: Beyond Journey’s End",
    image: posterFallback,
    linkId: "frieren-beyond-journeys-end",
    rating: "9.1",
    status: "Ongoing",
    episode: "Episode 28",
  },
  {
    title: "Dandadan",
    image:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=700&q=85",
    linkId: "dandadan",
    rating: "8.8",
    status: "Ongoing",
    episode: "Episode 12",
  },
  {
    title: "The Apothecary Diaries",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?auto=format&fit=crop&w=700&q=85",
    linkId: "kusuriya-no-hitorigoto",
    rating: "8.9",
    status: "Ongoing",
    episode: "Episode 24",
  },
  {
    title: "Jujutsu Kaisen",
    image:
      "https://images.unsplash.com/photo-1614583225154-5fcdda07019f?auto=format&fit=crop&w=700&q=85",
    linkId: "jujutsu-kaisen",
    rating: "9.0",
    status: "Completed",
    episode: "Episode 47",
  },
];
