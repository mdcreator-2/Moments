import axios from 'axios';

// Vite proxies /api natively in development, so we rely on relative paths locally
// In production, you would attach this to process.env.VITE_API_URL
const apiClient = axios.create({
  baseURL: '', // The proxy intercepts this
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
