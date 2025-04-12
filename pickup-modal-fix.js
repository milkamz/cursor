// 페이지가 로드되었을 때 실행할 코드
document.addEventListener('DOMContentLoaded', function() {
    // 기존 showPickupTimeModal 함수를 저장
    const originalShowPickupTimeModal = window.showPickupTimeModal;
    
    // 향상된 스타일을 추가하는 함수
    function enhancePickupTimeModalStyle() {
        // 스타일을 위한 CSS 추가
        const styleElement = document.createElement('style');
        styleElement.id = 'pickupTimeModalStyle';
        styleElement.textContent = `
            #pickupTimeModal .order-content {
                max-width: 500px !important;
                width: 95% !important;
                margin: 0 auto !important;
            }
            
            #pickupTimeModal .order-form {
                padding: 1.5rem !important;
            }
            
            #pickupTimeModal input[type="date"] {
                width: 100% !important;
                padding: 0.75rem !important;
                border-radius: 8px !important;
                border: 1px solid #d2d2d7 !important;
            }
            
            #pickupTimeModal .time-select-trigger {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                width: 100% !important;
                padding: 0.75rem !important;
                border-radius: 8px !important;
                border: 1px solid #d2d2d7 !important;
                background: white !important;
                cursor: pointer !important;
            }
            
            #pickupTimeModal .time-dropdown {
                position: absolute !important;
                width: 100% !important;
                max-height: 200px !important;
                overflow-y: auto !important;
                background: white !important;
                border: 1px solid #d2d2d7 !important;
                border-radius: 8px !important;
                margin-top: 4px !important;
                z-index: 100 !important;
            }
            
            #pickupTimeModal .submit-order {
                width: 100% !important;
                margin-top: 1.5rem !important;
            }
            
            @media (max-width: 768px) {
                #pickupTimeModal .order-content {
                    width: 95% !important;
                    max-width: 100% !important;
                }
            }
        `;
        
        // 기존 스타일이 있으면 제거
        const existingStyle = document.getElementById('pickupTimeModalStyle');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // 새 스타일 추가
        document.head.appendChild(styleElement);
    }
    
    // showPickupTimeModal 함수 오버라이드
    window.showPickupTimeModal = function() {
        // 기존 함수 먼저 실행
        if (originalShowPickupTimeModal) {
            originalShowPickupTimeModal();
        }
        
        // 모달 스타일 개선
        enhancePickupTimeModalStyle();
    };
    
    // CSS를 미리 추가해 놓기
    enhancePickupTimeModalStyle();
    
    console.log("Pickup time modal enhancement loaded");
}); 