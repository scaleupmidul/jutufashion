import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { formatTaka } from '../utils/currency';
import { formatBadge, NormalizedBadge } from '../utils/badge';

interface BestSellersCarouselProps {
  products: Product[];
  onSelectProduct: (product: Product, selectedColor?: ProductColor) => void;
  onQuickAdd?: (product: Product, color: ProductColor, size: number) => void;
}

interface BestSellerItem {
  product: Product;
  forcedColor: ProductColor;
  forcedBadge?: NormalizedBadge;
}

export const BestSellersCarousel: React.FC<BestSellersCarouselProps> = ({
  products,
  onSelectProduct,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const isAdjustingRef = useRef(false);

  // Generate the curated base list of best seller items
  const baseItems: BestSellerItem[] = useMemo(() => {
    const pCruiserWhite = products.find(p => p.id === '262370');
    const pRunnerMushroom = products.find(p => p.id === '262371');
    const pRunnerAnthracite = products.find(p => p.id === '262372');
    const pRunnerNavy = products.find(p => p.id === '262373');
    const pCanvasWarmWhite = products.find(p => p.id === '262369');
    const pCanvasSeaSpray = products.find(p => p.id === '262364');
    const pSlideAnthracite = products.find(p => p.id === '262361');
    const pSlideBlack = products.find(p => p.id === '262363');
    const pFlipFlop = products.find(p => p.id === '262362');
    const pSlideSand = products.find(p => p.id === '262365');
    const pDasher = products.find(p => p.id === '262374');

    const rawList: (BestSellerItem | null)[] = [
      pCruiserWhite && pCruiserWhite.colors?.[0] ? { product: pCruiserWhite, forcedColor: pCruiserWhite.colors[0], forcedBadge: formatBadge(pCruiserWhite.badge || 'New') } : null,
      pRunnerMushroom && pRunnerMushroom.colors?.[0] ? { product: pRunnerMushroom, forcedColor: pRunnerMushroom.colors[0], forcedBadge: formatBadge(pRunnerMushroom.badge || 'New') } : null,
      pRunnerAnthracite && pRunnerAnthracite.colors?.[0] ? { product: pRunnerAnthracite, forcedColor: pRunnerAnthracite.colors[0], forcedBadge: formatBadge(pRunnerAnthracite.badge || 'New') } : null,
      pRunnerNavy && pRunnerNavy.colors?.[0] ? { product: pRunnerNavy, forcedColor: pRunnerNavy.colors[0], forcedBadge: formatBadge(pRunnerNavy.badge || 'New') } : null,
      pCanvasWarmWhite && pCanvasWarmWhite.colors?.[0] ? { product: pCanvasWarmWhite, forcedColor: pCanvasWarmWhite.colors[0], forcedBadge: formatBadge(pCanvasWarmWhite.badge || 'New') } : null,
      pCanvasSeaSpray && pCanvasSeaSpray.colors?.[0] ? { product: pCanvasSeaSpray, forcedColor: pCanvasSeaSpray.colors[0], forcedBadge: formatBadge(pCanvasSeaSpray.badge || 'Best') } : null,
      pSlideAnthracite && pSlideAnthracite.colors?.[0] ? { product: pSlideAnthracite, forcedColor: pSlideAnthracite.colors[0], forcedBadge: formatBadge(pSlideAnthracite.badge || 'New') } : null,
      pSlideBlack && pSlideBlack.colors?.[0] ? { product: pSlideBlack, forcedColor: pSlideBlack.colors[0], forcedBadge: formatBadge(pSlideBlack.badge || 'New') } : null,
      pFlipFlop && pFlipFlop.colors?.[0] ? { product: pFlipFlop, forcedColor: pFlipFlop.colors[0], forcedBadge: formatBadge(pFlipFlop.badge || 'Best') } : null,
      pSlideSand && pSlideSand.colors?.[0] ? { product: pSlideSand, forcedColor: pSlideSand.colors[0], forcedBadge: formatBadge(pSlideSand.badge || 'New') } : null,
      pDasher && pDasher.colors?.[0] ? { product: pDasher, forcedColor: pDasher.colors[0], forcedBadge: formatBadge(pDasher.badge || 'Best') } : null,
    ];

    const validList = rawList.filter((item): item is BestSellerItem => item !== null && Boolean(item.forcedColor));
    if (validList.length > 0) return validList;

    // Fallback if none found
    return products
      .filter(p => p.colors && p.colors.length > 0)
      .map(p => ({
        product: p,
        forcedColor: p.colors[0],
        forcedBadge: formatBadge(p.badge),
      }));
  }, [products]);

  // Clone base items 4 times to create an endless loop buffer
  const COPIES = 4;
  const loopProducts = useMemo(() => {
    const list: BestSellerItem[] = [];
    for (let c = 0; c < COPIES; c++) {
      list.push(...baseItems);
    }
    return list;
  }, [baseItems]);

  // Set initial scroll position to the middle copy (copy 1 out of 0..3)
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const setInitialPosition = () => {
      if (el.scrollWidth > el.clientWidth) {
        const singleSetWidth = el.scrollWidth / COPIES;
        if (el.clientWidth < 640 && el.children.length > 0) {
          const targetIndex = baseItems.length; // start at beginning of middle loop set
          const targetCard = el.children[targetIndex] as HTMLElement;
          if (targetCard) {
            el.scrollLeft = targetCard.offsetLeft - (el.clientWidth - targetCard.offsetWidth) / 2;
            return;
          }
        }
        el.scrollLeft = singleSetWidth;
      }
    };

    const timer = setTimeout(setInitialPosition, 50);
    return () => clearTimeout(timer);
  }, [loopProducts, baseItems.length]);

  // Seamless infinite wrap-around on scroll
  const handleScrollWrap = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || isAdjustingRef.current) return;

    const totalWidth = el.scrollWidth;
    const singleSetWidth = totalWidth / COPIES;
    if (singleSetWidth <= 0) return;

    // If scrolled too far left (near 0), jump forward by 2 sets
    if (el.scrollLeft < singleSetWidth * 0.35) {
      isAdjustingRef.current = true;
      el.scrollLeft += singleSetWidth * 2;
      requestAnimationFrame(() => {
        isAdjustingRef.current = false;
      });
    }
    // If scrolled too far right (near end), jump back by 2 sets
    else if (el.scrollLeft > singleSetWidth * 2.65) {
      isAdjustingRef.current = true;
      el.scrollLeft -= singleSetWidth * 2;
      requestAnimationFrame(() => {
        isAdjustingRef.current = false;
      });
    }
  }, []);

  const handleNavClick = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const isMobile = window.innerWidth < 640 || el.clientWidth < 640;

    // Mobile: Center one card exactly in the viewport on each button click
    if (isMobile && el.children.length > 0) {
      const currentCenter = el.scrollLeft + el.clientWidth / 2;
      const cards = Array.from(el.children) as HTMLElement[];

      if (direction === 'right') {
        const nextCard = cards.find(card => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          return cardCenter > currentCenter + 15;
        });

        if (nextCard) {
          const targetScrollLeft = nextCard.offsetLeft - (el.clientWidth - nextCard.offsetWidth) / 2;
          el.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth',
          });
          return;
        }
      } else {
        const prevCards = cards.filter(card => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          return cardCenter < currentCenter - 15;
        });

        const prevCard = prevCards[prevCards.length - 1];
        if (prevCard) {
          const targetScrollLeft = prevCard.offsetLeft - (el.clientWidth - prevCard.offsetWidth) / 2;
          el.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth',
          });
          return;
        }
      }
    }

    // Tablet & Desktop: smooth step navigation
    const containerWidth = el.clientWidth;
    const step = containerWidth * 0.32;

    el.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  // Mouse drag handlers for desktop swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setInitialScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 6) {
      setHasMoved(true);
    }
    scrollContainerRef.current.scrollLeft = initialScrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="w-full bg-[#ede9e2] pt-6 sm:pt-8 pb-8 sm:pb-12 overflow-hidden">
      {/* Section Header with BEST SELLERS and Carousel controls */}
      <div className="w-full px-4 sm:px-6 md:px-8 flex items-center justify-between mb-4 sm:mb-5">
        <div className="inline-block border-b border-black pb-0.5">
          <h2 className="text-[12px] sm:text-[14px] font-bold tracking-[0.15em] uppercase text-stone-900 leading-none">
            BEST SELLERS
          </h2>
        </div>

        {/* Carousel Prev / Next Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleNavClick('left')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-stone-800 flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-all focus:outline-none cursor-pointer"
            aria-label="Previous products"
            title="Previous"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
          </button>
          <button
            onClick={() => handleNavClick('right')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-stone-800 flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-all focus:outline-none cursor-pointer"
            aria-label="Next products"
            title="Next"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel with Seamless Looping */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScrollWrap}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`w-full flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none px-4 sm:px-6 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {loopProducts.map((item, idx) => {
          const { product, forcedColor, forcedBadge } = item;
          if (!product) return null;
          const colorObj = forcedColor || product.colors?.[0] || { name: 'Standard', colorCode: '#333333', image: '' };

          return (
            <div
              key={`${product.id}-${colorObj.name || 'color'}-loop-${idx}`}
              onClick={() => {
                if (!hasMoved) {
                  onSelectProduct(product, colorObj);
                }
              }}
              className="group product-card flex-none w-[72%] sm:w-[46%] md:w-[31%] lg:w-[23.8%] xl:w-[23.8%] bg-white rounded-[.666rem] overflow-hidden flex flex-col justify-between cursor-pointer active:scale-[0.99] transition-all duration-200 select-none relative shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              style={{ borderRadius: '.666rem' }}
            >
              {/* Top Badge: Floating over top corners */}
              <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 z-10 flex items-center justify-between pointer-events-none">
                {forcedBadge ? (
                  <span className="bg-[#e7e3d9]/90 backdrop-blur-xs text-stone-800 text-[10px] sm:text-[10.5px] font-bold tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg uppercase inline-block leading-none shadow-2xs">
                    {forcedBadge}
                  </span>
                ) : (
                  <span />
                )}

                {(product.isOutOfStock || (product.stock !== undefined && product.stock <= 0)) && (
                  <span className="bg-rose-600 text-white text-[9px] sm:text-[9.5px] font-bold tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg uppercase leading-none shadow-2xs">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Main Product Image - Full bleed on top, left, and right with zero gap/margin/padding */}
              <div className="w-full aspect-[4/3] sm:aspect-square flex items-center justify-center relative overflow-hidden bg-[#faf8f5]">
                {colorObj.image ? (
                  <img
                    src={colorObj.image}
                    alt={`${product.name} - ${colorObj.name}`}
                    className={`w-full h-full object-cover select-none pointer-events-none ${
                      (product.isOutOfStock || (product.stock !== undefined && product.stock <= 0))
                        ? 'opacity-70 grayscale-[25%]'
                        : ''
                    }`}
                    loading="lazy"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Typography & Info - only bottom space */}
              <div className="flex flex-col text-left p-3.5 sm:p-4 mt-auto">
                <h3
                  className="text-[13px] sm:text-[14px] md:text-[15px] font-bold tracking-[0.06em] text-stone-900 uppercase leading-snug truncate"
                  title={product.name}
                >
                  {product.name}
                </h3>

                <p className="text-[12px] sm:text-[13px] text-stone-600 font-normal leading-snug mt-1 truncate">
                  {colorObj.name}
                </p>

                {/* Bottom Row: Color Swatch on Left and Price on Right */}
                <div className="flex items-center justify-between mt-2.5 pt-0.5">
                  <div className="flex items-center">
                    <span
                      className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full border border-stone-300 ring-1 ring-stone-800/80 ring-offset-1 inline-block shrink-0"
                      style={{ backgroundColor: colorObj.colorCode || '#333333' }}
                      title={colorObj.name}
                    />
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-[13px] sm:text-[14px] md:text-[15px] font-bold text-stone-900 leading-snug">
                      {formatTaka(product.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

