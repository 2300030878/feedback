import React, { useEffect, useMemo, useState } from 'react';

// Lightweight debounce to avoid external deps
const createDebounce = (fn, wait) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

const AsyncSearchSelect = ({ fetcher, value, onChange, placeholder = 'Search...', renderOption, getKey, getLabel }) => {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);

  const debounced = useMemo(() => createDebounce(async (q) => {
    try {
      const res = await fetcher(q);
      setOptions(Array.isArray(res) ? res : res?.data || []);
    } catch (_) {}
  }, 250), [fetcher]);

  useEffect(() => {
    debounced(query);
    return () => {};
  }, [query, debounced]);

  return (
    <div className="relative">
      <input
        className="form-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
      />
      {open && (
        <div className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-md border bg-white shadow">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">No results</div>
          ) : (
            options.map((opt) => (
              <button
                key={getKey(opt)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                onClick={() => { onChange(opt); setOpen(false); setQuery(getLabel(opt)); }}
              >
                {renderOption ? renderOption(opt) : getLabel(opt)}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AsyncSearchSelect;

