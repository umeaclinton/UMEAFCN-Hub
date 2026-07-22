'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    params.delete('jobType');
    params.delete('experience');
    params.delete('salary');
    params.delete('domain');
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  const hasFilters = searchParams.has('jobType') || searchParams.has('experience') || searchParams.has('salary') || searchParams.has('domain');

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h3><span className="filter-icon"></span> Filters</h3>
        {hasFilters && (
          <button onClick={handleClearAll} className="clear-all-btn">Clear All</button>
        )}
      </div>

      <div className="filter-group">
        <h4>Job Type</h4>
        <div className="filter-pills">
          {['Full Time', 'Internship', 'Contract', 'Part Time'].map(type => (
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
        <h4>Experience</h4>
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
        <h4>Salary</h4>
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

      <div className="filter-group">
        <h4>Domain</h4>
        <select 
          className="domain-select"
          value={searchParams.get('domain') || ''}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value) {
              params.set('domain', e.target.value);
            } else {
              params.delete('domain');
            }
            params.delete('page');
            router.push(`/?${params.toString()}`);
          }}
        >
          <option value="">Select domain</option>
          {['Technology', 'Marketing', 'Finance', 'Sales', 'Design', 'Customer Support', 'Operations', 'Other'].map(domain => (
            <option key={domain} value={domain}>{domain}</option>
          ))}
        </select>
      </div>
    </aside>
  );
}
