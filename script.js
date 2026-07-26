// JavaScript Code - Fetch 'data.json'
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    const cardGrid = document.getElementById('cardGrid');
    const resultCount = document.getElementById('resultCount');
    const noResults = document.getElementById('noResults');

    let articlesData = [];

    // 외부 data.json 파일 읽기
    fetch('./data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            articlesData = data;
            renderCards(articlesData);
        })
        .catch(error => {
            console.error('JSON 데이터 로딩 실패:', error);
            cardGrid.innerHTML = `
                <div class="error-msg">
                    <p><strong>데이터를 불러올 수 없습니다.</strong></p>
                    <p>동일한 디렉터리에 'data.json' 파일이 위치해 있는지 확인하세요.</p>
                </div>
            `;
            resultCount.textContent = '결과 0건';
        });

    function renderCards(data, keyword = '') {
        cardGrid.innerHTML = '';

        if (!data || data.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }

        resultCount.textContent = `결과 ${data ? data.length : 0}건`;

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

    function highlightText(text, keyword) {
        if (!text) return '';
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
        return string.replace(/[.*+?^${}()|[\]\]/g, '\$&');
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        clearBtn.style.display = query.length > 0 ? 'block' : 'none';

        const filteredData = articlesData.filter(item => {
            const matchNumber = item.조 && item.조.toLowerCase().includes(query);
            const matchTitle = item.제목 && item.제목.toLowerCase().includes(query);
            const matchBody = item.본문 && item.본문.toLowerCase().includes(query);
            return matchNumber || matchTitle || matchBody;
        });

        renderCards(filteredData, query);
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        renderCards(articlesData);
        searchInput.focus();
    });
});
