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
        
        // 获取DOM元素 - 增强选择器
        contactScroll = document.querySelector('.photography-contact-scroll');
        contactContainer = document.querySelector('.photography-contact-container');
        photographyPage = document.querySelector('.page[data-page="4"]');
        
        // 详细的调试信息
        console.log('[PhotographyScroll] DOM元素检查:');
        console.log('- contactScroll:', contactScroll ? '✓ 找到' : '✗ 未找到', contactScroll);
        console.log('- contactContainer:', contactContainer ? '✓ 找到' : '✗ 未找到', contactContainer);
        console.log('- photographyPage:', photographyPage ? '✓ 找到' : '✗ 未找到', photographyPage);
        
        if (!contactScroll || !contactContainer || !photographyPage) {
            console.error('[PhotographyScroll] 关键DOM元素缺失，尝试延迟初始化');
            // 延迟重试
            setTimeout(() => {
                contactScroll = document.querySelector('.photography-contact-scroll');
                contactContainer = document.querySelector('.photography-contact-container');
                photographyPage = document.querySelector('.page[data-page="4"]');
                if (contactScroll && contactContainer && photographyPage) {
                    console.log('[PhotographyScroll] 延迟初始化成功');
                    bindEvents();
                }
            }, 500);
            return;
        }
        
        // 绑定事件
        bindEvents();
        
        console.log('[PhotographyScroll] 摄影页面滚动动画初始化完成');
    }
    
    // 绑定事件 - 提高优先级
    function bindEvents() {
        // 使用捕获阶段来确保先于其他事件处理器执行
        document.addEventListener('wheel', handleWheel, { 
            passive: false,
            capture: true  // 使用捕获阶段
        });
        
        console.log('[PhotographyScroll] 事件监听器已绑定（捕获阶段）');
    }
    
    // 处理滚轮事件
    function handleWheel(e) {
        // 检查详情页面状态
        if ((window.AppleDetail && window.AppleDetail.isVisible()) ||
            (window.AiDetail && window.AiDetail.isVisible()) ||
            (window.DesignDetail && window.DesignDetail.isVisible())) {
            return;
        }
        
        // 检查是否在摄影页面（第4页，index为3）
        const currentPage = window.PageSystem ? window.PageSystem.getCurrentPage() : -1;
        const isInPageMode = window.PageSystem ? window.PageSystem.isInPageMode() : false;
        const isTransitioning = window.PageSystem ? window.PageSystem.isTransitioning() : false;
        
        // 调试输出
        if (currentPage === 3) {
            console.log('[PhotographyScroll] 页面状态:', {
                currentPage,
                isInPageMode,
                isTransitioning,
                contactScrollY,
                pageScrollY,
                rubberBandY
            });
        }
        
        const nowInPhotographyPage = currentPage === 3 && isInPageMode && !isTransitioning;
        
        if (nowInPhotographyPage) {
            console.log('[PhotographyScroll] ✓ 在摄影页面，处理滚动事件, deltaY:', e.deltaY);
            
            // 首次进入摄影页面
            if (!wasInPhotographyPage) {
                console.log('[PhotographyScroll] 首次进入摄影页面');
                wasInPhotographyPage = true;
            }
            
            isInPhotographyPage = true;
            
            // 判断是否应该处理滚动
            const atTop = contactScrollY === 0 && pageScrollY === 0 && rubberBandY === 0;
            const scrollingUp = e.deltaY < 0;
            
            // 如果在顶部且向上滚动，允许页面切换
            if (atTop && scrollingUp) {
                console.log('[PhotographyScroll] 在顶部向上滚动，允许页面切换');
                return; // 不阻止默认行为，让页面系统处理
            }
            
            // 其他情况，阻止默认行为并处理滚动
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡
            handleContactScroll(e.deltaY);
            
        } else {
            isInPhotographyPage = false;
            if (wasInPhotographyPage) {
                console.log('[PhotographyScroll] 离开摄影页面');
                wasInPhotographyPage = false;
            }
        }
    }
    
    // 处理联系信息滚动
    function handleContactScroll(deltaY) {
        if (!contactScroll || !photographyPage) {
            console.error('[PhotographyScroll] DOM元素未就绪');
            return;
        }
        
        // 清除之前的超时
        if (photographyScrollTimeout) {
            clearTimeout(photographyScrollTimeout);
        }
        
        // 计算滚动增量（调整敏感度）
        const scrollStep = deltaY * 0.5; // 降低敏感度，让滚动更平滑
        
        // 严格的三阶段滚动逻辑
        const maxContactScroll = 459; // 容器内最大滚动距离
        const maxPageScroll = 200;    // 页面延展最大距离
        
        console.log('[PhotographyScroll] 滚动处理:', {
            deltaY,
            scrollStep,
            currentStage: contactScrollY < maxContactScroll ? 1 : 
                         pageScrollY < maxPageScroll ? 2 : 3
        });
        
        if (deltaY > 0) {
            // ===== 向下滚动 =====
            if (contactScrollY < maxContactScroll) {
                // 第一阶段：容器内滚动
                const oldScrollY = contactScrollY;
                contactScrollY += scrollStep;
                contactScrollY = Math.min(contactScrollY, maxContactScroll);
                stageDamping = 0;
                console.log(`[PhotographyScroll] 第一阶段 - 容器滚动: ${oldScrollY.toFixed(1)} → ${contactScrollY.toFixed(1)}px (max: ${maxContactScroll}px)`);
                
            } else if (contactScrollY >= maxContactScroll && pageScrollY === 0) {
                // 阶段切换阻尼
                stageDamping++;
                console.log(`[PhotographyScroll] 阶段1→2切换阻尼: ${stageDamping}/${DAMPING_THRESHOLD}`);
                if (stageDamping >= DAMPING_THRESHOLD) {
                    pageScrollY += scrollStep;
                    pageScrollY = Math.min(pageScrollY, maxPageScroll);
                    stageDamping = 0;
                    console.log(`[PhotographyScroll] 进入第二阶段 - 页面延展: ${pageScrollY.toFixed(1)}px`);
                }
                
            } else if (pageScrollY > 0 && pageScrollY < maxPageScroll) {
                // 第二阶段：页面延展
                const oldPageY = pageScrollY;
                pageScrollY += scrollStep;
                pageScrollY = Math.min(pageScrollY, maxPageScroll);
                console.log(`[PhotographyScroll] 第二阶段 - 页面延展: ${oldPageY.toFixed(1)} → ${pageScrollY.toFixed(1)}px (max: ${maxPageScroll}px)`);
                
            } else if (pageScrollY >= maxPageScroll) {
                // 第三阶段：橡皮筋效果
                isRubberBanding = true;
                const oldRubberY = rubberBandY;
                rubberBandY += scrollStep * 0.3;
                rubberBandY = Math.min(rubberBandY, RUBBER_BAND_LIMIT);
                console.log(`[PhotographyScroll] 第三阶段 - 橡皮筋: ${oldRubberY.toFixed(1)} → ${rubberBandY.toFixed(1)}px (max: ${RUBBER_BAND_LIMIT}px)`);
            }
            
        } else if (deltaY < 0) {
            // ===== 向上滚动 - 严格逆序 =====
            if (rubberBandY > 0) {
                // 第三阶段回滚
                const oldRubberY = rubberBandY;
                rubberBandY += scrollStep * 0.5;
                rubberBandY = Math.max(rubberBandY, 0);
                if (rubberBandY === 0) {
                    isRubberBanding = false;
                }
                console.log(`[PhotographyScroll] 橡皮筋回滚: ${oldRubberY.toFixed(1)} → ${rubberBandY.toFixed(1)}px`);
                
            } else if (pageScrollY > 0) {
                // 第二阶段回滚
                const oldPageY = pageScrollY;
                pageScrollY += scrollStep;
                pageScrollY = Math.max(pageScrollY, 0);
                console.log(`[PhotographyScroll] 第二阶段回滚: ${oldPageY.toFixed(1)} → ${pageScrollY.toFixed(1)}px`);
                
            } else if (pageScrollY <= 0 && contactScrollY >= maxContactScroll) {
                // 阶段切换阻尼
                stageDamping++;
                console.log(`[PhotographyScroll] 阶段2→1切换阻尼: ${stageDamping}/${DAMPING_THRESHOLD}`);
                if (stageDamping >= DAMPING_THRESHOLD) {
                    contactScrollY += scrollStep;
                    contactScrollY = Math.max(contactScrollY, 0);
                    stageDamping = 0;
                    console.log(`[PhotographyScroll] 回到第一阶段 - 容器滚动: ${contactScrollY.toFixed(1)}px`);
                }
                
            } else if (contactScrollY < maxContactScroll && contactScrollY > 0) {
                // 第一阶段回滚
                const oldScrollY = contactScrollY;
                contactScrollY += scrollStep;
                contactScrollY = Math.max(contactScrollY, 0);
                console.log(`[PhotographyScroll] 第一阶段回滚: ${oldScrollY.toFixed(1)} → ${contactScrollY.toFixed(1)}px`);
            }
        }
        
        // 更新滚动位置
        updateScrollPosition();
        
        // 设置防抖，橡皮筋回弹
        photographyScrollTimeout = setTimeout(() => {
            if (isRubberBanding && rubberBandY > 0) {
                snapBackRubberBand();
            }
        }, 150);
    }
    
    // 更新滚动位置
    function updateScrollPosition() {
        // 第一阶段：容器内滚动
        if (contactScroll) {
            const transform = `translateY(${-contactScrollY}px)`;
            contactScroll.style.transform = transform;
            console.log('[PhotographyScroll] 更新容器位置:', transform);
        }
        
        // 第二阶段和第三阶段：移动摄影页面本身
        if (photographyPage) {
            const totalPageOffset = pageScrollY + rubberBandY;
            const transform = `translateY(${-totalPageOffset}px)`;
            photographyPage.style.transform = transform;
            
            // 橡皮筋过渡效果
            if (isRubberBanding && rubberBandY > 0) {
                photographyPage.style.transition = 'transform 0.1s ease-out';
            } else {
                photographyPage.style.transition = 'transform 0.3s ease-out';
            }
            
            if (totalPageOffset > 0) {
                console.log('[PhotographyScroll] 更新页面位置:', transform);
            }
        }
    }
    
    // 橡皮筋回弹动画
    function snapBackRubberBand() {
        if (rubberBandY <= 0) return;
        
        const snapBackStep = rubberBandY * 0.15;
        rubberBandY -= snapBackStep;
        
        if (rubberBandY < 1) {
            rubberBandY = 0;
            isRubberBanding = false;
            console.log('[PhotographyScroll] 橡皮筋回弹完成');
        }
        
        updateScrollPosition();
        
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
        console.log('[PhotographyScroll] 滚动位置已重置');
    }
    
    // 获取当前滚动状态
    function isActive() {
        return isInPhotographyPage;
    }
    
    // 获取调试信息
    function getDebugInfo() {
        return {
            isActive: isInPhotographyPage,
            contactScrollY,
            pageScrollY,
            rubberBandY,
            stageDamping,
            isRubberBanding
        };
    }
    
    // 公开API
    return {
        init,
        resetScroll,
        isActive,
        getDebugInfo
    };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('[PhotographyScroll] 启动摄影页面滚动动画');
        window.PhotographyScroll.init();
        
        // 添加调试命令
        window.debugPhoto = function() {
            const info = window.PhotographyScroll.getDebugInfo();
            console.table(info);
            return info;
        };
        console.log('[PhotographyScroll] 调试命令已注册: debugPhoto()');
    }, 400);
});