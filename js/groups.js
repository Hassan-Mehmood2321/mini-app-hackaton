// VisualBook - Groups Page Logic

// DOM elements
const createGroupBtn = document.getElementById('createGroupBtn');
const saveGroupBtn = document.getElementById('saveGroupBtn');
const myGroups = document.getElementById('myGroups');
const discoverGroups = document.getElementById('discoverGroups');
const groupSuggestions = document.getElementById('groupSuggestions');
const groupActivities = document.getElementById('groupActivities');

// Initialize groups page
function initGroups() {
    loadMyGroups();
    loadDiscoverGroups();
    loadGroupSuggestions();
    loadGroupActivities();
}

// Load and display user's groups
function loadMyGroups() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const groups = getGroupsByUserId(currentUser.id);

    if (myGroups) {
        myGroups.innerHTML = '';

        if (groups.length === 0) {
            myGroups.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <h5>No groups yet</h5>
                    <p class="text-muted">Join or create groups to see them here!</p>
                </div>
            `;
            return;
        }

        groups.forEach(group => {
            const groupElement = createGroupElement(group, true);
            myGroups.appendChild(groupElement);
        });
    }
}

// Load and display discoverable groups
function loadDiscoverGroups() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const allGroups = getStorageData('visualbook_groups');
    const userGroups = getGroupsByUserId(currentUser.id);
    const userGroupIds = userGroups.map(g => g.id);

    // Filter out groups the user is already in
    const discoverGroupsList = allGroups.filter(group =>
        !userGroupIds.includes(group.id) && group.privacy === 'public'
    );

    if (discoverGroups) {
        discoverGroups.innerHTML = '';

        if (discoverGroupsList.length === 0) {
            discoverGroups.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h5>No groups to discover</h5>
                    <p class="text-muted">Check back later for new groups!</p>
                </div>
            `;
            return;
        }

        discoverGroupsList.forEach(group => {
            const groupElement = createGroupElement(group, false);
            discoverGroups.appendChild(groupElement);
        });
    }
}

