const API_BASE_URL = "http://localhost:3001";

export type Anime = {
  title: string;
  image: string;
  linkId?: string;
  link?: string;
  rating?: string;
  score?: string;
  status?: string;
  sinopsis?: string;
  genre?: Array<string | { text: string }>;
  genres?: string[];
  episode?: string;
  release_time?: string;
};

export type Episode = {
  episode: string;
  title: string;
  date_uploaded: string;
  id: string;
  link: string;
};

export type AnimeDetail = Anime & {
  detail?: Record<string, string>;
  ratingValue?: string;
  list_episode?: Episode[];
  youtube?: { link: string };
};

export type EpisodeDetail = {
  title: string;
  eps: string;
  date_uploaded: string;
  detail_anime: Anime;
  embedUrl?: string;
  downloadEps: Array<{
    format: string;
    data: Array<{ quality: string; link: Record<string, string> }>;
  }>;
};

export type HomeResponse = {
  season: Anime[];
  latest: Anime[];
};

export type SearchResponse = {
  results: Anime[];
};

export type PageResponse = {
  items: Anime[];
  page: number;
  totalPages: number;
};

export type ScheduleItem = Anime & {
  day: string;
  time: string;
};

export type ScheduleResponse = {
  days: Record<string, ScheduleItem[]>;
};

export type TopAnime = Anime & {
  rank: number;
};

export type TopResponse = {
  items: TopAnime[];
};

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function getHome(): Promise<HomeResponse> {
  return request<HomeResponse>("/");
}

export function getAnimeDetail(slug: string): Promise<AnimeDetail> {
  return request<AnimeDetail>(`/anime/${encodeURIComponent(slug)}`);
}

export function getEpisode(id: string): Promise<EpisodeDetail> {
  return request<EpisodeDetail>(`/anime/eps/${encodeURIComponent(id)}`);
}

export function searchAnime(query: string): Promise<SearchResponse> {
  return request<SearchResponse>(`/search/${encodeURIComponent(query)}`);
}

export function getLatest(page = 1): Promise<PageResponse> {
  return request<PageResponse>(`/latest?page=${page}`);
}

export function getBatch(page = 1): Promise<PageResponse> {
  return request<PageResponse>(`/batch?page=${page}`);
}

export function getSchedule(): Promise<ScheduleResponse> {
  return request<ScheduleResponse>("/schedule");
}

export function getTop10(): Promise<TopResponse> {
  return request<TopResponse>("/top10");
}

export function getLibrary(): Promise<SearchResponse> {
  return request<SearchResponse>("/library");
}

export function getMovies(): Promise<SearchResponse> {
  return request<SearchResponse>("/movies");
}
