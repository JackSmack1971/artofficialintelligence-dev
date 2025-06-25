#!/bin/bash
# install.sh - ArtOfficial Intelligence Website Development Environment Setup
# Ubuntu Linux environment for AI coding agents

set -e  # Exit on any error

echo "🚀 Setting up ArtOfficial Intelligence Website Development Environment"
echo "============================================================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on Ubuntu
check_ubuntu() {
    if ! grep -q "Ubuntu" /etc/os-release 2>/dev/null; then
        print_warning "This script is designed for Ubuntu. Proceeding anyway..."
    fi
}

# Update system packages
update_system() {
    print_status "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    print_success "System packages updated"
}

# Install essential development tools
install_dev_tools() {
    print_status "Installing essential development tools..."
    sudo apt install -y \
        curl \
        wget \
        git \
        build-essential \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        unzip \
        vim \
        tree \
        htop \
        jq
    print_success "Development tools installed"
}

# Install Node.js 18+ (required for React 18)
install_nodejs() {
    print_status "Installing Node.js 18..."
    
    # Remove any existing Node.js
    sudo apt remove -y nodejs npm 2>/dev/null || true
    
    # Install NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    
    # Verify installation
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    
    print_success "Node.js installed: $NODE_VERSION"
    print_success "npm installed: $NPM_VERSION"
    
    # Check minimum version requirement
    if ! node -pe "process.version.slice(1).split('.')[0] >= 18"; then
        print_error "Node.js version 18+ required. Current: $NODE_VERSION"
        exit 1
    fi
}

# Install pnpm (preferred package manager)
install_pnpm() {
    print_status "Installing pnpm..."
    npm install -g pnpm
    
    PNPM_VERSION=$(pnpm --version)
    print_success "pnpm installed: $PNPM_VERSION"
}

# Configure vim for better development experience
    
    
    # Create basic .vimrc for better coding experience
    cat > ~/.vimrc << 'EOF'
" Basic vim configuration for development
set number              " Show line numbers
set relativenumber      " Show relative line numbers
set tabstop=2           " Tab width
set shiftwidth=2        " Indent width
set expandtab           " Use spaces instead of tabs
set autoindent          " Auto-indent new lines
set smartindent         " Smart indenting
set hlsearch            " Highlight search results
set incsearch           " Incremental search
set ignorecase          " Case insensitive search
set smartcase           " Case sensitive if uppercase present
set mouse=a             " Enable mouse support
set clipboard=unnamedplus " Use system clipboard
set syntax=on           " Enable syntax highlighting
set background=dark     " Dark background
set showcmd             " Show command in status line
set showmatch           " Show matching brackets
set ruler               " Show cursor position
set wildmenu            " Enhanced command completion
set scrolloff=8         " Keep 8 lines visible when scrolling

" File type detection
filetype on
filetype plugin on
filetype indent on

" Basic key mappings
nnoremap <C-s> :w<CR>
inoremap <C-s> <Esc>:w<CR>a

" Set file types for common extensions
autocmd BufNewFile,BufRead *.tsx set filetype=typescript
autocmd BufNewFile,BufRead *.jsx set filetype=javascript
autocmd BufNewFile,BufRead *.ts set filetype=typescript
autocmd BufNewFile,BufRead *.js set filetype=javascript
EOF
    
    print_success "vim configured for development"
}

# Install Git and configure basics
setup_git() {
    print_status "Configuring Git..."
    
    # Check if Git is already configured
    if ! git config --global user.name &> /dev/null; then
        print_status "Setting up basic Git configuration..."
        git config --global user.name "AI Agent"
        git config --global user.email "ai-agent@artofficial-intelligence.local"
        git config --global init.defaultBranch main
        print_success "Git configured with default settings"
    else
        print_success "Git already configured"
    fi
}

# Install project dependencies
install_project_deps() {
    print_status "Installing project dependencies..."
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_warning "package.json not found. Creating project first..."
        create_project_structure
    fi
    
    # Install dependencies
    pnpm install
    print_success "Project dependencies installed"
}