// Load and display group suggestions
function loadGroupSuggestions() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const allGroups = getStorageData('visualbook_groups');
    const userGroups = getGroupsByUserId(currentUser.id);
    const userGroupIds = userGroups.map(g => g.id);

    // Get groups that user's friends are in but user is not
    const friendGroupIds = new Set();
    currentUser.friends.forEach(friendId => {
        const friendGroups = getGroupsByUserId(friendId);
        friendGroups.forEach(group => {
            if (!userGroupIds.includes(group.id)) {
                friendGroupIds.add(group.id);
            }
        });
    });

    const suggestedGroups = Array.from(friendGroupIds).map(groupId =>
        allGroups.find(g => g.id === groupId)
    ).filter(Boolean).slice(0, 5); // Limit to 5 suggestions

    if (groupSuggestions) {
        groupSuggestions.innerHTML = '';

        if (suggestedGroups.length === 0) {
            groupSuggestions.innerHTML = `
                <div class="text-center py-3">
                    <p class="text-muted">No group suggestions at the moment.</p>
                </div>
            `;
            return;
        }

        suggestedGroups.forEach(group => {
            const groupElement = document.createElement('div');
            groupElement.className = 'mb-3';
            groupElement.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                        <div class="rounded-circle bg-primary d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                            <i class="fas fa-users text-white"></i>
                        </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <h6 class="mb-0">${group.name}</h6>
                        <small class="text-muted">${group.members.length} members</small>
                    </div>
                    <button class="btn btn-primary btn-sm join-group-btn" data-group-id="${group.id}">Join</button>
                </div>
            `;

            groupSuggestions.appendChild(groupElement);
        });
    }
}

// Load and display group activities
function loadGroupActivities() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const userGroups = getGroupsByUserId(currentUser.id);
    const posts = getStorageData('visualbook_posts');
    const users = getStorageData('visualbook_users');

    // Get recent posts from user's groups (simplified - in a real app, posts would be associated with groups)
    const recentPosts = posts
        .filter(post => {
            // In a real app, we would check if the post is in one of the user's groups
            // For now, we'll just show recent posts from friends
            return currentUser.friends.includes(post.userId);
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    if (groupActivities) {
        groupActivities.innerHTML = '';

        if (recentPosts.length === 0) {
            groupActivities.innerHTML = `
                <div class="text-center py-3">
                    <p class="text-muted">No recent activities.</p>
                </div>
            `;
            return;
        }

        recentPosts.forEach(post => {
            const user = users.find(u => u.id === post.userId);
            if (!user) return;

            const activityElement = document.createElement('div');
            activityElement.className = 'mb-3';
            activityElement.innerHTML = `
                <div class="d-flex">
                    <img src="${user.profilePicture || 'images/default-avatar.png'}" class="rounded-circle me-2" width="32" height="32" alt="${user.name}">
                    <div>
                        <strong>${user.name}</strong> posted in a group
                        <div class="text-muted small">${formatDate(post.timestamp)}</div>
                    </div>
                </div>
            `;

            groupActivities.appendChild(activityElement);
        });
    }
}

// Create a group element
function createGroupElement(group, isMember) {
    const groupElement = document.createElement('div');
    groupElement.className = 'col-md-6 col-lg-4 mb-4';

    const createdByUser = getUserById(group.createdBy);
    const creatorName = createdByUser ? createdByUser.name : 'Unknown';

    groupElement.innerHTML = `
        <div class="group-card">
            <div class="group-image">
                <i class="fas fa-users"></i>
            </div>
            <div class="group-info">
                <h5>${group.name}</h5>
                <p class="text-muted">${group.description}</p>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <small class="text-muted">Created by ${creatorName}</small>
                    <span class="badge ${group.privacy === 'public' ? 'bg-success' : 'bg-warning'}">
                        ${group.privacy === 'public' ? 'Public' : 'Private'}
                    </span>
                </div>
                <div class="group-members">
                    ${group.members.slice(0, 3).map(memberId => {
        const member = getUserById(memberId);
        return member ? `<img src="${member.profilePicture || 'images/default-avatar.png'}" class="member-avatar" alt="${member.name}">` : '';
    }).join('')}
                    ${group.members.length > 3 ? `<span class="member-count">+${group.members.length - 3} more</span>` : ''}
                </div>
                <div class="mt-3">
                    ${isMember ?
            `<button class="btn btn-outline-danger btn-sm leave-group-btn" data-group-id="${group.id}">Leave Group</button>` :
            `<button class="btn btn-primary btn-sm join-group-btn" data-group-id="${group.id}">Join Group</button>`
        }
                </div>
            </div>
        </div>
    `;

    return groupElement;
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
    loadMyGroups();
    loadDiscoverGroups();
    loadGroupSuggestions();

    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('createGroupModal'));
    modal.hide();
    document.getElementById('createGroupForm').reset();

    alert('Group created successfully!');
}

// Join group
function joinGroup(groupId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const groups = getStorageData('visualbook_groups');
    const groupIndex = groups.findIndex(g => g.id === groupId);

    if (groupIndex === -1) return;

    // Add user to group members
    if (!groups[groupIndex].members.includes(currentUser.id)) {
        groups[groupIndex].members.push(currentUser.id);
    }

    saveStorageData('visualbook_groups', groups);

    // Update UI
    loadMyGroups();
    loadDiscoverGroups();
    loadGroupSuggestions();

    alert('You have joined the group!');
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

    // Update UI
    loadMyGroups();
    loadDiscoverGroups();
    loadGroupSuggestions();

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
    initGroups();

    // Create group button
    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', createGroup);
    }

    // Save group button
    if (saveGroupBtn) {
        saveGroupBtn.addEventListener('click', saveGroup);
    }

    // Event delegation for group actions
    document.addEventListener('click', function (e) {
        const joinBtn = e.target.closest('.join-group-btn');
        const leaveBtn = e.target.closest('.leave-group-btn');

        if (joinBtn) {
            const groupId = parseInt(joinBtn.dataset.groupId);
            joinGroup(groupId);
        } else if (leaveBtn) {
            const groupId = parseInt(leaveBtn.dataset.groupId);
            leaveGroup(groupId);
        }
    });
});