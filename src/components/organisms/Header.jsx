import React from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title, onMenuToggle, searchValue, onSearchChange, onAddNew, addNewLabel = "Add New" }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-display font-bold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {onSearchChange && (
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search..."
              className="hidden sm:block w-64"
            />
          )}
          
          {onAddNew && (
            <Button onClick={onAddNew}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              {addNewLabel}
            </Button>
          )}
        </div>
      </div>
      
      {onSearchChange && (
        <div className="sm:hidden mt-4">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search..."
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default Header;