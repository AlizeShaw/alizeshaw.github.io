document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const blogPosts = document.getElementById('blog-posts');
    let posts = [];

    fetch('/search.json')
        .then(response => response.json())
        .then(data => {
            posts = data;
        });

    searchIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        searchInput.classList.toggle('active');
        searchInput.focus();
    });

    document.addEventListener('click', function(event) {
        if (event.target !== searchInput && event.target !== searchIcon) {
            searchInput.classList.remove('active');
        }
    });

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        searchResults.innerHTML = '';

        if (query.length === 0) {
            blogPosts.style.display = 'block';
            searchResults.style.display = 'none';
            return;
        }

        blogPosts.style.display = 'none';
        searchResults.style.display = 'block';

        const results = posts.filter(post => {
            return post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query);
        });

        results.forEach(result => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${result.url}" class="blog-post-link text-gray-300-dark text-gray-700">
                                <h3 class="text-xl font-semibold transition-colors duration-100 text-white-dark text-gray-800">${result.title}</h3>
                                <p class="text-sm text-gray-500-dark text-gray-500">${result.date}</p>
                            </a>`;
            searchResults.appendChild(li);
        });
    });
});
