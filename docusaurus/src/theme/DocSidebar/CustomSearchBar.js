import React, { useEffect } from 'react';
import SearchBar from '@theme-original/SearchBar';
import { getEnhancedContentType, filterResultsByContentType } from '../../utils/searchConfig';
import Icon from '../../components/Icon.js'

const SEARCH_FILTERS = [
  { value: '', label: 'All content', icon: '🔍' },
  { value: 'cms', label: 'CMS Docs', icon: '⚙️' },
  { value: 'cloud', label: 'Cloud Docs', icon: '☁️' },
  { value: 'features', label: 'CMS Features', icon: '✨' },
  { value: 'development', label: 'Development', icon: '🔧' },
  { value: 'api', label: 'APIs', icon: '🔌' },
  { value: 'configuration', label: 'Configuration', icon: '🛠️' }
];

// Store all results for filtering
let allResults = [];

export default function CustomSearchBarWrapper(props) {
  
  // Function to store all search results when they appear
  const storeSearchResults = () => {
    const hits = document.querySelectorAll('.DocSearch-Hit');
    if (hits.length === 0) return;

    allResults = Array.from(hits).map(hit => {
      const link = hit.querySelector('a');
      const url = link ? link.href : '';
      
      return {
        element: hit,
        url: url,
        contentType: getEnhancedContentType({ url })
      };
    });
    
    console.log(`Stored ${allResults.length} results for filtering`);
  };

  // Function to apply filter by hiding/showing results
  const applyFilter = (filterValue) => {
    console.log(`Applying filter: ${filterValue}`);
    
    if (allResults.length === 0) {
      storeSearchResults();
    }

    if (!filterValue || filterValue === '') {
      // Show all results
      allResults.forEach(result => {
        result.element.style.display = '';
      });
      
      // Show all sections
      document.querySelectorAll('.DocSearch-Hit-source').forEach(section => {
        section.style.display = '';
      });
      
      // Update result count
      updateResultCount(allResults.length);
      
      // Update empty state (clear it since we're showing all results)
      updateEmptyState('', allResults.length);
      
      console.log(`Showing all ${allResults.length} results`);
      return;
    }

    // Filter results based on content type
    const resultsData = allResults.map(r => ({ url: r.url, contentType: r.contentType }));
    const filteredData = filterResultsByContentType(resultsData, filterValue);
    const filteredUrls = filteredData.map(r => r.url);

    // Show/hide results
    let visibleCount = 0;
    const visibleSections = new Set();
    
    allResults.forEach(result => {
      if (filteredUrls.includes(result.url)) {
        result.element.style.display = '';
        visibleCount++;
        
        // Track which sections have visible results
        const section = result.element.closest('.DocSearch-Hit-source');
        if (section) {
          visibleSections.add(section);
        }
      } else {
        result.element.style.display = 'none';
      }
    });

    // Hide sections that have no visible results
    document.querySelectorAll('.DocSearch-Hit-source').forEach(section => {
      if (!visibleSections.has(section)) {
        section.style.display = 'none';
      } else {
        section.style.display = '';
      }
    });
    
    // Update result count
    updateResultCount(visibleCount);
    
    // Update empty state
    updateEmptyState(filterValue, visibleCount);
    
    console.log(`Filter "${filterValue}": showing ${visibleCount} of ${allResults.length} results`);
  };

  // Function to show/hide empty state message
  const updateEmptyState = (filterValue, visibleCount) => {
    const modal = document.querySelector('.DocSearch-Modal');
    if (!modal) return;

    // Remove existing empty state message
    const existingEmptyState = modal.querySelector('.custom-empty-state');
    if (existingEmptyState) {
      existingEmptyState.remove();
    }

    if (visibleCount === 0 && filterValue) {
      // Find the hits container to insert the empty state message
      const hitsContainer = modal.querySelector('.DocSearch-Hits') || 
                           modal.querySelector('.DocSearch-NoResults')?.parentElement;
      
      if (hitsContainer) {
        // Create empty state message
        const emptyState = document.createElement('div');
        emptyState.className = 'custom-empty-state';
        emptyState.style.cssText = `
          padding: 40px 20px;
          text-align: center;
          color: #666;
          font-size: 14px;
        `;

        const filterLabel = SEARCH_FILTERS.find(f => f.value === filterValue)?.label || filterValue;
        
        emptyState.innerHTML = `
          <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;">📄</div>
          <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">No ${filterLabel} results found</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">
            Try searching for something else or use a different filter.
          </p>
          <button id="show-all-results-btn"
                  style="
                    margin-top: 16px;
                    padding: 8px 16px;
                    background: #5468ff;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.2s ease;
                  ">
            Show all results
          </button>
        `;

        // Add event listener to the button after creating it
        const showAllBtn = emptyState.querySelector('#show-all-results-btn');
        if (showAllBtn) {
          showAllBtn.addEventListener('mouseenter', () => {
            showAllBtn.style.background = '#4c63d2';
          });
          
          showAllBtn.addEventListener('mouseleave', () => {
            showAllBtn.style.background = '#5468ff';
          });
          
          showAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Find and click the "All content" filter button
            const allContentButton = document.querySelector('[data-filter=""]');
            if (allContentButton) {
              allContentButton.click();
            }
          });
        }

        hitsContainer.appendChild(emptyState);
      }
    }
  };
  const updateResultCount = (count) => {
    // Search ONLY within the DocSearch modal for the result count
    const modal = document.querySelector('.DocSearch-Modal');
    if (!modal) return;
    
    // Look for the result count specifically within the modal
    const possibleSelectors = [
      '.DocSearch-Footer p',
      '.DocSearch-Footer [role="button"]',
      'p[role="button"]'
    ];
    
    let resultCountElement = null;
    for (const selector of possibleSelectors) {
      const elements = modal.querySelectorAll(selector);
      for (const element of elements) {
        if (element.textContent.includes('See all')) {
          resultCountElement = element;
          break;
        }
      }
      if (resultCountElement) break;
    }
    
    // Fallback: find any element within modal containing "See all"
    if (!resultCountElement) {
      const allElements = modal.querySelectorAll('*');
      for (const element of allElements) {
        if (element.textContent.includes('See all') && 
            element.textContent.includes('results') &&
            !element.querySelector('*')) { // Make sure it's a leaf element
          resultCountElement = element;
          break;
        }
      }
    }
    
    if (resultCountElement) {
      if (count === 0) {
        // Hide the "See all X results" when there are no results
        resultCountElement.style.display = 'none';
        console.log('Hidden result count (0 results)');
      } else {
        // Show and update the count
        resultCountElement.style.display = '';
        resultCountElement.textContent = `See all ${count} result${count === 1 ? '' : 's'}`;
        console.log(`Updated count to: ${count} result${count === 1 ? '' : 's'}`);
      }
    } else {
      console.log('Could not find result count element within modal');
    }
  };

  // Function to inject filter buttons with filtering functionality
  const injectFilterButtons = () => {
    const searchBar = document.querySelector('.DocSearch-SearchBar');
    if (!searchBar || document.querySelector('.filter-buttons-container')) {
      return; // Already injected or search bar not found
    }

    // Create container for filter buttons
    const container = document.createElement('div');
    container.className = 'filter-buttons-container';
    container.style.cssText = `
      padding: 16px;
      border-bottom: 1px solid #e1e5e9;
      background: #f8f9fa;
    `;

    // Create title
    const title = document.createElement('div');
    title.textContent = 'FILTER BY CONTENT TYPE:';
    title.style.cssText = `
      font-size: 12px;
      font-weight: 600;
      color: #656d76;
      text-transform: uppercase;
      margin-bottom: 12px;
      letter-spacing: 0.05em;
    `;

    // Create buttons container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    `;

    let activeFilter = '';

    // Create each filter button
    SEARCH_FILTERS.forEach(filter => {
      const button = document.createElement('button');
      button.textContent = `${filter.icon} ${filter.label}`;
      button.className = 'filter-button';
      button.dataset.filter = filter.value;
      button.style.cssText = `
        display: inline-flex;
        align-items: center;
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid #ccc;
        background: white;
        color: #333;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      `;

      // Set "All content" as default active
      if (filter.value === '') {
        button.style.background = '#5468ff';
        button.style.color = 'white';
        button.style.borderColor = '#5468ff';
        activeFilter = '';
      }

      // Add hover effect
      button.addEventListener('mouseenter', () => {
        if (activeFilter !== filter.value) {
          button.style.borderColor = '#5468ff';
          button.style.transform = 'translateY(-1px)';
        }
      });

      button.addEventListener('mouseleave', () => {
        if (activeFilter !== filter.value) {
          button.style.borderColor = '#ccc';
          button.style.transform = 'translateY(0)';
        }
      });

      // Add click handler with actual filtering
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); // Prevent any event bubbling
        
        console.log(`Filter clicked: ${filter.value} (${filter.label})`);
        
        // Update active filter
        activeFilter = filter.value;
        
        // Update button styles
        buttonsDiv.querySelectorAll('.filter-button').forEach(btn => {
          if (btn.dataset.filter === filter.value) {
            btn.style.background = '#5468ff';
            btn.style.color = 'white';
            btn.style.borderColor = '#5468ff';
          } else {
            btn.style.background = 'white';
            btn.style.color = '#333';
            btn.style.borderColor = '#ccc';
          }
        });

        // Apply the filter with a small delay to ensure results are rendered
        setTimeout(() => {
          applyFilter(filter.value);
        }, 100);
        
        return false; // Extra insurance to prevent default behavior
      });

      buttonsDiv.appendChild(button);
    });

    container.appendChild(title);
    container.appendChild(buttonsDiv);

    // Insert the container after the search bar
    searchBar.parentNode.insertBefore(container, searchBar.nextSibling);

    // Store results when buttons are injected
    setTimeout(storeSearchResults, 200);
  };

  // Monitor for DocSearch modal opening and results appearing
  useEffect(() => {
    let hasInjected = false;
    
    const checkForModal = () => {
      const modal = document.querySelector('.DocSearch-Modal');
      const hits = document.querySelectorAll('.DocSearch-Hit');
      
      if (modal && !hasInjected) {
        // Modal is open, inject buttons
        setTimeout(() => {
          injectFilterButtons();
          hasInjected = true;
        }, 100);
      } else if (!modal && hasInjected) {
        // Modal closed, reset
        hasInjected = false;
        allResults = [];
      }

      // Store results when they appear/change
      if (hits.length > 0) {
        setTimeout(storeSearchResults, 100);
      }
    };

    // Check periodically for modal and results
    const interval = setInterval(checkForModal, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-custom-search-bar">
      <SearchBar {...props} />
      <button className="kapa-widget-button">
        <span className="kapa-widget-button-text">
          <Icon name="sparkle"/>Ask AI
        </span>
      </button>
    </div>
  );
}