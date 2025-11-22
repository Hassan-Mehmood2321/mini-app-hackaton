function initializeStorage() {
    if (!localStorage.getItem('visualbook_users')) {
        const sampleUsers = [
            {
                id: 1,
                name: 'munib ',
                email: 'munib@example.com',
                password: '123456789',
                bio: 'Software developer and photography enthusiast',
                location: 'karachi',
                profilePicture: 'https://images.unsplash.com/photo-1599475735868-a8924c458792?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFuZHNvbWUlMjBib3l8ZW58MHx8MHx8fDA%3D',
                friends: [2, 3],
                friendRequests: [],
                createdAt: new Date().toISOString()
            },
        ];
        localStorage.setItem('visualbook_users', JSON.stringify(sampleUsers));
    }

    if (!localStorage.getItem('visualbook_posts')) {
        const samplePosts = [
            {
                id: 1,
                userId: 1,
                content: 'Just finished my morning run! Feeling energized and ready for the day. ',
                feeling: 'energized',
                location: 'Central Park, NYC',
                image: 'https://i.pinimg.com/236x/44/ec/8d/44ec8dc2e150e18198c90ce459cddc59.jpg',
                likes: [2, 3],
                comments: [
                    { userId: 2, content: 'Great job! Keep it up!', timestamp: new Date().toISOString() }
                ],
                shares: 0,
                timestamp: new Date().toISOString()
            },

        ];
        localStorage.setItem('visualbook_posts', JSON.stringify(samplePosts));
    }

    if (!localStorage.getItem('visualbook_groups')) {
        const sampleGroups = [
            {
                id: 1,
                name: 'Photography Enthusiasts',
                description: 'A community for photography lovers to share tips and photos',
                privacy: 'public',
                members: [1, 2],
                createdBy: 1,
                createdAt: new Date().toISOString()
            },

        ];
        localStorage.setItem('visualbook_groups', JSON.stringify(sampleGroups));
    }

    if (!localStorage.getItem('visualbook_stories')) {
        const sampleStories = [
            {
                id: 1,
                userId: 1,
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLw-_LKeDH7NNXILXrfFMK8sned1eeVIAkrA&s',
                timestamp: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            },

        ];
        localStorage.setItem('visualbook_stories', JSON.stringify(sampleStories));
    }

    if (!localStorage.getItem('visualbook_current_user')) {
        localStorage.setItem('visualbook_current_user', JSON.stringify(null));
    }
}
function getStorageData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}
function saveStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('visualbook_current_user'));
}
function setCurrentUser(user) {
    localStorage.setItem('visualbook_current_user', JSON.stringify(user));
}
function clearCurrentUser() {
    localStorage.setItem('visualbook_current_user', JSON.stringify(null));
}
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}
function getUserById(userId) {
    const users = getStorageData('visualbook_users');
    return users.find(user => user.id === parseInt(userId));
}
function getPostsByUserId(userId) {
    const posts = getStorageData('visualbook_posts');
    return posts.filter(post => post.userId === parseInt(userId));
}
function getGroupsByUserId(userId) {
    const groups = getStorageData('visualbook_groups');
    return groups.filter(group => group.members.includes(parseInt(userId)));
}
function getStoriesByUserId(userId) {
    const stories = getStorageData('visualbook_stories');
    const now = new Date();
    return stories.filter(story =>
        story.userId === parseInt(userId) && new Date(story.expiresAt) > now
    );
}
function getActiveStories() {
    const stories = getStorageData('visualbook_stories');
    const now = new Date();
    return stories.filter(story => new Date(story.expiresAt) > now);
}
initializeStorage();