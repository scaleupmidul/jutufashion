import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Check, X, RefreshCw, Loader2 } from 'lucide-react';
import { uploadImageToServer } from '../../utils/imageUpload';

interface AdminImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (newValue: string) => void;
  altText?: string;
  onAltChange?: (alt: string) => void;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto' | 'portrait';
  placeholder?: string;
  helperText?: string;
  suggestedPresets?: Array<{ label: string; url: string }>;
  presetImages?: Array<{ label: string; url: string }>;
}

export const AdminImageUploadField: React.FC<AdminImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  altText,
  onAltChange,
  aspectRatio = 'square',
  placeholder = 'https://images.unsplash.com/... or upload image',
  helperText,
  suggestedPresets = [],
  presetImages,
}) => {
  const effectivePresets = presetImages && presetImages.length > 0 ? presetImages : suggestedPresets;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState<'url' | 'presets'>('url');
  const [imgError, setImgError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, SVG, etc.)');
      return;
    }
    setIsUploading(true);
    try {
      const res = await uploadImageToServer(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.88,
      });
      if (res.success && res.url) {
        onChange(res.url);
        setImgError(false);
      } else {
        throw new Error(res.error || 'Failed to upload');
      }
    } catch (err) {
      console.warn('Fallback to local data URL on upload failure', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
          setImgError(false);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'video':
        return 'aspect-16/9';
      case 'wide':
        return 'aspect-21/9';
      case 'portrait':
        return 'aspect-3/4';
      case 'square':
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="space-y-2 font-sans">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[10.5px] font-bold uppercase tracking-wider text-stone-700 block">
            {label}
          </label>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] font-bold uppercase tracking-wider text-stone-700 hover:text-black bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Upload className="w-3 h-3 text-stone-600" />
              <span>Upload File</span>
            </button>
            {suggestedPresets.length > 0 && (
              <button
                type="button"
                onClick={() => setInputMode(inputMode === 'presets' ? 'url' : 'presets')}
                className="text-[10px] font-bold uppercase tracking-wider text-stone-700 hover:text-black bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <ImageIcon className="w-3 h-3 text-stone-600" />
                <span>Presets</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Preview & Dropzone Box */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
        {/* Visual Preview Box */}
        <div className="sm:col-span-4 lg:col-span-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative ${getAspectClass()} w-full rounded-xl overflow-hidden bg-stone-100 border-2 transition-all cursor-pointer flex flex-col items-center justify-center p-2 text-center ${
              isDragging
                ? 'border-stone-900 bg-stone-200'
                : value && !imgError
                ? 'border-stone-300 hover:border-stone-800'
                : 'border-dashed border-stone-300 hover:border-stone-500'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center p-3 text-stone-700">
                <Loader2 className="w-6 h-6 animate-spin mb-1 text-stone-900" />
                <span className="text-[10px] font-bold text-stone-900 uppercase">Uploading...</span>
              </div>
            ) : value && !imgError ? (
              <>
                <img
                  src={value}
                  alt={altText || 'Preview'}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Change Image</span>
                  <span className="text-[8.5px] opacity-80 mt-0.5">Click or drop file</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-stone-400 p-3">
                <Upload className="w-6 h-6 mb-1 text-stone-400 group-hover:text-stone-700 transition-colors" />
                <span className="text-[10px] font-bold text-stone-600 uppercase">Click / Drop File</span>
                <span className="text-[8.5px] text-stone-600 mt-0.5">PNG, JPG, WEBP</span>
              </div>
            )}
          </div>

          {value && (
            <div className="flex items-center justify-between mt-1 px-0.5">
              <span className="text-[9px] text-emerald-700 font-bold flex items-center space-x-1">
                <Check className="w-2.5 h-2.5" />
                <span>Image Active</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                  setImgError(false);
                }}
                className="text-[9.5px] text-stone-500 hover:text-red-700 font-semibold cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="sm:col-span-8 lg:col-span-8 space-y-2">
          {inputMode === 'url' ? (
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-stone-400">
                  <LinkIcon className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={value.startsWith('data:') ? '✓ Uploaded image file (Base64)' : value}
                  onChange={(e) => {
                    onChange(e.target.value);
                    setImgError(false);
                  }}
                  placeholder={placeholder}
                  className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl pl-8 pr-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                Paste any public image URL or click "Upload File" to pick directly from your computer / phone.
              </p>
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 space-y-2">
              <span className="text-[10px] font-bold uppercase text-stone-700 block">
                Select Curated Luxury Image Preset:
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {effectivePresets.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      onChange(preset.url);
                      setInputMode('url');
                      setImgError(false);
                    }}
                    className="flex items-center space-x-2 p-1.5 rounded-lg border border-stone-200 bg-white hover:border-stone-800 text-left cursor-pointer transition-colors group"
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-7 h-7 rounded object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-bold text-stone-800 truncate group-hover:text-black">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {onAltChange !== undefined && (
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                Alt Text / Accessibility Description
              </label>
              <input
                type="text"
                value={altText || ''}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder="e.g. JUTU lightweight sneaker lifestyle shot"
                className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          )}

          {helperText && (
            <p className="text-[10px] text-stone-600">{helperText}</p>
          )}
        </div>
      </div>
    </div>
  );
};
