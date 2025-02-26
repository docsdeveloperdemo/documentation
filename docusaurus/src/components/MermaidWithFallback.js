// src/components/DocusaurusMermaidFileFallback.js
import React, { useEffect, useState, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

export default function DocusaurusMermaidFileFallback({ 
  chartFile,
  fallbackImage, 
  fallbackImageDark, 
  alt, 
  className 
}) {
  const [chartContent, setChartContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [renderFailed, setRenderFailed] = useState(false);
  const { colorMode } = useColorMode();
  const imgRef = useRef(null);
  
  // Determine which image to display based on the current theme
  const imageToShow = colorMode === 'dark' && fallbackImageDark 
    ? fallbackImageDark 
    : fallbackImage;
  
  // Load chart content from file
  useEffect(() => {
    if (chartFile) {
      setIsLoading(true);
      
      fetch(chartFile)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load chart file: ${response.status} ${response.statusText}`);
          }
          return response.text();
        })
        .then(content => {
          console.log('Mermaid file loaded successfully:', chartFile);
          setChartContent(content.trim());
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error loading Mermaid chart file:', error);
          setRenderFailed(true);
          setIsLoading(false);
        });
    }
  }, [chartFile]);
  
  // Check if Mermaid rendering has succeeded
  useEffect(() => {
    if (!isLoading && chartContent) {
      // Set a timer to check if Mermaid has rendered the diagram
      const timer = setTimeout(() => {
        // Look for the Mermaid container that we created
        const mermaidContainer = document.querySelector(`.mermaid-container-${chartFile.replace(/[^a-zA-Z0-9]/g, '')}`);
        if (mermaidContainer) {
          const mermaidDiv = mermaidContainer.querySelector('.mermaid');
          
          // Conditions for considering the render as failed:
          // 1. No SVG (diagram wasn't rendered)
          // 2. OR presence of a Mermaid error message (the bomb icon)
          if (
            !mermaidDiv.querySelector('svg') || 
            mermaidDiv.textContent.includes('Syntax error') ||
            mermaidDiv.querySelector('.error-icon')
          ) {
            setRenderFailed(true);
          }
        }
      }, 1000); // Check after 1 second
      
      return () => clearTimeout(timer);
    }
  }, [chartContent, isLoading, chartFile]);

  // Initialize zoom on the fallback image
  useEffect(() => {
    // Only proceed if the image is rendered and the ref is set
    if (renderFailed && imgRef.current) {
      console.log('Setting up zoom on fallback image');
      
      // Dynamically import medium-zoom (which is likely used by the plugin)
      import('medium-zoom').then((module) => {
        const mediumZoom = module.default;
        try {
          // Apply zoom to our image
          const zoom = mediumZoom(imgRef.current, {
            margin: 24,
            background: 'rgba(0, 0, 0, 0.7)',
            scrollOffset: 0,
          });
          
          console.log('Zoom successfully applied to image');
          
          // Return cleanup function
          return () => {
            zoom.detach();
          };
        } catch (error) {
          console.error('Failed to apply zoom:', error);
        }
      }).catch(error => {
        console.error('Failed to import medium-zoom:', error);
      });
    }
  }, [renderFailed]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className={className || 'mermaid-loading-container'}>
        <div className="mermaid-loading">
          <em>Loading diagram...</em>
        </div>
      </div>
    );
  }
  
  // Show fallback image if rendering failed or file loading failed
  if (renderFailed) {
    return (
      <div className={className || 'mermaid-fallback-container'}>
        <img 
          ref={imgRef}
          src={imageToShow} 
          alt={alt || 'Diagram (fallback image)'} 
          className="mermaid-fallback-image medium-zoom-image" 
          data-zoomable="true"
          style={{ cursor: 'zoom-in' }}
        />
        <div className="mermaid-fallback-notice">
          <small>Please note that the original, clickable diagram couldn't be rendered, probably due to a <a href="https://mermaid.js.org/">Mermaid.js</a> issue. A static image is displayed instead;  you can click on it to zoom in, and even right click and choose "Save as…" to download it and view it offline.</small>
        </div>
      </div>
    );
  }
  
  // Use the mermaid class that Docusaurus expects to process
  const uniqueClass = `mermaid-container-${chartFile.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <div className={`${className || 'mermaid-container'} ${uniqueClass}`}>
      <div className="mermaid">
        {chartContent}
      </div>
    </div>
  );
}