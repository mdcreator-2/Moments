import axios from 'axios';

// In development, Vite proxies /api to the backend (baseURL stays empty).
// In production, set VITE_API_URL to your deployed backend URL.
// Docker (nginx) also proxies /api, so it works with an empty baseURL too.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  // POST /api/videos - Start the clipping pipeline
  submitVideo: async (youtube_url: string) => {
    const res = await apiClient.post('/api/videos', { youtube_url });
    return res.data; // { video_id, status }
  },

  // GET /api/videos/{video_id} - Fetch Transcript and Analyzed Clips
  getVideoStatus: async (videoId: string) => {
    const res = await apiClient.get(`/api/videos/${videoId}`);
    return res.data; 
  },

  // POST /api/videos/{video_id}/clips/{clip_index}/render - Ignite the GPU rendering
  triggerRender: async (videoId: string, clipIndex: number, subtitleStyle: string = "bold_yellow") => {
    const res = await apiClient.post(`/api/videos/${videoId}/clips/${clipIndex}/render`, {
      subtitle_style: subtitleStyle
    });
    return res.data;
  },

  // GET /api/videos/{video_id}/clips/{clip_index}/status - Wait for Render completion
  getClipStatus: async (videoId: string, clipIndex: number) => {
    const res = await apiClient.get(`/api/videos/${videoId}/clips/${clipIndex}/status`);
    return res.data; // { status, render_url }
  },

  // Helper for static src URLs in React img tags
  getThumbnailUrl: (videoId: string, clipIndex: number) => {
    return `/api/videos/${videoId}/clips/${clipIndex}/thumbnail`;
  }
};
