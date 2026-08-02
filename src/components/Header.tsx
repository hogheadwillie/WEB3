import React from 'react';
import { motion } from 'framer-motion';
import { Shield, User, LogOut, Menu, X, BookOpen, LifeBuoy } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg">
              <Shield className="h-6 w-6 text-cyan-400" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                QuantumSecure
              </h1>
              <p className="text-xs text-gray-400">Enterprise Security Platform</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
              Dashboard
            </Link>
            <Link to="/pricing" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
              Pricing
            </Link>
            <Link to="/documentation" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
              Documentation
            </Link>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
              Support
            </a>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">{user.email}</p>
                  <p className="text-xs text-gray-400">Enterprise User</p>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors duration-200"
                  >
                    <User className="h-4 w-4 text-gray-300" />
                  </motion.button>
                  <motion.button
                    onClick={signOut}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/login"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </a>
                <motion.a
                  href="/signup"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-200"
                >
                  Sign Up
                </motion.a>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t border-gray-800 py-4 space-y-3"
          >
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
            >
              <Shield className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/pricing"
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              to="/documentation"
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
            >
              <BookOpen className="h-4 w-4" />
              Documentation
            </Link>
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
            >
              <LifeBuoy className="h-4 w-4" />
              Support
            </a>
            {!user && (
              <div className="px-4 pt-3 border-t border-gray-800 space-y-3">
                <a
                  href="/login"
                  className="block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-200 text-center"
                >
                  Sign Up
                </a>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
};