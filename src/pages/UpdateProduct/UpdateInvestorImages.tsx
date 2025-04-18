/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from 'sonner'; // Import Sonner's toast

interface Investor {
  name: string;
  fileId: string;
  thumbnailUrl: string;
}

interface UpdateInvestorImagesProps {
  startup: {
    keyInvestors: Investor[];
  };
  investorsLogos: string[];
  setInvestorsLogos: React.Dispatch<React.SetStateAction<string[]>>;
}

const UpdateInvestorImages: React.FC<UpdateInvestorImagesProps> = ({
  startup,
  setInvestorsLogos,
}) => {
  const [investorsLogoPreviews, setInvestorsLogoPreviews] = useState<Investor[]>([]);
  const [isInvestorLogoUploading, setIsInvestorLogoUploading] = useState<boolean>(false);
  const startupKeyInvestors = startup?.keyInvestors;

  useEffect(() => {
    if (startupKeyInvestors) {
      setInvestorsLogoPreviews(startupKeyInvestors);
    }
  }, [startupKeyInvestors]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsInvestorLogoUploading(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const loadingToast = toast.loading("Uploading image..."); // Show loading toast

      try {
        const response = await axios.post("https://forge-backend-self.vercel.app/api/v1/image/upload", formData, {
          withCredentials: true
        });
        const imageId = response?.data?.image?._id;
        const newUploadedImage = response?.data?.image;

        if (newUploadedImage) {
          setInvestorsLogos((prev) => [...prev, imageId]);
          setInvestorsLogoPreviews((prev) => [
            ...prev,
            {
              name: file.name,
              fileId: imageId,
              thumbnailUrl: newUploadedImage.thumbnailUrl,
            },
          ]);
          toast.success("Image uploaded successfully!"); // Show success toast
        }
      } catch (error) {
        toast.error("Error uploading image."); // Show error toast
        console.error("Error uploading image:", error);
      } finally {
        setIsInvestorLogoUploading(false);
        toast.dismiss(loadingToast);
      }
    }
  };

  const handleDeleteImage = (fileId: string) => {
    const loadingToast = toast.loading("Deleting image..."); // Show loading toast

    axios.delete(`https://forge-backend-self.vercel.app/api/v1/image/delete/${fileId}`, {
      withCredentials: true
    })
    .then(() => {
      setInvestorsLogoPreviews(prev => prev.filter(image => image.fileId !== fileId));
      setInvestorsLogos(prev => prev.filter(id => id !== fileId));
      toast.success("Image deleted successfully!"); // Show success toast
    })
    .catch(error => {
      if (error.response && error.response.data.message === "The requested file does not exist.") {
        setInvestorsLogoPreviews(prev => prev.filter(image => image.fileId !== fileId));
        setInvestorsLogos(prev => prev.filter(id => id !== fileId));
      } else {
        console.error('Error deleting image:', error);
        toast.error("Error deleting image."); // Show error toast
      }
    })
    .finally(() => {
      toast.dismiss(loadingToast); // Dismiss loading toast
    });
  };

  return (
    <div className="flex flex-wrap gap-5 mt-5">
      {investorsLogoPreviews.map((image, index) => (
        <div key={index} className="relative size-24">
          <img
            src={image.thumbnailUrl}
            alt={`Investor Logo ${index + 1}`}
            className="size-24 object-cover rounded-md border"
          />
          <button
            type="button"
            onClick={() => handleDeleteImage(image.fileId)}
            className="absolute top-0 right-1 text-red-500 text-2xl"
          >
            &times;
          </button>
        </div>
      ))}
      {investorsLogoPreviews.length < 8 && (
        <div className="flex flex-col gap-4">
          <input
            type="file"
            onChange={handleImageChange}
            className="hidden"
            id={`upload-image-update-investors`}
            accept="image/*"
          />
          <label
            htmlFor={`upload-image-update-investors`}
            className="w-24 h-24 bg-white rounded-md border px-3 py-2 text-sm focus-visible:outline-none flex items-center justify-center cursor-pointer"
          >
            <p className="text-center">
              {isInvestorLogoUploading ? "Please wait..." : "Upload key investor logo"}
            </p>
          </label>
        </div>
      )}
    </div>
  );
};

export default UpdateInvestorImages;
