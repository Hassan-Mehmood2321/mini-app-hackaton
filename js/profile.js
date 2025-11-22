const editProfileBtn = document.getElementById('editProfileBtn');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const createGroupBtn = document.getElementById('createGroupBtn');
const saveGroupBtn = document.getElementById('saveGroupBtn');
const profilePosts = document.getElementById('profilePosts');
const profileFriends = document.getElementById('profileFriends');
const profileGroups = document.getElementById('profileGroups');
function initProfile() {
    loadProfileData();
    loadProfilePosts();
    loadProfileFriends();
    loadProfileGroups();
}
function loadProfileData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileLocation = document.getElementById('profileLocation');
    const profileBio = document.getElementById('profileBio');

    if (profileAvatar) profileAvatar.src = currentUser.profilePicture || 'images/default-avatar.png';
    if (profileName) profileName.textContent = currentUser.name;
    if (profileLocation) profileLocation.textContent = currentUser.location || 'No location set';
    if (profileBio) profileBio.textContent = currentUser.bio || 'No bio yet';
    const postsCount = document.getElementById('postsCount');
    const friendsCount = document.getElementById('friendsCount');
    const groupsCount = document.getElementById('groupsCount');
    if (postsCount) postsCount.textContent = getPostsByUserId(currentUser.id).length;
    if (friendsCount) friendsCount.textContent = currentUser.friends.length;
    if (groupsCount) groupsCount.textContent = getGroupsByUserId(currentUser.id).length;
}
function loadProfilePosts() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    const posts = getPostsByUserId(currentUser.id);
    const users = getStorageData('visualbook_users');
    posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (profilePosts) {
        profilePosts.innerHTML = '';
        if (posts.length === 0) {
            profilePosts.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                    <h5>No posts yet</h5>
                    <p class="text-muted">Share your thoughts with the world!</p>
                </div>
            `;
            return;
        }

        posts.forEach(post => {
            const user = users.find(u => u.id === post.userId);
            if (!user) return;

            const postElement = createProfilePostElement(post, user, currentUser);
            profilePosts.appendChild(postElement);
        });
    }
}

// Create a profile post element
function createProfilePostElement(post, user, currentUser) {
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
            <div class="post-action delete-btn" data-post-id="${post.id}">
                <i class="fas fa-trash"></i>
                <span>Delete</span>
            </div>
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

// Load and display profile friends
function loadProfileFriends() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getStorageData('visualbook_users');

    if (profileFriends) {
        profileFriends.innerHTML = '';

        if (currentUser.friends.length === 0) {
            profileFriends.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <h5>No friends yet</h5>
                    <p class="text-muted">Connect with people to see them here!</p>
                </div>
            `;
            return;
        }

        currentUser.friends.forEach(friendId => {
            const friend = users.find(u => u.id === friendId);
            if (!friend) return;

            const friendElement = document.createElement('div');
            friendElement.className = 'col-md-6 col-lg-4 mb-4';
            friendElement.innerHTML = `
                <div class="friend-card">
                    <img src="${friend.profilePicture || 'images/default-avatar.png'}" class="friend-avatar" alt="${friend.name}">
                    <div class="friend-info">
                        <h6 class="mb-0">${friend.name}</h6>
                        <p>${friend.bio || 'No bio yet'}</p>
                        <button class="btn btn-outline-primary btn-sm view-profile-btn" data-user-id="${friend.id}">View Profile</button>
                    </div>
                </div>
            `;

            profileFriends.appendChild(friendElement);
        });
    }
}

