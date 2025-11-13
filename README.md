# ‧ 🍒 ⋅ ˚✮ My Rotten Tomatoes

A platform dedicated to reviews and information about the films a bit like Rotten Tomatoes



## Features

* **Authentication** – Secure user login and registration and Oauth2 authentication
  
* **Database** – Postgres for storing users, movies, comments, favorites, rates
  
* **Admin Panel** – Import movies from TMDB API into local database
  
* **Frontend** – Responsive UI built with NextJs, React 19, and TailwindCSS 4
  
* **Backend API** – NextJs App Router, Prisma with Accelerate, and TMDB API
  
* **Deployment Ready** – Easily deploy project with ***Vercel***
  


## Tech Stack

<div style="display: flex; gap: 10px;">
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React">
  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next Js">
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres">

</div>



## Installations

1. Clone the repository
   
2. Install dependencies
    ```bash
    npm install
    ```

3. Environments setup
   ```bash
   cp .env.example .env
   ```
    Update .env with your configuration:

      * **TMDB API Key** - Get yours at https://www.themoviedb.org/settings/api
      * **Database URLs** - Configure Prisma Accelerate connection
      * **SMTP Settings** - For email verification
      * **JWT Secret** - For authentication tokens

   Example .env:
   ```env
   # TMDB API
   NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
   NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
   NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

   # Database (Prisma Accelerate)
   DATABASE_URL="postgresql://user:pass@localhost:5432/db"
   ACCELERATE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."

   # SMTP
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password

   # JWT
   JWT_SECRET="your_secret_key"
   JWT_EXPIRES_IN="7d"
   ```
  
4. Database setup
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. Development
   ```bash
    npm run dev
    ```
   Access the app at http://localhost:3000

6. Admin Import (for admins only)
   - Navigate to http://localhost:3000/admin/movies-tmdb
   - Click "+ ADD" to add the movie to your local database
   - View imported movies at http://localhost:3000/admin/movies

7. Production Build
    ```bash
    npm run build
    ```
  

## Repository Structure
```
.
├── app
│   ├── generated
│   │   └── prisma
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── eslint.config.mjs
├── LICENSE
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── public
├── README.md
└── tsconfig.json

```



## Architecture Overview


### Frontend 

* Built with NextJs + tailwindCSS + JavaScript

### Backend 

* Built with NextJs, MovieDB
  
* Handles authentication, rating, comments, users management

### Database Tables

![alt text](image.png)

| Table        | Purpose          | 
| :----------- | :-------------- |
| **users**| authentication and users management|
| **movies**    | store movies from MovieDB API   |
| **comments**    | store users comments on a Movie   |
| **favorites**    | set up a wishlist for each user   |
| **rates**    | store marks given by the user on each movie   |

## Helpful Commands Tools

### Prisma

To visualize database content run :

```bash
npx prisma studio

```

To run a seed run :

```bash
npx prisma db seed

```

To to create the database tables:

```bash
npx prisma migrate dev

```
## License
This project is licensed under the  [MIT](https://choosealicense.com/licenses/mit/)—see the LICENSE file for details.

