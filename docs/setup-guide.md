# AI Resume Builder Setup Guide

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser
- Text editor (VS Code recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-resume-builder.git
cd ai-resume-builder
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
# Create .env file
cp .env.example .env

# Add your API keys
VITE_GROQ_API_KEY=your_groq_api_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open http://localhost:5173 in your browser

## Development Setup

### Project Structure
```
ai-resume-builder/
├── src/
│   ├── components/     # React components
│   ├── lib/           # Utilities and services
│   ├── styles/        # Global styles
│   └── App.jsx        # Main application
├── public/            # Static assets
├── docs/             # Documentation
└── package.json      # Project configuration
```

### Key Features
- React + Vite for fast development
- Tailwind CSS for styling
- AI integration via Groq
- Multiple resume templates
- ATS compatibility checking

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

## Deployment

### Building for Production
1. Update environment variables for production
2. Build the project:
```bash
npm run build
```
3. Test the production build:
```bash
npm run preview
```

### Deployment Options

#### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

#### Manual Deployment
1. Build the project
2. Copy the `dist` folder to your server
3. Configure server to serve static files
4. Set up environment variables

## Configuration

### Environment Variables
- `VITE_GROQ_API_KEY`: Your Groq API key
- Add other variables as needed

### API Rate Limits
- Groq API: Varies by plan
- Implement rate limiting in production

## Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run specific test file
npm run test src/components/__tests__/Resume.test.js

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
```bash
npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version
   - Clear node_modules and reinstall
   - Verify environment variables

2. **API Issues**
   - Verify API key
   - Check API status
   - Review rate limits

3. **Development Server**
   - Check port conflicts
   - Clear browser cache
   - Review console errors

### Getting Help
- Check GitHub issues
- Review documentation
- Join Discord community

## Contributing

### Development Process
1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests
5. Submit pull request

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Follow component structure

## License
MIT License - see LICENSE file

## Support
- GitHub Issues
- Email Support
- Community Forums 