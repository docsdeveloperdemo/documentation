import React, { useState, useCallback, useEffect } from 'react';
import { DocSearch } from '@docsearch/react';
import { useThemeConfig } from '@docusaurus/theme-common';
import { filterResultsByContentType, getEnhancedContentType } from '../../utils/searchConfig';
import Icon from '../../components/Icon.js';

const SEARCH_FILTERS = [
  { 
    value: '', 
    label: 'All content', 
    icon: '🔍', 
    color: 'neutral' 
  },
  { 
    value: 'cms', 
    label: 'CMS Docs', 
    icon: '⚙️', 
    color: 'primary'
  },
  { 
    value: 'cloud', 
    label: 'Cloud Docs', 
    icon: '☁️', 
    color: 'secondary'
  },
  { 
    value: 'features', 
    label: 'CMS Features', 
    icon: '✨', 
    color: 'success'
  },
  { 
    value: 'development', 
    label: 'Development', 
    icon: '🔧', 
    color: 'warning'
  },
  { 
    value: 'api', 
    label: 'APIs', 
    icon: '🔌', 
    color: 'info'
  },
  { 
    value: 'configuration', 
    label: 'Configuration', 
    icon: '🛠️', 
    color: 'alternative'
  }
];

// Global variable to store current filter - accessible by transformItems
let globalSelectedFilter = '';

