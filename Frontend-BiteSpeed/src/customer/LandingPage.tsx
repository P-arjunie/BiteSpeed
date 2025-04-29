// BiteSpeedHomePage.jsx
import { useState, useEffect } from 'react';
import { ChevronRight, Clock, MapPin, ShoppingBag, Star, Truck, User, Heart, Search, Menu, X } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.jpeg';
import res1 from '../assets/res1.jpeg';
import res2 from '../assets/res2.jpeg';
import res3 from '../assets/res3.jpeg';
import res4 from '../assets/res4.jpeg';

const BiteSpeedHomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Add animation classes to elements when page loads
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
    
    return () => animatedElements.forEach(el => observer.unobserve(el));
  }, []);

  const handleLoginPrompt = () => {
    alert("Please login first to access this feature");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <Header isScrolled={isScrolled} />

      {/* Hero Section with Parallax Effect */}
      <section id="home" className="relative bg-gradient-to-br from-black to-gray-900 pt-32 pb-32 px-5 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('../assets/pattern.svg')] bg-repeat"></div>
        
        {/* Floating Food Icons */}
        <div className="hidden lg:block">
          {[1, 2, 3, 4, 5].map((item) => (
            <div 
              key={item}
              className="absolute rounded-full bg-orange-500 opacity-10"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`
              }}
            ></div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center relative z-10">
          <div className="lg:w-1/2 mb-10 lg:mb-0 animate-on-scroll">
            <span className="inline-block px-4 py-1 rounded-full bg-orange-500 bg-opacity-20 text-orange-500 font-medium mb-6 transform transition hover:scale-105">
              #1 Food Delivery App
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Delicious Food <span className="text-orange-500 relative">
                Delivered
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="#F97316" strokeWidth="2" />
                </svg>
              </span> To Your Doorstep
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Order from your favorite local restaurants with just a few taps and enjoy fast delivery right to your door. Experience culinary delights from the comfort of your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-3 rounded-full text-lg font-medium transition transform hover:scale-105 shadow-lg hover:shadow-orange-500/30"
                onClick={handleLoginPrompt}
              >
                Order Now
              </button>
              <button 
                className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-full text-lg font-medium transition transform hover:scale-105"
                onClick={handleLoginPrompt}
              >
                View Restaurants
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center animate-on-scroll">
            {/* Hero Image with Floating Effect */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-3xl opacity-20 transform -translate-y-1/4"></div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white border-opacity-10 transform hover:scale-105 transition duration-700 animate-float">
                <div className="aspect-w-16 aspect-h-9 bg-gray-800 overflow-hidden">
                  <img src={heroImage} alt="Delicious Food" className="w-full h-full object-cover" />
                </div>
              </div>
              
              {/* Floating Badges */}
              <div className="absolute -right-10 -top-10 bg-white rounded-xl shadow-xl p-3 transform rotate-12 animate-float-slow">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-orange-500" fill="#f97316" />
                  <span className="text-sm font-bold ml-1">4.9</span>
                </div>
              </div>
              
              <div className="absolute -left-5 bottom-5 bg-white rounded-xl shadow-xl p-3 flex items-center transform -rotate-6 animate-float-delay">
                <Truck className="w-4 h-4 text-orange-500 mr-2" />
                <span className="text-sm font-medium">Free Delivery</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave SVG Divider - Enhanced */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#F9FAFB">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,106.7C1248,107,1344,85,1392,74.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-500 font-medium mb-4">Services</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="text-orange-500 relative">
              Services
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="#F97316" strokeWidth="2" />
              </svg>
            </span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Experience the best food delivery service with BiteSpeed. We provide a range of services to make your ordering experience smooth and enjoyable.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-gray-100 animate-on-scroll">
              <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform transition hover:rotate-6">
                <Truck className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-gray-600 mb-6">Get your food delivered in 30 minutes or less. Our delivery partners ensure your food arrives hot and fresh.</p>
              <a href="#" className="text-orange-500 font-medium flex items-center group">
                Learn More <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition" />
              </a>
            </div>
            
            {/* Service 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-gray-100 animate-on-scroll">
              <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform transition hover:rotate-6">
                <ShoppingBag className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Wide Selection</h3>
              <p className="text-gray-600 mb-6">Choose from thousands of restaurants and cuisines. From local favorites to international dishes, we have it all.</p>
              <a href="#" className="text-orange-500 font-medium flex items-center group">
                Browse Restaurants <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition" />
              </a>
            </div>
            
            {/* Service 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-gray-100 animate-on-scroll">
              <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform transition hover:rotate-6">
                <Star className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Experience</h3>
              <p className="text-gray-600 mb-6">Enjoy a seamless ordering experience with real-time tracking, easy payments, and responsive customer support.</p>
              <a href="#" className="text-orange-500 font-medium flex items-center group">
                Learn More <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Showcase - Enhanced */}
      <section id="restaurants" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-500 font-medium mb-4">Restaurants</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Top <span className="text-orange-500 relative">
              Restaurants
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="#F97316" strokeWidth="2" />
              </svg>
            </span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore the most popular restaurants in your area. From budget-friendly to premium options, we have restaurants for every taste and occasion.</p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-on-scroll">
            <div className="flex items-center bg-gray-50 rounded-full p-2 shadow-md border border-gray-100">
              <div className="bg-white rounded-full p-2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search restaurants or cuisines..." 
                className="bg-transparent border-none focus:outline-none px-4 py-2 flex-grow text-gray-700"
              />
              <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
                Search
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Restaurant Card 1 */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 animate-on-scroll">
              <div className="h-56 bg-gray-200 relative group">
              <img src={res2} alt="Hero Food Image" className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-50"></div>
                <span className="absolute top-4 right-4 bg-white text-orange-500 px-3 py-1 rounded-full text-sm font-medium shadow-md flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-orange-500" /> 4.8
                </span>
                <button className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-red-500 transition transform hover:scale-110">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-xl">Burger Bliss</h3>
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">Open Now</span>
                </div>
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 mr-1 text-orange-500" />
                  <span className="text-sm">0.8 miles away</span>
                </div>
                <div className="flex items-center text-gray-500 mb-4">
                  <Clock className="w-4 h-4 mr-1 text-orange-500" />
                  <span className="text-sm">20-30 min delivery</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">Burgers</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">American</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">Fast Food</span>
                </div>
                <button 
                  className="w-full bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition transform hover:scale-105 shadow-md hover:shadow-orange-200"
                  onClick={handleLoginPrompt}
                >
                  Order Now
                </button>
              </div>
            </div>
            
            {/* Restaurant Card 2 */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 animate-on-scroll">
              <div className="h-56 bg-gray-200 relative group">
              <img src={res4} alt="Hero Food Image" className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-50"></div>
                <span className="absolute top-4 right-4 bg-white text-orange-500 px-3 py-1 rounded-full text-sm font-medium shadow-md flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-orange-500" /> 4.6
                </span>
                <button className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-red-500 transition transform hover:scale-110">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-xl">Pizza Paradise</h3>
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">Open Now</span>
                </div>
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 mr-1 text-orange-500" />
                  <span className="text-sm">1.2 miles away</span>
                </div>
                <div className="flex items-center text-gray-500 mb-4">
                  <Clock className="w-4 h-4 mr-1 text-orange-500" />
                  <span className="text-sm">25-35 min delivery</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">Pizza</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">Italian</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">Pasta</span>
                </div>
                <button 
                  className="w-full bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition transform hover:scale-105 shadow-md hover:shadow-orange-200"
                  onClick={handleLoginPrompt}
                >
                  Order Now
                </button>
              </div>
            </div>
            
            {/* Restaurant Card 3 */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 animate-on-scroll">
              <div className="h-56 bg-gray-200 relative group">
                <img src={res3} alt="Hero Food Image" className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-50"></div>
                <span className="absolute top-4 right-4 bg-white text-orange-500 px-3 py-1 rounded-full text-sm font-medium shadow-md flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-orange-500" /> 4.9
                </span>
                <button className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-red-500 transition transform hover:scale-110">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-xl">Sushi Supreme</h3>
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">Open Now</span>
                </div>
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 mr-1 text-orange-500" />
                  <span className="text-sm">1.5 miles away</span>
                </div>
                <div className="flex items-center text-gray-500 mb-4">
                  <Clock className="w-4 h-4 mr-1 text-orange-500" />
                  <span className="text-sm">30-40 min delivery</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">Sushi</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">Japanese</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">Asian</span>
                </div>
                <button 
                  className="w-full bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition transform hover:scale-105 shadow-md hover:shadow-orange-200"
                  onClick={handleLoginPrompt}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center animate-on-scroll">
            <button 
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition transform hover:scale-105 shadow-lg inline-flex items-center"
              onClick={handleLoginPrompt}
            >
              View All Restaurants <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full opacity-10 transform -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full opacity-10 transform translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block px-4 py-1 rounded-full bg-gray-800 text-orange-500 font-medium mb-4">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How <span className="text-orange-500 relative">
              It Works
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="#F97316" strokeWidth="2" />
              </svg>
            </span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Ordering food with BiteSpeed is simple and hassle-free. Follow these easy steps to get your favorite meals delivered to your doorstep.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center relative animate-on-scroll">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-gray-800">
                <div className="absolute top-0 left-0 h-full w-1/2 bg-orange-500"></div>
              </div>
              
              <div className="relative z-10">
                <div className="bg-black w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-orange-500 shadow-lg shadow-orange-500/20 transform transition hover:scale-110">
                  <span className="text-3xl font-bold text-orange-500">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Choose Restaurant</h3>
                <p className="text-gray-400">Browse through our extensive list of restaurants and cuisines in your area.</p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="text-center relative animate-on-scroll">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-gray-800">
                <div className="absolute top-0 left-0 h-full w-1/2 bg-orange-500"></div>
              </div>
              
              <div className="relative z-10">
                <div className="bg-black w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-orange-500 shadow-lg shadow-orange-500/20 transform transition hover:scale-110">
                  <span className="text-3xl font-bold text-orange-500">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Select Your Meal</h3>
                <p className="text-gray-400">Pick your favorite dishes from the menu and add them to your cart.</p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="text-center relative animate-on-scroll">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-gray-800">
                <div className="absolute top-0 left-0 h-full w-1/2 bg-orange-500"></div>
              </div>
              
              <div className="relative z-10">
                <div className="bg-black w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-orange-500 shadow-lg shadow-orange-500/20 transform transition hover:scale-110">
                  <span className="text-3xl font-bold text-orange-500">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Checkout & Pay</h3>
                <p className="text-gray-400">Review your order, add delivery details, and choose your payment method.</p>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="text-center relative animate-on-scroll">
              <div className="relative z-10">
                <div className="bg-black w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-orange-500 shadow-lg shadow-orange-500/20 transform transition hover:scale-110">
                  <span className="text-3xl font-bold text-orange-500">4</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Enjoy Your Food</h3>
                <p className="text-gray-400">Track your order in real-time and enjoy your meal when it arrives hot and fresh.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our <span className="text-orange-500">Customers Say</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. See what our happy customers have to say about BiteSpeed's food delivery service.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4">
                  {/* User Avatar Placeholder */}
                </div>
                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <div className="flex text-orange-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"BiteSpeed has been a lifesaver during busy workdays. The delivery is always on time, and the food arrives hot and fresh. Their app is super easy to use too!"</p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4">
                  {/* User Avatar Placeholder */}
                </div>
                <div>
                  <h4 className="font-bold">Michael Rodriguez</h4>
                  <div className="flex text-orange-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"I love the variety of restaurants available on BiteSpeed. The delivery drivers are always courteous, and the customer service is excellent when I've needed help."</p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4">
                  {/* User Avatar Placeholder */}
                </div>
                <div>
                  <h4 className="font-bold">Emily Chen</h4>
                  <div className="flex text-orange-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600">"As a busy mom, BiteSpeed has made family dinners so much easier. The kids love being able to choose their favorites, and I love not having to cook every night!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Order <span className="text-orange-500">Delicious Food?</span></h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">Join thousands of satisfied customers and experience the best food delivery service in town. Your favorite meals are just a few clicks away!</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition"
              onClick={handleLoginPrompt}
            >
              Order Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-orange-500 mb-4">Bite<span className="text-white">Speed</span></h3>
              <p className="text-gray-400 mb-4">The fastest food delivery service that brings delicious meals from your favorite local restaurants right to your doorstep.</p>
              <div className="flex space-x-4">
                {/* Social Media Icons Placeholders */}
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition">FB</a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition">TW</a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition">IG</a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition">YT</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">Restaurants</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">Delivery Areas</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                  123 Delivery St, Foodville, FV 12345
                </li>
                <li className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-orange-500" />
                  (555) 123-4567
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  support@bitespeed.com
                </li>
              </ul>
              
              <div className="mt-6">
                <h4 className="text-lg font-bold mb-2">Subscribe to Newsletter</h4>
                <div className="flex mt-2">
                  <input type="email" placeholder="Your email" className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 flex-grow" />
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} BiteSpeed. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Mobile Menu - Hidden by default, would need JS to toggle */}
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 hidden">
        <div className="flex justify-end p-4">
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <a href="#home" className="text-white text-xl mb-6 hover:text-orange-500 transition">Home</a>
          <a href="#services" className="text-white text-xl mb-6 hover:text-orange-500 transition">Services</a>
          <a href="#restaurants" className="text-white text-xl mb-6 hover:text-orange-500 transition">Restaurants</a>
          <a href="#how-it-works" className="text-white text-xl mb-6 hover:text-orange-500 transition">How It Works</a>
          <a href="#testimonials" className="text-white text-xl mb-6 hover:text-orange-500 transition">Testimonials</a>
          <button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition mt-4">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BiteSpeedHomePage;