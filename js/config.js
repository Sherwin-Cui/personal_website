// 全局配置文件
window.AppConfig = {
    // 语言配置
    languages: {
        default: 'en',
        available: ['en', 'zh']
    },
    
    // 动画配置
    animations: {
        scrollMultiplier: 0.3,
        line1ScrollThreshold: 300,
        line2ScrollThreshold: 600,
        revealThreshold: 800,
        fadeTransitionDuration: 1000,
        typewriterDelay: {
            typing: 150,
            deleting: 100,
            pauseAfterComplete: 2000,
            pauseAfterDelete: 500
        }
    },
    
    // 视频配置
    videos: {
        count: 6,
        fadeOutDuration: 1000,
        fadeOutTriggerTime: 1 // 提前1秒开始渐出
    },
    
    // 下拉菜单配置
    dropdown: {
        hideDelay: 100,
        content: {
            work: {
                title: { en: 'Our Work', zh: '我们的作品' },
                description: { 
                    en: 'Explore our portfolio of creative projects and digital experiences.', 
                    zh: '探索我们的创意项目和数字体验作品集。' 
                }
            },
            about: {
                title: { en: 'About Us', zh: '关于我们' },
                description: { 
                    en: 'Learn more about our team, values, and creative process.', 
                    zh: '了解更多关于我们的团队、价值观和创作过程。' 
                }
            },
            services: {
                title: { en: 'Our Services', zh: '我们的服务' },
                description: { 
                    en: 'Discover the full range of services we offer to bring your vision to life.', 
                    zh: '发现我们提供的全方位服务，让您的愿景成为现实。' 
                }
            }
        }
    },
    
    // 像素艺术配置
    pixelArt: {
        gridSize: 48,
        pixelSize: 14,
        gap: 1,
        highlightColor: '#0057a5',
        highlightRange: 1, // 高亮周围多少个像素
        transitionDuration: '0.6s'
    },
    
    // 文本内容
    text: {
        scrollIndicator: {
            zh: '向下滑动以浏览',
            en: 'Scroll to explore'
        }
    }
};