/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TextInput from "../../components/Reusable/TextInput/TextInput";
import { useForm } from "react-hook-form";
// import SelectInput from "../../components/Reusable/SelectInput/SelectInput";
import TextArea from "../../components/Reusable/TextArea/TextArea";
import { toast } from "sonner";
import { FaArrowLeftLong } from "react-icons/fa6";
import UpdateInvestorImages from "./UpdateInvestorImages";
import UpdateCustomerImages from "./UpdateCustomerImages";
import { AiOutlineClose } from "react-icons/ai";

interface Metric {
  heading: string;
  metric: string;
  icon: string | null;
}
const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [startup, setStartup] = useState<any>({});
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (startup) {
      setValue("name", startup.name);
      setValue("websiteUrl", startup.websiteUrl);
      setValue("hardwareTech", startup.hardwareTech);
      setValue("hardwareInnovations", startup.hardwareInnovations);
    }
  }, [startup, setValue]);

  // Fething data by id
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await axios.get(`https://forge-backend-self.vercel.app/api/v1/startup/${id}`, {
          withCredentials: true
        });
        setStartup(response?.data?.startup);
      } catch (error) {
        console.error('Error fetching startups:', error);
      }
    };

    fetchStartups();
  }, [id]);


  // const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<string[] | []>(startup?.category?.futureScope || []);
  const [selectedOptionError, setSelectedOptionError] = useState<boolean>(false);
  useEffect(() => {
    if (startup?.category?.futureScope) {
      setSelectedOptions(startup.category.futureScope);
    }
  }, [startup?.category?.futureScope]);

  const [programmes, setProgrammes] = useState<string[]>(startup?.category?.programmes || []);
  const [grantsInvestments, setGrantsInvestments] = useState<string[]>(startup?.grants || []);

  useEffect(() => {
    if (startup?.category?.programmes) {
      setProgrammes(startup?.category?.programmes);
    }
    if (startup?.grants) {
      setGrantsInvestments(startup?.grants);
    }
  }, [startup?.category?.programmes, startup?.grants]);

  const handleKeyDownProgramme = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      e.preventDefault();
      const newprogramme = e.currentTarget.value.trim();
      if (!programmes.includes(newprogramme)) {
        setProgrammes([...programmes, newprogramme]);
        setValue("programmes", [...programmes, newprogramme]);
      }
      e.currentTarget.value = "";
    }
  };

  // Function to remove a programme
  const removeProgramme = (index: number) => {
    const newTags = programmes.filter((_, i) => i !== index);
    setProgrammes(newTags);
    setValue("programmes", newTags);
  };

  const handleKeyDownGrantsInvestments = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      e.preventDefault();
      const newGrantsInvestments = e.currentTarget.value.trim();
      if (!grantsInvestments.includes(newGrantsInvestments)) {
        setGrantsInvestments([...grantsInvestments, newGrantsInvestments]);
        setValue("grantsInvestments", [...grantsInvestments, newGrantsInvestments]);
      }
      e.currentTarget.value = "";
    }
  };

  // Function to remove a grants Investments
  const removeGrantsInvestments = (index: number) => {
    const newItems = grantsInvestments.filter((_, i) => i !== index);
    setGrantsInvestments(newItems);
    setValue("grants", newItems);
  };

  const options = [
    { value: "Mobility Hardware", label: "Mobility Hardware" },
    { value: "Production Hardware", label: "Production Hardware" },
    { value: "Defence Hardware", label: "Defence Hardware" },
    { value: "Assistive Hardware", label: "Assistive Hardware" },
    { value: "Industrial Hardware", label: "Industrial Hardware" },
    { value: "Energy & Sustainability Hardware", label: "Energy & Sustainability Hardware" },
    { value: "Health Hardware", label: "Health Hardware" },
    { value: "Climate Hardware", label: "Climate Hardware" },
  ];

  // For future scope
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(prevSelectedOptions => {
      if (Array.isArray(prevSelectedOptions)) {
        return Array.from(new Set([...prevSelectedOptions, ...selectedValues]));
      }
      return selectedValues
    });
  };


  const handleRemoveOption = (option: string) => {
    setSelectedOptions(selectedOptions.filter(selected => selected !== option));
  };

  // const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
  //   setSelectedOptions(prevSelectedOptions => {
  //     return Array.from(new Set([...prevSelectedOptions, ...selectedValues]));
  //   });
  // };

  // const handleRemoveOption = (option: string) => {
  //   setSelectedOptions(selectedOptions.filter(selected => selected !== option));
  // };

  // Update main logo
  const [startupLogo, setStartupLogo] = useState<string>(startup?.logo?.thumbnailUrl || "");
  useEffect(() => {
    if (startup?.logo?.thumbnailUrl) {
      setStartupLogo(startup?.logo?.thumbnailUrl);
      setLogoId(startup?.logo?._id);
    }
  }, [startup?.logo?.thumbnailUrl]);

  const [logoId, setLogoId] = useState<string>(startup?.logo);
  const [logoName, setLogoName] = useState<string>("");
  const [isLogoAdding, setIsLogoAdding] = useState(false);

  const handleAddLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsLogoAdding(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Send image to the API
        const response = await axios.post("https://forge-backend-self.vercel.app/api/v1/image/upload", formData, {
          withCredentials: true
        });

        const imageId = response?.data?.image?._id;
        const imageName = response?.data?.image?.name;
        setLogoId(imageId);
        setLogoName(imageName);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsLogoAdding(false);
      }
    }
  };

  const [investorsLogos, setInvestorsLogos] = useState<string[]>([]);

  useEffect(() => {
    if (startup?.keyInvestors) {
      const initialLogos = startup.keyInvestors.map((investor: any) => investor._id);
      setInvestorsLogos(initialLogos);
    }
  }, []);
  // console.log(investorsLogos);


  const [customerDetailsLogos, setCustomerDetailsLogos] = useState<string[]>([]);
  // console.log(customerDetailsLogos);

  useEffect(() => {
    if (startup?.CustomersDetails) {
      const initialLogos = startup.CustomersDetails.map((customer: any) => customer._id);
      setCustomerDetailsLogos(initialLogos);
    }
  }, []);


  // For metric feature ------------- start -----------
  const [metrics, setMetrics] = useState<Metric[]>([]);

  // Use a ref to ensure we set the initial state from the API only once
  const hasSetInitialMetrics = useRef(false);

  useEffect(() => {
    if (startup?.metricFeatures && !hasSetInitialMetrics.current) {
      setMetrics(startup?.metricFeatures);
      hasSetInitialMetrics.current = true;
    }
  }, [startup?.metricFeatures]);

  // Handle the image upload and store the image ID
  const handleAddMetricImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const loadingToast = toast.loading("Uploading image..."); // Show loading toast

      try {
        // Send image upload request to the API
        const response = await axios.post("https://forge-backend-self.vercel.app/api/v1/image/upload", formData, {
          withCredentials: true
        });
        const imageId = response?.data?.image?._id;

        // Update the state with the new image ID
        const updatedMetrics = [...metrics];
        updatedMetrics[index].icon = imageId;
        setMetrics(updatedMetrics);

        // Dismiss loading toast and show success toast
        toast.dismiss(loadingToast);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        // Dismiss loading toast and show error toast
        toast.dismiss(loadingToast);
        toast.error("Error uploading image.");
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: "heading" | "metric") => {
    const updatedMetrics = [...metrics];
    updatedMetrics[index][field] = e.target.value;
    setMetrics(updatedMetrics);
  };

  const handleDeleteMatricImage = async (fileId: string) => {
    const loadingToast = toast.loading("Deleting image...");

    try {
      await axios.delete(`https://forge-backend-self.vercel.app/api/v1/image/delete/${fileId}`, {
        withCredentials: true
      });

      // Update metrics by setting icon to null only for the matching fileId
      setMetrics((prev: any) =>
        prev.map((metric: any) => ({
          ...metric,
          icon: metric.icon?.fileId === fileId ? null : metric.icon
        }))
      );

      toast.success("Image deleted successfully!");
    } catch (error: any) {
      if (error.response?.data?.message === "The requested file does not exist.") {
        // Handle the specific error when the file does not exist
        toast.error("The requested file does not exist.");
      } else {
        console.error('Error deleting image:', error);
        toast.error("Error deleting image.");
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const addAnotherMetric = () => {
    setMetrics([...metrics, { heading: "", metric: "", icon: "" }]);
  };

  // For metric feature ------------- end -----------
  const [isStartupUpdating, setIsStartupUpdating] = useState(false);
  //  Update startup function
  const handleUpdateStartup = async (data: any) => {

    if (selectedOptions?.length < 1) {
      setSelectedOptionError(true);
      toast.error("Future scope is required.")
      return;
    }

    if (!logoId) {
      toast.error("Logo is required.")
      return;
    }
    const startUpData = {
      name: data.name,
      websiteUrl: data.websiteUrl,
      hardwareTech: data.hardwareTech,
      hardwareInnovations: data.hardwareInnovations,
      about: data.about,
      logo: logoId,
      keyInvestors: investorsLogos,
      CustomersDetails: customerDetailsLogos,
      metricFeatures: metrics,
      category: {
        futureScope: selectedOptions,
        stages: data.stages,
        programmes: programmes
      },
      grants: grantsInvestments
    };

    try {
      setIsStartupUpdating(true);
      // Send image to the API
      const response = await axios.put(`https://forge-backend-self.vercel.app/api/v1/startup/${startup?._id}`, startUpData, {
        withCredentials: true
      });
      if (response?.data?.message) {
        toast.success(response?.data?.message)
        navigate("/dashboard")
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsStartupUpdating(false);
    } finally {
      setIsStartupUpdating(false);
    }
  };

  // Delete image func
  // const handleDeleteImage = async (fileId: string, fieldName: string, index?: number) => {
  //   const toastId = toast.loading("Deleting image..."); // Show loading toast

  //   try {
  //     const response = await axios.delete(`https://forge-backend-self.vercel.app/api/v1/image/delete/${fileId}`, {
  //       withCredentials: true,
  //     });

  //     if (fieldName === "startupLogo") {
  //       setStartupLogo("");
  //     } else if (fieldName === "metric" && index !== undefined) {
  //       const updatedMetrics = [...metrics];
  //       updatedMetrics[index].icon = null;
  //       setMetrics(updatedMetrics);
  //     }

  //     toast.success("Image deleted successfully!", { id: toastId }); // Success toast
  //     console.log(response);
  //   } catch (error) {
  //     toast.error("Failed to delete image!", { id: toastId }); // Error toast
  //     console.error("Error deleting image:", error);
  //   }
  // };

  const handleDeleteStartupLogo = async (fileId: string) => {
    const toastId = toast.loading("Deleting logo..."); // Show loading toast
  
    try {
      await axios.delete(`https://forge-backend-self.vercel.app/api/v1/image/delete/${fileId}`, {
        withCredentials: true,
      });
      setStartupLogo("")
      setLogoId("");
      toast.success("Logo deleted successfully!", { id: toastId }); // Success toast
    } catch (error) {
      toast.error("Failed to delete logo!", { id: toastId }); // Error toast
      console.error("Error deleting logo:", error);
    }
  };
  



  return (
    <div className="max-w-[1000px] mx-auto w-full py-10">
      <div className="flex items-center gap-3 mb-10">
        <Link to={"/dashboard"} className="">
          <FaArrowLeftLong />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Startup Details</h1>

      </div>
      <form onSubmit={handleSubmit(handleUpdateStartup)}>
        <div className="flex gap-10 w-full">
          {/* Category details */}
          <div className="w-full">
            <h1 className="text-gray-900 font-semibold text-2xl">Category Details</h1>
            <div className="flex flex-col gap-4 mt-5">

              <div className="flex flex-col gap-4">
                <div className="space-y-2 text-sm">
                  <label htmlFor="multi-select" className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
                    Select Future Scope <span className="text-red-500 text-lg">*</span>
                  </label>
                  <select
                    id="multi-select"
                    onChange={handleSelectChange}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus-visible:outline-none dark:border-zinc-700"
                  >
                    <option disabled selected>
                      Select Future Scope
                    </option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {selectedOptionError && <p className="text-red-500 text-sm">Future scope is required</p>}
                  <div className="mt-2">
                    {selectedOptions?.map((option) => (
                      <div key={option} className="inline-flex items-center bg-gray-200 text-gray-700 rounded px-2 py-1 mr-2 mt-2">
                        {options.find(opt => opt.value === option)?.label}
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(option)}
                          className="ml-2 text-red-500"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <label htmlFor="stages" className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
                    Stages <span className="text-red-500 text-lg">*</span>
                  </label>
                  <select
                    id="stages"
                    {...register("stages", { required: "Stages is required" })}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus-visible:outline-none dark:border-zinc-700"
                  >
                    <option value="" disabled>Select Stage</option>
                    <option value="Growth Stage">Growth Stage</option>
                    <option value="Product Stage">Product Stage</option>
                    <option value="Market Stage">Market Stage</option>
                  </select>
                  {errors.stages && <p className="text-red-500 text-sm">{errors.stages.message as string}</p>}
                </div>

                <div>
                  <TextInput
                    label="Programmes"
                    name="programmes"
                    type="text"
                    placeholder="Enter programmes"
                    onKeyDown={handleKeyDownProgramme}
                  />
                  <div className="flex flex-wrap gap-2">
                    {programmes.map((programme, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center bg-gray-200 text-gray-700 rounded px-2 py-1 mr-2 mt-2"
                      >
                        <span>{programme}</span>
                        <AiOutlineClose
                          className="cursor-pointer text-red-500"
                          onClick={() => removeProgramme(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <TextInput
                    label="Grants & Investments"
                    name="grantsInvestments"
                    type="text"
                    placeholder="Enter Grants & Investments"
                    onKeyDown={handleKeyDownGrantsInvestments}
                  />
                  <div className="flex flex-wrap gap-2">
                    {grantsInvestments.map((item, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center bg-gray-200 text-gray-700 rounded px-2 py-1 mr-2 mt-2"
                      >
                        <span>{item}</span>
                        <AiOutlineClose
                          className="cursor-pointer text-red-500"
                          onClick={() => removeGrantsInvestments(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <TextArea
                isMandatory={true}
                label="About The Startup"
                name="about"
                placeholder="Say about your startup"
                rows={5}
                register={register("about")}
                errorMessage={errors.about?.message}
                defaultValue={startup?.about}
              />

            </div>
          </div>

          {/* Details */}
          <div className="w-full">
            <h1 className="text-gray-900 font-semibold text-2xl">Details</h1>
            <div className="flex flex-col gap-4 mt-5">
              <TextInput
                isMandatory={true}
                label="Startup Name"
                name="name"
                type="text"
                placeholder="Enter startup name"
                register={register("name", {
                  required: "Name is required",
                })}
                errorMessage={errors.name?.message}
                defaultValue={startup?.name}
              />
              {/* Startup logo */}
              <div className="space-y-2 text-sm">
                <label htmlFor="file" className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-1">
                  Upload File <span className="text-red-500 text-lg">*</span>
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleAddLogo}
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus-visible:outline-none dark:border-zinc-700"
                />
                {
                  startupLogo &&
                  <div className="relative size-24">
                    <img
                      src={startupLogo}
                      alt={startup?.name}
                      className="size-24 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteStartupLogo(startup?.logo?.fileId)}
                      className="absolute top-0 right-1 text-red-500 text-2xl"
                    >
                      &times;
                    </button>
                  </div>
                }

                {
                  isLogoAdding ?
                    <p className="text-orange-500">Uploading logo... Please wait.</p>
                    :
                    logoName && <p className="text-sm text-green-500 mt-2">File Selected: {logoName}</p>
                }
              </div>

              <TextInput
                label="Startup Website URL"
                name="websiteUrl"
                type="text"
                placeholder="Enter website Url"
                register={register("websiteUrl")}
                errorMessage={errors.websiteUrl?.message}
                defaultValue={startup?.websiteUrl}
                value={startup?.websiteUrl}
              />
              <TextInput
                label="Hardware Tech"
                name="hardwareTech"
                type="text"
                placeholder="Enter hardware tech"
                register={register("hardwareTech")}
                errorMessage={errors.hardwareTech?.message}
                defaultValue={startup?.hardwareTech}
              />
              <TextInput
                label="Hardware Innovations"
                name="hardwareInnovations"
                type="text"
                placeholder="Enter hardware innovations"
                register={register("hardwareInnovations")}
                errorMessage={errors.hardwareInnovations?.message}
                defaultValue={startup?.hardwareInnovations}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-10 mt-10">
          {/* Key investor Details */}
          <div className="w-1/2">
            <h1 className="text-gray-900 font-semibold text-2xl">Key investors Image (Upto 8)</h1>
            <p className="text-xs text-red-500 mt-1">NOTE: Images will be removed immediately on clicking the "❌" without needing to submit.</p>
            <UpdateInvestorImages startup={startup} investorsLogos={investorsLogos} setInvestorsLogos={setInvestorsLogos} />
          </div>

          {/*Customer Details */}
          <div className="w-1/2">
            <h1 className="text-gray-900 font-semibold text-2xl">Customer Details (Upto 8)</h1>
            <p className="text-xs text-red-500 mt-1">NOTE: Images will be removed immediately on clicking the "❌" without needing to submit.</p>
            <UpdateCustomerImages customerDetailsLogos={customerDetailsLogos} setCustomerDetailsLogos={setCustomerDetailsLogos} startup={startup} />
          </div>
        </div>

        <div>
          {/* Metric Features */}
          <div className="w-full mt-10">
            <h1 className="text-gray-900 font-semibold text-2xl">Metric Features</h1>
            <div className="flex flex-col gap-4 mt-5">
              {
                metrics?.map((metric: any, index: number) => (
                  <div key={index}>
                    <h1 className="text-gray-900 text-xl">Metric Feature {index + 1}</h1>

                    {/* Feature Heading */}
                    <TextInput
                      label="Feature Heading"
                      name="heading"
                      type="text"
                      placeholder="Enter Feature Heading"
                      value={metric.heading}
                      onChange={(e) => handleInputChange(e, index, "heading")}
                      defaultValue={metric?.heading}
                    />

                    {/* Feature Metric */}
                    <TextInput
                      label="Feature Metric"
                      name="metric"
                      type="text"
                      placeholder="Enter Feature Metric"
                      value={metric.metric}
                      onChange={(e) => handleInputChange(e, index, "metric")}
                      defaultValue={metric?.metric}
                    />

                    {/* Feature Metric Icon */}
                    <div className="space-y-2 text-sm">
                      <label htmlFor={`file-${index}`} className="block text-zinc-700 dark:text-zinc-300 font-medium">
                        Upload Icon
                      </label>
                      {
                        metric?.icon?.thumbnailUrl ?
                          <div key={index} className="relative size-24">
                            <img
                              src={metric?.icon?.thumbnailUrl}
                              alt={metric?.icon?.name}
                              className="size-24 object-cover rounded-md border"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteMatricImage(metric?.icon?.fileId)}
                              className="absolute top-0 right-1 text-red-500 text-2xl"
                            >
                              &times;
                            </button>
                          </div>
                          :
                          <input
                            type="file"
                            id={`file-${index}`}
                            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus-visible:outline-none dark:border-zinc-700"
                            onChange={(e) => handleAddMetricImage(e, index)}
                          />
                      }
                    </div>
                  </div>
                ))}
            </div>
            <button
              type="button"
              className="mt-4 text-blue-500 hover:text-blue-700"
              onClick={addAnotherMetric}
            >
              Add Another Metric
            </button>
          </div>
        </div>

        <button className="rounded-md bg-sky-500 px-4 py-2 text-white transition-colors hover:bg-sky-600 dark:bg-sky-700 w-full">
          {
            isStartupUpdating ? "Loading..." : "Submit"
          }
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;