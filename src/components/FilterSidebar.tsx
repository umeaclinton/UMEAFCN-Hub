'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Close filter when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);


  // Helper to handle filter toggles
  const handleToggle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.getAll(key);

    if (currentValues.includes(value)) {
      params.delete(key);
      currentValues.filter(v => v !== value).forEach(v => params.append(key, v));
    } else {
      params.append(key, value);
    }
    
    // reset to page 1 on filter change
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('jobType');
    params.delete('experience');
    params.delete('salary');
    params.delete('domain');
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  const hasFilters = searchParams.has('category') || searchParams.has('jobType') || searchParams.has('experience') || searchParams.has('salary') || searchParams.has('domain');

  return (
    <>
      <button 
        className="filter-trigger" 
        onClick={() => setIsOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        Apply Filters
      </button>

      {/* Backdrop for filter modal */}
      {isOpen && (
        <div 
          className="filter-backdrop" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`filter-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="filter-header">
          <h2><span className="filter-icon"></span> Filters</h2>
          <div className="filter-header-actions">
            {hasFilters && (
              <button onClick={handleClearAll} className="clear-all-btn">Clear All</button>
            )}
            <button className="close-filter-btn" onClick={() => setIsOpen(false)}>
              &times;
            </button>
          </div>
        </div>

      <div className="filter-group">
        <h3>Categories</h3>
        <div className="filter-pills">
          {['Scholarships', 'Internships', 'Graduate Trainee', 'Remote'].map(cat => (
            <button
              key={cat}
              onClick={() => handleToggle('category', cat)}
              className={`filter-pill ${searchParams.getAll('category').includes(cat) ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Job Type</h3>
        <div className="filter-pills">
          {['Full Time', 'Hybrid', 'Contract', 'Part Time'].map(type => (
            <button
              key={type}
              onClick={() => handleToggle('jobType', type)}
              className={`filter-pill ${searchParams.getAll('jobType').includes(type) ? 'active' : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Experience</h3>
        <div className="checkbox-list">
          {['More than 0 year', 'More than 1 year', 'More than 2 years', 'More than 3 years', 'More than 4 years'].map(exp => (
            <label key={exp} className="checkbox-label">
              <input
                type="checkbox"
                checked={searchParams.getAll('experience').includes(exp)}
                onChange={() => handleToggle('experience', exp)}
              />
              <span>{exp}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Salary</h3>
        <div className="checkbox-list two-cols">
          {['Competitive', 'Under $50k', '$50k - $100k', '$100k+'].map(salary => (
            <label key={salary} className="checkbox-label">
              <input
                type="checkbox"
                checked={searchParams.getAll('salary').includes(salary)}
                onChange={() => handleToggle('salary', salary)}
              />
              <span>{salary}</span>
            </label>
          ))}
        </div>
      </div>

    </aside>
    </>
  );
}
