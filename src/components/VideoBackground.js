// 视频背景组件
// 管理背景视频的播放、切换和生命周期

class VideoBackground {
    constructor() {
        this.videoContainer = null;
        this.videos = [];
        this.currentVideoIndex = 0;
        this.isPlaying = false;
        this.isInitialized = false;
        this.cycleInterval = null;
    }

    init() {
        if (this.isInitialized) return;

        this.videoContainer = document.querySelector('.video-container');
        this.videos = document.querySelectorAll('.background-video');

        if (this.videoContainer && this.videos.length > 0) {
            this.setupVideos();
            this.startVideoCycle();
            this.isInitialized = true;
            console.log('[VideoBackground] Video background initialized');
        }
    }

    setupVideos() {
        this.videos.forEach((video, index) => {
            // 设置视频属性
            video.muted = true;
            video.loop = true;
            video.preload = 'auto';
            
            // 隐藏所有视频，只显示第一个
            if (index === 0) {
                video.style.opacity = '1';
                video.style.zIndex = '1';
            } else {
                video.style.opacity = '0';
                video.style.zIndex = '0';
            }

            // 监听视频加载完成
            video.addEventListener('loadeddata', () => {
                console.log(`[VideoBackground] Video ${index + 1} loaded`);
            });

            // 监听视频错误
            video.addEventListener('error', (e) => {
                console.error(`[VideoBackground] Video ${index + 1} error:`, e);
            });
        });
    }

    startVideoCycle() {
        if (this.videos.length <= 1) return;

        // 播放第一个视频
        this.playCurrentVideo();

        // 设置自动切换
        this.cycleInterval = setInterval(() => {
            this.nextVideo();
        }, 5000); // 每5秒切换一次
    }

    nextVideo() {
        if (this.videos.length <= 1) return;

        const currentVideo = this.videos[this.currentVideoIndex];
        this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
        const nextVideo = this.videos[this.currentVideoIndex];

        this.transitionToVideo(currentVideo, nextVideo);
    }

    transitionToVideo(currentVideo, nextVideo) {
        // 预加载下一个视频
        nextVideo.currentTime = 0;
        nextVideo.play().catch(e => {
            console.error('[VideoBackground] Error playing next video:', e);
        });

        // 淡入淡出效果
        nextVideo.style.zIndex = '1';
        nextVideo.style.opacity = '0';
        
        // 使用requestAnimationFrame进行平滑过渡
        let opacity = 0;
        const fadeIn = () => {
            opacity += 0.02;
            nextVideo.style.opacity = opacity;
            
            if (opacity < 1) {
                requestAnimationFrame(fadeIn);
            } else {
                // 隐藏当前视频
                currentVideo.style.opacity = '0';
                currentVideo.style.zIndex = '0';
                currentVideo.pause();
            }
        };
        
        requestAnimationFrame(fadeIn);
        
        console.log(`[VideoBackground] Switched to video ${this.currentVideoIndex + 1}`);
    }

    playCurrentVideo() {
        const currentVideo = this.videos[this.currentVideoIndex];
        if (currentVideo) {
            currentVideo.play().catch(e => {
                console.error('[VideoBackground] Error playing video:', e);
            });
            this.isPlaying = true;
        }
    }

    pauseCurrentVideo() {
        const currentVideo = this.videos[this.currentVideoIndex];
        if (currentVideo) {
            currentVideo.pause();
            this.isPlaying = false;
        }
    }

    // 停止视频循环
    stopCycle() {
        if (this.cycleInterval) {
            clearInterval(this.cycleInterval);
            this.cycleInterval = null;
        }
        this.pauseCurrentVideo();
    }

    // 重新开始视频循环
    restartCycle() {
        this.stopCycle();
        this.startVideoCycle();
    }

    // 显示视频容器
    show() {
        if (this.videoContainer) {
            this.videoContainer.style.opacity = '1';
        }
    }

    // 隐藏视频容器
    hide() {
        if (this.videoContainer) {
            this.videoContainer.style.opacity = '0';
        }
    }

    // 清理资源
    destroy() {
        this.stopCycle();
        this.videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    }
}

// 创建全局实例
window.VideoBackground = new VideoBackground();