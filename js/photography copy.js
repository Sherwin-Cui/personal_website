// 摄影页面滚动动画控制
window.PhotographyScroll = (function() {
    'use strict';
    
    let contactScroll, contactContainer, photographyPage;
    let contactScrollY = 0; // 容器内滚动位置
    let pageScrollY = 0;    // 页面延展滚动位置
    let rubberBandY = 0;    // 橡皮筋效果位置
    let isInPhotographyPage = false;
    let photographyScrollTimeout = null;
    let stageDamping = 0;      // 阶段切换阻尼计数器
    let isRubberBanding = false; // 是否在橡皮筋状态
    let wasInPhotographyPage = false; // 上一帧是否在摄影页面
    const DAMPING_THRESHOLD = 3; // 需要滚动3次才能切换阶段
    const RUBBER_BAND_LIMIT = 100; // 橡皮筋最大拉伸距离
    
    // 初始化
    function init() {
        console.log('[PhotographyScroll] 初始化摄影页面滚动动画');
        
        // 获取DOM元素
        contactScroll = document.querySelector('.photography-contact-scroll');
        contactContainer = document.querySelector('.photography-contact-container');
        photographyPage = document.querySelector('.page[data-page="4"]');
        
        if (!contactScroll || !contactContainer || !photographyPage) {
            console.error('[PhotographyScroll] 关键DOM元素缺失');
            console.log('contactScroll:', contactScroll);
            console.log('contactContainer:', contactContainer);
            console.log('photographyPage:', photographyPage);
            return;
        }
        
        // 绑定事件
        bindEvents();
        
        console.log('[PhotographyScroll] 摄影页面滚动动画初始化完成');
    }
    
    // 绑定事件
    function bindEvents() {
        // 监听页面切换事件
        document.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    // 处理滚轮事件
    function handleWheel(e) {
        // 检查是否在摄影页面（第4页，index为3）且页面切换已完成
        const nowInPhotographyPage = window.PageSystem && 
            window.PageSystem.getCurrentPage() === 3 && 
            window.PageSystem.isInPageMode() &&
            !window.PageSystem.isTransitioning();
            
        if (nowInPhotographyPage) {
            console.log('[PhotographyScroll] 在摄影页面，处理滚动事件');
            
            // 首次进入摄影页面时，保持当前状态不变
            if (!wasInPhotographyPage) {
                console.log('[PhotographyScroll] 首次进入摄影页面，保持当前状态');
                // 不强制设置状态，让用户从当前状态开始体验动画
            }
            
            isInPhotographyPage = true;
            wasInPhotographyPage = true;
            
            // 检查是否应该阻止默认行为
            const shouldPreventDefault = !(contactScrollY === 0 && pageScrollY === 0 && rubberBandY === 0 && e.deltaY < 0);
            
            if (shouldPreventDefault) {
                // 阻止默认滚动行为
                e.preventDefault();
                // 处理滚动动画
                handleContactScroll(e.deltaY);
            } else {
                // 在顶部且向上滚动时，允许默认行为（页面切换）
                console.log('[PhotographyScroll] 允许页面切换到上一页');
            }
        } else {
            isInPhotographyPage = false;
            // 不在摄影页面时记录状态变化
            if (wasInPhotographyPage) {
                console.log('[PhotographyScroll] 离开摄影页面');
                wasInPhotographyPage = false;
                // 不重置滚动位置，保持状态
            }
        }
    }
    
    // 处理联系信息滚动
    function handleContactScroll(deltaY) {
        if (!contactScroll) return;
        
        // 清除之前的超时
        if (photographyScrollTimeout) {
            clearTimeout(photographyScrollTimeout);
        }
        
        // 计算滚动增量（适中敏感度）
        const scrollStep = deltaY * 0.8;
        
        // 严格的两阶段滚动逻辑
        const maxContactScroll = 459; // 容器内最大滚动距离
        const maxPageScroll = 200;    // 页面延展最大距离
        
        if (deltaY > 0) {
            // ===== 向下滚动 =====
            if (contactScrollY < maxContactScroll) {
                // 第一阶段：容器内滚动，严格独立
                contactScrollY += scrollStep;
                contactScrollY = Math.min(contactScrollY, maxContactScroll);
                stageDamping = 0; // 重置阻尼
                console.log(`[PhotographyScroll] 第一阶段 - 容器滚动: ${contactScrollY}px / ${maxContactScroll}px`);
            } else if (contactScrollY >= maxContactScroll && pageScrollY === 0) {
                // 阶段切换阻尼：从第一阶段到第二阶段
                stageDamping++;
                console.log(`[PhotographyScroll] 阶段切换阻尼: ${stageDamping}/${DAMPING_THRESHOLD}`);
                if (stageDamping >= DAMPING_THRESHOLD) {
                    // 阻尼满足，开始第二阶段
                    pageScrollY += scrollStep;
                    pageScrollY = Math.min(pageScrollY, maxPageScroll);
                    stageDamping = 0; // 进入第二阶段后重置阻尼
                    console.log(`[PhotographyScroll] 第二阶段开始 - 页面延展: ${pageScrollY}px / ${maxPageScroll}px`);
                }
            } else if (pageScrollY > 0 && pageScrollY < maxPageScroll) {
                // 第二阶段：页面延展，严格独立
                pageScrollY += scrollStep;
                pageScrollY = Math.min(pageScrollY, maxPageScroll);
                console.log(`[PhotographyScroll] 第二阶段 - 页面延展: ${pageScrollY}px / ${maxPageScroll}px`);
            } else if (pageScrollY >= maxPageScroll) {
                // 第三阶段：橡皮筋效果，严格独立
                isRubberBanding = true;
                rubberBandY += scrollStep * 0.3; // 减弱橡皮筋移动
                rubberBandY = Math.min(rubberBandY, RUBBER_BAND_LIMIT);
                console.log(`[PhotographyScroll] 橡皮筋效果: ${rubberBandY}px / ${RUBBER_BAND_LIMIT}px`);
            }
        } else if (deltaY < 0) {
            // ===== 向上滚动 - 严格逆序 =====
            if (rubberBandY > 0) {
                // 第三阶段回滚：橡皮筋效果，严格独立
                rubberBandY += scrollStep * 0.5; // scrollStep为负值，稍快回滚
                rubberBandY = Math.max(rubberBandY, 0);
                if (rubberBandY === 0) {
                    isRubberBanding = false;
                }
                console.log(`[PhotographyScroll] 橡皮筋回滚: ${rubberBandY}px`);
            } else if (pageScrollY > 0) {
                // 第二阶段回滚：页面延展，严格独立
                pageScrollY += scrollStep; // scrollStep为负值
                pageScrollY = Math.max(pageScrollY, 0);
                console.log(`[PhotographyScroll] 第二阶段回滚 - 页面延展: ${pageScrollY}px`);
            } else if (pageScrollY <= 0 && contactScrollY >= maxContactScroll) {
                // 阶段切换阻尼：从第二阶段回到第一阶段
                stageDamping++;
                console.log(`[PhotographyScroll] 阶段切换阻尼（回滚）: ${stageDamping}/${DAMPING_THRESHOLD}`);
                if (stageDamping >= DAMPING_THRESHOLD) {
                    // 阻尼满足，开始回滚第一阶段
                    contactScrollY += scrollStep; // scrollStep为负值
                    contactScrollY = Math.max(contactScrollY, 0);
                    stageDamping = 0; // 进入第一阶段回滚后重置阻尼
                    console.log(`[PhotographyScroll] 第一阶段回滚开始 - 容器滚动: ${contactScrollY}px`);
                }
            } else if (contactScrollY < maxContactScroll && contactScrollY > 0) {
                // 第一阶段回滚：容器滚动，严格独立
                contactScrollY += scrollStep; // scrollStep为负值
                contactScrollY = Math.max(contactScrollY, 0);
                console.log(`[PhotographyScroll] 第一阶段回滚 - 容器滚动: ${contactScrollY}px`);
            }
        }
        
        // 更新滚动位置
        updateScrollPosition();
        
        // 设置防抖，避免过度滚动
        photographyScrollTimeout = setTimeout(() => {
            // 橡皮筋自动回弹
            if (isRubberBanding && rubberBandY > 0) {
                snapBackRubberBand();
            }
        }, 150);
    }
    
    // 更新滚动位置
    function updateScrollPosition() {
        // 第一阶段：容器内滚动
        if (contactScroll) {
            contactScroll.style.transform = `translateY(${-contactScrollY}px)`;
        }
        
        // 第二阶段和第三阶段：移动摄影页面本身来露出延展内容 + 橡皮筋效果
        if (photographyPage) {
            const totalPageOffset = pageScrollY + rubberBandY;
            photographyPage.style.transform = `translateY(${-totalPageOffset}px)`;
            
            // 添加橡皮筋的过渡效果
            if (isRubberBanding && rubberBandY > 0) {
                photographyPage.style.transition = 'transform 0.1s ease-out';
            } else {
                photographyPage.style.transition = 'transform 0.3s ease-out';
            }
        }
    }
    
    // 橡皮筋回弹动画
    function snapBackRubberBand() {
        if (rubberBandY <= 0) return;
        
        const snapBackStep = rubberBandY * 0.15; // 每次回弹15%
        rubberBandY -= snapBackStep;
        
        if (rubberBandY < 1) {
            rubberBandY = 0;
            isRubberBanding = false;
            console.log('[PhotographyScroll] 橡皮筋回弹完成');
        }
        
        updateScrollPosition();
        
        // 继续回弹动画
        if (rubberBandY > 0) {
            requestAnimationFrame(snapBackRubberBand);
        }
    }
    
    // 重置滚动位置
    function resetScroll() {
        contactScrollY = 0;
        pageScrollY = 0;
        rubberBandY = 0;
        isRubberBanding = false;
        stageDamping = 0;
        updateScrollPosition();
    }
    
    // 获取当前滚动状态
    function isActive() {
        return isInPhotographyPage;
    }
    
    // 公开API
    return {
        init,
        resetScroll,
        isActive
    };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('[PhotographyScroll] 启动摄影页面滚动动画');
        window.PhotographyScroll.init();
    }, 400);
});