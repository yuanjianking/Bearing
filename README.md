# 🏗️ Personal System Structuring Tool (PSST)

## 📋 Project Overview

The **Personal System Structuring Tool** is a visual personal system management tool built with React, TypeScript, and ReactFlow. It employs a three-layer load-bearing structure design philosophy to help users transform abstract personal development goals into visual, actionable system diagrams.

## 🌐 Live Demo
**Experience it now:** [https://yuanjianking.github.io/Bearing/](https://yuanjianking.github.io/Bearing/)

## 🎯 Design Philosophy

### Three-Layer Load-Bearing Structure
The system adopts architectural "load-bearing structure" concepts, dividing personal systems into three hierarchical layers:

1. **Core Purpose Layer** (Life Vision Layer) - Top-level load-bearing
2. **Primary Goals Layer** (Implementation Path Layer) - Middle-level load-bearing
3. **Foundation Support Layer** (Daily Practice Layer) - Base-level load-bearing

Each layer supports the weight of the layers above while providing structural stability, forming a complete and resilient personal development system.

## ✨ Core Features

### 🏗️ Three-Layer Visualization Architecture
- **Intelligent Height Allocation**: Automatic 1:2:3 proportional height distribution
- **Gradient Background**: Blue gradient from light to dark with clear visual hierarchy
- **Node Layer Constraints**: Smart containment of nodes within designated layers

### 🖱️ Advanced Interaction Features
- **Smart Boundary Detection**: Automatic layer boundary calculation during node dragging
- **Cross-Layer Connection Support**: Logical connections between different hierarchical layers
- **Viewport Locking**: Fixed viewport range for focused content area
- **Responsive Zooming**: Wheel-based zooming while maintaining structural integrity

### 📊 History & Insights
- **System Snapshots**: Save system states across different time periods
- **Change Tracking**: Record node adjustments and connection changes
- **Intelligent Analysis**: Identify persistent nodes and pattern changes
- **Timeline Navigation**: View system evolution along a chronological axis

### 🎨 Aesthetic Visual Design
- **Modern UI**: Clean and intuitive interface design
- **Custom Nodes**: Carefully designed node visuals
- **Smooth Animations**: Fluid interaction transitions
- **Responsive Layout**: Perfect adaptation across various screen sizes

## 🛠️ Technical Architecture

### Frontend Tech Stack
- **React 19** - Modern React framework
- **TypeScript** - Type-safe JavaScript superset
- **ReactFlow** - Professional flowchart visualization library
- **CSS Modules** - Modular style management
- **ResizeObserver API** - Responsive dimension monitoring
- **Vite** - Next generation frontend tooling

### Architectural Highlights
- **Unidirectional Data Flow**: Clear data management
- **Component-Based Design**: Highly reusable components
- **Type Safety**: Comprehensive TypeScript type definitions
- **Performance Optimization**: Intelligent rendering and state management

## 📁 Project Structure

```
src/
├── components/
│   └── CenterPanel/              # Core visualization component
│       ├── CenterPanel.tsx       # Main component (ReactFlow Provider)
│       ├── CenterPanelInner.tsx  # Three-layer structure implementation
│       └── CenterPanel.module.css # Style module
├── hooks/
│   └── useLayerExtents.ts        # Custom Hook: Layer boundary calculation
├── App.tsx                       # Application entry point
└── styles/                       # Global styles
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+ or yarn 1.22+

### Installation & Setup
```bash
# Clone the repository
git clone https://github.com/yuanjianking/Bearing.git
cd Bearing

# Install dependencies
npm install

# Start development server
npm run dev

# Build production version
npm run build

# Deploy to GitHub Pages
npm run deploy
```

Access the live demo at [https://yuanjianking.github.io/Bearing/](https://yuanjianking.github.io/Bearing/)

Development server runs at http://localhost:5173

## 🎮 User Guide

### Basic Operations
1. **Drag Nodes**: Freely drag nodes within their designated layers
2. **Create Connections**: Drag from one node to another to create connections
3. **Adjust View**: Use mouse wheel to zoom, right-click and drag to pan
4. **Save Snapshots**: Click "Seal Structure" to save current state

### Three-Layer Structure Operations
- **Core Purpose Layer**: Place long-term visions and core values
- **Primary Goals Layer**: Set medium-term objectives and key results
- **Foundation Support Layer**: Plan daily practices and habit formation

### Node Management
- Each node represents a system element (goals, habits, projects, etc.)
- Nodes can move freely within their designated layers but cannot cross layers
- Supports logical connections between nodes to form system networks

## 🎯 Application Scenarios

### Personal Growth Management
- Annual goal setting and tracking
- Skill development planning
- Habit formation systems

### Project Management
- Project architecture design
- Task dependency management
- Team role coordination

### Life System Construction
- Health management systems
- Financial planning systems
- Learning path design

## 📱 Compatibility

- **Desktop Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Devices**: iOS Safari 14+, Android Chrome 90+
- **Screen Sizes**: Supports various resolutions from mobile phones to 4K displays

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

### Code Standards
- Use TypeScript strict mode
- Follow ESLint configuration
- Add necessary unit tests
- Update relevant documentation

## 🔗 Related Resources
- **GitHub Repository**: [https://github.com/yuanjianking/Bearing](https://github.com/yuanjianking/Bearing)
- **Live Demo**: [https://yuanjianking.github.io/Bearing/](https://yuanjianking.github.io/Bearing/)
- **Issue Tracker**: [https://github.com/yuanjianking/Bearing/issues](https://github.com/yuanjianking/Bearing/issues)

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## 📞 Support & Feedback

- **Issue Reporting**: [GitHub Issues](https://github.com/yuanjianking/Bearing/issues)
- **Feature Suggestions**: [Feature Requests](https://github.com/yuanjianking/Bearing/discussions)
- **Documentation Improvements**: [Documentation](https://github.com/yuanjianking/Bearing/wiki)

## 🙏 Acknowledgments

Thanks to all contributors and users, with special appreciation to:
- The [ReactFlow](https://reactflow.dev/) team for their excellent visualization library
- All early users who participated in testing and provided feedback
- Personal system management practitioners who provided inspiration
- GitHub Pages for providing free hosting and deployment

---

**🌟 Vision**: Help everyone build their own sustainable growth systems.

**💡 Philosophy**: Good systems should be as solid as architecture and as flexible as life.

**🚀 Goal**: Transform personal system management from abstract concepts into visual practice.

**🌐 Live Access**: Visit [https://yuanjianking.github.io/Bearing/](https://yuanjianking.github.io/Bearing/) to start building your personal system today!