// pages/LandingPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '☁️',
      title: 'Cloud Storage',
      description: 'Store all your memories safely in the cloud. Access from anywhere, anytime.'
    },
    {
      icon: '📁',
      title: 'Smart Albums',
      description: 'Organize photos into beautiful albums. Create, edit, and manage with ease.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your photos are encrypted and private. Only you can access your content.'
    },
    {
      icon: '⚡',
      title: 'Fast Upload',
      description: 'Drag & drop upload with instant processing. Supports all image formats.'
    },
    {
      icon: '🔄',
      title: 'Auto Backup',
      description: 'Never lose a memory with automatic backup from your devices.'
    },
    {
      icon: '🎨',
      title: 'Beautiful Gallery',
      description: 'View your photos in a stunning grid gallery with lightbox preview.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '1M+', label: 'Photos Stored' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Photographer',
      content: 'PhotoVault has completely changed how I manage my portfolio. The upload speed is incredible!',
      avatar: 'SJ',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Travel Blogger',
      content: 'Perfect for organizing thousands of travel photos. The album system is exactly what I needed.',
      avatar: 'MC',
      rating: 5
    },
    {
      name: 'Emma Watson',
      role: 'Content Creator',
      content: 'Simple, fast, and reliable. Best photo storage solution I\'ve ever used!',
      avatar: 'EW',
      rating: 5
    }
  ];

  const pricing = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '100 MB Storage',
        'Basic Albums',
        'Upload up to 5MB/file',
        'Email Support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$9',
      period: '/month',
      features: [
        '10 GB Storage',
        'Unlimited Albums',
        'Upload up to 50MB/file',
        'Priority Support',
        'Advanced Analytics'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Business',
      price: '$29',
      period: '/month',
      features: [
        '100 GB Storage',
        'Team Collaboration',
        'Upload up to 100MB/file',
        '24/7 Phone Support',
        'API Access'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <span className="text-yellow-300">⭐</span>
              <span className="text-sm font-medium">Trusted by 10,000+ photographers</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Preserve Your
              <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent"> Memories Forever</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Store, organize, and share your precious moments with the most beautiful photo storage platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/signup"
                    className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105 text-lg"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition text-lg"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105 text-lg"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
            
            <div className="mt-16 flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free 30-day trial</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose PhotoVault?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your photo collection in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                Beautiful Gallery
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Stunning Photo Gallery Experience
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                View your photos in a beautiful grid layout with smooth animations. 
                Our lightbox preview lets you enjoy your memories in full glory.
              </p>
              <ul className="space-y-3">
                {[
                  'Responsive grid that adapts to any screen',
                  'Bulk select and delete operations',
                  'Sort by date, size, or name',
                  'Powerful search functionality'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-2 shadow-2xl">
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="grid grid-cols-3 gap-1 p-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users who trust PhotoVault with their memories
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade or cancel anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl relative'
                    : 'bg-gray-50 text-gray-800 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-800 px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-800'}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-800'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.popular ? 'text-blue-200' : 'text-gray-500'}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.popular ? 'text-blue-100' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-full font-semibold transition transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:shadow-xl'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust PhotoVault with their precious memories.
          </p>
          {!isAuthenticated ? (
            <Link
              to="/signup"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105 text-lg"
            >
              Get Started Free
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105 text-lg"
            >
              Go to Dashboard
            </Link>
          )}
          <p className="text-blue-200 text-sm mt-4">No credit card required. Free 30-day trial.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">📸</span>
                <span className="text-xl font-bold">PhotoVault</span>
              </div>
              <p className="text-gray-400 text-sm">
                Preserving your memories, one photo at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 PhotoVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;