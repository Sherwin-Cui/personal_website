// 下拉菜单管理模块
window.DropdownManager = (function() {
    let dropdownTimeout;
    let dropdownOverlay;
    let dropdownTitle;
    let dropdownDescription;
    
    function showDropdown(type) {
        clearTimeout(dropdownTimeout);
        
        const content = AppConfig.dropdown.content[type];
        const currentLanguage = window.LanguageManager ? window.LanguageManager.getCurrentLanguage() : 'en';
        
        if (content) {
            dropdownTitle.textContent = content.title[currentLanguage];
            dropdownDescription.textContent = content.description[currentLanguage];
        }
        
        dropdownOverlay.classList.add('active');
    }
    
    function hideDropdown() {
        dropdownTimeout = setTimeout(() => {
            dropdownOverlay.classList.remove('active');
        }, AppConfig.dropdown.hideDelay);
    }
    
    function getCurrentDropdownType() {
        const hoveredTrigger = document.querySelector('.dropdown-trigger:hover');
        return hoveredTrigger ? hoveredTrigger.getAttribute('data-dropdown') : null;
    }
    
    function updateLanguage(currentLanguage) {
        if (dropdownOverlay && dropdownOverlay.classList.contains('active')) {
            const activeDropdownType = getCurrentDropdownType();
            if (activeDropdownType) {
                const content = AppConfig.dropdown.content[activeDropdownType];
                if (content) {
                    dropdownTitle.textContent = content.title[currentLanguage];
                    dropdownDescription.textContent = content.description[currentLanguage];
                }
            }
        }
    }
    
    function init() {
        dropdownOverlay = document.getElementById('dropdownOverlay');
        dropdownTitle = document.getElementById('dropdownTitle');
        dropdownDescription = document.getElementById('dropdownDescription');
        const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!dropdownOverlay || !dropdownTitle || !dropdownDescription) return;
        
        // 为每个下拉触发器添加事件监听
        dropdownTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', (e) => {
                const dropdownType = e.target.getAttribute('data-dropdown');
                showDropdown(dropdownType);
            });
            
            trigger.addEventListener('mouseleave', hideDropdown);
        });
        
        // 下拉菜单区域的鼠标事件
        dropdownOverlay.addEventListener('mouseenter', () => {
            clearTimeout(dropdownTimeout);
        });
        
        dropdownOverlay.addEventListener('mouseleave', hideDropdown);
        
        // 导航栏区域的鼠标事件
        if (navMenu) {
            navMenu.addEventListener('mouseleave', hideDropdown);
        }
    }
    
    return {
        init,
        showDropdown,
        hideDropdown,
        updateLanguage
    };
})();