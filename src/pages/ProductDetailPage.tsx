import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Layers, 
  ChevronRight,
  Ruler,
  ShoppingBag,
  ShoppingCart
} from 'lucide-react';
import { motion } from 'motion/react';
import { Product, ProductColor, PageView } from '../types';
import { formatTaka } from '../utils/currency';
import { formatBadge } from '../utils/badge';
import { SizeGuideModal } from '../components/SizeGuideModal';

interface ProductDetailPageProps {
  product: Product;
  selectedColor?: ProductColor;
  onAddToCart: (product: Product, color: ProductColor, size: number, quantity?: number, openDrawer?: boolean) => void;
  onNavigate: (view: PageView) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  selectedColor: propSelectedColor,
  onAddToCart,
  onNavigate,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    propSelectedColor || product.colors[0]
  );
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[2] || product.sizes[0]);
  const [activeImage, setActiveImage] = useState<string>(
    propSelectedColor?.image || product.colors[0].image
  );
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const isOutOfStock = product.isOutOfStock || (product.stock !== undefined && product.stock <= 0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

  useEffect(() => {
    if (propSelectedColor) {
      setSelectedColor(propSelectedColor);
      setActiveImage(propSelectedColor.image);
    }
  }, [propSelectedColor]);

  const handleColorChange = (color: ProductColor) => {
    setSelectedColor(color);
    setActiveImage(color.image);
  };

  const handleAdd = () => {
    const isPhone = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isPhone) {
      onAddToCart(product, selectedColor, selectedSize, 1, false);
      onNavigate('cart');
    } else {
      onAddToCart(product, selectedColor, selectedSize, 1, true);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const colorAlts = selectedColor.altImages;
  const galleryImages = [
    selectedColor.image,
    ...(Array.isArray(colorAlts) && colorAlts.length > 0
      ? colorAlts
      : Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : !colorAlts
      ? [
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80',
        ]
      : []),
  ].filter(Boolean);

  return (
    <div className="w-full lg:w-[85%] mx-auto px-3.5 sm:px-6 md:px-8 py-4 sm:py-10 animate-fadeIn pb-10 sm:pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-stone-500 mb-4 sm:mb-6 uppercase tracking-wider overflow-x-auto whitespace-nowrap scrollbar-none py-1">
        <button onClick={() => onNavigate('home')} className="hover:text-stone-900 cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
        <button
          onClick={() => onNavigate(product.gender === 'men' ? 'men' : 'women')}
          className="hover:text-stone-900 cursor-pointer"
        >
          {product.gender === 'men' ? "Men's" : "Women's"} Shoes
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
        <span className="text-stone-900 font-semibold truncate max-w-[150px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14">
        
        {/* Left Gallery (7 columns on desktop) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 sm:gap-2.5 overflow-x-auto md:overflow-visible scrollbar-none p-1 shrink-0">
            {galleryImages.map((imgUrl, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(imgUrl)}
                className={`w-14 h-14 sm:w-20 sm:h-20 bg-[#faf8f5] rounded-xl p-1.5 flex-shrink-0 border transition-all cursor-pointer ${
                  activeImage === imgUrl
                    ? 'border-stone-900 shadow-xs'
                    : 'border-stone-200/90 hover:border-stone-400 opacity-80 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover rounded-lg select-none" />
              </button>
            ))}
          </div>

          {/* Main Large Image - strictly 1:1 aspect ratio across all devices */}
          <div className="flex-1 w-full aspect-square bg-[#faf8f5] rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center relative">
            <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 flex flex-col gap-1.5 z-10">
              {formatBadge(product.badge) && (
                <span className="bg-[#e7e3d9] text-stone-800 text-[10px] sm:text-[10.5px] font-bold tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase inline-block leading-none shadow-2xs">
                  {formatBadge(product.badge)}
                </span>
              )}
              {isOutOfStock && (
                <span className="bg-rose-600 text-white text-[9px] sm:text-[9.5px] font-bold tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase inline-block leading-none shadow-2xs">
                  Out of Stock
                </span>
              )}
            </div>
            <img
              src={activeImage}
              alt={product.name}
              className={`w-full h-full object-cover select-none ${
                isOutOfStock ? 'opacity-70 grayscale-[30%]' : ''
              }`}
            />
          </div>
        </div>

        {/* Right Details & Sticky Purchase Box (5 columns on desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Product Title */}
            <h1 className="font-serif text-2xl sm:text-4xl text-stone-900 font-normal tracking-tight mb-1.5 sm:mb-2 uppercase">
              {product.name}
            </h1>

            {/* Price & Original Strike-through Price */}
            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl font-bold text-stone-950">{formatTaka(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm sm:text-base font-normal text-stone-400 line-through">
                  {formatTaka(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-5 sm:mb-6 font-normal">
              {product.description}
            </p>

            {/* Color Switcher */}
            <div className="mb-5 sm:mb-6 pb-4 sm:pb-6 border-b border-stone-200">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-900 mb-2.5">
                <span>COLOR: <span className="font-normal text-stone-600 uppercase">{selectedColor.name}</span></span>
              </div>
              <div className="flex items-center space-x-3">
                {product.colors.map((c) => {
                  const isSelected = c.name === selectedColor.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => handleColorChange(c)}
                      className={`w-8 h-8 sm:w-7 sm:h-7 rounded-full transition-all relative flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-stone-900 scale-110'
                          : 'hover:scale-110 opacity-80'
                      }`}
                      style={{ backgroundColor: c.colorCode }}
                      title={c.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-900 mb-2.5">
                <span>SELECT SIZE</span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-stone-700 hover:text-stone-950 font-semibold text-xs flex items-center space-x-1 transition-colors cursor-pointer group underline underline-offset-4 py-1"
                >
                  <Ruler className="w-3.5 h-3.5 text-stone-500 group-hover:text-stone-900" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                {product.sizes.map((size) => {
                  const isSelected = size === selectedSize;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 sm:py-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer min-h-[44px] flex items-center justify-center border ${
                        isSelected
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-800 border-stone-200/90 hover:border-stone-400 hover:bg-stone-50 active:bg-stone-100'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button (Consistent Rounded Corner Shape across Mobile, Tablet, and Desktop) */}
            <div className="mt-6 mb-6 sm:mt-7 sm:mb-7 lg:my-6">
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`group relative w-full py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold tracking-[0.14em] uppercase transition-all duration-200 flex items-center justify-center space-x-2.5 shadow-md hover:shadow-lg border ${
                  isOutOfStock
                    ? 'bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed shadow-none'
                    : 'bg-stone-950 hover:bg-stone-900 border-stone-900 text-white active:scale-[0.98] cursor-pointer'
                }`}
              >
                {isOutOfStock ? (
                  <span>Currently Out of Stock</span>
                ) : added ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span className="hidden md:inline">Added To Bag!</span>
                    <span className="md:hidden">Added To Cart!</span>
                  </>
                ) : (
                  <>
                    {/* Animated Shopping Cart / Bag Icon */}
                    <motion.span
                      animate={{ y: [0, -3.5, 0] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="inline-flex items-center justify-center shrink-0"
                    >
                      <ShoppingCart className="w-4 h-4 text-stone-200 md:hidden" />
                      <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-stone-200 hidden md:inline" />
                    </motion.span>
                    {/* Phone version: exclusively "Add To Cart" (no "Add To Bag" name here) */}
                    <span className="md:hidden">Add To Cart</span>
                    {/* Desktop version: "Add To Bag — Price" */}
                    <span className="hidden md:inline">Add To Bag — {formatTaka(product.price)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-stone-200 text-center text-[10px] sm:text-[11px] text-stone-600">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-stone-800 mb-1" />
                <span>Free Shipping Over ৳2,000</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-stone-800 mb-1" />
                <span>Easy Size Exchange</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-stone-800 mb-1" />
                <span>100% Quality Guaranteed</span>
              </div>
            </div>

          </div>

          {/* Materials & Build Specifications Card */}
          <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-stone-200/90">
            <h3 className="text-xs font-bold tracking-wider uppercase text-stone-900 mb-2.5 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-stone-800" />
              <span>Materials & Build Quality</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-700 mb-3.5">
              {product.materials.map((mat, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-stone-400 font-bold">•</span>
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Best Suited For
              </span>
              <span className="text-xs font-semibold text-stone-900 bg-[#faf8f5] px-2.5 py-1 rounded-lg border border-stone-200/90 inline-block w-fit">
                {product.idealFor || 'Daily Comfort & Walking'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Size Guide Modal Popup */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        defaultGender={product.gender}
        availableSizes={product.sizes}
        currentSelectedSize={selectedSize}
        onSelectSize={(newSize) => setSelectedSize(newSize)}
      />
    </div>
  );
};
