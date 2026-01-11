// Admin credentials for Nene
const ADMIN_CREDENTIALS = {
    username: 'Nene',
    password: 'NeneBlog2026!'
};

// Sample blog data
const defaultBlogs = [
    {
        id: 1,
        title: "My First Day",
        category: "daily-life",
        date: new Date("2026-01-10"),
        preview: "Today was an amazing day filled with new experiences and learning...",
        content: "Today was an amazing day filled with new experiences and learning. I woke up early and decided to start journaling my thoughts. This blog will be my digital journal where I share my daily adventures, updates, and random thoughts that come to mind.",
        image: null
    },
    {
        id: 2,
        title: "New Year Updates",
        category: "updates",
        date: new Date("2026-01-08"),
        preview: "Happy New Year everyone! Here's what's coming up this year...",
        content: "Happy New Year everyone! Here's what's coming up this year. I have so many exciting plans and goals I want to achieve. I'll be sharing my progress and updates regularly through this blog.",
        image: null
    },
    {
        id: 3,
        title: "On Happiness",
        category: "thoughts",
        date: new Date("2026-01-05"),
        preview: "I've been thinking a lot about what makes people truly happy...",
        content: "I've been thinking a lot about what makes people truly happy. Is it success, relationships, or something deeper? I believe happiness is found in the small moments, the quiet mornings, and the connections we make with others.",
        image: null
    },
    {
        id: 4,
        title: "Coffee Shop Adventures",
        category: "daily-life",
        date: new Date("2026-01-03"),
        preview: "Discovered a cozy new coffee shop today...",
        content: "Discovered a cozy new coffee shop today. The atmosphere was perfect for reading and writing. I spent three hours there just enjoying the ambiance and getting some work done. Sometimes the best moments are the simplest ones.",
        image: null
    }
];

// Initialize blogs from localStorage or use defaults
let blogs = JSON.parse(localStorage.getItem('blogs')) || defaultBlogs;

// User data
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// DOM Elements
const catalogBtn = document.getElementById('catalog-btn');
const uploadBtn = document.getElementById('upload-btn');
const userAccountBtn = document.getElementById('user-account-btn');
const favoritesBtn = document.getElementById('favorites-btn');
const catalogArea = document.getElementById('catalog-area');
const authModal = document.getElementById('auth-modal');
const writingModal = document.getElementById('writing-modal');
const userModal = document.getElementById('user-modal');
const favoritesModal = document.getElementById('favorites-modal');
const blogsGrid = document.getElementById('blogs-grid');
const blogDetail = document.getElementById('blog-detail');
const blogContent = document.getElementById('blog-content');
const backBtn = document.getElementById('back-btn');
const searchInput = document.getElementById('search-input');
const categoryBtns = document.querySelectorAll('.category-btn');
const blogForm = document.getElementById('blog-form');
const adminLoginForm = document.getElementById('admin-login-form');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

let currentFilter = 'all';
let currentSearch = '';
let currentImageData = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayBlogs();
    setupEventListeners();
    updateUserAccountDisplay();
});

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('blogs', JSON.stringify(blogs));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Setup Event Listeners
function setupEventListeners() {
    // Catalog toggle
    catalogBtn.addEventListener('click', () => {
        catalogArea.classList.toggle('active');
    });

    // Upload button (Admin only)
    uploadBtn.addEventListener('click', () => {
        authModal.classList.remove('hidden');
    });

    // User account button
    userAccountBtn.addEventListener('click', () => {
        userModal.classList.remove('hidden');
        updateUserAccountDisplay();
    });

    // Favorites button
    favoritesBtn.addEventListener('click', () => {
        if (!currentUser) {
            alert('Please login to view your favorites!');
            userModal.classList.remove('hidden');
            return;
        }
        displayFavorites();
        favoritesModal.classList.remove('hidden');
    });

    // Modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            authModal.classList.add('hidden');
            writingModal.classList.add('hidden');
            userModal.classList.add('hidden');
            favoritesModal.classList.add('hidden');
        });
    });

    // Admin login form
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            authModal.classList.add('hidden');
            writingModal.classList.remove('hidden');
            adminLoginForm.reset();
        } else {
            alert('Invalid admin credentials!');
        }
    });

    // Cancel admin button
    document.getElementById('cancel-admin-btn').addEventListener('click', () => {
        authModal.classList.add('hidden');
        adminLoginForm.reset();
    });

    // User login/signup toggle
    document.getElementById('show-signup').addEventListener('click', () => {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('signup-section').classList.remove('hidden');
    });

    document.getElementById('show-login').addEventListener('click', () => {
        document.getElementById('signup-section').classList.add('hidden');
        document.getElementById('login-section').classList.remove('hidden');
    });

    // Login form
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = user;
            saveToLocalStorage();
            updateUserAccountDisplay();
            loginForm.reset();
            alert('Login successful!');
        } else {
            alert('Invalid username or password!');
        }
    });

    // Signup form
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-password-confirm').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (users.find(u => u.username === username)) {
            alert('Username already exists!');
            return;
        }

        const newUser = {
            username,
            password,
            favorites: []
        };

        users.push(newUser);
        currentUser = newUser;
        saveToLocalStorage();
        updateUserAccountDisplay();
        signupForm.reset();
        alert('Account created successfully!');
    });

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
        currentUser = null;
        saveToLocalStorage();
        updateUserAccountDisplay();
        userModal.classList.add('hidden');
        displayBlogs();
    });

    // Close modals when clicking outside
    [authModal, writingModal, userModal, favoritesModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
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

    // Image upload handling
    const blogImageInput = document.getElementById('blog-image');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const removeImageBtn = document.getElementById('remove-image-btn');

    blogImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentImageData = e.target.result;
                previewImg.src = currentImageData;
                imagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    removeImageBtn.addEventListener('click', () => {
        currentImageData = null;
        blogImageInput.value = '';
        imagePreview.classList.add('hidden');
        previewImg.src = '';
    });

    // Blog form submit
    blogForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('blog-title').value;
        const category = document.getElementById('blog-category').value;
        const content = document.getElementById('blog-content-input').value;

        const newBlog = {
            id: Date.now(),
            title,
            category,
            date: new Date(),
            preview: content.substring(0, 100) + '...',
            content,
            image: currentImageData
        };

        blogs.unshift(newBlog);
        saveToLocalStorage();
        displayBlogs();

        // Reset form and close modal
        blogForm.reset();
        currentImageData = null;
        imagePreview.classList.add('hidden');
        previewImg.src = '';
        writingModal.classList.add('hidden');
    });
}

