# Contributing to AI Video Clipper

Thank you for your interest in contributing to the AI Video Clipper project! This document provides guidelines and instructions for contributing.

## 📋 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🐛 Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**How to Submit a Good Bug Report:**

1. Use a clear and descriptive title
2. Describe the exact steps which reproduce the problem
3. Provide specific examples to demonstrate those steps
4. Describe the behavior you observed after following the steps
5. Explain which behavior you expected to see instead and why
6. Include screenshots and animated GIFs if possible
7. Include your environment details (OS, Python version, Node version, etc.)

## ✨ Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, provide the following information:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Include specific examples to demonstrate the steps
- Describe the current behavior and expected behavior
- Explain why this enhancement would be useful

## 🔄 Pull Request Process

### Before You Start

1. Fork the repository
2. Create a new branch for your feature/fix
3. Make sure you have the development environment set up (see README.md)

### Branch Naming Convention

Use descriptive branch names following this pattern:

```
feature/description          # New features
fix/description              # Bug fixes
docs/description             # Documentation updates
chore/description            # Maintenance, dependency updates
refactor/description         # Code refactoring
test/description             # Test additions or improvements
```

Examples:
```
feature/add-batch-processing
fix/face-detection-lag
docs/update-api-endpoints
chore/update-dependencies
```

### Commit Message Guidelines

Write clear and meaningful commit messages:

```
<type>: <description>

<optional body>

<optional footer>
```

**Types:**
- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Changes that don't affect code meaning (formatting, etc.)
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `perf:` - Code change that improves performance
- `test:` - Adding or updating tests
- `chore:` - Changes to build process, dependencies, etc.

**Examples:**
```
feat: add batch video processing support

fix: resolve face detection jitter with improved EMA smoothing

docs: add WebSocket endpoint documentation

chore: update FFmpeg dependency to latest version
```

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write clean, readable code
   - Follow the project's code style
   - Update documentation as needed

3. **Test your changes:**
   ```bash
   # Backend tests
   cd backend && pytest

   # Frontend tests
   cd frontend && npm run test

   # Type checking (Frontend)
   cd frontend && npm run type-check
   ```

4. **Commit with meaningful messages:**
   ```bash
   git commit -m "feat: add subtitle style presets"
   ```

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request:**
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe your changes clearly
   - Include before/after screenshots for UI changes

### Pull Request Checklist

Before submitting your PR, make sure you have:

- [ ] Forked the repository and created a branch from `main`
- [ ] Read the README and CONTRIBUTING guidelines
- [ ] Made changes in a new git branch with an appropriate name
- [ ] Updated documentation and README.md if needed
- [ ] Added tests for any new functionality
- [ ] Verified that all tests pass locally
- [ ] Followed the code style guidelines (see below)
- [ ] Written clear, descriptive commit messages
- [ ] Ensured no unnecessary files are included (node_modules, __pycache__, etc.)

## 📝 Code Style Guidelines

### Python Backend

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guidelines
- Use meaningful variable names
- Add docstrings to functions and classes
- Use type hints where appropriate
- Maximum line length: 100 characters
- Use `black` for code formatting:
  ```bash
  pip install black
  black app/
  ```

**Example:**
```python
def transcribe_audio(audio_path: str, model_name: str = "large-v2") -> List[WordSegment]:
    """
    Transcribe audio file to text with word-level timestamps.
    
    Args:
        audio_path: Path to the audio file
        model_name: WhisperX model size
        
    Returns:
        List of WordSegment objects with timestamps
        
    Raises:
        FileNotFoundError: If audio file doesn't exist
    """
    # Implementation here
    pass
```

### Frontend (TypeScript/React)

- Follow [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- Use functional components with hooks
- Use TypeScript for type safety
- Component names should be PascalCase
- Use descriptive and intuitive naming
- Maximum line length: 100 characters
- Use Prettier for code formatting:
  ```bash
  cd frontend && npm run format
  ```

**Example:**
```typescript
interface ClipCardProps {
  virality_score: number;
  title: string;
  startTime: number;
  endTime: number;
  onRender: () => void;
}

export const ClipCard: React.FC<ClipCardProps> = ({
  virality_score,
  title,
  startTime,
  endTime,
  onRender,
}) => {
  return (
    <div className="clip-card glass-morphism">
      <div className="virality-score">{virality_score}/100</div>
      <h3>{title}</h3>
      <button onClick={onRender}>Render</button>
    </div>
  );
};
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
pytest test_tracker.py -v
```

### Frontend Testing

```bash
cd frontend
npm run test
npm run test:coverage
```

Write tests for:
- New features
- Bug fixes
- Edge cases
- Error handling

## 📚 Documentation

- Keep README.md up to date
- Document new API endpoints with examples
- Add JSDoc comments for TypeScript functions
- Add docstrings for Python functions
- Update this CONTRIBUTING.md if you add new processes

## 🎨 Design Considerations

- Maintain dark theme aesthetic (as per design system)
- Ensure responsive design (mobile-first approach)
- Follow accessibility best practices (WCAG 2.1)
- Use existing design tokens from globals.css
- Test with different devices and browsers

## 🔐 Security

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Keep dependencies updated
- Report security vulnerabilities responsibly

## 📦 Dependencies

When adding new dependencies:

**Backend:**
```bash
cd backend
pip install new-package
pip freeze > requirements.txt  # Update requirements
```

**Frontend:**
```bash
cd frontend
npm install new-package
git add package.json package-lock.json
```

Document why the new dependency is needed in your PR description.

## ❓ Questions?

- Check existing issues and discussions
- Review the README and execution guidelines
- Ask in pull request comments
- Open a new issue with your question

## 🙏 Thank You!

Your contributions help make this project better. We appreciate your time and effort!

---

**Happy Contributing! 🚀**