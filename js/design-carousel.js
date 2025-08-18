// 平面设计页面视频轮播系统
window.DesignCarousel = (function() {
    'use strict';
    
    let videos = [];
    let currentIndex = 0;
    let intervalId = null;
    let isInitialized = false;
    
    // 轮播间隔时间 (秒)
    const CAROUSEL_INTERVAL = 4000; // 4秒切换一次
    
    // 初始化
    function init() {
        if (isInitialized) return;
        
        console.log('[DesignCarousel] 初始化视频轮播系统');
        
        // 获取所有视频元素
        videos = document.querySelectorAll('.design-videos-container .design-video');
        
        if (videos.length === 0) {
            console.warn('[DesignCarousel] 未找到视频元素');
            return;
        }
        
        console.log(`[DesignCarousel] 找到 ${videos.length} 个视频`);
        
        // 设置初始状态
        setupInitialState();
        
        // 启动自动轮播
        startCarousel();
        
        isInitialized = true;
        console.log('[DesignCarousel] 视频轮播系统初始化完成');
    }
    
    // 设置初始状态
    function setupInitialState() {
        videos.forEach((video, index) => {
            if (index === 0) {
                video.classList.add('active');
                // 确保第一个视频开始播放
                video.play().catch(e => {
                    console.warn('[DesignCarousel] 视频自动播放失败:', e);
                });
            } else {
                video.classList.remove('active');
            }
        });
        
        currentIndex = 0;
    }
    
    // 切换到下一个视频
    function nextVideo() {
        if (videos.length === 0) return;
        
        // 移除当前活动状态
        videos[currentIndex].classList.remove('active');
        
        // 计算下一个索引
        currentIndex = (currentIndex + 1) % videos.length;
        
        // 添加新的活动状态
        videos[currentIndex].classList.add('active');
        
        // 确保新视频开始播放
        videos[currentIndex].play().catch(e => {
            console.warn('[DesignCarousel] 视频播放失败:', e);
        });
        
        console.log(`[DesignCarousel] 切换到视频 ${currentIndex + 1}/${videos.length}`);
    }
    
    // 启动自动轮播
    function startCarousel() {
        if (intervalId) {
            clearInterval(intervalId);
        }
        
        intervalId = setInterval(nextVideo, CAROUSEL_INTERVAL);
        console.log(`[DesignCarousel] 启动自动轮播，间隔 ${CAROUSEL_INTERVAL}ms`);
    }
    
    // 停止自动轮播
    function stopCarousel() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            console.log('[DesignCarousel] 停止自动轮播');
        }
    }
    
    // 重启轮播
    function restartCarousel() {
        stopCarousel();
        startCarousel();
    }
    
    // 切换到指定视频
    function goToVideo(index) {
        if (index < 0 || index >= videos.length) return;
        
        videos[currentIndex].classList.remove('active');
        currentIndex = index;
        videos[currentIndex].classList.add('active');
        
        videos[currentIndex].play().catch(e => {
            console.warn('[DesignCarousel] 视频播放失败:', e);
        });
        
        // 重启轮播定时器
        restartCarousel();
    }
    
    // 公开API
    return {
        init,
        startCarousel,
        stopCarousel,
        restartCarousel,
        nextVideo,
        goToVideo,
        getCurrentIndex: () => currentIndex,
        getVideoCount: () => videos.length
    };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('[DesignCarousel] 启动视频轮播系统');
        window.DesignCarousel.init();
    }, 500); // 延迟500ms确保DOM完全加载
});