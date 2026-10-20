async function findVideos(q) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.search = new URLSearchParams({ part: "snippet", type: "video", videoEmbeddable: "true", maxResults: "3", q, key }).toString();
  const res = await fetch(url);
  if (!res.ok) { console.error(`[YouTube] ${res.status} ${await res.text()}`); return []; }
  const data = await res.json();
  return (data.items || []).map((i) => ({ id: i.id.videoId, title: i.snippet.title, channel: i.snippet.channelTitle }));
}

async function attachVideos(course) {
  course.videosEnabled = Boolean(process.env.YOUTUBE_API_KEY);
  await Promise.all(course.modules.map(async (m) => {
    try { m.videos = await findVideos(m.youtubeQuery || `${course.topic} ${m.title} tutorial`); }
    catch (e) { console.error(`[YouTube] ${e.message}`); m.videos = []; }
  }));
  return course;
}

module.exports = { attachVideos };
