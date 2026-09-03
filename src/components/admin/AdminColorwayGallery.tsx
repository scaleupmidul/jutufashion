import React, { useRef, useState } from 'react';
import { Upload, Plus, Trash2, Link as LinkIcon, Image as ImageIcon, X, Check } from 'lucide-react';

interface AdminColorwayGalleryProps {
  colorName: string;
  images: string[];
  onAddImage: (url: string) => void;
  onRemoveImage: (index: number) => void;
  presetImages?: Array<{ label: string; url: string }>;
}

export const AdminColorwayGallery: React.FC<AdminColorwayGalleryProps> = ({
  colorName,
  images = [],
  onAddImage,
  onRemoveImage,
  presetImages = [],
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingFile(true);
    const fileList = Array.from(files);
    let loadedCount = 0;

    fileList.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        loadedCount++;
        if (loadedCount === fileList.length) setIsProcessingFile(false);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onAddImage(event.target.result as string);
        }
        loadedCount++;
        if (loadedCount === fileList.length) {
          setIsProcessingFile(false);
        }
      };
      reader.onerror = () => {
        loadedCount++;
        if (loadedCount === fileList.length) setIsProcessingFile(false);
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same files can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;
    onAddImage(urlInput.trim());
    setUrlInput('');
    setShowUrlInput(false);
  };

  return (
    <div className="pt-3 border-t border-stone-200/90 space-y-2.5">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-800">
              Additional Gallery Photos ({images.length})
            </span>
            <span className="text-[9px] font-semibold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
              Thumbnail Angles
            </span>
          </div>
          <span className="text-[9.5px] text-stone-500 block mt-0.5">
            Side angle, sole, heel, on-feet & packaging photos for &quot;{colorName || 'Colorway'}&quot;
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* File Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingFile}
            className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border border-stone-300 flex items-center space-x-1 transition-colors cursor-pointer"
            title="Upload photo from computer or phone"
          >
            <Upload className="w-3 h-3 text-stone-600" />
            <span>{isProcessingFile ? 'Loading...' : 'Upload Image'}</span>
          </button>

          {/* URL Input Toggle */}
          <button
            type="button"
            onClick={() => {
              setShowUrlInput(!showUrlInput);
              setShowPresets(false);
            }}
            className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg border transition-colors cursor-pointer flex items-center space-x-1 ${
              showUrlInput
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
            }`}
            title="Add image via direct web link (URL)"
          >
            <LinkIcon className="w-3 h-3" />
            <span>URL</span>
          </button>

          {/* Presets Toggle */}
          {presetImages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setShowPresets(!showPresets);
                setShowUrlInput(false);
              }}
              className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg border transition-colors cursor-pointer flex items-center space-x-1 ${
                showPresets
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
              }`}
              title="Pick from preset shoe angle photos"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Presets</span>
            </button>
          )}
        </div>
      </div>

      {/* Hidden Multi-file Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Inline URL Input Form */}
      {showUrlInput && (
        <form onSubmit={handleAddUrl} className="flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl p-2 animate-fadeIn">
          <input
            type="url"
            placeholder="Paste image link (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            autoFocus
            className="flex-1 bg-white border border-stone-300 text-stone-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            type="submit"
            disabled={!urlInput.trim()}
            className="bg-stone-950 hover:bg-black disabled:bg-stone-300 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Inline Presets Selector */}
      {showPresets && presetImages.length > 0 && (
        <div className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 animate-fadeIn space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-700 uppercase">
              Select Preset Angle / Showcase Photo:
            </span>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto pr-1">
            {presetImages.map((preset, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => {
                  onAddImage(preset.url);
                  setShowPresets(false);
                }}
                className="group relative aspect-square rounded-lg overflow-hidden border border-stone-300 hover:border-black transition-all cursor-pointer bg-white"
                title={preset.label}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[8px] font-bold truncate px-1 py-0.5 text-center">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Thumbnails List */}
      <div className="flex flex-wrap gap-2.5 items-center">
        {images.map((imgUrl, imgIdx) => (
          <div
            key={imgIdx}
            className="group relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl border border-stone-200 bg-white overflow-hidden shadow-2xs transition-all hover:border-stone-400"
          >
            <img
              src={imgUrl}
              alt={`Gallery angle ${imgIdx + 1}`}
              className="w-full h-full object-cover select-none"
              onError={(e) => {
                (e.target as HTMLElement).style.opacity = '0.3';
              }}
            />

            {/* Delete button */}
            <button
              type="button"
              onClick={() => onRemoveImage(imgIdx)}
              className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md p-1 shadow-sm opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Delete this photo"
            >
              <Trash2 className="w-3 h-3" />
            </button>

            {/* Position badge */}
            <span className="absolute bottom-1 left-1 text-[8.5px] font-mono font-bold bg-black/60 backdrop-blur-xs text-white px-1.5 py-0.2 rounded">
              #{imgIdx + 1}
            </span>
          </div>
        ))}

        {/* Quick Add Placeholder Card */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl border-2 border-dashed border-stone-300 hover:border-stone-600 bg-stone-50 hover:bg-stone-100 text-stone-500 hover:text-stone-900 flex flex-col items-center justify-center p-1 transition-all cursor-pointer group"
          title="Click to upload another angle photo"
        >
          <Plus className="w-4 h-4 text-stone-400 group-hover:text-stone-800 transition-colors" />
          <span className="text-[8.5px] font-bold uppercase mt-0.5 text-center leading-tight">
            Add Photo
          </span>
        </button>
      </div>
    </div>
  );
};
