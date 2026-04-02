# Mini Social - Social Media App

A fully-functional social media application built with React and Vite. Create posts, like, comment, and connect with others - all running in your browser with no backend server needed!

## Features

- **User Authentication**: Sign up and login with email and password
- **Create Posts**: Share your thoughts with the community
- **Like Posts**: Like or unlike posts from other users
- **Comments**: Add comments to any post
- **Delete Posts/Comments**: Remove your own posts and comments
- **Responsive Design**: Works great on mobile and desktop
- **Pure CSS**: All Material Design styling, no Tailwind

## Tech Stack

- **Frontend**: React 19 + Vite 4
- **Storage**: Browser LocalStorage (no backend needed)
- **Styling**: Pure CSS with Material Design

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will open automatically at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## How to Use

### Creating an Account
1. Click "Sign up" on the login page
2. Enter your username, email, and password
3. Confirm your password and click "Sign Up"

### Logging In
1. Enter your email and password
2. Click "Sign In"

### Creating a Post
1. After logging in, type your message in the text area
2. Click the "Post" button
3. Your post will appear at the top of the feed

### Interacting with Posts
- **Like**: Click the heart icon to like or unlike a post
- **Comment**: Click the comment icon to show/hide the comment section
- **Add Comment**: Type in the comment box and click "Post"
- **Delete**: Click the X button on your own post to delete it

### Logging Out
- Click the "Logout" button in the top right corner

## File Structure

```
src/
├── main.jsx              # App entry point
├── App.jsx               # Main app component
├── index.css             # All Material Design styling
├── context/
│   └── AuthContext.jsx   # Authentication state management
├── pages/
│   ├── LoginPage.jsx     # Login page
│   ├── SignupPage.jsx    # Signup page
│   └── HomePage.jsx      # Main feed page
└── components/
    ├── Header.jsx        # Top navigation
    ├── CreatePost.jsx    # Post creation form
    ├── PostFeed.jsx      # Posts list
    └── Post.jsx          # Individual post component
```

## Data Storage

All data is stored in your browser's LocalStorage:
- `users` - List of user accounts
- `posts` - All posts with their comments and likes
- `currentUser` - Currently logged-in user

**Note**: Data is cleared if you clear your browser cache/cookies.

## Features Explained

### Material Design Styling
- Indigo color scheme (#6366f1)
- Clean card-based layout
- Responsive flexbox design
- Hover states and smooth transitions
- Mobile-friendly responsive design

### Authentication
- Email/password based signup and login
- User session persisted in localStorage
- Simple password validation
- Clear error handling with messages

### Posts & Interactions
- Posts sorted by newest first
- Like counter with visual feedback
- Expandable comment sections
- Delete own posts and comments
- Relative timestamps (e.g., "2 hours ago")

## Customization

### Colors
Edit the CSS variables at the top of `src/index.css`:
```css
:root {
  --primary-color: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #818cf8;
  /* ... more colors ... */
}
```

### Styling
All styles are in `src/index.css`. Complete Material Design with no external CSS framework.

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Connect your GitHub repo
4. Click "Deploy"

### Deploy to Netlify
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repo
5. Set build command to `npm run build`
6. Set publish directory to `dist`

### Deploy to GitHub Pages
1. Update `vite.config.js` with `base: '/repo-name/'` if needed
2. Run `npm run build`
3. Deploy the `dist` folder to GitHub Pages

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge)

## Limitations

- No backend server (data stored locally in browser)
- Data persists only on this device/browser
- No real-time updates between different browsers
- No image uploads

## License

MIT - Feel free to use and modify!
