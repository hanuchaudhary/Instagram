# Instagram Clone

A full-stack Instagram clone built with modern web technologies, featuring real-time updates, image sharing, and social interactions.

## 🚀 Features

- User authentication and authorization
- Image upload and management
- Real-time feed updates
- Post creation and interaction (likes, comments)
- User profiles and following system
- Responsive design for mobile and desktop

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Zod** - Schema validation

### Backend
- **Express.js** - Node.js framework
- **JWT** - Authentication
- **Cloudinary** - Image storage and optimization

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/hanuchaudhary/Instagram.git
cd Instagram
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env)
VITE_API_URL=your_api_url
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# Backend (.env)
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/instagram_clone"
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🚀 Running the Application

### Development Mode
```bash
# Run frontend
cd client
npm run dev

# Run backend
cd backend
tsc -b
node dist/index.js
```

### Production Mode
```bash
# Build frontend
cd client
npm run build

# Build backend
cd server
npm run build
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /user/signup` - Register new user
- `POST /user/signin` - User login
- `POST /user/verify` - Verify JWT token

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Instagram for inspiration
- Shadcn UI for the amazing component library
- The open-source community for various tools and libraries

## 📧 Contact

KushChaudharyOg - [@your_twitter](https://x.com/KushChaudharyOg)

Project Link: [https://github.com/hanuchaudhary/Instagram](https://github.com/hanuchaudhary/Instagram)