// Load and display profile groups
function loadProfileGroups() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const groups = getGroupsByUserId(currentUser.id);

    if (profileGroups) {
        profileGroups.innerHTML = '';

        if (groups.length === 0) {
            profileGroups.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <h5>No groups yet</h5>
                    <p class="text-muted">Join or create groups to see them here!</p>
                </div>
            `;
            return;
        }

        groups.forEach(group => {
            const groupElement = document.createElement('div');
            groupElement.className = 'col-md-6 col-lg-4 mb-4';
            groupElement.innerHTML = `
                <div class="group-card">
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
                        <div class="mt-3">
                            <button class="btn btn-outline-primary btn-sm leave-group-btn" data-group-id="${group.id}">Leave Group</button>
                        </div>
                    </div>
                </div>
            `;

            profileGroups.appendChild(groupElement);
        });
    }
}

// Edit profile
function editProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    // Populate edit form with current data
    const editName = document.getElementById('editName');
    const editBio = document.getElementById('editBio');
    const editLocation = document.getElementById('editLocation');
    const editProfileAvatar = document.getElementById('editProfileAvatar');

    if (editName) editName.value = currentUser.name;
    if (editBio) editBio.value = currentUser.bio || '';
    if (editLocation) editLocation.value = currentUser.location || '';
    if (editProfileAvatar) editProfileAvatar.src = currentUser.profilePicture || 'images/default-avatar.png';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    modal.show();
}

// Save profile changes
function saveProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const editName = document.getElementById('editName');
    const editBio = document.getElementById('editBio');
    const editLocation = document.getElementById('editLocation');
    const profilePictureInput = document.getElementById('profilePictureInput');

    const updatedUser = {
        ...currentUser,
        name: editName.value,
        bio: editBio.value,
        location: editLocation.value
    };

    // Handle profile picture update if provided
    if (profilePictureInput && profilePictureInput.files.length > 0) {
        const file = profilePictureInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            updatedUser.profilePicture = e.target.result;
            completeProfileUpdate(updatedUser);
        };

        reader.readAsDataURL(file);
    } else {
        completeProfileUpdate(updatedUser);
    }
}

// Complete profile update
function completeProfileUpdate(updatedUser) {
    const users = getStorageData('visualbook_users');
    const userIndex = users.findIndex(u => u.id === updatedUser.id);

    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        saveStorageData('visualbook_users', users);
        setCurrentUser(updatedUser);

        // Update UI
        loadProfileData();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        modal.hide();

        alert('Profile updated successfully!');
    }
}

// Create group
function createGroup() {
    const modal = new bootstrap.Modal(document.getElementById('createGroupModal'));
    modal.show();
}

// Save new group
function saveGroup() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const groupName = document.getElementById('groupName');
    const groupDescription = document.getElementById('groupDescription');
    const groupPrivacy = document.getElementById('groupPrivacy');

    if (!groupName.value.trim()) {
        alert('Please enter a group name.');
        return;
    }

    const newGroup = {
        id: generateId(),
        name: groupName.value,
        description: groupDescription.value,
        privacy: groupPrivacy.value,
        members: [currentUser.id],
        createdBy: currentUser.id,
        createdAt: new Date().toISOString()
    };

    const groups = getStorageData('visualbook_groups');
    groups.push(newGroup);
    saveStorageData('visualbook_groups', groups);

    // Update UI
    loadProfileGroups();

    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('createGroupModal'));
    modal.hide();
    document.getElementById('createGroupForm').reset();

    alert('Group created successfully!');
}

// Leave group
function leaveGroup(groupId) {
    if (!confirm('Are you sure you want to leave this group?')) return;

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const groups = getStorageData('visualbook_groups');
    const groupIndex = groups.findIndex(g => g.id === groupId);

    if (groupIndex === -1) return;

    // Remove user from group members
    const memberIndex = groups[groupIndex].members.indexOf(currentUser.id);
    if (memberIndex !== -1) {
        groups[groupIndex].members.splice(memberIndex, 1);
    }

    // If group has no members, delete it
    if (groups[groupIndex].members.length === 0) {
        groups.splice(groupIndex, 1);
    }

    saveStorageData('visualbook_groups', groups);
    loadProfileGroups();

    alert('You have left the group.');
}

// Format date for display (reuse from app.js)
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
    initProfile();

    // Edit profile button
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', editProfile);
    }

    // Save profile button
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfile);
    }

    // Create group button
    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', createGroup);
    }

    // Save group button
    if (saveGroupBtn) {
        saveGroupBtn.addEventListener('click', saveGroup);
    }

    // Profile picture change
    const profilePictureInput = document.getElementById('profilePictureInput');
    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const editProfileAvatar = document.getElementById('editProfileAvatar');
                    if (editProfileAvatar) {
                        editProfileAvatar.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Event delegation for post actions
    if (profilePosts) {
        profilePosts.addEventListener('click', function (e) {
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

    // Event delegation for friend actions
    if (profileFriends) {
        profileFriends.addEventListener('click', function (e) {
            const target = e.target.closest('.view-profile-btn');
            if (!target) return;

            const userId = parseInt(target.dataset.userId);
            // In a real app, this would navigate to the friend's profile
            alert('View profile feature would show here in a full implementation');
        });
    }

    // Event delegation for group actions
    if (profileGroups) {
        profileGroups.addEventListener('click', function (e) {
            const target = e.target.closest('.leave-group-btn');
            if (!target) return;

            const groupId = parseInt(target.dataset.groupId);
            leaveGroup(groupId);
        });
    }
});

// Reuse functions from app.js for post interactions
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
    loadProfilePosts();
}

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
    loadProfilePosts();
}

function sharePost(postId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const posts = getStorageData('visualbook_posts');
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) return;

    posts[postIndex].shares += 1;
    saveStorageData('visualbook_posts', posts);
    loadProfilePosts();

    alert('Post shared successfully!');
}

function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const posts = getStorageData('visualbook_posts');
    const updatedPosts = posts.filter(p => p.id !== postId);

    saveStorageData('visualbook_posts', updatedPosts);
    loadProfilePosts();
}