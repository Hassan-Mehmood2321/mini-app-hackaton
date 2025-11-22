// VisualBook - Main Application Logic

// DOM elements
const createPostBtn = document.getElementById('createPostBtn');
const submitPostBtn = document.getElementById('submitPostBtn');
const addStoryBtn = document.getElementById('addStoryBtn');
const submitStoryBtn = document.getElementById('submitStoryBtn');
const postInput = document.getElementById('postInput');
const postsFeed = document.getElementById('postsFeed');
const storiesContainer = document.getElementById('storiesContainer');
const friendsList = document.getElementById('friendsList');
const friendRequests = document.getElementById('friendRequests');
const groupsList = document.getElementById('groupsList');

// Initialize the app
function initApp() {
    loadPosts();
    loadStories();
    loadFriends();
    loadFriendRequests();
    loadGroups();
}

// Load and display posts
function loadPosts() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const posts = getStorageData('visualbook_posts');
    const users = getStorageData('visualbook_users');

    // Sort posts by timestamp (newest first)
    posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (postsFeed) {
        postsFeed.innerHTML = '';

        posts.forEach(post => {
            const user = users.find(u => u.id === post.userId);
            if (!user) return;

            const postElement = createPostElement(post, user, currentUser);
            postsFeed.appendChild(postElement);
        });
    }
}

