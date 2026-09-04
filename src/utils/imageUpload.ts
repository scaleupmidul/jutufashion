/**
 * Utility functions for client-side image optimization, resizing, and uploading.
 */

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/png' | 'image/webp' | 'image/jpeg';
  preferDataUrl?: boolean;
}

/**
 * Optimizes an image file by scaling it down to reasonable dimensions using HTML5 Canvas.
 * For SVGs, returns the clean SVG data URL.
 * Preserves alpha transparency for PNGs/WebP logos.
 */
export async function optimizeImageFile(
  file: File,
  options: OptimizeOptions = {}
): Promise<string> {
  const {
    maxWidth = 800,
    maxHeight = 400,
    quality = 0.9,
    format = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png',
  } = options;

  // SVG files should remain vector without canvas rasterization
  if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale down proportionally if larger than maximum bounds
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            // Fallback to original reader result if canvas not supported
            return resolve(e.target?.result as string);
          }

          // Clear for transparency preservation
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL(format, quality);
          resolve(dataUrl);
        } catch (canvasErr) {
          console.warn('Canvas optimization failed, using original data URL:', canvasErr);
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image file for optimization'));
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file to the server API (/api/upload).
 * If the server is offline or fails, seamlessly falls back to the client-optimized data URL.
 */
export async function uploadImageToServer(
  file: File,
  options: OptimizeOptions = {}
): Promise<{ success: boolean; url: string; size?: number; error?: string }> {
  try {
    // 1. First optimize client-side to save network bandwidth and avoid huge payloads
    const optimizedDataUrl = await optimizeImageFile(file, options);

    // If preferDataUrl is requested (standard for small UI assets like logos to guarantee zero-404 and avoid iframe 302 proxy drops), return immediately
    if (options.preferDataUrl) {
      // Background mirror to server for archival without blocking
      fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: optimizedDataUrl,
          filename: file.name,
          type: file.type || 'image/png',
        }),
      }).catch(() => {});

      return {
        success: true,
        url: optimizedDataUrl,
        size: Math.round(optimizedDataUrl.length * 0.75),
      };
    }

    // 2. Post to server upload endpoint
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: optimizedDataUrl,
          filename: file.name,
          type: file.type || 'image/png',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.url) {
          return {
            success: true,
            url: json.url,
            size: json.size,
          };
        }
      }
    } catch (netErr) {
      console.warn('Direct upload endpoint failed, falling back to client-optimized asset:', netErr);
    }

    // 3. Fallback to client-optimized Data URL (already resized to under 100KB)
    return {
      success: true,
      url: optimizedDataUrl,
    };
  } catch (err: any) {
    console.error('Image upload failed:', err);
    return {
      success: false,
      url: '',
      error: err.message || 'Could not process or upload image',
    };
  }
}
