import React, { useState } from 'react';
import { 
  Save, 
  Check, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  FileText, 
  Heart, 
  ShieldCheck, 
  HelpCircle,
  Eye,
  Layout,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  PagesContentConfig, 
  HeroSlideItem, 
  PillarItem, 
  CategoryCardItem, 
  LifestylePhotoItem, 
  PageView 
} from '../../types';
import { AdminImageUploadField } from './AdminImageUploadField';
import { SHOE_PRESETS, LIFESTYLE_PRESETS } from '../../data/shoeImages';

interface AdminPagesContentViewProps {
  pagesContent: PagesContentConfig;
  onSaveContent: (content: PagesContentConfig) => Promise<any> | void;
  onExitAdmin: () => void;
}

export const AdminPagesContentView: React.FC<AdminPagesContentViewProps> = ({
  pagesContent,
  onSaveContent,
}) => {
  const [content, setContent] = useState<PagesContentConfig>(pagesContent);
  const [activeSubSection, setActiveSubSection] = useState<
    | 'hero' 
    | 'categoryGrid' 
    | 'lifestylePhotos' 
    | 'whyUs' 
    | 'ourStory' 
    | 'shoeCare' 
    | 'policies'
  >('hero');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await onSaveContent(content);
      if (res && res.success === false) {
        throw new Error(res.error || 'Failed to save website pages to database');
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      setSaveError(err.message || 'Database error while saving website content');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper for Hero Slides
  const handleUpdateHeroSlide = (idx: number, key: keyof HeroSlideItem, val: any) => {
    const updated = [...content.heroSlides];
    updated[idx] = { ...updated[idx], [key]: val };
    setContent({ ...content, heroSlides: updated });
  };

  const handleAddHeroSlide = () => {
    const newSlide: HeroSlideItem = {
      id: `slide_${Date.now()}`,
      eyebrow: 'NEW COLLECTION',
      title: 'Supreme Natural Comfort.\nCrafted For You.',
      subtitle: 'Engineered with sustainable merino wool and eucalyptus fibers.',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=2200&q=88',
      primaryActionLabel: 'SHOP MEN',
      primaryActionView: 'men',
      secondaryActionLabel: 'SHOP WOMEN',
      secondaryActionView: 'women',
    };
    setContent({ ...content, heroSlides: [...content.heroSlides, newSlide] });
  };

  const handleRemoveHeroSlide = (idx: number) => {
    if (content.heroSlides.length <= 1) return;
    setContent({
      ...content,
      heroSlides: content.heroSlides.filter((_, i) => i !== idx),
    });
  };

  // Helper for Category Cards
  const handleUpdateCategoryCard = (idx: number, key: keyof CategoryCardItem, val: any) => {
    const updated = [...content.categoryCards];
    updated[idx] = { ...updated[idx], [key]: val };
    setContent({ ...content, categoryCards: updated });
  };

  // Helper for Lifestyle Photos
  const handleUpdateLifestylePhoto = (idx: number, key: keyof LifestylePhotoItem, val: any) => {
    const updated = [...content.lifestylePhotos];
    updated[idx] = { ...updated[idx], [key]: val };
    setContent({ ...content, lifestylePhotos: updated });
  };

  // Helper for Why Us Pillars
  const handleUpdatePillar = (idx: number, key: keyof PillarItem, val: string) => {
    const updated = [...content.whyUs.pillars];
    updated[idx] = { ...updated[idx], [key]: val };
    setContent({
      ...content,
      whyUs: { ...content.whyUs, pillars: updated },
    });
  };

  const subSections = [
    { id: 'hero', label: '1. Hero Carousel', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'categoryGrid', label: '2. Category Grid (4 Cards)', icon: <Layout className="w-3.5 h-3.5" /> },
    { id: 'lifestylePhotos', label: '3. Lifestyle Photos (4 Shots)', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'whyUs', label: '4. Why Choose Us', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'ourStory', label: '5. Our Story Page', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'shoeCare', label: '6. Shoe Care Guide', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'policies', label: '7. Legal & Policies', icon: <HelpCircle className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <form onSubmit={handleSave} className="space-y-5 animate-fadeIn font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-stone-950 uppercase">
            Pages & Content CMS
          </h2>
          <p className="text-xs text-stone-500">
            Manage text, banners, category cards, and policy pages live on your storefront.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-stone-950 hover:bg-stone-800 disabled:opacity-75 text-white text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs self-start sm:self-auto active:scale-95"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>SAVING DB...</span>
            </>
          ) : savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>SAVED TO DB</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>SAVE & PUBLISH</span>
            </>
          )}
        </button>
      </div>

      {saveError && (
        <div className="bg-rose-50 border border-rose-300 text-rose-900 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Website content successfully updated in database!</span>
        </div>
      )}

      {/* Minimal Navigation Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-stone-200">
        {subSections.map((sub) => {
          const isActive = activeSubSection === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveSubSection(sub.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-stone-950 text-white'
                  : 'bg-white text-stone-600 hover:text-stone-950 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {sub.icon}
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. HERO BANNER & SLIDES                                  */}
      {/* ======================================================== */}
      {activeSubSection === 'hero' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-stone-900 tracking-wider">
              Homepage Hero Slides ({content.heroSlides.length})
            </span>
            <button
              type="button"
              onClick={handleAddHeroSlide}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="space-y-3">
            {content.heroSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="bg-white border border-stone-200 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="bg-stone-100 text-stone-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    SLIDE #{idx + 1}
                  </span>

                  {content.heroSlides.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHeroSlide(idx)}
                      className="text-stone-400 hover:text-red-700 p-1 cursor-pointer transition-colors"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="md:col-span-1">
                    <AdminImageUploadField
                      label="Slide Banner Image"
                      value={slide.image}
                      onChange={(url) => handleUpdateHeroSlide(idx, 'image', url)}
                      presetImages={LIFESTYLE_PRESETS}
                      aspectRatio="wide"
                      helperText="Banner image (1920x1080 recommended)"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                          Eyebrow Badge
                        </label>
                        <input
                          type="text"
                          value={slide.eyebrow}
                          onChange={(e) => handleUpdateHeroSlide(idx, 'eyebrow', e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2 focus:bg-white focus:outline-none uppercase"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={slide.subtitle || ''}
                          onChange={(e) => handleUpdateHeroSlide(idx, 'subtitle', e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-lg p-2 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                        Headline Title
                      </label>
                      <textarea
                        value={slide.title}
                        onChange={(e) => handleUpdateHeroSlide(idx, 'title', e.target.value)}
                        rows={2}
                        className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                          Primary Button
                        </label>
                        <input
                          type="text"
                          value={slide.primaryActionLabel}
                          onChange={(e) => handleUpdateHeroSlide(idx, 'primaryActionLabel', e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2 focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                          Secondary Button
                        </label>
                        <input
                          type="text"
                          value={slide.secondaryActionLabel}
                          onChange={(e) => handleUpdateHeroSlide(idx, 'secondaryActionLabel', e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. CATEGORY GRID (HOMEPAGE 4 CARDS)                      */}
      {/* ======================================================== */}
      {activeSubSection === 'categoryGrid' && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider">
              Homepage 4-Card Category Grid
            </h3>
            <p className="text-[11px] text-stone-500">
              Customize titles, background colors, and cutout shoe photos for the 4 featured boxes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {content.categoryCards.map((card, idx) => (
              <div
                key={card.id || idx}
                className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-xs font-bold uppercase text-stone-900">Card #{idx + 1}: {card.title}</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-stone-500 font-mono">{card.bgColor}</span>
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-300 inline-block"
                      style={{ backgroundColor: card.bgColor }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleUpdateCategoryCard(idx, 'title', e.target.value)}
                      className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="color"
                        value={card.bgColor}
                        onChange={(e) => handleUpdateCategoryCard(idx, 'bgColor', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-stone-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={card.bgColor}
                        onChange={(e) => handleUpdateCategoryCard(idx, 'bgColor', e.target.value)}
                        className="flex-1 bg-white border border-stone-300 text-stone-900 text-xs font-mono rounded-lg p-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                    Destination
                  </label>
                  <select
                    value={card.view}
                    onChange={(e) => handleUpdateCategoryCard(idx, 'view', e.target.value as PageView)}
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2"
                  >
                    <option value="new-arrivals">New Arrivals</option>
                    <option value="men">Men's Collection</option>
                    <option value="women">Women's Collection</option>
                    <option value="best-sellers">Best Sellers</option>
                    <option value="shop-all">Shop All</option>
                  </select>
                </div>

                <div className="pt-1">
                  <AdminImageUploadField
                    label="Shoe Photo (Cutout)"
                    value={card.shoeImage}
                    onChange={(url) => handleUpdateCategoryCard(idx, 'shoeImage', url)}
                    presetImages={SHOE_PRESETS}
                    aspectRatio="square"
                    helperText="Transparent PNG or product render"
                  />
                </div>

                <div 
                  className="rounded-lg p-2.5 flex items-center justify-between text-white overflow-hidden relative h-14"
                  style={{ backgroundColor: card.bgColor }}
                >
                  <span className="font-bold text-xs tracking-wider uppercase z-10">{card.title}</span>
                  {card.shoeImage && (
                    <img 
                      src={card.shoeImage} 
                      alt={card.alt} 
                      className="h-12 w-20 object-contain absolute right-2 bottom-1 drop-shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. LIFESTYLE PHOTO STRIP (HOMEPAGE 4 PHOTOS)             */}
      {/* ======================================================== */}
      {activeSubSection === 'lifestylePhotos' && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider">
              Homepage Lifestyle Photo Strip (4 Editorial Shots)
            </h3>
            <p className="text-[11px] text-stone-500">
              The 4 editorial photography frames on the landing page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {content.lifestylePhotos.map((photo, idx) => (
              <div key={photo.id || idx} className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-2">
                <span className="text-[10px] font-bold uppercase text-stone-700 block">Photo #{idx + 1}</span>
                <AdminImageUploadField
                  label="Lifestyle Photo"
                  value={photo.src}
                  onChange={(url) => handleUpdateLifestylePhoto(idx, 'src', url)}
                  presetImages={LIFESTYLE_PRESETS}
                  aspectRatio="square"
                />
                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-500 block mb-0.5">Alt Description</label>
                  <input
                    type="text"
                    value={photo.alt}
                    onChange={(e) => handleUpdateLifestylePhoto(idx, 'alt', e.target.value)}
                    placeholder="Alt Description"
                    className="w-full bg-white border border-stone-300 text-stone-900 text-[11px] rounded-lg p-1.5"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. WHY CHOOSE US (CRAFT & COMFORT)                       */}
      {/* ======================================================== */}
      {activeSubSection === 'whyUs' && (
        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider border-b border-stone-100 pb-2">
              Why Choose Us — Headlines & Showcase Banner
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={content.whyUs.badge}
                  onChange={(e) => setContent({ ...content, whyUs: { ...content.whyUs, badge: e.target.value } })}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2 uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={content.whyUs.title}
                  onChange={(e) => setContent({ ...content, whyUs: { ...content.whyUs, title: e.target.value } })}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                Subtitle
              </label>
              <textarea
                value={content.whyUs.subtitle}
                onChange={(e) => setContent({ ...content, whyUs: { ...content.whyUs, subtitle: e.target.value } })}
                rows={2}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-lg p-2"
              />
            </div>

            <div className="pt-1">
              <AdminImageUploadField
                label="Craft & Comfort Showcase Banner"
                value={content.whyUs.showcaseImage || ''}
                onChange={(url) => setContent({ ...content, whyUs: { ...content.whyUs, showcaseImage: url } })}
                presetImages={LIFESTYLE_PRESETS}
                aspectRatio="wide"
                helperText="Editorial lifestyle or workshop photo displayed alongside pillars"
              />
            </div>
          </div>

          {/* 4 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {content.whyUs.pillars.map((pillar, idx) => (
              <div key={idx} className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-xs font-mono font-bold text-stone-950">PILLAR #{pillar.number}</span>
                  <input
                    type="text"
                    value={pillar.badge}
                    onChange={(e) => handleUpdatePillar(idx, 'badge', e.target.value)}
                    placeholder="Badge"
                    className="bg-stone-100 text-stone-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-stone-200 w-28 text-center"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-600 block mb-0.5">Title</label>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => handleUpdatePillar(idx, 'title', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-1.5"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-600 block mb-0.5">Description</label>
                  <textarea
                    value={pillar.description}
                    onChange={(e) => handleUpdatePillar(idx, 'description', e.target.value)}
                    rows={2}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-lg p-1.5"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-600 block mb-0.5">Feature Spec</label>
                  <input
                    type="text"
                    value={pillar.spec}
                    onChange={(e) => handleUpdatePillar(idx, 'spec', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-lg p-1.5"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. OUR STORY (BRAND MANIFESTO)                           */}
      {/* ======================================================== */}
      {activeSubSection === 'ourStory' && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 space-y-3.5">
          <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider border-b border-stone-100 pb-2">
            Our Story & Brand Manifesto Page
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                Eyebrow
              </label>
              <input
                type="text"
                value={content.ourStory.eyebrow}
                onChange={(e) => setContent({ ...content, ourStory: { ...content.ourStory, eyebrow: e.target.value } })}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2 uppercase"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                Page Title
              </label>
              <input
                type="text"
                value={content.ourStory.title}
                onChange={(e) => setContent({ ...content, ourStory: { ...content.ourStory, title: e.target.value } })}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
              Lead Paragraph
            </label>
            <textarea
              value={content.ourStory.lead}
              onChange={(e) => setContent({ ...content, ourStory: { ...content.ourStory, lead: e.target.value } })}
              rows={3}
              className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <AdminImageUploadField
              label="Our Story Cover Banner"
              value={content.ourStory.heroImage || ''}
              onChange={(url) => setContent({ ...content, ourStory: { ...content.ourStory, heroImage: url } })}
              presetImages={LIFESTYLE_PRESETS}
              aspectRatio="wide"
            />
            <AdminImageUploadField
              label="Workshop Craftsmanship Photo"
              value={content.ourStory.chapter1Image || ''}
              onChange={(url) => setContent({ ...content, ourStory: { ...content.ourStory, chapter1Image: url } })}
              presetImages={LIFESTYLE_PRESETS}
              aspectRatio="square"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                Founder Quote
              </label>
              <textarea
                value={content.ourStory.founderQuote}
                onChange={(e) => setContent({ ...content, ourStory: { ...content.ourStory, founderQuote: e.target.value } })}
                rows={2}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-lg p-2"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                Founder Name & Title
              </label>
              <input
                type="text"
                value={content.ourStory.founderName}
                onChange={(e) => setContent({ ...content, ourStory: { ...content.ourStory, founderName: e.target.value } })}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SHOE CARE GUIDE                                       */}
      {/* ======================================================== */}
      {activeSubSection === 'shoeCare' && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 space-y-3.5">
          <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider border-b border-stone-100 pb-2">
            Shoe Care & Longevity Guide
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">Title</label>
              <input
                type="text"
                value={content.shoeCare.title}
                onChange={(e) => setContent({ ...content, shoeCare: { ...content.shoeCare, title: e.target.value } })}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">Subtitle</label>
              <input
                type="text"
                value={content.shoeCare.subtitle}
                onChange={(e) => setContent({ ...content, shoeCare: { ...content.shoeCare, subtitle: e.target.value } })}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-lg p-2"
              />
            </div>
          </div>

          <div className="pt-1">
            <AdminImageUploadField
              label="Header Banner"
              value={content.shoeCare.heroImage || ''}
              onChange={(url) => setContent({ ...content, shoeCare: { ...content.shoeCare, heroImage: url } })}
              presetImages={LIFESTYLE_PRESETS}
              aspectRatio="wide"
            />
          </div>

          <div className="space-y-2.5 pt-1">
            <span className="text-[10px] font-bold uppercase text-stone-600 block">4 Core Washing & Care Steps</span>
            {content.shoeCare.quickTips.map((tip, idx) => (
              <div key={idx} className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] font-bold uppercase text-stone-500 block mb-0.5">Step #{idx + 1}</label>
                  <input
                    type="text"
                    value={tip.title}
                    onChange={(e) => {
                      const updated = [...content.shoeCare.quickTips];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setContent({ ...content, shoeCare: { ...content.shoeCare, quickTips: updated } });
                    }}
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs font-bold rounded-md p-1.5"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[9px] font-bold uppercase text-stone-500 block mb-0.5">Instructions</label>
                  <input
                    type="text"
                    value={tip.desc}
                    onChange={(e) => {
                      const updated = [...content.shoeCare.quickTips];
                      updated[idx] = { ...updated[idx], desc: e.target.value };
                      setContent({ ...content, shoeCare: { ...content.shoeCare, quickTips: updated } });
                    }}
                    className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-md p-1.5"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. LEGAL POLICIES                                        */}
      {/* ======================================================== */}
      {activeSubSection === 'policies' && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 space-y-3.5">
          <h3 className="text-xs font-bold text-stone-950 uppercase tracking-wider border-b border-stone-100 pb-2">
            Legal, Return & Exchange Policies
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                Exchange Window (Days)
              </label>
              <input
                type="number"
                value={content.policies.refundDays}
                onChange={(e) => setContent({ ...content, policies: { ...content.policies, refundDays: Number(e.target.value) } })}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={content.policies.supportEmail}
                onChange={(e) => setContent({ ...content, policies: { ...content.policies, supportEmail: e.target.value } })}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-lg p-2"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                Support Hotline
              </label>
              <input
                type="text"
                value={content.policies.supportPhone}
                onChange={(e) => setContent({ ...content, policies: { ...content.policies, supportPhone: e.target.value } })}
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono rounded-lg p-2"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
              Exchange Hub Address
            </label>
            <input
              type="text"
              value={content.policies.exchangeAddress}
              onChange={(e) => setContent({ ...content, policies: { ...content.policies, exchangeAddress: e.target.value } })}
              className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-lg p-2"
            />
          </div>
        </div>
      )}

    </form>
  );
};
