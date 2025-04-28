// 구글 시트 ID를 여기에 입력하세요
const SPREADSHEET_ID = '1_3vfkReCDiWfQAIHwfC2vNPmJZk-EAhIO6AAsmrYms4';

// 시트 이름 설정
const SHEET_NAME = '주문 목록';
const MENU_SHEET_NAME = '메뉴 목록'; // 메뉴 데이터가 저장된 시트 이름

// CORS 헤더 설정
function setCorsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Access-Control-Max-Age': '86400',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
    };
}

// OPTIONS 요청 처리
function doOptions(e) {
    return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
}

// POST 요청을 처리하는 함수
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);

        // 필수 데이터 검증
        if (!data.name || !data.phone || !data.items || data.items.length === 0) {
            throw new Error('필수 주문 정보가 누락되었습니다.');
        }

        // 구글 시트 가져오기
        const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
        const sheet = spreadsheet.getSheetByName(SHEET_NAME);

        if (!sheet) {
            // 시트가 없으면 새로 생성
            sheet = spreadsheet.insertSheet(SHEET_NAME);
            // 헤더 추가
            sheet.getRange('A1:L1').setValues([['주문시간', '이름', '전화번호', '이메일', '배송옵션', '픽업시간', '상품명', '가격', '수량', '총금액', '요청사항', '주문번호', '주문상태']]);
        }

        // 주문 시간
        const orderTime = new Date().toLocaleString();

        // 각 상품을 개별 행으로 저장
        data.items.forEach((item, index) => {
            // 첫 번째 항목에만 전체 주문 정보 및 요청사항 포함
            const notesValue = index === 0 ? data.notes || '' : ''; // notes 값 처리
            Logger.log(`Processing item ${index}: notesValue = "${notesValue}"`); // notes 값 로깅

            const rowData = [
                orderTime,
                data.name,
                data.phone,
                data.email,
                data.deliveryOption || 'pickup',
                data.pickupTime || '',
                item.name,
                item.price,
                item.quantity,
                item.price * item.quantity,
                notesValue,
                data.orderNumber, // 주문 번호
                data.orderStatus || 'pending',
            ];

            // 데이터 추가
            sheet.appendRow(rowData);

            // 첫 번째 항목이 아닌 경우 주문자 정보는 빈칸으로 처리
            if (index > 0) {
                const lastRow = sheet.getLastRow();
                sheet.getRange(lastRow, 2, 1, 5).clearContent();
            }
        });

        if (data.sendEmail) {
            sendOrderConfirmationEmail(data);
        }

        return ContentService.createTextOutput(
            JSON.stringify({
                status: 'success',
                data: '주문 처리됨',
            })
        )
            .setMimeType(ContentService.MimeType.JSON)
            .setHeader('Access-Control-Allow-Origin', '*');

        // 성공 응답 반환
        return ContentService.createTextOutput(
            JSON.stringify({
                result: 'success',
                message: '주문이 성공적으로 저장되었습니다.',
            })
        ).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        // 에러 발생 시 에러 응답 반환
        return ContentService.createTextOutput(
            JSON.stringify({
                result: 'error',
                message: error.toString(),
            })
        ).setMimeType(ContentService.MimeType.JSON);
    }
}