# Create basic project structure if it doesn't exist
create_project_structure() {
    print_status "Creating project structure..."
    
    # Create directories
    mkdir -p src/{components/{ui,layout},pages,lib,data,types}
    mkdir -p public
    mkdir -p tests
    
    # Create basic package.json if it doesn't exist
    if [ ! -f "package.json" ]; then
        cat > package.json << 'EOF'
{
  "name": "artofficial-intelligence",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 3000",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "vitest": "^1.0.4"
  }
}
EOF
        print_success "Basic package.json created"
    fi
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f ".env.example" ]; then
        cat > .env.example << 'EOF'
# ArtOfficial Intelligence Website Environment Variables
VITE_APP_NAME=ArtOfficial Intelligence
VITE_APP_DESCRIPTION=Your source for AI news and insights
VITE_APP_URL=http://localhost:3000
EOF
        print_success ".env.example created"
    fi
    
    if [ ! -f ".env.local" ]; then
        cp .env.example .env.local
        print_success ".env.local created"
    fi
}

# Create basic configuration files
setup_config_files() {
    print_status "Setting up configuration files..."
    
    # TypeScript config
    if [ ! -f "tsconfig.json" ]; then
        cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "react-jsx",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "tests"],
  "exclude": ["node_modules", "dist"]
}
EOF
        print_success "tsconfig.json created"
    fi
    
    # Vite config
    if [ ! -f "vite.config.ts" ]; then
        cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
EOF
        print_success "vite.config.ts created"
    fi
    
    # Tailwind config
    if [ ! -f "tailwind.config.js" ]; then
        cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ai-primary': '#3B82F6',
        'ai-secondary': '#8B5CF6',
        'ai-accent': '#10B981',
      }
    },
  },
  plugins: [],
}
EOF
        print_success "tailwind.config.js created"
    fi
}

# Run development environment checks
run_checks() {
    print_status "Running environment checks..."
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        print_success "Node.js version check passed: $(node --version)"
    else
        print_error "Node.js version check failed. Required: 18+, Found: $(node --version)"
        exit 1
    fi
    
    # Check pnpm
    if command -v pnpm &> /dev/null; then
        print_success "pnpm check passed: $(pnpm --version)"
    else
        print_error "pnpm not found"
        exit 1
    fi
    
    # Check if project can be built
    if [ -f "package.json" ]; then
        print_status "Testing project build..."
        if pnpm run build &> /dev/null; then
            print_success "Project build test passed"
        else
            print_warning "Project build test failed (this is expected for new projects)"
        fi
    fi
}

# Main installation flow
main() {
    echo "🎯 Target: AI News Website MVP Development Environment"
    echo "🤖 For: AI Coding Agents on Ubuntu Linux"
    echo ""
    
    check_ubuntu
    update_system
    install_dev_tools
    install_nodejs
    install_pnpm
    configure_vim
    setup_git
    create_project_structure
    setup_environment
    setup_config_files
    install_project_deps
    run_checks
    
    echo ""
    echo "============================================================================"
    print_success "🎉 Development environment setup complete!"
    echo ""
    echo "📋 Next steps for AI agents:"
    echo "   1. Use 'vim' to edit files following AGENTS.md patterns"
    echo "   2. Run 'pnpm dev' to start development server"
    echo "   3. Build pages according to src/pages/AGENTS.md"
    echo "   4. Create components per src/components/AGENTS.md"
    echo "   5. Use 'tree src/' to view project structure"
    echo ""
    echo "🚀 Quick commands:"
    echo "   pnpm dev     # Start development server"
    echo "   pnpm build   # Build for production"
    echo "   pnpm test    # Run tests"
    echo "   tree src/    # View project structure"
    echo "   vim src/     # Edit source files"
    echo ""
    print_success "Environment ready for AI agents to start coding!"
}

# Run main function
main "$@"
