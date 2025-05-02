import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, createTimeline, stagger } from 'animejs';
import { 
  FaArrowRight, FaSpotify, FaApple, FaYoutube, FaDeezer, FaTiktok,
  FaChevronDown, FaRegChartBar, FaRegClock, FaRegUser, FaMoon, FaSun
} from "react-icons/fa";
import { SiAudiomack } from "react-icons/si";
import { MdOutlineAnalytics, MdOutlineLink } from "react-icons/md";
import { RiLinksFill } from "react-icons/ri";

const LandingPage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    // 1. Hero intro (timeline remains the same)
    createTimeline({
      defaults: {
        easing: 'easeOutExpo',
        duration: 1000,
        delay: stagger(100),
      }
    })
    .add({
      targets: heroRef.current.querySelectorAll('h1, p, a, svg'),
      opacity: [0, 1],
      translateY: [30, 0],
    });
  
    // 2. Platform logos — two-arg signature
    animate(
      heroRef.current.querySelectorAll('.platform-icon'),
      {
        translateY: [-15, 0],
        opacity: [0, 1],
        delay: stagger(100),
        duration: 1000,
        easing: 'easeOutElastic(1, .8)',
      }
    );
  
    // 3. Scroll-triggered
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
  
        if (entry.target === featuresRef.current) {
          animate(
            featuresRef.current.querySelectorAll('.feature-card'),
            {
              translateY: [50, 0],
              opacity: [0, 1],
              delay: stagger(100),
              duration: 800,
              easing: 'easeOutExpo',
            }
          );
        }
  
        if (entry.target === howItWorksRef.current) {
          createTimeline({
            defaults: { easing: 'easeOutExpo', duration: 800 }
          })
          .add({
            targets: howItWorksRef.current.querySelectorAll('.step'),
            opacity: [0, 1],
            translateX: [-30, 0],
          });
        }
  
        if (entry.target === testimonialsRef.current) {
          animate(
            testimonialsRef.current.querySelectorAll('.testimonial'),
            {
              scale: [0.9, 1],
              opacity: [0, 1],
              delay: stagger(100),
              duration: 600,
              easing: 'spring(1, 80, 10, 0)',
            }
          );
        }
  
        if (entry.target === ctaRef.current) {
          animate(
            ctaRef.current.querySelectorAll('h2, p, a'),
            {
              opacity: [0, 1],
              translateY: [20, 0],
              delay: stagger(100),
              duration: 800,
            }
          );
          animate(
            ctaRef.current.querySelector('a'),
            {
              scale: [1, 1.05, 1],
              duration: 2000,
              loop: true,
              easing: 'easeInOutSine',
            }
          );
        }
      });
    }, { threshold: 0.1 });
  
    [featuresRef, howItWorksRef, testimonialsRef, ctaRef].forEach(ref =>
      observer.observe(ref.current)
    );
  
    return () => observer.disconnect();
  }, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-x-hidden">

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Africa's Smart Link Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            The ultimate pre-save & smart link generator designed specifically for African artists
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
            >
              Get Started <FaArrowRight />
            </Link>
            <Link
              to="/features"
              className="bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600 flex items-center justify-center gap-2 transform hover:scale-105"
            >
              Learn More  
              <FaChevronDown className="learn-more-icon text-xl inline-block ml-1" />
            </Link>
          </div>
          
          {/* Platform Logos */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-20">
            <FaSpotify className="platform-icon text-4xl text-green-500" />
            <FaApple className="platform-icon text-4xl text-gray-800 dark:text-gray-300" />
            <FaYoutube className="platform-icon text-4xl text-red-600" />
            <FaDeezer className="platform-icon text-4xl text-pink-600" />
            <SiAudiomack className="platform-icon text-4xl text-orange-500" />
            <FaTiktok className="platform-icon text-4xl text-black dark:text-white" />
          </div>
          
          {/* Hero Image */}
          <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
            <div className="aspect-w-16 aspect-h-9 bg-gradient-to-r from-blue-500 to-purple-500 h-64 md:h-96 flex items-center justify-center">
              <RiLinksFill className="text-white text-8xl opacity-30 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-2xl md:text-4xl font-bold text-center px-4">
                  One Link to Rule Them All
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to maximize your music's reach
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="feature-card bg-gray-50 dark:bg-gray-700 p-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <MdOutlineLink className="text-blue-600 dark:text-blue-400 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3 dark:text-white">Smart Links</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                One link that automatically directs fans to their preferred streaming platform.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card bg-gray-50 dark:bg-gray-700 p-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <MdOutlineAnalytics className="text-purple-600 dark:text-purple-400 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3 dark:text-white">Advanced Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Track clicks, conversions, and fan locations in real-time.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-card bg-gray-50 dark:bg-gray-700 p-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaSpotify className="text-green-600 dark:text-green-400 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3 dark:text-white">Pre-Save Campaigns</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Boost your release day streams with pre-save links that work across all platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section ref={statsRef} className="py-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold mb-2" id="artists-count">0</div>
              <div className="text-sm uppercase tracking-wider">Artists</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2" id="links-count">0</div>
              <div className="text-sm uppercase tracking-wider">Links Created</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2" id="clicks-count">0</div>
              <div className="text-sm uppercase tracking-wider">Total Clicks</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2" id="countries-count">0</div>
              <div className="text-sm uppercase tracking-wider">Countries</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="step relative">
              <div className="absolute -left-4 md:-left-6 top-0 h-full flex items-center">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md ml-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-3">
                  <FaRegUser className="text-blue-500 dark:text-blue-400 mr-2" />
                  <h3 className="text-xl font-bold dark:text-white">Create Your Account</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Sign up in seconds and connect your artist profiles.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="step relative">
              <div className="absolute -left-4 md:-left-6 top-0 h-full flex items-center">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md ml-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-3">
                  <RiLinksFill className="text-blue-500 dark:text-blue-400 mr-2" />
                  <h3 className="text-xl font-bold dark:text-white">Generate Your Link</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Create a smart link for your music in just a few clicks.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="step relative">
              <div className="absolute -left-4 md:-left-6 top-0 h-full flex items-center">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md ml-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-3">
                  <FaRegChartBar className="text-blue-500 dark:text-blue-400 mr-2" />
                  <h3 className="text-xl font-bold dark:text-white">Share & Track</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Share your link everywhere and watch your analytics grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Trusted by African Artists</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See what artists are saying about our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="testimonial bg-gray-50 dark:bg-gray-700 p-8 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4">
                  AB
                </div>
                <div>
                  <h4 className="font-bold dark:text-white">Ama Blaq</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Afrobeats Artist</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 italic">
                "This platform tripled my pre-saves! The analytics helped me understand my audience better than ever before."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="testimonial bg-gray-50 dark:bg-gray-700 p-8 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-4">
                  DK
                </div>
                <div>
                  <h4 className="font-bold dark:text-white">DJ Kweku</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Amapiano Producer</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 italic">
                "Finally a tool made for African artists! The smart links work perfectly with all our local platforms too."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Grow Your Audience?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join thousands of African artists using our platform to maximize their reach.
          </p>
          <Link
            to="/login"
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
          >
            Get Started Now <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;