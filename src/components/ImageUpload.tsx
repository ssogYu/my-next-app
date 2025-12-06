'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  onImageRemove?: (imageUrl: string) => void;
  maxImages?: number;
  currentImages?: string[];
  className?: string;
}

export default function ImageUpload({
  onImageSelect,
  onImageRemove,
  maxImages = 6,
  currentImages = [],
  className = ""
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 验证文件大小（5MB限制）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }

    setIsUploading(true);

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      onImageSelect(dataUrl);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('图片读取失败');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    if (currentImages.length >= maxImages) {
      alert(`最多只能上传${maxImages}张图片`);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (imageUrl: string) => {
    if (onImageRemove) {
      onImageRemove(imageUrl);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 上传按钮 */}
      <div
        onClick={handleClick}
        className={`
          relative border-2 border-dashed border-rose-300/50 rounded-xl p-8
          bg-white/60 backdrop-blur-sm hover:bg-white/80
          transition-all duration-300 cursor-pointer
          group hover:border-rose-400/70
          ${currentImages.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={currentImages.length >= maxImages}
        />

        {isUploading ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-rose-600 font-medium">上传中...</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-rose-400 group-hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-rose-700 font-medium">点击上传背景图片</p>
              <p className="text-rose-500 text-sm">
                支持 JPG、PNG、GIF 格式，最大 5MB
              </p>
              <p className="text-rose-400 text-xs">
                已上传 {currentImages.length}/{maxImages} 张图片
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 预览区域 */}
      {preview && (
        <div className="mt-4">
          <p className="text-sm font-medium text-rose-700 mb-2">预览：</p>
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="预览图片"
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
              <p className="text-white text-xs p-2">新上传的图片</p>
            </div>
          </div>
        </div>
      )}

      {/* 当前上传的图片列表 */}
      {currentImages.length > 0 && (
        <div>
          <p className="text-sm font-medium text-rose-700 mb-2">已上传的背景图片：</p>
          <div className="grid grid-cols-3 gap-2">
            {currentImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`背景${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => handleRemoveImage(image)}
                    className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    title="删除图片"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}