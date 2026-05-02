(function () {
    const initBlogHeroVideo = () => {
        const heroBlocks = document.querySelectorAll('.blog-detail-hero.blog-featured');
        
        heroBlocks.forEach((block) => {
            const trigger = block.querySelector('.open_video_popup');
            const modal = document.querySelector('.blog-hero-video-modal');
            
            if (!trigger || !modal) return;
            
            const videoContainer = modal.querySelector('[data-video-modal-container]');
            const closeButton = modal.querySelector('.modal-popup__close');
            const overlay = modal.querySelector('.modal-popup__overlay');
            
            // Hide pause icon initially if it exists
            const pauseIcon = trigger.querySelector('.pause-icon');
            if (pauseIcon) {
                pauseIcon.style.display = 'none';
            }

            const openModal = () => {
                const videoSrc = trigger.dataset.videoSrc;
                const videoType = trigger.dataset.videoType || 'embed';
                const videoTitle = trigger.getAttribute('aria-label')?.replace('Play video: ', '') || 'Video';
                
                if (!videoSrc) return;

                if (videoType === 'mp4') {
                    const videoEl = document.createElement('video');
                    videoEl.src = videoSrc;
                    videoEl.controls = true;
                    videoEl.autoplay = true;
                    videoEl.muted = false;
                    videoEl.className = 'modal-video-player';
                    videoEl.style.width = '100%';
                    videoEl.setAttribute('controlsList', 'nodownload');
                    videoContainer.replaceChildren(videoEl);
                } else {
                    const iframeEl = document.createElement('iframe');
                    iframeEl.src = videoSrc;
                    iframeEl.title = videoTitle;
                    iframeEl.className = 'features-media__iframe';
                    iframeEl.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    iframeEl.allowFullscreen = true;
                    videoContainer.replaceChildren(iframeEl);
                }

                modal.classList.add('is-active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            };

            const closeModal = () => {
                modal.classList.remove('is-active');
                modal.setAttribute('aria-hidden', 'true');
                videoContainer.replaceChildren();
                document.body.style.overflow = '';
            };

            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });

            if (closeButton) closeButton.addEventListener('click', closeModal);
            if (overlay) overlay.addEventListener('click', closeModal);

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('is-active')) {
                    closeModal();
                }
            });
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBlogHeroVideo);
    } else {
        initBlogHeroVideo();
    }
})();
