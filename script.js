// Sample blog data
let blogs = [
    {
        id: 1,
        title: "My First Day",
        category: "daily-life",
        date: new Date("2026-01-10"),
        preview: "Today was an amazing day filled with new experiences and learning...",
        content: "Today was an amazing day filled with new experiences and learning. I woke up early and decided to start journaling my thoughts. This blog will be my digital journal where I share my daily adventures, updates, and random thoughts that come to mind."
    },
    {
        id: 2,
        title: "New Year Updates",
        category: "updates",
        date: new Date("2026-01-08"),
        preview: "Happy New Year everyone! Here's what's coming up this year...",
        content: "Happy New Year everyone! Here's what's coming up this year. I have so many exciting plans and goals I want to achieve. I'll be sharing my progress and updates regularly through this blog."
    },
    {
        id: 3,
        title: "On Happiness",
        category: "thoughts",
        date: new Date("2026-01-05"),
        preview: "I've been thinking a lot about what makes people truly happy...",
        content: "I've been thinking a lot about what makes people truly happy. Is it success, relationships, or something deeper? I believe happiness is found in the small moments, the quiet mornings, and the connections we make with others."
    },
    {
        id: 4,
        title: "Coffee Shop Adventures",
        category: "daily-life",
        date: new Date("2026-01-03"),
        preview: "Discovered a cozy new coffee shop today...",
        content: "Discovered a cozy new coffee shop today. The atmosphere was perfect for reading and writing. I spent three hours there just enjoying the ambiance and getting some work done. Sometimes the best moments are the simplest ones."
    }
];

// DOM Elements
const catalogBtn = document.getElementById('catalog-btn');
const uploadBtn = document.getElementById('upload-btn');
const catalogArea = document.getElementById('catalog-area');
const authModal = document.getElementById('auth-modal');
const writingModal = document.getElementById('writing-modal');
const blogsGrid = document.getElementById('blogs-grid');
const blogDetail = document.getElementById('blog-detail');
const blogContent = document.getElementById('blog-content');
const backBtn = document.getElementById('back-btn');
const searchInput = document.getElementById('search-input');
const categoryBtns = document.querySelectorAll('.category-btn');
const blogForm = document.getElementById('blog-form');

let currentFilter = 'all';
let currentSearch = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayBlogs();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Catalog toggle
    catalogBtn.addEventListener('click', () => {
        catalogArea.classList.toggle('active');
    });

    // Upload button
    uploadBtn.addEventListener('click', () => {
        authModal.classList.remove('hidden');
    });

    // Modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            authModal.classList.add('hidden');
            writingModal.classList.add('hidden');
        });
    });

    // Auth modal buttons
    document.getElementById('yes-btn').addEventListener('click', () => {
        authModal.classList.add('hidden');
        writingModal.classList.remove('hidden');
    });

    document.getElementById('no-btn').addEventListener('click', () => {
        authModal.classList.add('hidden');
    });

    // Close modals when clicking outside
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.add('hidden');
        }
    });

    writingModal.addEventListener('click', (e) => {
        if (e.target === writingModal) {
            writingModal.classList.add('hidden');
        }
    });

    // Category filters
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            displayBlogs();
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        displayBlogs();
    });

    // Back button
    backBtn.addEventListener('click', () => {
        blogDetail.classList.add('hidden');
        blogsGrid.classList.remove('hidden');
    });

    // Blog form submit
    blogForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('blog-title').value;
        const category = document.getElementById('blog-category').value;
        const content = document.getElementById('blog-content-input').value;

        const newBlog = {
            id: blogs.length + 1,
            title,
            category,
            date: new Date(),
            preview: content.substring(0, 100) + '...',
            content
        };

        blogs.unshift(newBlog);
        displayBlogs();

        // Reset form and close modal
        blogForm.reset();
        writingModal.classList.add('hidden');
    });
}

// Display blogs
function displayBlogs() {
    const filteredBlogs = blogs.filter(blog => {
        const matchesCategory = currentFilter === 'all' || blog.category === currentFilter;
        const matchesSearch = blog.title.toLowerCase().includes(currentSearch) ||
                            blog.preview.toLowerCase().includes(currentSearch);
        return matchesCategory && matchesSearch;
    });

    // Sort by date (newest first)
    filteredBlogs.sort((a, b) => b.date - a.date);

    blogsGrid.innerHTML = filteredBlogs.map(blog => `
        <div class="blog-card" data-id="${blog.id}">
            <div class="blog-category">${formatCategory(blog.category)}</div>
            <h3>${blog.title}</h3>
            <p class="blog-date">${formatDate(blog.date)}</p>
            <p class="blog-preview">${blog.preview}</p>
            <button class="read-more" onclick="showBlogDetail(${blog.id})">Read More</button>
        </div>
    `).join('');
}

// Show blog detail
function showBlogDetail(id) {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    blogContent.innerHTML = `
        <div class="blog-category">${formatCategory(blog.category)}</div>
        <h1>${blog.title}</h1>
        <p class="blog-date">${formatDate(blog.date)}</p>
        <div class="blog-full-content">${blog.content}</div>
    `;

    blogsGrid.classList.add('hidden');
    blogDetail.classList.remove('hidden');
}

// Format category
function formatCategory(category) {
    return category.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Format date
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
