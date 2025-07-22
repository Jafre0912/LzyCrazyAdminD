import React, { useState, useEffect, useRef } from 'react';
import './CountrySelector.css'; // We will create this file next

const CountrySelector = ({ countries, selectedCountry, onSelectCountry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  // This effect handles closing the dropdown if you click outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (countryName) => {
    onSelectCountry(countryName);
    setIsOpen(false);
    setSearchTerm('');
  };

  const currentCountry = countries.find(c => c.name === selectedCountry);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="custom-dropdown-wrapper" ref={wrapperRef}>
      <div className="custom-dropdown-selector" onClick={() => setIsOpen(!isOpen)}>
        {currentCountry && <img src={currentCountry.flag} alt="" className="selector-flag" />}
        <span className="selector-name">{currentCountry ? currentCountry.name : 'Select Country'}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className="dropdown-panel">
          <input
            type="text"
            className="search-input"
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <ul className="options-list">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <li key={country.name} onClick={() => handleSelect(country.name)}>
                  <img src={country.flag} alt="" className="option-flag" />
                  <span>{country.name}</span>
                </li>
              ))
            ) : (
              <li className="no-results">No countries found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;