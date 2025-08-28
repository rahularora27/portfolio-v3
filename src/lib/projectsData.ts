export interface Project {
  id: string;
  title: string;
  description: string;
  github: string;
  deployment?: string;
  technologies: string[];
  detailedContent?: string;
}

export const projectsData: Project[] = [
  {
    id: "portfolio-v3",
    title: "Portfolio Website",
    description: "A modern portfolio website built with React, TypeScript, and Tailwind CSS. Features dark mode and responsive design.",
    github: "https://github.com/rahularora27/portfolio-v3",
    deployment: "https://rahularora.tech",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    detailedContent: `
# Portfolio Website v3

This is my third iteration of my personal portfolio website, built from the ground up with modern web technologies.

## 🚀 Features

- **Modern Tech Stack**: Built with React 18, TypeScript, and Vite for blazing fast development and build times
- **Responsive Design**: Fully responsive layout that works seamlessly across all devices
- **Dark Mode**: Complete dark/light theme toggle with system preference detection
- **Performance Optimized**: Optimized for Core Web Vitals and SEO

## 🎯 Goals

The main goal was to create a clean, professional portfolio that showcases my work while demonstrating my technical skills. I wanted something that was:

- Fast and lightweight
- Easy to maintain and update
- Accessible and user-friendly
- Visually appealing in both light and dark modes

## 🛠️ Technical Implementation

### Frontend Architecture
The application follows a component-based architecture using React functional components with hooks. I chose TypeScript for better type safety and developer experience.

### Styling Approach
I used Tailwind CSS for styling, which allowed for rapid development while maintaining consistent design patterns. The dark mode implementation uses CSS variables and Tailwind's dark mode classes.

### Performance Considerations
- Code splitting with React.lazy for better bundle management
- Optimized images and assets
- Efficient routing with React Router
- Minimal dependencies to keep bundle size small

## 🎨 Design Philosophy

The design follows a minimalist approach with:
- Clean typography using system fonts
- Subtle animations and hover effects
- Consistent spacing and color schemes
- Focus on readability and user experience

## 📈 Results

The website achieves excellent performance scores:
- 100/100 Performance on Lighthouse
- 100/100 Accessibility score
- 100/100 Best Practices
- 100/100 SEO score

## 🔮 Future Enhancements

- Add more interactive elements
- Implement a contact form
- Add project filtering and search
- Include more detailed case studies
    `
  },
];