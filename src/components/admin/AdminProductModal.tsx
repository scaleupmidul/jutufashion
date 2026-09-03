import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image, Layers, Sparkles, Tag, Check, AlertCircle, Settings, Loader2 } from 'lucide-react';
import { Product, ProductColor, CategoryItem } from '../../types';
import { getStoredCategories, addStoredCategory, deleteStoredCategory, STORE_SYNC_EVENT } from '../../data/adminStore';
import { AdminImageUploadField } from './AdminImageUploadField';
import { AdminColorwayGallery } from './AdminColorwayGallery';
import { SHOE_PRESETS } from '../../data/shoeImages';

interface AdminProductModalProps {
  product: Product | null; // if null, creating new product
  onClose: () => void;
  onSave: (product: Product) => Promise<any> | void;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  product,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(product);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() => getStoredCategories());
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [customCategoryBadge, setCustomCategoryBadge] = useState('');
  const [categoryNotice, setCategoryNotice] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const [id, setId] = useState(product?.id || `shoe_${Date.now()}`);
  const [name, setName] = useState(product?.name || '');
  const [subtitle, setSubtitle] = useState(product?.subtitle || '');
  const [category, setCategory] = useState<string>(() => {
    if (product?.category) return product.category;
    const stored = getStoredCategories();
    return stored[0]?.slug || 'runners';
  });
  const [gender, setGender] = useState<Product['gender']>(product?.gender || 'unisex');
  const [price, setPrice] = useState<number>(product?.price || 2850);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(product?.originalPrice);
  const normalizeBadge = (val?: string) => {
    if (!val) return '';
    const upper = val.toUpperCase().trim();
    if (upper === 'NEW') return 'New';
    if (upper === 'BEST' || upper === 'BEST SELLER') return 'Best';
    if (upper === 'LIMITED' || upper === 'LIMITED EDITION') return 'Limited';
    if (upper === 'SALE') return 'Sale';
    if (upper === 'NONE') return '';
    return val;
  };

  const [badge, setBadge] = useState<string>(() => normalizeBadge(product?.badge));
  const [stock, setStock] = useState<number>(product?.stock ?? 25);
  const [isOutOfStock, setIsOutOfStock] = useState<boolean>(
    product?.isOutOfStock || (product?.stock !== undefined && product.stock <= 0) || false
  );
  const [description, setDescription] = useState(
    product?.description || 'Crafted with premium sustainable materials for effortless all-day comfort.'
  );

  // Available Sizes & custom sizing options
  const [availableSizeRange, setAvailableSizeRange] = useState<number[]>(() => {
    const defaultSizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
    const initialProductSizes = product?.sizes || [38, 39, 40, 41, 42, 43, 44];
    const combined = Array.from(new Set([...defaultSizes, ...initialProductSizes])).sort((a, b) => a - b);
    return combined;
  });

  const [selectedSizes, setSelectedSizes] = useState<number[]>(
    product?.sizes || [38, 39, 40, 41, 42, 43, 44]
  );
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [isAddingCustomSize, setIsAddingCustomSize] = useState(false);
  const [isManagingSizes, setIsManagingSizes] = useState(false);

  // Sync categories if changed elsewhere
  useEffect(() => {
    const handleSync = () => {
      setCategoriesList(getStoredCategories());
    };
    window.addEventListener(STORE_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(STORE_SYNC_EVENT, handleSync);
  }, []);

  const handleAddCustomCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customCategoryName.trim()) return;

    const added = addStoredCategory({
      name: customCategoryName.trim(),
      badge: customCategoryBadge.trim() || undefined,
    });

    const updated = getStoredCategories();
    setCategoriesList(updated);
    setCategory(added.slug);
    setCustomCategoryName('');
    setCustomCategoryBadge('');
    setIsAddingCategory(false);
    
    setCategoryNotice({
      type: 'success',
      text: `Category "${added.name}" added & selected!`,
    });
    setTimeout(() => setCategoryNotice(null), 3500);
  };

  const handleDeleteCategory = (catIdOrSlug: string, catName: string) => {
    deleteStoredCategory(catIdOrSlug);
    const updated = getStoredCategories();
    setCategoriesList(updated);
    
    if (category === catIdOrSlug || category === catName.toLowerCase()) {
      setCategory(updated[0]?.slug || 'runners');
    }

    setCategoryNotice({
      type: 'info',
      text: `Category "${catName}" removed.`,
    });
    setTimeout(() => setCategoryNotice(null), 3500);
  };

  // Colors list
  const [colors, setColors] = useState<ProductColor[]>(
    product?.colors && product.colors.length > 0
      ? product.colors.map((c) => ({
          ...c,
          altImages: c.altImages ? [...c.altImages] : [],
        }))
      : [
          {
            name: 'Anthracite',
            colorCode: '#2c2c2c',
            image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80',
            altImages: [],
          },
          {
            name: 'Sea Spray',
            colorCode: '#7298ac',
            image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
            altImages: [],
          },
        ]
  );

  // Materials & Features
  const [materialsText, setMaterialsText] = useState(
    product?.materials.join('\n') || 'Merino Wool Upper\nSugarcane SweetFoam® Outsole\nRecycled Polyester Laces'
  );
  const [featuresText, setFeaturesText] = useState(
    product?.features.join('\n') || 'All-Day Cushioning\nNaturally Odor Resistant\nMachine Washable'
  );

  const toggleSize = (size: number) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size].sort((a, b) => a - b));
    }
  };

  const handleAddCustomSize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = Number(customSizeInput.trim());
    if (isNaN(parsed) || parsed <= 0 || parsed > 99) return;

    if (!availableSizeRange.includes(parsed)) {
      const updatedRange = [...availableSizeRange, parsed].sort((a, b) => a - b);
      setAvailableSizeRange(updatedRange);
    }
    if (!selectedSizes.includes(parsed)) {
      setSelectedSizes([...selectedSizes, parsed].sort((a, b) => a - b));
    }
    setCustomSizeInput('');
    setIsAddingCustomSize(false);
  };

  const handleRemoveSizeFromRange = (sizeToRemove: number) => {
    setAvailableSizeRange(availableSizeRange.filter((s) => s !== sizeToRemove));
    setSelectedSizes(selectedSizes.filter((s) => s !== sizeToRemove));
  };

  const handleAddColor = () => {
    setColors([
      ...colors,
      {
        name: 'New Color',
        colorCode: '#888888',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
        altImages: [],
      },
    ]);
  };

  const handleUpdateColor = (idx: number, key: keyof ProductColor, val: string) => {
    const updated = [...colors];
    updated[idx] = { ...updated[idx], [key]: val };
    setColors(updated);
  };

  const handleAddAltImage = (colorIdx: number, url: string) => {
    if (!url.trim()) return;
    const updated = [...colors];
    const currentAlts = updated[colorIdx].altImages ? [...updated[colorIdx].altImages!] : [];
    currentAlts.push(url.trim());
    updated[colorIdx] = { ...updated[colorIdx], altImages: currentAlts };
    setColors(updated);
  };

  const handleRemoveAltImage = (colorIdx: number, altIdx: number) => {
    const updated = [...colors];
    if (!updated[colorIdx].altImages) return;
    const currentAlts = updated[colorIdx].altImages!.filter((_, i) => i !== altIdx);
    updated[colorIdx] = { ...updated[colorIdx], altImages: currentAlts };
    setColors(updated);
  };

  const handleRemoveColor = (idx: number) => {
    if (colors.length <= 1) return;
    setColors(colors.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const materials = materialsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const features = featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const sanitizedColors = colors.map((col, idx) => ({
      name: col.name.trim() || `Color ${idx + 1}`,
      colorCode: col.colorCode || '#2c2c2c',
      image: col.image?.trim() || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80',
      altImages: col.altImages,
    }));

    const sanitizedSizes = selectedSizes.length > 0 ? selectedSizes : [38, 39, 40, 41, 42, 43, 44];

    const updatedProduct: Product = {
      id,
      name: name.trim().toUpperCase(),
      subtitle: subtitle.trim() || undefined,
      category,
      gender,
      price: Math.max(0, Number(price) || 0),
      originalPrice: originalPrice && Number(originalPrice) > 0 ? Number(originalPrice) : undefined,
      badge: badge ? (badge as Product['badge']) : undefined,
      stock: Math.max(0, Number(stock) || 0),
      isOutOfStock: isOutOfStock || Number(stock) <= 0,
      colors: sanitizedColors,
      sizes: sanitizedSizes,
      description: description.trim() || 'Crafted with premium sustainable materials for effortless all-day comfort.',
      materials: materials.length > 0 ? materials : ['Premium Sustainable Fiber'],
      features: features.length > 0 ? features : ['Ergonomic Comfort'],
      rating: product?.rating || 4.9,
      reviewCount: product?.reviewCount || 120,
    };

    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await onSave(updatedProduct);
      if (res && res.success === false) {
        throw new Error(res.error || 'Failed to save to database');
      }
      setIsSaving(false);
      onClose();
    } catch (err: any) {
      setIsSaving(false);
      setSaveError(err.message || 'Database error: Could not save product.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-auto text-stone-900">
        
        {/* Header Bar */}
        <div className="bg-[#0c0c0c] text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight font-sans">
              {isEditing ? 'EDIT FOOTWEAR MODEL' : 'ADD NEW FOOTWEAR MODEL'}
            </h3>
            <span className="text-xs text-stone-400 block mt-0.5">
              Live updates the store catalog and product details page.
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Row 1: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                Model Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. MEN'S WOOL RUNNER PRO"
                required
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-black uppercase"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                Subtitle / Headline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Premium merino wool everyday sneaker"
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Category Notice Banner */}
          {categoryNotice && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between animate-fadeIn ${
              categoryNotice.type === 'success' 
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                : 'bg-stone-100 text-stone-800 border border-stone-200'
            }`}>
              <div className="flex items-center space-x-2">
                {categoryNotice.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-stone-600 shrink-0" />
                )}
                <span>{categoryNotice.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setCategoryNotice(null)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Row 2: Category, Gender, Badge, Stock */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              
              {/* Category Select & Actions */}
              <div>
                <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                  Category *
                </label>
                <div className="flex items-center space-x-1.5">
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === '__ADD_NEW__') {
                        setIsAddingCategory(true);
                        setIsManagingCategories(false);
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="flex-1 min-w-0 bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-black capitalize truncate"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.id || cat.slug} value={cat.slug}>
                        {cat.name} {cat.badge ? `(${cat.badge})` : ''}
                      </option>
                    ))}
                    {!categoriesList.some((c) => c.slug === category) && category && (
                      <option value={category}>{category}</option>
                    )}
                    <option value="__ADD_NEW__" className="font-bold text-stone-950 bg-stone-100">
                      + Add Custom Category...
                    </option>
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(!isAddingCategory);
                      setIsManagingCategories(false);
                    }}
                    className={`h-[38px] w-[38px] shrink-0 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      isAddingCategory 
                        ? 'bg-black text-white border-black shadow-xs' 
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-black border-stone-300'
                    }`}
                    title="Add Custom Category"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsManagingCategories(!isManagingCategories);
                      setIsAddingCategory(false);
                    }}
                    className={`h-[38px] w-[38px] shrink-0 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      isManagingCategories 
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs' 
                        : 'bg-stone-50 hover:bg-rose-50 text-stone-600 hover:text-rose-600 border-stone-300'
                    }`}
                    title="Manage & Remove Categories"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Product['gender'])}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-black h-[38px]"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              {/* Badge */}
              <div>
                <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                  Badge
                </label>
                <select
                  value={normalizeBadge(badge)}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-black h-[38px]"
                >
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Best">Best</option>
                  <option value="Limited">Limited</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>

              {/* Stock Quantity & Out of Stock toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block">
                    Stock Quantity
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isOutOfStock}
                      onChange={(e) => setIsOutOfStock(e.target.checked)}
                      className="sr-only"
                    />
                    <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                      isOutOfStock
                        ? 'bg-rose-600 text-white'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}>
                      {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
                    </span>
                  </label>
                </div>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => {
                    const newStock = Number(e.target.value);
                    setStock(newStock);
                    if (newStock === 0) {
                      setIsOutOfStock(true);
                    }
                  }}
                  min="0"
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-black h-[38px]"
                />
              </div>
            </div>

            {/* Custom Category Inline Form Box */}
            {isAddingCategory && (
              <div className="bg-stone-100 border border-stone-300/80 rounded-2xl p-4 space-y-3 animate-fadeIn shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-900 flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-stone-700" />
                    <span>Create New Custom Category</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Category Name (e.g. Sandals, Boots, High Tops, Loafers)"
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      autoFocus
                      className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-medium rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Optional Badge (e.g. SUMMER)"
                      value={customCategoryBadge}
                      onChange={(e) => setCustomCategoryBadge(e.target.value)}
                      className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-medium rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-black uppercase"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-3 py-1.5 text-stone-600 hover:text-stone-900 text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    disabled={!customCategoryName.trim()}
                    className="bg-stone-950 hover:bg-black disabled:bg-stone-300 text-white px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add & Select Category</span>
                  </button>
                </div>
              </div>
            )}

            {/* Manage & Remove Categories Box */}
            {isManagingCategories && (
              <div className="bg-stone-100 border border-stone-300/80 rounded-2xl p-4 space-y-3 animate-fadeIn shadow-2xs">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-900 flex items-center space-x-1.5">
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Manage & Remove Categories</span>
                    </span>
                    <span className="text-[10px] text-stone-500 block">
                      Click the trash icon to permanently remove any unwanted category.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsManagingCategories(false)}
                    className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {categoriesList.map((cat) => (
                    <div
                      key={cat.id || cat.slug}
                      className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded-xl"
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="text-xs font-bold text-stone-900 truncate">
                          {cat.name}
                        </span>
                        {cat.badge && (
                          <span className="text-[8px] font-extrabold uppercase bg-stone-900 text-white px-1.5 py-0.5 rounded">
                            {cat.badge}
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-stone-400">
                          /{cat.slug}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id || cat.slug, cat.name)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer shrink-0 ml-2"
                        title={`Remove "${cat.name}" category`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setIsManagingCategories(false)}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Row 3: Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                Selling Price (৳ Taka) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                min="0"
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-sm font-mono font-bold rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                Original / Strike-through Price (Optional ৳)
              </label>
              <input
                type="number"
                value={originalPrice || ''}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 3500"
                min="0"
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-sm font-mono rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Row 4: Size Selection */}
          <div className="bg-[#faf8f5] border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest uppercase text-stone-600">
                AVAILABLE SIZES
              </span>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCustomSize(!isAddingCustomSize);
                    setIsManagingSizes(false);
                  }}
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                    isAddingCustomSize
                      ? 'bg-black text-white'
                      : 'bg-white text-stone-700 hover:text-black border border-stone-200 shadow-2xs'
                  }`}
                  title="Add custom shoe size"
                >
                  <Plus className="w-3 h-3" />
                  <span>Custom Size</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsManagingSizes(!isManagingSizes);
                    setIsAddingCustomSize(false);
                  }}
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                    isManagingSizes
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-rose-600 hover:text-rose-700 border border-stone-200 shadow-2xs'
                  }`}
                  title="Remove sizes from list"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Manage</span>
                </button>
              </div>
            </div>

            {/* Inline Custom Size Form */}
            {isAddingCustomSize && (
              <div className="bg-white border border-stone-300 rounded-xl p-3 flex items-center gap-2 animate-fadeIn shadow-2xs">
                <input
                  type="number"
                  placeholder="Enter size (e.g. 34, 47, 48, 49)"
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  min="20"
                  max="60"
                  autoFocus
                  className="flex-1 bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono font-bold rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSize}
                  disabled={!customSizeInput.trim()}
                  className="bg-black hover:bg-stone-800 disabled:bg-stone-300 text-white px-3.5 py-2 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer flex items-center space-x-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Size</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomSize(false)}
                  className="text-stone-400 hover:text-stone-700 p-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Inline Size Manager (Delete sizes) */}
            {isManagingSizes && (
              <div className="bg-white border border-stone-300 rounded-xl p-3.5 space-y-2 animate-fadeIn shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-stone-700">
                  <span>Click any size to permanently remove it from available options:</span>
                  <button
                    type="button"
                    onClick={() => setIsManagingSizes(false)}
                    className="text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {availableSizeRange.map((sz) => (
                    <div
                      key={sz}
                      className="group flex items-center bg-rose-50 border border-rose-200 rounded-xl pl-2.5 pr-1 py-1 text-xs font-mono font-bold text-rose-900"
                    >
                      <span>{sz}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSizeFromRange(sz)}
                        className="text-rose-400 hover:text-rose-700 hover:bg-rose-100 p-1 rounded-md ml-1 transition-colors cursor-pointer"
                        title={`Remove size ${sz}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Size Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {availableSizeRange.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`w-11 h-10 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white border border-stone-300 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            <span className="text-[10px] text-stone-500 block">
              Click buttons to select/unselect active sizes for this model. Dark buttons indicate enabled sizes.
            </span>
          </div>

          {/* Row 5: Colorways & Images */}
          <div className="bg-[#faf8f5] border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest uppercase text-stone-600">
                COLOR VARIANTS & IMAGES ({colors.length})
              </span>
              <button
                type="button"
                onClick={handleAddColor}
                className="text-[11px] font-bold text-stone-900 hover:text-black flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Colorway</span>
              </button>
            </div>

            <div className="space-y-4">
              {colors.map((col, idx) => (
                <div key={idx} className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="color"
                        value={col.colorCode}
                        onChange={(e) => handleUpdateColor(idx, 'colorCode', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-stone-300 cursor-pointer"
                        title="Pick Hex Color"
                      />
                      <input
                        type="text"
                        value={col.name}
                        onChange={(e) => handleUpdateColor(idx, 'name', e.target.value)}
                        placeholder="Color Name (e.g. Natural White)"
                        className="bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none w-48 sm:w-64"
                      />
                      <span className="text-[11px] font-mono text-stone-400">
                        {col.colorCode}
                      </span>
                    </div>

                    {colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove this colorway"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <AdminImageUploadField
                      label={`Photo for "${col.name || 'Colorway'}"`}
                      value={col.image}
                      onChange={(url) => handleUpdateColor(idx, 'image', url)}
                      presetImages={SHOE_PRESETS}
                      aspectRatio="square"
                      helperText="Upload image file or select from shoe image presets"
                    />
                  </div>

                  {/* Left-side Angle & Gallery Thumbnails */}
                  <AdminColorwayGallery
                    colorName={col.name}
                    images={col.altImages || []}
                    onAddImage={(url) => handleAddAltImage(idx, url)}
                    onRemoveImage={(imgIdx) => handleRemoveAltImage(idx, imgIdx)}
                    presetImages={SHOE_PRESETS}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 6: Description & Materials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-wider uppercase text-stone-600 block mb-1">
                Materials (One per line)
              </label>
              <textarea
                value={materialsText}
                onChange={(e) => setMaterialsText(e.target.value)}
                rows={3}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-black font-mono"
              />
            </div>
          </div>

          {/* Error Banner */}
          {saveError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-800 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-stone-950 hover:bg-black text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center space-x-2 disabled:opacity-60"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSaving ? 'Saving to Database...' : (isEditing ? 'Update Footwear' : 'Save Footwear')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
