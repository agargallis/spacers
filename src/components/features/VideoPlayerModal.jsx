import Modal from '../ui/Modal';

export default function VideoPlayerModal({ video, onClose }) {
  return (
    <Modal open={!!video} onClose={onClose} title={video?.title ?? ''}>
      {video && (
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </Modal>
  );
}
