---
description: How to use the Admin Dashboard
---

# Admin Dashboard Guide

The Admin Dashboard provides powerful tools to manage the Cookbook application.

## Accessing the Dashboard

1. Log in with an account that has the `isAdmin` flag set to `true`.
2. Navigate to `/admin` or click the "Admin Panel" link if available (usually hidden for non-admins).

## Features

### Dashboard Overview

- View key statistics: Total Recipes, Total Views, Total Likes, Total Users.
- See recent recipes and quick actions.

### Recipe Management

- **View All Recipes**: See a list of all recipes with status, category, and difficulty.
- **Search & Filter**: Find specific recipes by title or category.
- **Delete Recipe**: Remove inappropriate or spam recipes.
- **Edit Recipe**: (Optional) Admins can edit any recipe.

### User Management

- **View All Users**: See a list of registered users.
- **Manage Roles**: Promote users to Admin or demote Admins.
- **Suspend/Block**: Suspend users who violate community guidelines.
- **Delete User**: Permanently remove a user and all their data.

### Inspiration Management (Thoughts)

- **Add Inspiration**: Create new "Thought of the Day" quotes.
- **Manage Inspirations**: Edit, delete, or toggle the active status of quotes.

## Technical Details

- **Route**: `/admin` (Protected by `AdminRoute` wrapper).
- **API**: `/api/admin/*` endpoints (Protected by `adminOnly` middleware).
- **Security**: Requires a valid JWT token with `isAdmin: true` in the user record.