// Create a post element
function createPostElement(post, user, currentUser) {
    const postDiv = document.createElement('div');
    postDiv.className = 'card mb-4 post';
    postDiv.id = `post-${post.id}`;

    const isLiked = post.likes.includes(currentUser.id);
    const likeIcon = isLiked ? 'fas fa-heart text-danger' : 'far fa-heart';

    postDiv.innerHTML = `
        <div class="post-header">
            <img src="${user.profilePicture || 'images/default-avatar.png'}" class="post-avatar" alt="${user.name}">
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
            </div>
        ` : ''}
    `;

    return postDiv;
}

// Load and display stories
function loadStories() {
    const stories = getActiveStories();
    const users = getStorageData('visualbook_users');

    if (storiesContainer) {
        storiesContainer.innerHTML = '';

        stories.forEach(story => {
            const user = users.find(u => u.id === story.userId);
            if (!user) return;

            const storyElement = document.createElement('div');
            storyElement.className = 'story';
            storyElement.innerHTML = `
                <div class="story-avatar" style="background-image: url('${story.image}')">
                    <img src="${user.profilePicture || 'images/default-avatar.png'}" class="rounded-circle w-100 h-100" alt="${user.name}">
                </div>
                <div class="story-username">${user.name}</div>
            `;

            storiesContainer.appendChild(storyElement);
        });
    }
}

// Load and display friends
function loadFriends() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getStorageData('visualbook_users');

    if (friendsList) {
        friendsList.innerHTML = '';

        currentUser.friends.forEach(friendId => {
            const friend = users.find(u => u.id === friendId);
            if (!friend) return;

            const friendElement = document.createElement('div');
            friendElement.className = 'friend-card';
            friendElement.innerHTML = `
                <img src="${friend.profilePicture || 'images/default-avatar.png'}" class="friend-avatar" alt="${friend.name}">
                <div class="friend-info">
                    <h6 class="mb-0">${friend.name}</h6>
                    <p>${friend.bio || 'No bio yet'}</p>
                </div>
            `;

            friendsList.appendChild(friendElement);
        });
    }
}

// Load and display friend requests
function loadFriendRequests() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getStorageData('visualbook_users');

    if (friendRequests) {
        friendRequests.innerHTML = '';

        currentUser.friendRequests.forEach(requestId => {
            const requester = users.find(u => u.id === requestId);
            if (!requester) return;

            const requestElement = document.createElement('div');
            requestElement.className = 'notification';
            requestElement.innerHTML = `
                <img src="${requester.profilePicture || 'images/default-avatar.png'}" class="notification-avatar" alt="${requester.name}">
                <div class="notification-content">
                    <strong>${requester.name}</strong> sent you a friend request
                </div>
                <div class="notification-actions">
                    <button class="btn btn-success btn-sm accept-request" data-user-id="${requester.id}">Accept</button>
                    <button class="btn btn-danger btn-sm reject-request" data-user-id="${requester.id}">Reject</button>
                </div>
            `;

            friendRequests.appendChild(requestElement);
        });
    }
}

// Load and display groups
function loadGroups() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const groups = getGroupsByUserId(currentUser.id);

    if (groupsList) {
        groupsList.innerHTML = '';

        groups.forEach(group => {
            const groupElement = document.createElement('div');
            groupElement.className = 'group-card';
            groupElement.innerHTML = `
                <div class="group-image">
                    <i class="fas fa-users"></i>
                </div>
                <div class="group-info">
                    <h5>${group.name}</h5>
                    <p class="text-muted">${group.description}</p>
                    <div class="group-members">
                        ${group.members.slice(0, 3).map(memberId => {
                const member = getUserById(memberId);
                return member ? `<img src="${member.profilePicture || 'images/default-avatar.png'}" class="member-avatar" alt="${member.name}">` : '';
            }).join('')}
                        ${group.members.length > 3 ? `<span class="member-count">+${group.members.length - 3} more</span>` : ''}
                    </div>
                </div>
            `;

            groupsList.appendChild(groupElement);
        });
    }
}

// Format date for display
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

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    initApp();

    // Create post button
    if (createPostBtn) {
        createPostBtn.addEventListener('click', function () {
            const postContent = postInput ? postInput.value : '';
            if (postContent.trim()) {
                createPost(postContent);
                if (postInput) postInput.value = '';
            } else {
                // Show modal for detailed post creation
                const modal = new bootstrap.Modal(document.getElementById('createPostModal'));
                modal.show();
            }
        });
    }

    // Submit post from modal
    if (submitPostBtn) {
        submitPostBtn.addEventListener('click', function () {
            const content = document.getElementById('postContent').value;
            const feeling = document.getElementById('postFeeling').value;
            const location = document.getElementById('postLocation').value;
            const imageInput = document.getElementById('postImage');

            createPost(content, feeling, location, imageInput);

            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('createPostModal'));
            modal.hide();
            document.getElementById('postForm').reset();
        });
    }

    // Add story button
    if (addStoryBtn) {
        addStoryBtn.addEventListener('click', function () {
            const modal = new bootstrap.Modal(document.getElementById('addStoryModal'));
            modal.show();
        });
    }

    // Submit story
    if (submitStoryBtn) {
        submitStoryBtn.addEventListener('click', function () {
            const imageInput = document.getElementById('storyImage');

            if (imageInput.files.length > 0) {
                createStory(imageInput);

                // Close modal and reset form
                const modal = bootstrap.Modal.getInstance(document.getElementById('addStoryModal'));
                modal.hide();
                document.getElementById('storyForm').reset();
            } else {
                alert('Please select an image for your story.');
            }
        });
    }

    // Event delegation for post actions
    if (postsFeed) {
        postsFeed.addEventListener('click', function (e) {
            const target = e.target.closest('.like-btn, .comment-btn, .share-btn, .delete-btn');
            if (!target) return;

            const postId = parseInt(target.dataset.postId);

            if (target.classList.contains('like-btn')) {
                toggleLike(postId);
            } else if (target.classList.contains('comment-btn')) {
                addComment(postId);
            } else if (target.classList.contains('share-btn')) {
                sharePost(postId);
            } else if (target.classList.contains('delete-btn')) {
                deletePost(postId);
            }
        });
    }

    // Event delegation for friend requests
    if (friendRequests) {
        friendRequests.addEventListener('click', function (e) {
            const target = e.target.closest('.accept-request, .reject-request');
            if (!target) return;

            const userId = parseInt(target.dataset.userId);

            if (target.classList.contains('accept-request')) {
                acceptFriendRequest(userId);
            } else if (target.classList.contains('reject-request')) {
                rejectFriendRequest(userId);
            }
        });
    }
});

// Create a new post
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

    // Handle image upload if provided
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

// Save post to storage and reload
function savePost(post) {
    const posts = getStorageData('visualbook_posts');
    posts.push(post);
    saveStorageData('visualbook_posts', posts);
    loadPosts();
}

// Create a new story
function createStory(imageInput) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const newStory = {
            id: generateId(),
            userId: currentUser.id,
            image: e.target.result,
            timestamp: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };

        const stories = getStorageData('visualbook_stories');
        stories.push(newStory);
        saveStorageData('visualbook_stories', stories);
        loadStories();
    };

    reader.readAsDataURL(file);
}

// Toggle like on a post
function toggleLike(postId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const posts = getStorageData('visualbook_posts');
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) return;

    const post = posts[postIndex];
    const likeIndex = post.likes.indexOf(currentUser.id);

    if (likeIndex === -1) {
        // Add like
        post.likes.push(currentUser.id);
    } else {
        // Remove like
        post.likes.splice(likeIndex, 1);
    }

    saveStorageData('visualbook_posts', posts);
    loadPosts();
}

// Add comment to a post
function addComment(postId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const comment = prompt('Enter your comment:');
    if (!comment || !comment.trim()) return;

    const posts = getStorageData('visualbook_posts');
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) return;

    posts[postIndex].comments.push({
        userId: currentUser.id,
        content: comment.trim(),
        timestamp: new Date().toISOString()
    });

    saveStorageData('visualbook_posts', posts);
    loadPosts();
}

// Share a post
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

// Delete a post
function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const posts = getStorageData('visualbook_posts');
    const updatedPosts = posts.filter(p => p.id !== postId);

    saveStorageData('visualbook_posts', updatedPosts);
    loadPosts();
}

// Accept friend request
function acceptFriendRequest(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getStorageData('visualbook_users');
    const currentUserIndex = users.findIndex(u => u.id === currentUser.id);
    const requesterIndex = users.findIndex(u => u.id === userId);

    if (currentUserIndex === -1 || requesterIndex === -1) return;

    // Remove from friend requests
    const requestIndex = users[currentUserIndex].friendRequests.indexOf(userId);
    if (requestIndex !== -1) {
        users[currentUserIndex].friendRequests.splice(requestIndex, 1);
    }

    // Add to friends list for both users
    if (!users[currentUserIndex].friends.includes(userId)) {
        users[currentUserIndex].friends.push(userId);
    }

    if (!users[requesterIndex].friends.includes(currentUser.id)) {
        users[requesterIndex].friends.push(currentUser.id);
    }

    saveStorageData('visualbook_users', users);
    setCurrentUser(users[currentUserIndex]);
    loadFriendRequests();
    loadFriends();
}

// Reject friend request
function rejectFriendRequest(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getStorageData('visualbook_users');
    const currentUserIndex = users.findIndex(u => u.id === currentUser.id);

    if (currentUserIndex === -1) return;

    // Remove from friend requests
    const requestIndex = users[currentUserIndex].friendRequests.indexOf(userId);
    if (requestIndex !== -1) {
        users[currentUserIndex].friendRequests.splice(requestIndex, 1);
    }

    saveStorageData('visualbook_users', users);
    setCurrentUser(users[currentUserIndex]);
    loadFriendRequests();
}