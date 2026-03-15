# Intake

Real experiences with birth control and medications, beyond the official description.

## 🌟 Features

- **User Authentication**: Secure signup/login with Supabase
- **Verification System**: Soft verification through brand-specific questions
- **Share Experiences**: Post tips, side effects, and discussions
- **Browse Methods**: Explore different birth control methods and brands
- **Community Engagement**: Upvote and comment on posts
- **PWA Support**: Install on mobile devices for app-like experience
- **Responsive Design**: Works seamlessly on all devices

## 💡 What is Intake?

Intake is where you learn what the instruction manual doesn't tell you. Real people sharing real experiences about their medications - the good, the challenging, and everything in between.

**Double meaning:**
- **Intake** your medication daily
- **Intake** real knowledge from others who've been there

## 🚀 Tech Stack

- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Netlify
- **PWA**: Service Worker for offline functionality

## 📋 Prerequisites

- Node.js (optional, for local development server)
- Supabase account (free tier available)
- Netlify account (free tier available)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd birth-control-community
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to **Project Settings > API**
3. Copy your:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (long string starting with `eyJ...`)

4. Run the database migration:
   - Go to **SQL Editor** in Supabase dashboard
   - Copy the contents of `supabase-migration.sql`
   - Paste and run it in the SQL Editor
   - This will create all tables, policies, and seed data

5. Update `src/js/supabase-client.js`:
   ```javascript
   const SUPABASE_URL = 'YOUR_PROJECT_URL';
   const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
   ```

### 3. Local Development

#### Option 1: Using Python (recommended)
```bash
python3 -m http.server 8000
```
Then visit: `http://localhost:8000`

#### Option 2: Using Node.js
```bash
npx serve .
```

#### Option 3: Using VS Code
Install the "Live Server" extension and click "Go Live"

### 4. Deploy to Netlify

1. Push your code to GitHub

2. Go to [netlify.com](https://netlify.com) and click "Add new site"

3. Connect your GitHub repository

4. Configure build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `.` (root directory)

5. Add environment variables (optional):
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

6. Click "Deploy site"

7. Your site will be live at `https://your-site-name.netlify.app`

### 5. Configure PWA

After deployment, test PWA functionality:
- Visit your site on mobile
- Look for "Add to Home Screen" prompt
- Install and test offline functionality

## 📁 Project Structure

```
birth-control-community/
├── public/
│   ├── icons/              # PWA icons
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service worker
├── src/
│   ├── assets/            # Static assets
│   ├── components/        # Reusable UI components
│   ├── data/              # Static JSON data
│   ├── js/                # JavaScript modules
│   ├── pages/             # Page components
│   └── styles/            # CSS files
├── index.html             # Main HTML
├── supabase-migration.sql # Database setup
├── DATABASE_SCHEMA.md     # Database documentation
└── README.md              # This file
```

## 🎨 Design System

The platform uses a cohesive design system based on:
- **Primary Color**: #8BC9B0 (mint/sage green)
- **Typography**: SF Pro Display/Text
- **Spacing**: 4px base unit
- **Components**: Pills, cards, inputs with consistent styling

See `src/styles/variables.css` for full design tokens.

## 🔐 Security Features

- Row Level Security (RLS) enabled on all tables
- User authentication via Supabase Auth
- Email verification (configurable)
- Secure password requirements
- Input sanitization

## 📊 Database Schema

The platform uses PostgreSQL through Supabase with the following main tables:
- `profiles` - Extended user information
- `methods` - Birth control methods
- `brands` - Specific brands/products
- `posts` - User-generated content
- `comments` - Post comments
- `upvotes` - Post upvotes
- `user_verifications` - Brand verifications

See `DATABASE_SCHEMA.md` for detailed schema documentation.

## 🧪 Testing

### Test User Accounts
Create test accounts through the signup flow to test features:
1. Sign up with a test email
2. Try the verification flow on different brands
3. Create posts in different categories
4. Test upvoting and commenting

### Verification Questions
The platform includes pre-loaded verification questions for:
- Yasmin
- Yaz
- Lo Loestrin Fe
- Ortho Tri-Cyclen
- Microgestin
- Mirena
- Paragard

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📝 Future Enhancements

- [ ] Search functionality
- [ ] User profiles with activity history
- [ ] Notifications system
- [ ] Direct messaging
- [ ] More birth control methods and brands
- [ ] Mobile apps (iOS/Android)
- [ ] Community moderation tools
- [ ] Report/flag system
- [ ] Tags and advanced filtering
- [ ] Bookmark/save posts

## 💡 Usage Tips

### For Users:
1. **Get Verified**: Answer questions about your method to get the verified badge
2. **Be Specific**: Share detailed experiences - they're most helpful
3. **Search First**: Check if your question has been answered before posting
4. **Be Respectful**: This is a supportive community

### For Developers:
1. **Environment Variables**: Use .env for sensitive data in production
2. **Rate Limiting**: Consider adding rate limits for API calls
3. **Analytics**: Add privacy-respecting analytics if needed
4. **Monitoring**: Set up error tracking (e.g., Sentry)

## 📄 License

This project is private and not licensed for public use.

## 👤 Author

Built with care for the community.

## 🙏 Acknowledgments

- Anthropic's Claude for development assistance
- Supabase for backend infrastructure
- Netlify for hosting
- All the people who will share their experiences to help others

---

**Need Help?** Check the [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for database details or review the code comments throughout the project.