// Update user account display
function updateUserAccountDisplay() {
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    const accountSection = document.getElementById('account-section');

    if (currentUser) {
        loginSection.classList.add('hidden');
        signupSection.classList.add('hidden');
        accountSection.classList.remove('hidden');
        document.getElementById('logged-username').textContent = currentUser.username;
        document.getElementById('favorites-count').textContent = currentUser.favorites.length;
    } else {
        loginSection.classList.remove('hidden');
        signupSection.classList.add('hidden');
        accountSection.classList.add('hidden');
    }
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
    filteredBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    blogsGrid.innerHTML = filteredBlogs.map(blog => {
        const isFavorited = currentUser && currentUser.favorites.includes(blog.id);
        return `
            <div class="blog-card" data-id="${blog.id}">
                ${currentUser ? `
                <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" onclick="toggleFavorite(${blog.id}); event.stopPropagation();">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="${isFavorited ? '#ffc7e7' : 'none'}" stroke="#ffc7e7" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </button>
                ` : ''}
                ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="blog-image">` : ''}
                <div class="blog-category">${formatCategory(blog.category)}</div>
                <h3>${blog.title}</h3>
                <p class="blog-date">${formatDate(blog.date)}</p>
                <p class="blog-preview">${blog.preview}</p>
                <button class="read-more" onclick="showBlogDetail(${blog.id})">Read More</button>
            </div>
        `;
    }).join('');
}

// Toggle favorite
function toggleFavorite(blogId) {
    if (!currentUser) {
        alert('Please login to add favorites!');
        return;
    }

    const index = currentUser.favorites.indexOf(blogId);
    if (index > -1) {
        currentUser.favorites.splice(index, 1);
    } else {
        currentUser.favorites.push(blogId);
    }

    // Update the user in the users array
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex > -1) {
        users[userIndex] = currentUser;
    }

    saveToLocalStorage();
    displayBlogs();
    updateUserAccountDisplay();
}

// Display favorites
function displayFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    const favoriteBlogs = blogs.filter(blog => currentUser.favorites.includes(blog.id));

    if (favoriteBlogs.length === 0) {
        favoritesGrid.innerHTML = '';
        return;
    }

    favoritesGrid.innerHTML = favoriteBlogs.map(blog => `
        <div class="blog-card" data-id="${blog.id}">
            <button class="favorite-btn favorited" onclick="toggleFavorite(${blog.id}); displayFavorites(); event.stopPropagation();">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffc7e7" stroke="#ffc7e7" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            </button>
            ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="blog-image">` : ''}
            <div class="blog-category">${formatCategory(blog.category)}</div>
            <h3>${blog.title}</h3>
            <p class="blog-date">${formatDate(blog.date)}</p>
            <p class="blog-preview">${blog.preview}</p>
            <button class="read-more" onclick="showBlogDetail(${blog.id}); document.getElementById('favorites-modal').classList.add('hidden');">Read More</button>
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
        ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="blog-image">` : ''}
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
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
