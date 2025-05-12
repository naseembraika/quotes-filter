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

// Helper function to create and append a quote card
function createQuoteCard(quote, container) {
    const quoteCard = document.createElement('div');
    quoteCard.className = 'quote-card';
    quoteCard.innerHTML = `
        <p class="quote-text">🙶${quote.quote}🙷</p>
        <p class="quote-author">- ${quote.author}</p>
    `;
    container.appendChild(quoteCard);
}

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
                createQuoteCard(quote, quotesContainer);
            }
        });
        return;
    }

    currentQuotes.forEach(quote => {
        createQuoteCard(quote, quotesContainer);
    });

    updatePagination(quotesData.total);
}

function updatePagination(totalQuotes) {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalQuotes / quotesPerPage);
    const maxVisiblePages = 5; // Maximum number of visible page buttons

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

    // Page Numbers with Ellipses
    if (totalPages <= maxVisiblePages) {
        // Show all pages if total pages are less than or equal to maxVisiblePages
        for (let i = 1; i <= totalPages; i++) {
            createPageButton(i, paginationContainer);
        }
    } else {
        // Show first page
        createPageButton(1, paginationContainer);

        if (currentPage > 3) {
            // Add ellipsis if current page is beyond the first few pages
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'ellipsis';
            paginationContainer.appendChild(ellipsis);
        }

        // Calculate the range of pages to display around the current page
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            createPageButton(i, paginationContainer);
        }

        if (currentPage < totalPages - 2) {
            // Add ellipsis if current page is far from the last few pages
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'ellipsis';
            paginationContainer.appendChild(ellipsis);
        }

        // Show last page
        createPageButton(totalPages, paginationContainer);
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

// Helper function to create a page button
function createPageButton(pageNumber, container) {
    const pageBtn = document.createElement('button');
    pageBtn.className = 'page-btn';
    pageBtn.textContent = pageNumber;
    if (pageNumber === currentPage) {
        pageBtn.classList.add('active');
    }
    pageBtn.addEventListener('click', () => {
        currentPage = pageNumber;
        renderQuotes();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    container.appendChild(pageBtn);
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