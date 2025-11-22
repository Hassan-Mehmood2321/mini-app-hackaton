const createPostBtn = document.getElementById('createPostBtn');
const submitPostBtn = document.getElementById('submitPostBtn');
const postInput = document.getElementById('postInput');
const postsList = document.getElementById('postsList');
const postFilter = document.querySelectorAll('[data-filter]');
function initPosts() {
    loadPosts('all');
    setupEventListeners();
}
function loadPosts(filter = 'all') {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    let posts = getStorageData('visualbook_posts');
    const users = getStorageData('visualbook_users');
    if (filter === 'friends') {
        posts = posts.filter(post =>
            currentUser.friends.includes(post.userId) || post.userId === currentUser.id
        );
    } else if (filter === 'my') {
        posts = posts.filter(post => post.userId === currentUser.id);
    }
    posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (postsList) {
        postsList.innerHTML = '';

        if (posts.length === 0) {
            postsList.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                    <h5>No posts found</h5>
                    <p class="text-muted">${filter === 'my' ? 'You haven\'t created any posts yet.' : 'No posts match your current filter.'}</p>
                </div>
            `;
            return;
        }

        posts.forEach(post => {
            const user = users.find(u => u.id === post.userId);
            if (!user) return;

            const postElement = createPostElement(post, user, currentUser);
            postsList.appendChild(postElement);
        });
    }
}
function createPostElement(post, user, currentUser) {
    const postDiv = document.createElement('div');
    postDiv.className = 'card mb-4 post';
    postDiv.id = `post-${post.id}`;

    const isLiked = post.likes.includes(currentUser.id);
    const likeIcon = isLiked ? 'fas fa-heart text-danger' : 'far fa-heart';

    postDiv.innerHTML = `
        <div class="post-header">
            <img src="${user.profilePicture || 'assets/images/my pic.jpeg'}" class="post-avatar" alt="${user.name}">
            <div class="post-user-info">
                <h6 class="mb-0">${user.name}</h6>
                <div class="post-meta">
                    ${post.feeling ? `<span><i class="fas fa-smile"></i> Feeling ${post.feeling}</span> • ` : ''}
                    ${post.location ? `<span><i class="fas fa-map-marker-alt"></i> ${post.location}</span> • ` : ''}
                    <span>${formatDate(post.timestamp)}</span>
                </div>
            </div>
        </div>
        <div class="post-content">
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : ''}
        </div>
        <div class="post-actions">
            <div class="post-action like-btn" data-post-id="${post.id}">
                <i class="${likeIcon}"></i>
                <span>Like</span>
                ${post.likes.length > 0 ? `<span class="ms-1">(${post.likes.length})</span>` : ''}
            </div>
            <div class="post-action comment-btn" data-post-id="${post.id}">
                <i class="far fa-comment"></i>
                <span>Comment</span>
                ${post.comments.length > 0 ? `<span class="ms-1">(${post.comments.length})</span>` : ''}
            </div>
            <div class="post-action share-btn" data-post-id="${post.id}">
                <i class="far fa-share-square"></i>
                <span>Share</span>
                ${post.shares > 0 ? `<span class="ms-1">(${post.shares})</span>` : ''}
            </div>
            ${post.userId === currentUser.id ? `
                <div class="post-action delete-btn" data-post-id="${post.id}">
                    <i class="fas fa-trash"></i>
                    <span>Delete</span>
                </div>
            ` : ''}
        </div>
        ${post.comments.length > 0 ? `
            <div class="post-comments p-3 border-top">
                ${post.comments.map(comment => {
        const commentUser = getUserById(comment.userId);
        return `
                        <div class="comment mb-2">
                            <strong>${commentUser.name}</strong>
                            <span class="ms-2">${comment.content}</span>
                            <div class="text-muted small">${formatDate(comment.timestamp)}</div>
                        </div>
                    `;
    }).join('')}
                <div class="add-comment mt-2">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Write a comment..." id="comment-input-${post.id}">
                        <button class="btn btn-primary post-comment-btn" data-post-id="${post.id}">Post</button>
                    </div>
                </div>
            </div>
        ` : `
            <div class="post-comments p-3 border-top">
                <div class="add-comment">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Write a comment..." id="comment-input-${post.id}">
                        <button class="btn btn-primary post-comment-btn" data-post-id="${post.id}">Post</button>
                    </div>
                </div>
            </div>
        `}
    `;

    return postDiv;
}
function setupEventListeners() {
    if (createPostBtn) {
        createPostBtn.addEventListener('click', function () {
            const postContent = postInput ? postInput.value : '';
            if (postContent.trim()) {
                createPost(postContent);
                if (postInput) postInput.value = '';
            } else {
                const modal = new bootstrap.Modal(document.getElementById('createPostModal'));
                modal.show();
            }
        });
    }
    if (submitPostBtn) {
        submitPostBtn.addEventListener('click', function () {
            const content = document.getElementById('postContent').value;
            const feeling = document.getElementById('postFeeling').value;
            const location = document.getElementById('postLocation').value;
            const imageInput = document.getElementById('postImage');

            createPost(content, feeling, location, imageInput);
            const modal = bootstrap.Modal.getInstance(document.getElementById('createPostModal'));
            modal.hide();
            document.getElementById('postForm').reset();
        });
    }
    if (postFilter.length > 0) {
        postFilter.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                const filter = this.getAttribute('data-filter');
                loadPosts(filter);
                const dropdownToggle = document.querySelector('.dropdown-toggle');
                if (dropdownToggle) {
                    dropdownToggle.textContent = this.textContent;
                }
            });
        });
    }
    if (postsList) {
        postsList.addEventListener('click', function (e) {
            const target = e.target.closest('.like-btn, .comment-btn, .share-btn, .delete-btn, .post-comment-btn');
            if (!target) return;

            const postId = parseInt(target.dataset.postId);

            if (target.classList.contains('like-btn')) {
                toggleLike(postId);
            } else if (target.classList.contains('comment-btn')) {
                const commentInput = document.getElementById(`comment-input-${postId}`);
                if (commentInput) {
                    commentInput.focus();
                }
            } else if (target.classList.contains('share-btn')) {
                sharePost(postId);
            } else if (target.classList.contains('delete-btn')) {
                deletePost(postId);
            } else if (target.classList.contains('post-comment-btn')) {
                const commentInput = document.getElementById(`comment-input-${postId}`);
                if (commentInput && commentInput.value.trim()) {
                    addComment(postId, commentInput.value.trim());
                    commentInput.value = '';
                }
            }
        });
    }
    if (postsList) {
        postsList.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && e.target.type === 'text' && e.target.id.startsWith('comment-input-')) {
                const postId = parseInt(e.target.id.split('-')[2]);
                if (e.target.value.trim()) {
                    addComment(postId, e.target.value.trim());
                    e.target.value = '';
                }
            }
        });
    }
}
function createPost(content, feeling = '', location = '', imageInput = null) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const newPost = {
        id: generateId(),
        userId: currentUser.id,
        content,
        feeling,
        location,
        image: null,
        likes: [],
        comments: [],
        shares: 0,
        timestamp: new Date().toISOString()
    };
    if (imageInput && imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            newPost.image = e.target.result;
            savePost(newPost);
        };

        reader.readAsDataURL(file);
    } else {
        savePost(newPost);
    }
}
function savePost(post) {
    const posts = getStorageData('visualbook_posts');
    posts.push(post);
    saveStorageData('visualbook_posts', posts);
    loadPosts();
}

function toggleLike(postId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const posts = getStorageData('visualbook_posts');
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) return;

    const post = posts[postIndex];
    const likeIndex = post.likes.indexOf(currentUser.id);

    if (likeIndex === -1) {
        post.likes.push(currentUser.id);
    } else {

        post.likes.splice(likeIndex, 1);
    }

    saveStorageData('visualbook_posts', posts);
    loadPosts();
}


function addComment(postId, commentContent) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const posts = getStorageData('visualbook_posts');
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) return;

    posts[postIndex].comments.push({
        userId: currentUser.id,
        content: commentContent,
        timestamp: new Date().toISOString()
    });

    saveStorageData('visualbook_posts', posts);
    loadPosts();
}


function sharePost(postId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const posts = getStorageData('visualbook_posts');
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) return;

    posts[postIndex].shares += 1;
    saveStorageData('visualbook_posts', posts);
    loadPosts();

    alert('Post shared successfully!');
}


function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const posts = getStorageData('visualbook_posts');
    const updatedPosts = posts.filter(p => p.id !== postId);

    saveStorageData('visualbook_posts', updatedPosts);
    loadPosts();
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
}


document.addEventListener('DOMContentLoaded', function () {
    initPosts();
});