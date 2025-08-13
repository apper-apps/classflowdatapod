import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ title, onMenuToggle, searchValue, onSearchChange, actionButton, showSearch = true }) => {
  const { user } = useSelector((state) => state.user)
  const { logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </button>
          <div className="ml-2 lg:ml-0">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden sm:block">
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search..."
              />
            </div>
          )}
          
          {actionButton}
          
          {user && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">
                Welcome, {user.firstName || user.name || 'User'}!
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <ApperIcon name="LogOut" className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header