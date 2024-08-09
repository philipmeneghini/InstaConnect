using Backend.Models;

namespace Backend.Handlers.MediaHandlers
{
    public interface IMediaHandler<T> where T : IInstaModel
    {
        public void AttachPresignedUrls(T item, bool includeUpload = false);

        public void AttachPresignedUrls(IEnumerable<T> items, bool includeUpload = false);

        public void RemoveMedia(T item);

        public void RemoveMedia(IEnumerable<T> items);
    }
}
