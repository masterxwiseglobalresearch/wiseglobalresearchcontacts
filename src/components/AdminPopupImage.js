import React, { useState, useEffect, useRef } from 'react';
import { ref as dbRef, set, onValue } from 'firebase/database';
import { db } from '../firebase';
import { FaUpload, FaTrash } from 'react-icons/fa';

// Admin uploader that stores a media object in Realtime Database under `admin/popupMedia`.
// It supports images and videos (mp4/webm). For compatibility with older string-only values
// the component will still accept a plain string URL/dataURL and treat it as an image.

const DB_PATH = 'admin/popupMedia';

const AdminPopupImage = () => {
  const [preview, setPreview] = useState('');
  const [previewType, setPreviewType] = useState('video'); // restrict to 'video'
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const r = dbRef(db, DB_PATH);
    const off = onValue(r, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (typeof val === 'string') {
          setPreview(val);
          // treat string values that point to Canva as embeds
          setPreviewType(val.startsWith('data:video') ? 'video' : (val.includes('canva.com') ? 'embed' : 'image'));
        } else if (val && typeof val === 'object' && val.url) {
          setPreview(val.url);
          setPreviewType(val.type === 'video' ? 'video' : (val.type === 'embed' ? 'embed' : 'image'));
        } else {
          setPreview('');
        }
      } else {
        setPreview('');
      }
    }, (err) => {
      console.warn('Failed to read popup image from DB', err);
    });
    return () => off();
  }, []);

  const onChooseFile = async (file) => {
    if (!file) return;
    setError('');
    setLoading(true);
    setUploadProgress(0);
    try {
      // Realtime DB string limit ~50MB. Prefer checking file.size first.
      const MAX_BYTES = 50 * 1024 * 1024; // 50 MB
      const isVideo = file.type && file.type.startsWith('video');
      const isImage = file.type && file.type.startsWith('image');

      if (!isVideo && !isImage) {
        setError('Keval video (MP4/WebM) ya image files allowed hain.');
        throw new Error('not-supported-file');
      }

      if (file.size >= MAX_BYTES) {
        const msg = isVideo
          ? 'Video file bahut bada hai. Realtime Database mein store karne ke liye file ka size 50MB se kam hona chahiye. Kripya chhota video upload karein ya Firebase Storage ka istemal karein.'
          : 'Image file bahut bada hai. Kripya chhota image upload karein.';
        setError(msg);
        throw new Error('data-url-too-large');
      }

      if (preview) {
        const msg = 'Ek media pehle se maujood hai — pehle use clear karein tabhi naya upload karein.';
        setError(msg);
        throw new Error('media-already-present');
      }

      // For small files, convert to dataURL and store
      const dataUrl = await new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = (e) => rej(e);
        fr.readAsDataURL(file);
      });
      const payload = isVideo
        ? { type: 'video', url: dataUrl, name: file.name }
        : { type: 'image', url: dataUrl, name: file.name };
      await set(dbRef(db, DB_PATH), payload);
      return;
    } catch (e) {
      console.error('Upload failed', e);
      const msg = e && e.message ? e.message : String(e);
      const code = e && e.code ? e.code : null;
      setError(code ? `Upload failed (${code}): ${msg}` : `Upload failed: ${msg}`);
      // keep a visible alert for now
      // eslint-disable-next-line no-alert
      alert((code ? `Upload failed (${code}): ` : 'Upload failed: ') + msg);
    } finally {
      // leave preview in place; only clear progress/flags
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const onFileInput = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) onChooseFile(f);
  };

  const onUseUrl = async () => {
    if (!urlValue) return;
    setError('');
    setLoading(true);
    try {
      const url = urlValue.trim();
      const lower = url.toLowerCase();
      const isDataVideo = lower.startsWith('data:video');
      const isVideoExt = lower.endsWith('.mp4') || lower.endsWith('.webm');
      const isCanva = lower.includes('canva.com/design/');

      // Block replacement if existing media is a video or an embed
      if (preview && (previewType === 'video' || previewType === 'embed')) {
        setError('Ek media pehle se maujood hai — pehle use clear karein tabhi naya URL set karein.');
        throw new Error('media-already-present');
      }

      if (isCanva) {
        // try to derive an embeddable URL from the Canva share link
        let embedUrl = url;
        try {
          if (embedUrl.includes('/view')) embedUrl = embedUrl.replace('/view', '/embed');
          else if (!embedUrl.includes('/embed')) embedUrl = embedUrl.replace(/\/?$/, '/embed');
          if (!/^https?:\/\//i.test(embedUrl)) embedUrl = 'https://' + embedUrl;
        } catch (e) {
          // fallback to original URL
          embedUrl = url;
        }
        await set(dbRef(db, DB_PATH), { type: 'embed', url: embedUrl, name: url });
      } else if (isDataVideo || isVideoExt) {
        await set(dbRef(db, DB_PATH), { type: 'video', url, name: url });
      } else {
        setError('Keval video URLs (MP4/WebM/data:video) ya Canva embed links allowed.');
        throw new Error('not-supported-url');
      }
      setUrlValue('');
    } catch (e) {
      console.error('Failed to use URL', e);
      setError(e && e.message ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  // URL input removed — component is video-only

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const clear = async () => {
    setLoading(true);
    try {
      // Clear the RTDB entry
      await set(dbRef(db, DB_PATH), null);
    } catch (e) {
      console.error('Failed to clear popup image', e);
      setError('Failed to clear popup media: ' + (e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md text-gray-800 relative">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Popup Media Manager</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Media Preview</label>
              <div className="w-full min-h-48 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden relative">
                {preview ? (
                  previewType === 'video' ? (
                    <video src={preview} className="max-w-full max-h-64 rounded" muted autoPlay loop playsInline controls={false} />
                  ) : previewType === 'embed' ? (
                    <iframe
                      src={preview}
                      title="Embed preview"
                      className="w-full max-h-64 rounded border-0"
                      style={{ minHeight: 200 }}
                      allowFullScreen
                    />
                  ) : (
                    <img src={preview} alt="preview" className="max-w-full max-h-64 rounded object-contain" />
                  )
                ) : (
                  <div className="text-gray-500">No video uploaded</div>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mt-2">
                <input
                  type="file"
                  accept="video/mp4,video/webm,image/*"
                  onChange={onFileInput}
                  ref={fileInputRef}
                  className="hidden"
                  disabled={loading || !!preview}
                />
                <button
                  onClick={handleUploadClick}
                  disabled={loading || !!preview}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <FaUpload />
                  {loading ? 'Uploading...' : (preview ? 'Media present' : 'Upload Media')}
                </button>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Paste video or image URL (MP4/WebM/JPG/PNG) or Canva link"
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                    className="px-2 py-1 border rounded-md text-sm ml-2 w-64"
                    disabled={loading || !!preview}
                  />
                  <button
                    onClick={onUseUrl}
                    disabled={loading || !urlValue || !!preview}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    Use URL
                  </button>
                </div>
                {uploadProgress > 0 && (
                  <div className="w-48 ml-2 text-sm text-gray-700">
                    <div className="h-2 bg-gray-200 rounded overflow-hidden">
                      <div style={{ width: `${uploadProgress}%` }} className="h-full bg-green-500" />
                    </div>
                    <div className="text-xs mt-1">{uploadProgress}%</div>
                  </div>
                )}
                <button
                  onClick={clear}
                  disabled={loading || !preview}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <FaTrash />
                  Clear
                </button>
              </div>
              <p className="text-xs mt-2 text-gray-500">Supported: MP4, WebM and common image formats (JPG/PNG). Uploads stored as data URLs must be under 50MB. If a media item is already present, you must clear it before uploading another.</p>
                {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Global translucent overlay during uploads */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white bg-opacity-90 rounded-md p-4 flex flex-col items-center gap-2">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10" />
            <div className="text-sm text-gray-800">Uploading... {uploadProgress > 0 ? `${uploadProgress}%` : ''}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPopupImage;
