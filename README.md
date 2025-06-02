# AI Resume Builder

An intelligent resume generation system that creates customized, ATS-friendly resumes based on user inputs. The application uses AI to provide content suggestions, analyze ATS compatibility, and optimize resumes for specific job descriptions.

## Features

- 🤖 AI-powered content generation and suggestions
- 📊 ATS compatibility analysis
- 🎯 Job description matching
- 🔍 Industry-specific keyword optimization
- 📝 Multiple export formats (PDF, DOCX, HTML)
- 🎨 4 customizable templates
- 💾 Local storage for data privacy
- 📱 Responsive design for all devices

## Live Demo

[View Live Demo](https://airesumebuilder.netlify.app/)

## Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- A Groq API key for AI features

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mooncakesg/ai-resume-builder.git
cd ai-resume-builder
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the project root:
```env
VITE_GROQ_API_KEY=your-api-key-here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

## Documentation

- [User Guide](docs/user-guide.md)
- [Technical Report](docs/technical-report.md)
- [API Documentation](docs/api-docs.md)

## Project Structure

```
ai-resume-builder/
├── src/
│   ├── components/      # React components
│   ├── lib/            # Core libraries
│   ├── utils/          # Utility functions
│   ├── styles/         # Global styles
│   └── App.jsx         # Main application
├── public/             # Static assets
├── docs/              # Documentation
└── tests/             # Test files
```

## Technologies Used

- React + Vite
- Tailwind CSS
- Material-UI
- Groq API
- jsPDF
- docx-js
- file-saver

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Groq](https://groq.com) for AI capabilities
- [Material-UI](https://mui.com) for UI components
- [Tailwind CSS](https://tailwindcss.com) for styling
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation

