export default function Videos() {
  const videos = [
    "https://res.cloudinary.com/ds2tkqwtr/video/upload/v1765626231/video3_onxuao.mp4",
    "https://res.cloudinary.com/ds2tkqwtr/video/upload/v1765626226/WhatsApp_Video_2025-12-11_at_06.54.18_o4bzdd.mp4",
    "https://res.cloudinary.com/ds2tkqwtr/video/upload/v1765626221/video_2_pbjrvx.mp4"
  ];

  return (
    <div className="p-6">
      <h2
        className="text-4xl font-extrabold mb-8 text-center text-gradient"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
         Novedades 
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, index) => (
          <video
            key={index}
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded-lg shadow-lg"
          />
        ))}
      </div>
    </div>
  );
}
