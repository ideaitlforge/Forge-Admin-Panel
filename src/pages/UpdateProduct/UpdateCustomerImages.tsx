/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from 'sonner'; // Import Sonner's toast

// Define a type for customer details logo
type CustomerDetailsLogo = {
  name: string;
  fileId: string;
  thumbnailUrl: string;
};

// Define props type for the component
type UpdateCustomerImagesProps = {
  startup: {
    CustomersDetails: CustomerDetailsLogo[];
  } | null;
  setCustomerDetailsLogos: React.Dispatch<React.SetStateAction<string[]>>;
  customerDetailsLogos: string[];
};

const UpdateCustomerImages: React.FC<UpdateCustomerImagesProps> = ({
  startup,
  setCustomerDetailsLogos,
}) => {
  const [customerDetailsLogoPreviews, setCustomerDetailsLogoPreviews] = useState<CustomerDetailsLogo[]>([]);
  const [isCustomerLogoUploading, setIsCustomerLogoUploading] = useState<boolean>(false);

  const startupCustomerDetails = startup?.CustomersDetails;

  useEffect(() => {
    if (startupCustomerDetails) {
      setCustomerDetailsLogoPreviews(startupCustomerDetails);
    }
  }, [startupCustomerDetails]);

  const handleCustomerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsCustomerLogoUploading(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const loadingToast = toast.loading("Uploading image..."); // Show loading toast

      try {
        const response = await axios.post("https://forgebackend.vercel.app/api/v1/image/upload", formData, {
          withCredentials: true,
        });
        const imageId = response?.data?.image?._id;
        const newUploadedImage = response?.data?.image;

        if (newUploadedImage) {
          setCustomerDetailsLogos((prev) => [...prev, imageId]);
          setCustomerDetailsLogoPreviews((prev) => [
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
        setIsCustomerLogoUploading(false);
        toast.dismiss(loadingToast); // Dismiss loading toast
      }
    }
  };

  const handleDeleteImage = (fileId: string) => {
    const loadingToast = toast.loading("Deleting image...");

    axios.delete(`https://forgebackend.vercel.app/api/v1/image/delete/${fileId}`, {
      withCredentials: true
    })
    .then(() => {
      setCustomerDetailsLogoPreviews(prev => prev.filter(image => image.fileId !== fileId));
      setCustomerDetailsLogos(prev => prev.filter(id => id !== fileId));
      toast.success("Image deleted successfully!");
    })
    .catch(error => {
      if (error.response && error.response.data.message === "The requested file does not exist.") {
        setCustomerDetailsLogoPreviews(prev => prev.filter(image => image.fileId !== fileId));
        setCustomerDetailsLogos(prev => prev.filter(id => id !== fileId));
      } else {
        console.error('Error deleting image:', error);
        toast.error("Error deleting image.");
      }
    })
    .finally(() => {
      toast.dismiss(loadingToast);
    });
  };

  return (
    <div className="flex flex-wrap gap-5 mt-5">
      {customerDetailsLogoPreviews.map((image, index) => (
        <div key={index} className="relative size-24">
          <img
            src={image.thumbnailUrl}
            alt={`Customer Logo ${index + 1}`}
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
      {customerDetailsLogoPreviews.length < 8 && (
        <div className="flex flex-col gap-4">
          <input
            type="file"
            onChange={handleCustomerImageChange}
            className="hidden"
            id={`upload-image-update-customers`}
            accept="image/*"
          />
          <label
            htmlFor={`upload-image-update-customers`}
            className="w-24 h-24 bg-white rounded-md border px-3 py-2 text-sm focus-visible:outline-none flex items-center justify-center cursor-pointer"
          >
            <p className="text-center">
              {isCustomerLogoUploading ? "Please wait..." : "Upload customer logo"}
            </p>
          </label>
        </div>
      )}
    </div>
  );
};

export default UpdateCustomerImages;
