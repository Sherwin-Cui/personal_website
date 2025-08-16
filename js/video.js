// 视频管理模块
window.VideoManager = (function() {
    let currentVideoIndex = 0;
    const videos = [];
    
    function initVideos() {
        console.log('[VideoManager] Initializing videos, count:', AppConfig.videos.count);
        // 获取所有视频元素
        for (let i = 1; i <= AppConfig.videos.count; i++) {
            const video = document.getElementById(`video${i}`);
            console.log(`[VideoManager] Video ${i}:`, video ? 'found' : 'not found');
            if (video) {
                videos.push(video);
                
                // 添加事件监听器
                video.addEventListener('loadeddata', () => {
                    if (i === 1) {
                        // 第一个视频加载完成后自动播放
                        playFirstVideo();
                    }
                });
                
                // 如果视频已经加载完成，直接播放第一个视频
                if (i === 1 && video.readyState >= 3) {
                    console.log('[VideoManager] Video 1 already loaded, playing immediately');
                    playFirstVideo();
                }
                
                video.addEventListener('error', (e) => {
                    console.error(`Video ${i} failed to load:`, e);
                });
                
                video.addEventListener('timeupdate', () => {
                    // 在视频播放到接近结束时开始渐出
                    if (video.duration - video.currentTime <= AppConfig.videos.fadeOutTriggerTime && 
                        !video.classList.contains('fading-out')) {
                        video.classList.add('fading-out');
                        video.style.opacity = '0';
                        
                        // 在渐出完成后切换到下一个视频
                        setTimeout(() => {
                            playNextVideo();
                        }, AppConfig.videos.fadeOutDuration);
                    }
                });
                
                video.addEventListener('ended', () => {
                    // 如果没有通过timeupdate触发切换，则在这里切换
                    if (!video.classList.contains('fading-out')) {
                        playNextVideo();
                    }
                });
            }
        }
    }
    
    function playFirstVideo() {
        console.log('[VideoManager] playFirstVideo called, videos.length:', videos.length);
        if (videos.length > 0) {
            const firstVideo = videos[0];
            console.log('[VideoManager] Playing first video:', firstVideo);
            firstVideo.currentTime = 0;
            firstVideo.classList.add('active');
            firstVideo.style.opacity = '1';
            firstVideo.play().then(() => {
                console.log('[VideoManager] First video started playing');
            }).catch(err => {
                console.error('[VideoManager] First video play failed:', err);
            });
        } else {
            console.error('[VideoManager] No videos found to play');
        }
    }
    
    function playNextVideo() {
        if (videos.length === 0) return;
        
        // 当前视频淡出并重置状态
        const currentVideo = videos[currentVideoIndex];
        currentVideo.classList.remove('active');
        currentVideo.classList.remove('fading-out');
        currentVideo.pause();
        currentVideo.style.opacity = '0';
        
        // 切换到下一个视频（循环全部视频）
        currentVideoIndex = (currentVideoIndex + 1) % AppConfig.videos.count;
        const nextVideo = videos[currentVideoIndex];
        
        // 重置并播放下一个视频
        nextVideo.currentTime = 0;
        nextVideo.classList.add('active');
        nextVideo.style.opacity = '1';
        
        nextVideo.play().then(() => {
        }).catch(err => {
            // 如果播放失败，尝试重新加载
            nextVideo.load();
            setTimeout(() => {
                nextVideo.play().catch(e => console.log('Retry play failed:', e));
            }, 100);
        });
    }
    
    function init() {
        initVideos();
        
        // 调试：检查视频状态
        setTimeout(() => {
            console.log('Video debug info:');
            videos.forEach((video, index) => {
                if (video) {
                    console.log(`Video ${index + 1}:`, {
                        src: video.querySelector('source')?.src,
                        readyState: video.readyState,
                        paused: video.paused,
                        error: video.error,
                        networkState: video.networkState,
                        hasActiveClass: video.classList.contains('active')
                    });
                }
            });
        }, 2000);
    }
    
    return {
        init,
        playFirstVideo,
        playNextVideo
    };
})();