export default function CustomSearchBarWrapper(props) {
  const { algolia } = useThemeConfig();
  const [selectedFilter, setSelectedFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update global variable when local state changes
  useEffect(() => {
    globalSelectedFilter = selectedFilter;
  }, [selectedFilter]);

  // Transform and filter items based on global filter
  const transformItems = useCallback((items) => {
    // Apply original transform from config if it exists
    const originalTransform = algolia.transformItems;
    let transformedItems = originalTransform ? originalTransform(items) : items;
    
    // Add contentType to each item
    const itemsWithTypes = transformedItems.map(item => {
      const detectedType = getEnhancedContentType(item);
      return { ...item, contentType: detectedType };
    });
    
    // Apply content type filter using global variable
    const filteredItems = filterResultsByContentType(itemsWithTypes, globalSelectedFilter);
    
    return filteredItems;
  }, [algolia.transformItems]);

  // Monitor modal state with MutationObserver since onOpen/onClose might not work reliably
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList?.contains('DocSearch-Container')) {
            setIsModalOpen(true);
          }
        });
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList?.contains('DocSearch-Container')) {
            setIsModalOpen(false);
            setSelectedFilter('');
            globalSelectedFilter = '';
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Inject filter UI into DocSearch modal with improved styling
  useEffect(() => {
    if (isModalOpen) {
      const injectFilterUI = () => {
        const searchBar = document.querySelector('.DocSearch-SearchBar');
        if (searchBar && !document.querySelector('.injected-filters')) {
          // Create filter container
          const filterContainer = document.createElement('div');
          filterContainer.className = 'injected-filters';

          // Create filter title
          const filterTitle = document.createElement('div');
          filterTitle.className = 'filter-title';
          filterTitle.textContent = 'FILTER BY CONTENT TYPE:';

          // Create filter buttons container
          const buttonsContainer = document.createElement('div');
          buttonsContainer.className = 'filter-buttons';

          // Create filter buttons with improved styling
          SEARCH_FILTERS.forEach((filter) => {
            const button = document.createElement('button');
            button.textContent = `${filter.icon} ${filter.label}`;
            button.className = 'filter-pill';
            button.dataset.filterValue = filter.value;
            
            const isActive = selectedFilter === filter.value;
            if (isActive) {
              button.classList.add('active');
              button.dataset.active = 'true';
            }

            // Enhanced hover effects
            button.addEventListener('mouseenter', () => {
              if (selectedFilter !== filter.value) {
                button.style.transform = 'translateY(-1px)';
              }
            });

            button.addEventListener('mouseleave', () => {
              if (selectedFilter !== filter.value) {
                button.style.transform = 'translateY(0)';
              }
            });

            button.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              // Update React state and global variable immediately
              setSelectedFilter(filter.value);
              globalSelectedFilter = filter.value;
              
              // Update button states immediately with improved visual feedback
              buttonsContainer.querySelectorAll('.filter-pill').forEach(btn => {
                const isActiveBtn = btn.dataset.filterValue === filter.value;
                btn.classList.toggle('active', isActiveBtn);
                btn.dataset.active = isActiveBtn.toString();
              });
              
              // Force search refresh by modifying input value
              const searchInput = document.querySelector('.DocSearch-Input');
              if (searchInput && searchInput.value) {
                const currentValue = searchInput.value;
                
                // Keep input focused throughout the process
                searchInput.focus();
                
                // Add then remove character to trigger new search
                searchInput.value = currentValue + 'x';
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                setTimeout(() => {
                  searchInput.value = currentValue;
                  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                  
                  // Ensure input stays focused and cursor is at the end
                  searchInput.focus();
                  searchInput.setSelectionRange(currentValue.length, currentValue.length);
                }, 100);
              }
            });

            buttonsContainer.appendChild(button);
          });

          filterContainer.appendChild(filterTitle);
          filterContainer.appendChild(buttonsContainer);

          // Insert after search bar
          searchBar.parentNode.insertBefore(filterContainer, searchBar.nextSibling);

          // Add enhanced styles to create pills with transparent background in dark mode
          const style = document.createElement('style');
          style.textContent = `
            .injected-filters {
              padding: 12px 16px !important;
              border-bottom: 1px solid var(--docsearch-muted-color) !important;
              background: var(--docsearch-modal-background) !important;
            }

            .injected-filters .filter-title {
              font-size: 12px !important;
              color: var(--docsearch-muted-color) !important;
              margin-bottom: 8px !important;
              font-weight: 600 !important;
              letter-spacing: 0.5px !important;
            }

            .injected-filters .filter-buttons {
              display: flex !important;
              gap: 6px !important;
              flex-wrap: wrap !important;
            }

            .injected-filters .filter-pill {
              padding: 6px 12px !important;
              border-radius: 16px !important;
              font-size: 12px !important;
              cursor: pointer !important;
              transition: all 0.2s ease !important;
              outline: none !important;
              font-family: inherit !important;
              white-space: nowrap !important;
              
              /* Light mode - good visibility */
              background: #f8f9fa !important;
              color: #495057 !important;
              border: 1px solid #dee2e6 !important;
              font-weight: 500 !important;
            }

            .injected-filters .filter-pill:hover {
              background: #e9ecef !important;
              color: #343a40 !important;
              border-color: #adb5bd !important;
              transform: translateY(-1px) !important;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
            }

            .injected-filters .filter-pill.active,
            .injected-filters .filter-pill[data-active="true"] {
              background: var(--docsearch-primary-color) !important;
              color: white !important;
              border-color: var(--docsearch-primary-color) !important;
              font-weight: 600 !important;
              box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3) !important;
            }

            .injected-filters .filter-pill.active:hover,
            .injected-filters .filter-pill[data-active="true"]:hover {
              background: var(--docsearch-primary-color) !important;
              transform: translateY(-1px) !important;
              box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4) !important;
            }

            /* Dark mode - transparent elegant pills */
            @media (prefers-color-scheme: dark) {
              .injected-filters .filter-pill {
                background: rgba(255, 255, 255, 0.1) !important;
                color: rgba(255, 255, 255, 0.7) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
              }

              .injected-filters .filter-pill:hover {
                background: rgba(255, 255, 255, 0.15) !important;
                color: rgba(255, 255, 255, 0.9) !important;
                border-color: rgba(255, 255, 255, 0.3) !important;
              }

              .injected-filters .filter-pill.active,
              .injected-filters .filter-pill[data-active="true"] {
                background: var(--docsearch-primary-color) !important;
                color: white !important;
                border-color: var(--docsearch-primary-color) !important;
              }
            }

            /* Responsive design for mobile */
            @media (max-width: 768px) {
              .injected-filters .filter-buttons {
                flex-direction: column !important;
                align-items: stretch !important;
              }

              .injected-filters .filter-pill {
                text-align: center !important;
              }
            }
          `;
          
          document.head.appendChild(style);
        }
      };

      // Try to inject immediately, then retry if needed
      injectFilterUI();
      const retryTimer = setTimeout(injectFilterUI, 100);
      const retryTimer2 = setTimeout(injectFilterUI, 300);
      
      return () => {
        clearTimeout(retryTimer);
        clearTimeout(retryTimer2);
      };
    }
  }, [isModalOpen, selectedFilter]);

  return (
    <div className="my-custom-search-bar">
      <DocSearch
        {...algolia}
        transformItems={transformItems}
        translations={{
          button: {
            buttonText: 'Search',
            buttonAriaLabel: 'Search'
          }
        }}
        {...props}
      />
      
      <button className="kapa-widget-button">
        <span className="kapa-widget-button-text">
          <Icon name="sparkle"/>Ask AI
        </span>
      </button>
    </div>
  );
}