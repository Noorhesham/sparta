"use client";

import { useFormContext } from "react-hook-form";
import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Trash } from "lucide-react";
import { uploadImageToImageKit } from "@/app/utils/helpers";

export const PhotoInput = ({
  name,
  single = false,
  mediaType = "image",
}: {
  name: string;
  single?: boolean;
  mediaType?: "image" | "video";
}) => {
  const {
    setValue,
    watch,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);

  // Determine if we should store as single string based on prop or field name
  const shouldStoreSingle = single || name === "photo" || name === "background";

  // Get current value from form
  const watchedValue = watch(name);

  // Get field error
  const fieldError = errors[name];
  const hasError = !!fieldError;

  // Effect to check if we have images and if there's an error, clear it
  useEffect(() => {
    const value = watch(name);
    const hasValue = Array.isArray(value) ? value.length > 0 : !!value;

    if (hasValue && hasError) {
      clearErrors(name);
      trigger(name);
    }
  }, [watchedValue, hasError, name, clearErrors, watch, trigger]);

  // Normalize current images
  let currentImages: string[] = [];

  if (Array.isArray(watchedValue)) {
    currentImages = watchedValue;
  } else if (typeof watchedValue === "string" && watchedValue) {
    currentImages = [watchedValue];
  }

  const handleUpload = useCallback(
    async (files: FileList) => {
      try {
        setIsUploading(true);
        setValue("isUploading", true);

        const uploadPromises = Array.from(files).map((file) => uploadImageToImageKit(file));

        const results = await Promise.all(uploadPromises);
        const newImages = results.map((res) => res.url);

        if (shouldStoreSingle) {
          setValue(name, newImages[0], { shouldValidate: true }); // Store single image and validate
        } else {
          setValue(name, [...currentImages, ...newImages], { shouldValidate: true }); // Append new images and validate
        }

        // Explicitly clear errors for this field
        clearErrors(name);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
        setValue("isUploading", false);
      }
    },
    [currentImages, name, setValue, shouldStoreSingle, clearErrors]
  );

  const handleDelete = (url: string) => {
    const filteredImages = currentImages.filter((imgUrl) => imgUrl !== url);
    const newValue = shouldStoreSingle ? filteredImages[0] || "" : filteredImages;
    setValue(name, newValue, { shouldValidate: true });
  };

  return (
    <div className="space-y-4 w-full">
      <Input
        type="file"
        multiple={!shouldStoreSingle}
        accept={mediaType === "image" ? "image/*" : "video/*"}
        disabled={isUploading}
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
        className={`cursor-pointer ${hasError ? "border-red-500" : ""}`}
      />

      {hasError && (
        <p className="text-sm text-red-500">
          {typeof fieldError === "string" ? fieldError : fieldError?.message?.toString() || "Please upload an image"}
        </p>
      )}

      <div className="grid grid-cols-3 gap-4">
        {currentImages.length > 0 &&
          currentImages.map((url, index) => (
            <div key={url + index} className="relative w-full h-44 group">
              {mediaType === "image" ? (
                <Image
                  src={url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="rounded-lg w-full object-cover aspect-square"
                />
              ) : (
                <video controls src={url} className="max-w-full h-full absolute inset-0 object-cover rounded" />
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(url)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
      </div>

      {isUploading && <p className="text-sm text-muted-foreground">Uploading images...</p>}
    </div>
  );
};