// 자동 이메일 전송 함수
function sendOrderConfirmationEmail(data) {
    try {
        // 이메일 본문 생성
        const itemsList = data.items.map((item) => `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n');

        const emailBody = `
      Dear ${data.name},

      Thank you for your order at Texan Lee Donuts!

      Order Details:
      -------------
      Order Number: ${data.orderNumber}
      Pickup Time: ${data.pickupTime}

      Items Ordered:
      ${itemsList}

      Total: $${data.total.toFixed(2)}

      Special Instructions: ${data.notes || 'None'}

      Pickup Location:
      Texan Lee Donuts
      1490 Valley Ridge Blvd #104
      Lewisville, TX 75077

      If you have any questions about your order, please contact us at:
      Phone: (972) 436-1054
      Email: texanleedonuts@gmail.com

      Thank you for choosing Texan Lee Donuts!
    `;

        // 이메일 전송
        MailApp.sendEmail({
            to: data.email,
            subject: 'Your Texan Lee Donuts Order Confirmation',
            body: emailBody,
        });

        return true;
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return false;
    }
}

// GET 요청을 처리하는 함수
function doGet(e) {
    // CORS 헤더 설정
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/javascript',
    };

    // action 파라미터가 있는지 확인
    if (e.parameter && e.parameter.action) {
        // 메뉴 데이터 가져오기 요청
        if (e.parameter.action === 'getMenu') {
            return getMenuData(e.parameter.callback);
        }
    }

    // 기본 응답
    return ContentService.createTextOutput(
        JSON.stringify({
            status: 'ok',
            message: '주문 시스템이 정상적으로 작동중입니다.',
        })
    )
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
}

// 메뉴 데이터를 가져오는 함수
function getMenuData(callbackParam) {
    try {
        const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
        const menuSheet = spreadsheet.getSheetByName(MENU_SHEET_NAME);

        if (!menuSheet) {
            throw new Error(`메뉴 시트를 찾을 수 없습니다.`);
        }

        // 메뉴 데이터 가져오기
        const dataRange = menuSheet.getDataRange();
        const values = dataRange.getValues();

        if (!values || values.length < 2) {
            throw new Error('메뉴 데이터가 없습니다.');
        }

        // 첫 번째 행은 헤더로 간주
        const headers = values[0].map((h) => h.toString().trim().toLowerCase());

        const categoryIndex = headers.indexOf('category');
        const nameIndex = headers.indexOf('name');
        const descriptionIndex = headers.indexOf('description');
        const priceIndex = headers.indexOf('price');
        const imageUrlIndex = headers.indexOf('imageurl');

        // 필수 열이 존재하는지 확인
        if (nameIndex === -1 || priceIndex === -1 || categoryIndex === -1) {
            throw new Error('필수 열(category, name, price)이 없습니다.');
        }

        // 카테고리별 메뉴 데이터 구성
        const menuData = {
            donut: [],
            'cake-donut': [],
            breakfast: [],
        };

        // 헤더 행을 제외하고 데이터 처리
        for (let i = 1; i < values.length; i++) {
            const row = values[i];
            const name = row[nameIndex] ? row[nameIndex].toString().trim() : null;
            const priceStr = row[priceIndex] ? row[priceIndex].toString().trim() : null;
            const category = row[categoryIndex] ? row[categoryIndex].toString().trim() : null;
            const price = priceStr ? parseFloat(priceStr) : NaN;

            if (!name || !category || isNaN(price)) continue;

            const menuItem = {
                name: name,
                price: price,
                description: descriptionIndex !== -1 ? row[descriptionIndex]?.toString().trim() || '' : '',
                imageUrl:
                    imageUrlIndex !== -1
                        ? row[imageUrlIndex]?.toString().trim() || 'https://images.unsplash.com/photo-1551024506-0bccd828d307'
                        : 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
            };

            if (menuData.hasOwnProperty(category)) {
                menuData[category].push(menuItem);
            }
        }

        // JSONP 콜백이 있는 경우 JSONP 형식으로 응답
        if (callbackParam) {
            return ContentService.createTextOutput(`${callbackParam}(${JSON.stringify(menuData)})`)
                .setMimeType(ContentService.MimeType.JAVASCRIPT)
                .setHeaders({
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/javascript',
                });
        }

        // 일반 JSON 형식으로 반환
        return ContentService.createTextOutput(JSON.stringify(menuData)).setMimeType(ContentService.MimeType.JSON).setHeaders({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        });
    } catch (error) {
        const errorResponse = {
            error: true,
            message: error.toString(),
        };

        if (callbackParam) {
            return ContentService.createTextOutput(`${callbackParam}(${JSON.stringify(errorResponse)})`)
                .setMimeType(ContentService.MimeType.JAVASCRIPT)
                .setHeaders({
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/javascript',
                });
        }

        return ContentService.createTextOutput(JSON.stringify(errorResponse)).setMimeType(ContentService.MimeType.JSON).setHeaders({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        });
    }
}

function doGet(e) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/javascript',
    };

    try {
        // 주문 검색 처리
        if (e.parameter.action === 'searchOrder') {
            const orderNumber = e.parameter.orderNumber;
            const callback = e.parameter.callback;

            const orderInfo = searchOrderByNumber(orderNumber);

            return ContentService.createTextOutput(
                `${callback}(${JSON.stringify({
                    error: false,
                    orderInfo: orderInfo,
                })})`
            ).setMimeType(ContentService.MimeType.JAVASCRIPT);
        }

        // 기타 액션 처리...
        return ContentService.createTextOutput(JSON.stringify({ error: true, message: '잘못된 요청입니다.' }))
            .setMimeType(ContentService.MimeType.JSON)
            .setHeaders(headers);
    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ error: true, message: error.message }))
            .setMimeType(ContentService.MimeType.JSON)
            .setHeaders(headers);
    }
}

function searchOrderByNumber(orderNumber) {
    try {
        const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
        const sheet = spreadsheet.getSheetByName(SHEET_NAME);

        if (!sheet) {
            throw new Error('주문 시트를 찾을 수 없습니다.');
        }

        const dataRange = sheet.getDataRange();
        const values = dataRange.getValues();
        const headers = values[0];

        // 필요한 열 인덱스 찾기
        const orderNumIdx = headers.indexOf('주문번호');
        const timeIdx = headers.indexOf('주문시간');
        const nameIdx = headers.indexOf('상품명');
        const quantityIdx = headers.indexOf('수량');
        const priceIdx = headers.indexOf('가격');
        const statusIdx = headers.indexOf('주문상태');

        if (orderNumIdx === -1) {
            throw new Error('주문번호 열을 찾을 수 없습니다.');
        }

        // 주문 찾기
        const orderRows = values.slice(1).filter((row) => row[orderNumIdx] === orderNumber);

        if (orderRows.length === 0) {
            return null;
        }

        // 주문 정보 구성
        const orderInfo = {
            orderNumber: orderNumber,
            orderTime: orderRows[0][timeIdx],
            total: 0,
            status: orderRows[0][statusIdx] || 'pending',
            items: [],
        };

        // 주문 아이템 정보 수집
        orderRows.forEach((row) => {
            const item = {
                name: row[nameIdx],
                quantity: parseInt(row[quantityIdx]),
                price: parseFloat(row[priceIdx]),
            };
            orderInfo.items.push(item);
            orderInfo.total += item.price * item.quantity;
        });

        return orderInfo;
    } catch (error) {
        Logger.log('Error in searchOrderByNumber:', error);
        return null;
    }
}
