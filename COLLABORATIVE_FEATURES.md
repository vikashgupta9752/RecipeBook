# Collaborative Cookbook - Groups & Friends Implementation Plan

Based on the workflow diagram provided, here's the complete implementation structure:

## ✅ COMPLETED (Backend Models)

### 1. **Group Model** (`server/models/Group.js`)

- Group name, description, owner
- Members array
- Invitations with status tracking
- Cover image and privacy settings

### 2. **Friendship Model** (`server/models/Friendship.js`)

- Friend requests (requester/recipient)
- Status: pending, accepted, declined, blocked
- Prevents duplicate friendships

### 3. **Recipe Model Updates**

- `group`: Link recipe to a group
- `forkedFrom`: Track original recipe when forking
- `forkCount`: Count how many times forked

## 🔄 NEXT STEPS - Backend Routes

### Friends Routes (`/api/friends`)

```javascript
POST   /api/friends/request/:userId    // Send friend request
PUT    /api/friends/accept/:id         // Accept friend request
PUT    /api/friends/decline/:id        // Decline friend request
DELETE /api/friends/remove/:userId     // Remove friend
GET    /api/friends                    // Get all friends
GET    /api/friends/requests           // Get pending requests
GET    /api/friends/suggestions        // Get friend suggestions
```

### Groups Routes (`/api/groups`)

```javascript
POST   /api/groups                        // Create new group
GET    /api/groups                        // Get user's groups
GET    /api/groups/:id                    // Get group details
PUT    /api/groups/:id                    // Update group
DELETE /api/groups/:id                    // Delete group
POST   /api/groups/:id/invite             // Invite friends to group
PUT    /api/groups/:id/join               // Accept group invitation
DELETE /api/groups/:id/leave             // Leave group
GET    /api/groups/:id/recipes            // Get group recipes
POST   /api/groups/:id/recipes            // Add recipe to group
```

### Recipe Routes Updates (`/api/recipes`)

```javascript
GET    /api/recipes/friends               // Get friend recipes
GET    /api/recipes/groups/:groupId       // Get group recipes
POST   /api/recipes/:id/fork              // Fork a recipe
GET    /api/recipes/:id/forks             // Get recipe forks
```

## 🎨 FRONTEND COMPONENTS NEEDED

### 1. **Friends Section** (`/friends`)

Components:

- `FriendsList.jsx` - Display all friends
- `FriendRequests.jsx` - Pending requests
- `FindFriends.jsx` - Search and suggestions
- `FriendCard.jsx` - Individual friend display
- `FriendRecipes.jsx` - View friend's recipes

### 2. **Groups Section** (`/groups`)

Components:

- `GroupsList.jsx` - User's groups
- `GroupDetail.jsx` - Group page with members & recipes
- `CreateGroup.jsx` - Create group form
- `GroupInvite.jsx` - Invite friends modal
- `GroupRecipes.jsx` - Group cookbook
- `GroupMembers.jsx` - Manage members

### 3. **Recipe Updates**

- Add "Fork" button to RecipeDetail
- Show "Forked from" indicator
- Add group selector when creating recipe
- Filter by "My Recipes", "Friend Recipes", "Group Recipes"

## 📱 NAVIGATION UPDATES

Update Sidebar.jsx to include:

```javascript
{
  { icon: Users, label: 'Friends', path: '/friends' },
  { icon: UserPlus, label: 'Groups', path: '/groups' },
  { icon: BookOpen, label: 'My Recipes', path: '/my-recipes' },
  { icon: Globe, label: 'Discover', path: '/' },
}
```

## 🔐 PERMISSIONS & PRIVACY

### Recipe Visibility:

- **Public**: Everyone can see
- **Friends**: Only friends can see
- **Group**: Only group members can see
- **Private**: Only creator can see

### Group Privacy:

- **Public**: Anyone can see, request to join
- **Private**: Invite-only

## 🚀 WORKFLOW IMPLEMENTATION

### 1.0 My Recipes

- List user's own recipes
- Fork indicator if forked from another
- Edit/Delete capabilities

### 2.0 Create New Recipe

- Existing functionality
- Add group selector
- Add privacy selector

### 3.0 Friend Recipes

- Grid of friend recipes
- Filter by friend
- Fork button on each recipe

### 4.0 Group Cookbooks

- **4.1**: Group recipes list with fork option
- **4.2**: Create group flow with member invitation
- **4.3**: Sign up flow (already exists)

## 💡 KEY FEATURES

1. **Recipe Forking**

   - Copy recipe with attribution
   - Edit forked recipe independently
   - Track fork count on original

2. **Group Collaboration**

   - Multiple members contribute recipes
   - Shared cookbook for groups
   - Group activity feed

3. **Social Features**
   - Friend requests
   - Follow friends
   - View friend activity
   - Recipe recommendations from friends

## 📊 DATABASE INDEXES

Add these for performance:

```javascript
// Friendship
friendshipSchema.index({ requester: 1, status: 1 });
friendshipSchema.index({ recipient: 1, status: 1 });

// Recipe
recipeSchema.index({ group: 1 });
recipeSchema.index({ user: 1, isPublic: 1 });
recipeSchema.index({ forkedFrom: 1 });

// Group
groupSchema.index({ owner: 1 });
groupSchema.index({ members: 1 });
```

## 🎯 IMPLEMENTATION PRIORITY

**Phase 1** (Core Social):

1. Friends routes ✅ (models done)
2. Friend UI components
3. Friend recipes view

**Phase 2** (Groups):

1. Groups routes ✅ (models done)
2. Create/join groups UI
3. Group recipes

**Phase 3** (Advanced):

1. Recipe forking
2. Activity feeds
3. Notifications

---

**Created**: Based on workflow diagram
**Status**: Models complete, routes and UI pending
**Estimated Time**: 4-6 hours for full implementation
