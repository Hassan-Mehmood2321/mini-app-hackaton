// VisualBook - Local Storage Data Management

// Random profile pictures for demo
const randomProfilePics = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
];

// Random post images for demo
const randomPostImages = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop'
];

// Get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Initialize localStorage with sample data if empty
function initializeStorage() {
    if (!localStorage.getItem('visualbook_users')) {
        const sampleUsers = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                bio: 'Software developer and photography enthusiast',
                location: 'New York, USA',
                profilePicture: getRandomItem(randomProfilePics),
                friends: [2, 3],
                friendRequests: [],
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                bio: 'Digital marketer and travel blogger',
                location: 'Los Angeles, USA',
                profilePicture: getRandomItem(randomProfilePics),
                friends: [1],
                friendRequests: [],
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Mike Johnson',
                email: 'mike@example.com',
                password: 'password123',
                bio: 'Fitness coach and nutrition expert',
                location: 'Chicago, USA',
                profilePicture: getRandomItem(randomProfilePics),
                friends: [1],
                friendRequests: [],
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                name: 'Sarah Wilson',
                email: 'sarah@example.com',
                password: 'password123',
                bio: 'Artist and creative designer',
                location: 'Miami, USA',
                profilePicture: getRandomItem(randomProfilePics),
                friends: [],
                friendRequests: [],
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                name: 'David Brown',
                email: 'david@example.com',
                password: 'password123',
                bio: 'Travel photographer and adventurer',
                location: 'Seattle, USA',
                profilePicture: getRandomItem(randomProfilePics),
                friends: [],
                friendRequests: [],
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('visualbook_users', JSON.stringify(sampleUsers));
    }

    if (!localStorage.getItem('visualbook_posts')) {
        const samplePosts = [
            {
                id: 1,
                userId: 1,
                content: 'Just finished my morning run! Feeling energized and ready for the day. 🏃‍♂️',
                feeling: 'energized',
                location: 'Central Park, NYC',
                image: getRandomItem(randomPostImages),
                likes: [2, 3],
                comments: [
                    { userId: 2, content: 'Great job! Keep it up!', timestamp: new Date().toISOString() }
                ],
                shares: 0,
                timestamp: new Date().toISOString()
            },
            {
                id: 2,
                userId: 2,
                content: 'Beautiful sunset at the beach today. Nature is amazing! 🌅',
                feeling: 'amazed',
                location: 'Santa Monica Beach',
                image: getRandomItem(randomPostImages),
                likes: [1],
                comments: [],
                shares: 1,
                timestamp: new Date().toISOString()
            },
            {
                id: 3,
                userId: 3,
                content: 'New personal record at the gym today! Hard work pays off. 💪',
                feeling: 'proud',
                location: 'Downtown Fitness',
                image: getRandomItem(randomPostImages),
                likes: [1, 2],
                comments: [
                    { userId: 1, content: 'Awesome! What was your routine?', timestamp: new Date().toISOString() }
                ],
                shares: 0,
                timestamp: new Date().toISOString()
            },
            {
                id: 4,
                userId: 4,
                content: 'Working on my new art project. So excited to share it with you all! 🎨',
                feeling: 'excited',
                location: 'Art Studio',
                image: getRandomItem(randomPostImages),
                likes: [1, 3],
                comments: [],
                shares: 0,
                timestamp: new Date().toISOString()
            },
            {
                id: 5,
                userId: 5,
                content: 'Exploring the mountains today. The view is absolutely breathtaking! ⛰️',
                feeling: 'inspired',
                location: 'Rocky Mountains',
                image: getRandomItem(randomPostImages),
                likes: [2, 4],
                comments: [
                    { userId: 2, content: 'Wow! Where is this?', timestamp: new Date().toISOString() }
                ],
                shares: 1,
                timestamp: new Date().toISOString()
            }
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
                members: [1, 2, 5],
                createdBy: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Fitness & Wellness',
                description: 'Share your fitness journey and wellness tips',
                privacy: 'public',
                members: [1, 3],
                createdBy: 3,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Travel Bloggers',
                description: 'For those who love to travel and share experiences',
                privacy: 'private',
                members: [2, 5],
                createdBy: 2,
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                name: 'Art & Creativity',
                description: 'Showcase your artwork and creative projects',
                privacy: 'public',
                members: [4],
                createdBy: 4,
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('visualbook_groups', JSON.stringify(sampleGroups));
    }

    if (!localStorage.getItem('visualbook_stories')) {
        const sampleStories = [
            {
                id: 1,
                userId: 1,
                image: getRandomItem(randomPostImages),
                timestamp: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 2,
                userId: 2,
                image: getRandomItem(randomPostImages),
                timestamp: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                userId: 3,
                image: getRandomItem(randomPostImages),
                timestamp: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 4,
                userId: 4,
                image: getRandomItem(randomPostImages),
                timestamp: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        localStorage.setItem('visualbook_stories', JSON.stringify(sampleStories));
    }

    if (!localStorage.getItem('visualbook_current_user')) {
        localStorage.setItem('visualbook_current_user', JSON.stringify(null));
    }
}

// Get data from localStorage
function getStorageData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Save data to localStorage
function saveStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('visualbook_current_user'));
}

// Set current user
function setCurrentUser(user) {
    localStorage.setItem('visualbook_current_user', JSON.stringify(user));
}

// Clear current user (logout)
function clearCurrentUser() {
    localStorage.setItem('visualbook_current_user', JSON.stringify(null));
}

// Generate unique ID
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Get user by ID
function getUserById(userId) {
    const users = getStorageData('visualbook_users');
    return users.find(user => user.id === parseInt(userId));
}

// Get posts by user ID
function getPostsByUserId(userId) {
    const posts = getStorageData('visualbook_posts');
    return posts.filter(post => post.userId === parseInt(userId));
}

// Get groups by user ID
function getGroupsByUserId(userId) {
    const groups = getStorageData('visualbook_groups');
    return groups.filter(group => group.members.includes(parseInt(userId)));
}

// Get stories by user ID
function getStoriesByUserId(userId) {
    const stories = getStorageData('visualbook_stories');
    const now = new Date();
    return stories.filter(story =>
        story.userId === parseInt(userId) && new Date(story.expiresAt) > now
    );
}

// Get all active stories
function getActiveStories() {
    const stories = getStorageData('visualbook_stories');
    const now = new Date();
    return stories.filter(story => new Date(story.expiresAt) > now);
}

// Initialize storage when script loads
initializeStorage();