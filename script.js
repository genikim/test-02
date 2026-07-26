// JavaScript Code
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    const cardGrid = document.getElementById('cardGrid');
    const resultCount = document.getElementById('resultCount');
    const noResults = document.getElementById('noResults');

    let articlesData = [];

    // JSON 데이터 로드
    fetch('조합데이터.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('네트워크 응답에 문제가 있습니다.');
            }
            return response.json();
        })
        .then(data => {
            articlesData = data;
            renderCards(articlesData);
        })
        .catch(error => {
            console.error('데이터 로딩 실패:', error);
            cardGrid.innerHTML = '<p class="error-msg">데이터를 불러오는 중 오류가 발생했습니다. 조합데이터.json 파일 위치를 확인하세요.</p>';
            resultCount.textContent = '결과 0건';
        });

    // 카드 랜더링 함수
    function renderCards(data, keyword = '') {
        cardGrid.innerHTML = '';

        if (data.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }

        resultCount.textContent = `결과 ${data.length}건`;

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'article-card';

            const highlightedNumber = highlightText(item.조, keyword);
            const highlightedTitle = highlightText(item.제목, keyword);
            const highlightedBody = highlightText(item.본문, keyword);

            card.innerHTML = `
                <div class="card-header">
                    <span class="article-number">${highlightedNumber}</span>
                    <h2 class="article-title">(${highlightedTitle})</h2>
                </div>
                <div class="card-body">${highlightedBody}</div>
            `;
            cardGrid.appendChild(card);
        });
    }

    // 키워드 하이라이팅 처리 함수
    function highlightText(text, keyword) {
        if (!keyword.trim()) return escapeHtml(text);
        
        const escapedText = escapeHtml(text);
        const escapedKeyword = escapeHtml(keyword.trim());
        const regex = new RegExp(`(${escapeRegExp(escapedKeyword)})`, 'gi');

        return escapedText.replace(regex, '<mark>$1</mark>');
    }

    function escapeHtml(string) {
        return String(string)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\$&');
    }

    // 검색 이벤트 핸들러
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length > 0) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }

        const filteredData = articlesData.filter(item => {
            const matchNumber = item.조.toLowerCase().includes(query);
            const matchTitle = item.제목.toLowerCase().includes(query);
            const matchBody = item.본문.toLowerCase().includes(query);
            return matchNumber || matchTitle || matchBody;
        });

        renderCards(filteredData, query);
    });

    // 검색어 초기화 버튼
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        renderCards(articlesData);
        searchInput.focus();
    });
});
