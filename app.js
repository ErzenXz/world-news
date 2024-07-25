const apiUrl = 'https://test.erzen.tk/article/all';
let currentStart = 0;
const pageSize = 15;

document.addEventListener('DOMContentLoaded', () => {
    loadArticles(currentStart, pageSize);

    document.getElementById('prev-button').addEventListener('click', () => {
        if (currentStart > 0) {
            currentStart -= pageSize;
            loadArticles(currentStart, pageSize);
        }
    });

    document.getElementById('next-button').addEventListener('click', () => {
        currentStart += pageSize;
        loadArticles(currentStart, pageSize);
    });
});

async function loadArticles(start, limit) {
    try {
        const response = await fetch(`${apiUrl}?range=[${start},${start + limit - 1}]`);
        let data = await response.json();
        data = data.articles;

        console.log(data);

        // Check for nested structures
        let articles = [];

        if (data.value) {
            articles = data.value.value ? data.value.value.articles || [] : data.value.articles || [];
        } else if (data.Value) {
            articles = data.Value.value ? data.Value.value.articles || [] : data.Value.articles || [];
        }

        displayArticles(articles);

        // Disable/Enable buttons based on the current start index
        document.getElementById('prev-button').disabled = start === 0;
        document.getElementById('next-button').disabled = articles.length < pageSize;
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

function displayArticles(articles) {
    const container = document.getElementById('articles-container');
    container.innerHTML = '';

    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'article';

        let title = new String(article.title);
        let description = new String(article.description);

        // Only display the first 50 characters of the description
        if (description.length > 150) {
            description = description.substring(0, 150) + '...';
        }

        if (title.length > 50) {
            title = title.substring(0, 50) + '...';
        }

        articleElement.innerHTML = `
            <img src="${article.imageUrl}" alt="${article.title}">
            <h2 title="${article.title}">${title}</h2>
            <p>${description}</p>
        `;

        articleElement.addEventListener('click', () => {
            window.open(article.url, '_blank');
        });

        container.appendChild(articleElement);
    });

}
