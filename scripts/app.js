const fetchingQuotes = async () => {
    const response = await fetch(`https://dummyjson.com/quotes/?limit=0`);
    if (response.status !== 200) {
        throw new Error('Fetching quotes failed');
    }
    const data = await response.json();
    return data;
}

const quotesPerPage = 10;
let currentPage = 1;

async function renderQuotes(searchQuery) {
    let quotesData = null;
    if (!quotesData) {
        try {
            quotesData = await fetchingQuotes();
        } catch (error) {
            alert(error.message);
        }
    }

    const quotesContainer = document.getElementById('quotes-container');
    quotesContainer.innerHTML = '';

    const start = (currentPage - 1) * quotesPerPage;
    const end = start + quotesPerPage;
    const currentQuotes = quotesData.quotes.slice(start, end);

    if (searchQuery) {
        currentQuotes.forEach(quote => {
            if (quote.quote.toLowerCase().includes(searchQuery)) {
                const quoteCard = document.createElement('div');
                quoteCard.className = 'quote-card';
                quoteCard.innerHTML = `
                <p class="quote-text">"${quote.quote}"</p>
                <p class="quote-author">- ${quote.author}</p>
                `;
                quotesContainer.appendChild(quoteCard);
            }
        });
        return;
    }
    currentQuotes.forEach(quote => {
        const quoteCard = document.createElement('div');
        quoteCard.className = 'quote-card';
        quoteCard.innerHTML = `
            <p class="quote-text">"${quote.quote}"</p>
            <p class="quote-author">- ${quote.author}</p>
        `;
        quotesContainer.appendChild(quoteCard);
    });

    updatePagination(quotesData.total);
}

function updatePagination(totalQuotes) {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalQuotes / quotesPerPage);
    const maxVisiblePages = 5; // Maximum number of page buttons to display

    // Previous Button
    const prevBtn = document.createElement('button');
    prevBtn.id = 'prev-btn';
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderQuotes();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    paginationContainer.appendChild(prevBtn);

    // Calculate the range of page numbers to display
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust the start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Page Numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        pageBtn.textContent = i;
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderQuotes();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationContainer.appendChild(pageBtn);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.id = 'next-btn';
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderQuotes();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    paginationContainer.appendChild(nextBtn);
}

// Initial render
renderQuotes();

document.getElementById('filter-search').addEventListener('input', function () {
    const text = this.value.toLowerCase();
    if (text) {
        renderQuotes(text);
    } else {
        renderQuotes();
    }
})