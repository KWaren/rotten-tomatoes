# 🍿 My Rotten Tomatoes# ‧ 🍒 ⋅ ˚✮ My Rotten Tomatoes



A modern movie review platform inspired by Rotten Tomatoes, built with Next.js 16, React 19, and Prisma. Features include user authentication, movie ratings, comments, favorites, and a comprehensive admin panel for movie management.A platform dedicated to reviews and information about the films a bit like Rotten Tomatoes



![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?style=for-the-badge&logo=next.js)

![React](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)

![Prisma](https://img.shields.io/badge/Prisma-6.19.0-2D3748?style=for-the-badge&logo=prisma)## Features

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-316192?style=for-the-badge&logo=postgresql)

![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)* **Authentication** – Secure user login and registration and Oauth2 authentication

  

---* **Database** – Postgres for storing users, movies, comments, favorites, rates

  

## 📋 Table of Contents* **Admin Panel** – Import movies from TMDB API into local database

  

- [Features](#-features)* **Frontend** – Responsive UI built with NextJs, React 19, and TailwindCSS 4

- [Tech Stack](#-tech-stack)  

- [Prerequisites](#-prerequisites)* **Backend API** – NextJs App Router, Prisma with Accelerate, and TMDB API

- [Installation](#-installation)  

- [Configuration](#-configuration)* **Deployment Ready** – Easily deploy project with ***Vercel***

- [Database Setup](#-database-setup)  

- [Running the Application](#-running-the-application)

- [Project Structure](#-project-structure)

- [API Documentation](#-api-documentation)## Tech Stack

- [Authentication Flow](#-authentication-flow)

- [Admin Panel](#-admin-panel)<div style="display: flex; gap: 10px;">

- [Deployment](#-deployment)  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">

- [Scripts](#-scripts)  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React">

- [Contributing](#-contributing)  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next Js">

- [Team](#-team)  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma">

  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres">

---

</div>

## ✨ Features



### 🎬 Core Features

- **Movie Browsing**: Browse, search, and filter movies by genre, year, director, and popularity## Installations

- **TMDB Integration**: Import movies directly from The Movie Database (TMDB) API

- **Movie Details**: View comprehensive movie information including cast, crew, budget, and revenue1. Clone the repository

- **User Ratings**: Rate movies on a scale of 1-10   

- **Comments System**: Write and manage movie reviews and comments2. Install dependencies

- **Favorites**: Save movies to your personal favorites list    ```bash

    npm install

### 👤 User Management    ```

- **Authentication**: Secure email/password authentication with JWT tokens

- **Email Verification**: Account verification via email links3. Environments setup

- **User Profiles**: Manage personal information and view activity history   ```bash

- **Role-Based Access**: USER and ADMIN roles with different permissions   cp .env.example .env

   ```

### 🎯 Admin Features    Update .env with your configuration:

- **Admin Dashboard**: Comprehensive KPI dashboard with statistics

  - Total users, verified users, movies, and comments count      * **TMDB API Key** - Get yours at https://www.themoviedb.org/settings/api

  - Popular genres with average ratings      * **Database URLs** - Configure Prisma Accelerate connection

  - Top movies by age group (Under 3, 3-12, 13-17, 18-25, 26-35, 36-45, 46-55, 55+)      * **SMTP Settings** - For email verification

- **User Management**: Full CRUD operations on user accounts      * **JWT Secret** - For authentication tokens

- **Movie Import**: Import movies from TMDB with complete metadata

- **Movie Management**: View and delete movies from the database   Example .env:

- **Dark Theme**: Unified dark theme across the entire admin panel   ```env

   # TMDB API

### 🎨 UI/UX   NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here

- **Responsive Design**: Mobile-first approach with TailwindCSS 4   NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3

- **Dark Mode**: Beautiful dark theme throughout the application   NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

- **Interactive Components**: Smooth animations and transitions

- **Toast Notifications**: Real-time feedback for user actions   # Database (Prisma Accelerate)

   DATABASE_URL="postgresql://user:pass@localhost:5432/db"

---   ACCELERATE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."



## 🛠 Tech Stack   # SMTP

   SMTP_HOST=smtp.gmail.com

### Frontend   SMTP_PORT=587

- **Next.js 16.0.1**: React framework with App Router   SMTP_USER=your_email@gmail.com

- **React 19.2.0**: Latest React with concurrent features   SMTP_PASS=your_app_password

- **TailwindCSS 4**: Utility-first CSS framework

- **React Hook Form**: Form validation and management   # JWT

- **Zod**: Schema validation   JWT_SECRET="your_secret_key"

   JWT_EXPIRES_IN="7d"

### Backend   ```

- **Next.js API Routes**: Serverless API endpoints  

- **Prisma 6.19.0**: ORM with type-safe database access4. Database setup

- **Prisma Accelerate**: Connection pooling and caching   ```bash

- **PostgreSQL**: Relational database   # Generate Prisma Client

- **NextAuth**: Authentication library   npx prisma generate

- **JWT**: JSON Web Tokens for session management

   # Run migrations

### External APIs   npx prisma migrate dev

- **TMDB API**: Movie data, images, and metadata

- **Nodemailer**: Email sending for verification   # (Optional) Seed the database

   npx prisma db seed

### Development Tools   ```

- **ESLint**: Code linting

- **Jest**: Testing framework5. Development

- **Swagger UI**: API documentation   ```bash

    npm run dev

---    ```

   Access the app at http://localhost:3000

## 📦 Prerequisites

6. Admin Import (for admins only)

Before you begin, ensure you have the following installed:   - Navigate to http://localhost:3000/admin/movies-tmdb

   - Click "+ ADD" to add the movie to your local database

- **Node.js**: v18.0.0 or higher   - View imported movies at http://localhost:3000/admin/movies

- **npm** or **yarn**: Latest version

- **PostgreSQL**: v14.0 or higher7. Production Build

- **Git**: For version control    ```bash

    npm run build

### Required Accounts    ```

- **TMDB Account**: For API access ([Get API Key](https://www.themoviedb.org/settings/api))  

- **Email Service**: For sending verification emails (Gmail, SendGrid, etc.)

- **Prisma Accelerate** (Optional): For connection pooling## Repository Structure

```

---.

├── app

## 🚀 Installation│   ├── generated

│   │   └── prisma

### 1. Clone the Repository│   ├── globals.css

│   ├── layout.tsx

```bash│   └── page.tsx

git clone <repository-url>├── eslint.config.mjs

cd C-COD-270-COT-2-1-c2cod270p0-3├── LICENSE

```├── next.config.ts

├── package.json

### 2. Install Dependencies├── package-lock.json

├── postcss.config.mjs

```bash├── public

npm install├── README.md

```└── tsconfig.json



### 3. Setup Environment Variables```



Create a `.env` file in the root directory:



```bash## Architecture Overview

cp .env.example .env

```

### Frontend 

---

* Built with NextJs + tailwindCSS + JavaScript

## ⚙️ Configuration

### Backend 

### Environment Variables

* Built with NextJs, MovieDB

Edit your `.env` file with the following configuration:  

* Handles authentication, rating, comments, users management

```env

# Database (Direct Connection)### Database Tables

DATABASE_URL="postgresql://user:password@localhost:5432/rotten_tomatoes?schema=public"

![alt text](image.png)

# Prisma Accelerate (Optional - for connection pooling)

ACCELERATE_URL="prisma://accelerate.prisma-data.net/?api_key=your_api_key"| Table        | Purpose          | 

| :----------- | :-------------- |

# NextAuth Configuration| **users**| authentication and users management|

NEXTAUTH_URL="http://localhost:3000"| **movies**    | store movies from MovieDB API   |

NEXTAUTH_SECRET="your-super-secret-key-here"| **comments**    | store users comments on a Movie   |

| **favorites**    | set up a wishlist for each user   |

# JWT Secret| **rates**    | store marks given by the user on each movie   |

JWT_SECRET="your-jwt-secret-key"

## Helpful Commands Tools

# Cookie Name

COOKIE_NAME="sid"### Prisma



# TMDB APITo visualize database content run :

NEXT_PUBLIC_TMDB_API_KEY="your_tmdb_api_key"

NEXT_PUBLIC_TMDB_BASE_URL="https://api.themoviedb.org/3"```bash

NEXT_PUBLIC_TMDB_IMAGE_BASE_URL="https://image.tmdb.org/t/p"npx prisma studio



# Email Configuration (Example with Gmail)```

EMAIL_HOST="smtp.gmail.com"

EMAIL_PORT="587"To run a seed run :

EMAIL_USER="your-email@gmail.com"

EMAIL_PASSWORD="your-app-password"```bash

EMAIL_FROM="My Rotten Tomatoes <your-email@gmail.com>"npx prisma db seed



# Application URL```

NEXT_PUBLIC_APP_URL="http://localhost:3000"

To to create the database tables:

# Email Verification

VERIFICATION_TOKEN_EXPIRES_HOURS="24"```bash

```npx prisma migrate dev



### Email Configuration Notes```

## License

#### Gmail SetupThis project is licensed under the  [MIT](https://choosealicense.com/licenses/mit/)—see the LICENSE file for details.

1. Enable 2-Factor Authentication on your Google account

2. Generate an App Password: Google Account → Security → 2-Step Verification → App Passwords
3. Use the generated password in `EMAIL_PASSWORD`

#### Alternative Email Services
- **SendGrid**: Use SMTP or SendGrid API
- **Mailgun**: Configure SMTP settings
- **AWS SES**: Configure AWS credentials

---

## 🗄 Database Setup

### 1. Create PostgreSQL Database

```bash
# Using psql
psql -U postgres
CREATE DATABASE rotten_tomatoes;
\q
```

Or create via PostgreSQL GUI (pgAdmin, DBeaver, etc.)

### 2. Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npm run seed
```

### 3. View Database (Optional)

```bash
# Open Prisma Studio
npx prisma studio
```

This opens a visual editor at `http://localhost:5555`

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### API Documentation

Access the Swagger UI documentation at:
```
http://localhost:3000/docs
```

---

## 📁 Project Structure

```
C-COD-270-COT-2-1-c2cod270p0-3/
├── app/                          # Next.js App Router
│   ├── about/                    # About page
│   ├── admin/                    # Admin panel
│   │   ├── dashboard/            # Dashboard with KPIs
│   │   ├── users/                # User management
│   │   ├── movies/               # Movie management
│   │   └── movies-tmdb/          # TMDB import interface
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── logout/
│   │   │   ├── resend/
│   │   │   └── verify/[token]/
│   │   ├── movies/               # Movies CRUD
│   │   ├── comments/             # Comments CRUD
│   │   ├── ratings/              # Ratings CRUD
│   │   ├── users/                # Users CRUD (admin)
│   │   ├── favorites/            # Favorites toggle
│   │   ├── directors/            # List directors
│   │   ├── kpis/                 # Dashboard KPIs
│   │   ├── me/                   # Current user info
│   │   └── admin/
│   │       └── import-movie/     # TMDB import
│   ├── docs/                     # API documentation (Swagger UI)
│   ├── favorites/                # User favorites page
│   ├── login/                    # Login page
│   ├── movies/                   # Movies listing
│   │   └── [id]/                 # Movie detail page
│   ├── profile/                  # User profile page
│   ├── register/                 # Registration page
│   ├── unauthorized/             # Unauthorized access page
│   └── verify-email/             # Email verification page
├── components/                   # React components
│   ├── auth/                     # Auth components
│   ├── comments/                 # Comment components
│   ├── layout/                   # Layout components (Header, Footer)
│   ├── movie/                    # Movie components (Card, List, Filter)
│   ├── ratings/                  # Rating components (Stars)
│   └── users/                    # User components (UpdateModal)
├── docs/                         # Documentation files
├── hooks/                        # Custom React hooks
│   └── useAuth.js                # Authentication hook
├── lib/                          # Utility libraries
│   ├── auth.js                   # Auth utilities
│   ├── comments.js               # Comment utilities
│   ├── cookies.js                # Cookie management
│   ├── jwt.js                    # JWT utilities
│   ├── mailer.js                 # Email sending
│   ├── prisma.js                 # Prisma clients (direct & accelerate)
│   ├── ratings.js                # Rating utilities
│   ├── session.js                # Session management
│   ├── tmdb.js                   # TMDB API client
│   └── validation.js             # Validation utilities
├── prisma/                       # Prisma configuration
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── public/                       # Static files
│   ├── openapi.json              # OpenAPI specification
│   └── Logo.png                  # Application logo
├── scripts/                      # Utility scripts
├── validators/                   # Validation schemas
│   └── auth.js                   # Auth validation (Zod)
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # TailwindCSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
└── README.md                     # This file
```

---

## 📚 API Documentation

### Complete API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout current user
- `POST /api/auth/resend` - Resend verification email
- `GET /api/auth/verify/{token}` - Verify email with token
- `GET /api/me` - Get current user information

#### Movies
- `GET /api/movies` - List movies (with pagination, filters)
  - Query params: `page`, `limit`, `genre`
- `GET /api/movies/{id}` - Get movie details
- `DELETE /api/movies/{id}` - Delete movie (admin only)

#### Comments
- `GET /api/comments?movieId={id}` - Get comments for a movie
- `POST /api/comments` - Create a comment
- `GET /api/comments/{id}` - Get specific comment
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

#### Ratings
- `GET /api/ratings?movieId={id}` - Get ratings for a movie
- `POST /api/ratings` - Create/update rating
- `GET /api/ratings/{id}` - Get specific rating
- `PUT /api/ratings/{id}` - Update rating
- `DELETE /api/ratings/{id}` - Delete rating

#### Favorites
- `POST /api/favorites` - Toggle movie as favorite
  - Body: `{ userId, movieId }`

#### Admin
- `GET /api/users` - List all users (admin only)
- `POST /api/users` - Create user (admin only)
- `GET /api/users/{id}` - Get user details (admin only)
- `PUT /api/users/{id}` - Update user (admin only)
- `DELETE /api/users/{id}` - Delete user (admin only)
- `POST /api/admin/import-movie` - Import movie from TMDB (admin only)
  - Body: `{ tmdbId }`
- `GET /api/kpis` - Get dashboard KPIs (admin only)
- `GET /api/directors` - Get list of all directors

### Interactive API Documentation

Visit `/docs` for the complete Swagger UI documentation with:
- All endpoints with descriptions
- Request/response schemas
- Try-it-out functionality
- Authentication flows

---

## 🔐 Authentication Flow

### Registration Process
1. User submits registration form with email, password, name, surname, profession, birthday
2. System validates input with Zod schema
3. Password is hashed with bcrypt (12 rounds)
4. User record created with `verified: false`
5. Verification token (UUID) generated
6. Verification email sent with link
7. User clicks link → token verified → account activated

### Login Process
1. User submits email and password
2. System checks if user exists and is verified
3. Password compared with bcrypt
4. JWT token generated with user id, email, and role
5. Token stored in HTTP-only cookie (`sid`)
6. User redirected to homepage

### Protected Routes
- Frontend: `useAuth()` hook checks `/api/me` endpoint
- API: Routes verify JWT token from cookie
- Admin routes: Additional check for `role === "ADMIN"`

---

## 🎛 Admin Panel

### Access
1. User must have `role: "ADMIN"` in database
2. Navigate to `/admin` or click Admin button in header
3. Dark-themed interface with sidebar navigation

### Dashboard (`/admin`)
- **Statistics Cards**: Total users, active (verified) users, movies, comments
- **Popular Genres**: Top genres sorted by average rating
- **Movies by Age Group**: Top 5 movies per demographic
- **Quick Actions**: Links to user/movie management

### User Management (`/admin/users`)
- View all users with pagination
- Filter by role (USER/ADMIN) and status (verified/unverified)
- Search by name or email
- Create new users
- Edit user details (name, email, role, profession)
- Delete users

### Movie Management (`/admin/movies`)
- View all movies from database
- Paginated list with movie details
- Delete movies (cascade deletes ratings, comments, favorites)

### TMDB Import (`/admin/movies-tmdb`)
- Browse popular and top-rated movies from TMDB
- Filter by genre and year
- Search functionality
- Click "+ ADD" to import movie with:
  - Complete metadata (title, description, tagline)
  - Cast and crew information
  - Budget, revenue, runtime
  - Poster and backdrop images
  - Release date and status

---

## 🗃 Database Schema

### User
```prisma
model User {
  id                Int         @id @default(autoincrement())
  email             String      @unique
  password          String
  name              String?
  surname           String?
  profession        String?
  birthday          String?
  role              Role        @default(USER)
  verified          Boolean     @default(false)
  verificationToken String?
  favorites         Favorite[]
  ratings           Rating[]
  comments          Comment[]
  createdAt         DateTime    @default(now())
}
```

### Movie
```prisma
model Movie {
  id               Int         @id @default(autoincrement())
  tmdbId           Int?        @unique
  title            String
  originalTitle    String?
  description      String      @db.Text
  tagline          String?
  posterUrl        String?
  backdropUrl      String?
  releaseDate      DateTime?
  director         String?
  genres           String[]
  runtime          Int?
  status           String?
  voteAverage      Float?
  voteCount        Int?
  budget           BigInt?
  revenue          BigInt?
  homepage         String?
  originalLanguage String?
  cast             Json?
  crew             Json?
  ratings          Rating[]
  comments         Comment[]
  favorites        Favorite[]
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @default(now()) @updatedAt
}
```

### Relations
- **Favorite**: Many-to-many between User and Movie
- **Rating**: Many-to-many with score (1-10)
- **Comment**: Many-to-many with content

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Database**
   - Use Vercel Postgres, or
   - Connect to external PostgreSQL (Railway, Supabase, etc.)

4. **Environment Variables**
   - Add all `.env` variables in Vercel dashboard
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to production URL

### Other Platforms

#### Railway
1. Create new project
2. Add PostgreSQL database
3. Connect GitHub repository
4. Configure environment variables
5. Deploy

#### Docker
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📜 Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build           # Build for production
npm run start           # Start production server

# Database
npx prisma generate     # Generate Prisma Client
npx prisma migrate dev  # Run migrations
npx prisma studio       # Open Prisma Studio
npx prisma db push      # Push schema to database

# Linting
npm run lint            # Run ESLint

# Validation
npm run validate:openapi # Validate OpenAPI spec
```

---

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "[ADD] new feature"
   git commit -m "[FIX] resolve bug in component"
   ```

5. **Push and create Pull Request**
   ```bash
   git push origin feat/your-feature-name
   ```

### Code Style
- Use ESLint configuration
- Follow React best practices
- Use meaningful variable names
- Comment complex logic
- Keep components small and focused

---

## 👥 Team

**2WLG Team**

Made with ❤️ by the 2WLG Team at Epitech Coding Academy

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🐛 Known Issues

### Prisma Accelerate Connection Issues
- **Issue**: Intermittent "Cannot fetch data from service" errors
- **Solution**: Critical routes use `prismaDirect` instead of `prisma` (with Accelerate)
- **Affected Routes**: Auth, users, KPIs, favorites, directors

### TMDB Rate Limiting
- **Issue**: Too many requests to TMDB API
- **Solution**: Implement caching or rate limiting on import

---

## 🔮 Future Enhancements

- [ ] User profile avatars
- [ ] Social sharing of reviews
- [ ] Advanced search with multiple filters
- [ ] Movie recommendations based on ratings
- [ ] Email notifications for new comments
- [ ] Movie watchlist feature
- [ ] Mobile app (React Native)
- [ ] Multi-language support (i18n)

---

## 📞 Support

For issues, questions, or suggestions:
1. Check existing [GitHub Issues]
2. Create a new issue with detailed description
3. Contact the development team

---

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the amazing API
- [Next.js Team](https://nextjs.org/) for the excellent framework
- [Prisma Team](https://www.prisma.io/) for the powerful ORM
- [Vercel](https://vercel.com/) for hosting platform
- Epitech Coding Academy for the project opportunity

---

<div align="center">

**⭐ If you like this project, please give it a star on GitHub! ⭐**

Made with 🍿 and ❤️

</div>
