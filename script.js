// Initialize Quill editor
const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
        ]
    },
    placeholder: 'Write your post here...'
});

// DOM Elements
const postsSection = document.getElementById('posts-section');
const newPostSection = document.getElementById('new-post-section');
const aboutSection = document.getElementById('about-section');
const postsContainer = document.getElementById('posts-container');
const postForm = document.getElementById('post-form');
const postTitle = document.getElementById('post-title');
const postId = document.getElementById('post-id');
const homeLink = document.getElementById('home-link');
const newPostLink = document.getElementById('new-post-link');
const aboutLink = document.getElementById('about-link');
const cancelPost = document.getElementById('cancel-post');

// Sample posts data (in a real app, this would come from a database)
let posts = [
    {
        id: 1,
        title: "First Week at Moringa School",
        content: "<p>I just completed my first week at Moringa School and it's been an incredible experience so far!</p><p>We covered the basics of HTML and CSS, and I've already built my first webpage.</p><p><strong>Key learnings:</strong></p><ul><li>HTML structure</li><li>CSS styling</li><li>Git basics</li></ul><p>Looking forward to next week!</p>",
        date: "2023-05-15"
    },
    {
        id: 2,
        title: "JavaScript Fundamentals",
        content: "<p>This week we dove into JavaScript fundamentals. It's challenging but exciting!</p><p>We learned about variables, functions, loops, and DOM manipulation.</p><p>Here's a code snippet from one of our exercises:</p><pre><code>function greet(name) {\n  return `Hello, ${name}!`;\n}</code></pre><p>I'm starting to see how all these pieces fit together to create interactive websites.</p>",
        date: "2023-05-22"
    }
];

// Display current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Navigation functions
function showSection(section) {
    postsSection.style.display = 'none';
    newPostSection.style.display = 'none';
    aboutSection.style.display = 'none';
    
    section.style.display = 'block';
}

homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(postsSection);
    loadPosts();
});

newPostLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(newPostSection);
    postForm.reset();
    quill.setContents([]);
    postId.value = '';
});

aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(aboutSection);
});

cancelPost.addEventListener('click', () => {
    showSection(postsSection);
});

// Load and display posts
function loadPosts() {
    postsContainer.innerHTML = '';
    
    if (posts.length === 0) {
        postsContainer.innerHTML = '<p>No posts yet. Create your first post!</p>';
        return;
    }
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h3 class="post-title">${post.title}</h3>
            <p class="post-date">Posted on ${formatDate(post.date)}</p>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <button class="btn btn-edit" data-id="${post.id}">Edit</button>
                <button class="btn btn-delete" data-id="${post.id}">Delete</button>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', editPost);
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', deletePost);
    });
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Edit post
function editPost(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const post = posts.find(p => p.id === id);
    
    if (post) {
        showSection(newPostSection);
        postTitle.value = post.title;
        quill.setContents(quill.clipboard.convert(post.content));
        postId.value = post.id;
    }
}

// Delete post
function deletePost(e) {
    if (confirm('Are you sure you want to delete this post?')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        posts = posts.filter(p => p.id !== id);
        loadPosts();
    }
}

// Save post (create or update)
postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = postTitle.value.trim();
    const content = quill.root.innerHTML;
    const id = postId.value ? parseInt(postId.value) : null;
    const now = new Date().toISOString().split('T')[0];
    
    if (!title || !content) {
        alert('Please fill in all fields');
        return;
    }
    
    if (id) {
        // Update existing post
        const index = posts.findIndex(p => p.id === id);
        if (index !== -1) {
            posts[index] = {
                id,
                title,
                content,
                date: now
            };
        }
    } else {
        // Create new post
        const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
        posts.push({
            id: newId,
            title,
            content,
            date: now
        });
    }
    
    // Reset form and show posts
    postForm.reset();
    quill.setContents([]);
    showSection(postsSection);
    loadPosts();
});

// Initialize the app
showSection(postsSection);
loadPosts();