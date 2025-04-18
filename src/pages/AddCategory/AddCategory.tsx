/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import TextInput from "../../components/Reusable/TextInput/TextInput";
import SelectInput from "../../components/Reusable/SelectInput/SelectInput";
import { useState } from "react";
import TextArea from "../../components/Reusable/TextArea/TextArea";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";


const AddCategory = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // For select future scope  --------- start--------
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectedOptionError, setSelectedOptionError] = useState<boolean>(false);

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
            return Array.from(new Set([...prevSelectedOptions, ...selectedValues]));
        });
    };

    const handleRemoveOption = (option: string) => {
        setSelectedOptions(selectedOptions.filter(selected => selected !== option));
    };
    // For select future scope  --------- end--------


    // For Investors logo  --------- start--------
    const [investorsLogos, setInvestorsLogos] = useState<string[]>([]);
    const [investorsLogoPreviews, setInvestorsLogoPreviews] = useState<string[]>([]);
    const [isInvestorLogoUploading, setIsInvestorLogoUploading] = useState<boolean>(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        console.log('Hitting investors logo func');
        if (e.target.files && e.target.files[0]) {
            setIsInvestorLogoUploading(true);
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("file", file);

            try {
                // Send image to the API
                const response = await axios.post("https://forgebackend.vercel.app/api/v1/image/upload", formData, {
                    withCredentials: true
                });
                const imageId = response?.data?.image?._id;
                console.log(response);

                // Update state with the returned image ID
                const newImages = [...investorsLogos];
                newImages[index] = imageId;
                setInvestorsLogos(newImages);

                const newPreviews = [...investorsLogoPreviews];
                newPreviews[index] = response?.data?.image?.thumbnailUrl;
                setInvestorsLogoPreviews(newPreviews);
            } catch (error) {
                console.error("Error uploading image:", error);
            } finally {
                setIsInvestorLogoUploading(false);
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        setInvestorsLogoPreviews(investorsLogoPreviews.filter((_, i) => i !== index));
    };
    // For Investors logo  --------- end--------


    // For Customer details logo  --------- start--------
    const [customerDetailsLogos, setCustomerDetailsLogos] = useState<string[]>([]);
    const [customerDetailsLogoPreviews, setCustomerDetailsLogosPreviews] = useState<string[]>([]);
    const [isCustomerLogoUploading, setIsCustomerLogoUploading] = useState<boolean>(false);

    const handleCustomerImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        console.log('Hitting customer logo func');
        if (e.target.files && e.target.files[0]) {
            setIsCustomerLogoUploading(true);
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("file", file);

            try {
                // Send image to the API
                const response = await axios.post("https://forgebackend.vercel.app/api/v1/image/upload", formData, {
                    withCredentials: true
                });
                const imageId = response?.data?.image?._id;
                // console.log(response);

                // Update state with the returned image ID
                const newImages = [...customerDetailsLogos];
                newImages[index] = imageId;
                setCustomerDetailsLogos(newImages);

                const newPreviews = [...customerDetailsLogoPreviews];
                newPreviews[index] = response?.data?.image?.thumbnailUrl;
                setCustomerDetailsLogosPreviews(newPreviews);
            } catch (error) {
                console.error("Error uploading image:", error);
            } finally {
                setIsCustomerLogoUploading(false);
            }
        }
    };

    const handleRemoveCustomerImage = (index: number) => {
        setCustomerDetailsLogos(customerDetailsLogos.filter((_, i) => i !== index));
    };
    // For Customer details logo  --------- end--------


    // For metric feature ------------- start -----------
    const [metrics, setMetrics] = useState([
        { heading: "", metric: "", icon: "" },
    ]);
    // console.log(metrics);
    const [isMetricLogoAdding, setIsMetricLogoAdding] = useState<boolean[]>([]);

    // Handle the image upload and store the image ID
    const handleAddMetricImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("file", file);

            // Set loading state for the specific metric
            const loadingStates = [...isMetricLogoAdding];
            loadingStates[index] = true;
            setIsMetricLogoAdding(loadingStates);

            try {
                // Send image to the API
                const response = await axios.post("https://forgebackend.vercel.app/api/v1/image/upload", formData, {
                    withCredentials: true
                });
                const imageId = response?.data?.image?._id;

                // Update the state with the image ID
                const updatedMetrics = [...metrics];
                updatedMetrics[index].icon = imageId;
                setMetrics(updatedMetrics);
            } catch (error) {
                console.error("Error uploading image:", error);
            } finally {
                // Reset loading state for the specific metric
                loadingStates[index] = false;
                setIsMetricLogoAdding(loadingStates);
            }
        }
    };

    // Handle input change for heading and metric
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: "heading" | "metric") => {
        const updatedMetrics = [...metrics];
        updatedMetrics[index][field] = e.target.value;
        setMetrics(updatedMetrics);
    };

    // Add another metric form
    const addAnotherMetric = () => {
        setMetrics([...metrics, { heading: "", metric: "", icon: "" }]);
        setIsMetricLogoAdding([...isMetricLogoAdding, false]);
    };

    // Remove a metric form
    const handleRemoveMetric = (index: number) => {
        const updatedMetrics = metrics.filter((_, i) => i !== index);
        const updatedLoadingStates = isMetricLogoAdding.filter((_, i) => i !== index);
        setMetrics(updatedMetrics);
        setIsMetricLogoAdding(updatedLoadingStates);
    };

    // For metric feature ------------- end -----------

    const [logoId, setLogoId] = useState<string>("");
    console.log(logoId);
    const [logoIdError, setLogoIdError] = useState<boolean>(false);
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
                const response = await axios.post("https://forgebackend.vercel.app/api/v1/image/upload", formData, {
                    withCredentials: true
                });

                const imageId = response?.data?.image?._id;
                const imageName = response?.data?.image?.name;
                console.log(imageId);
                setLogoId(imageId);
                setLogoName(imageName);
                console.log(response);
            } catch (error) {
                console.error("Error uploading image:", error);
            } finally {
                setIsLogoAdding(false);
            }
        }
    };

    const [isStartupAdding, setIsStartupAdding] = useState(false);

    

    const [programmes, setProgrammes] = useState<string[]>([]);
    const [grantsInvestments, setGrantsInvestments] = useState<string[]>([]);


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
        setValue("grantsInvestments", newItems);
    };

    const handleAddStartup = async (data: any) => {
        if (selectedOptions?.length < 1) {
            setSelectedOptionError(true);
            toast.error("Future scope is required.")
            return;
        }
        if (!logoId) {
            setLogoIdError(true);
            toast.error("Logo is required.")
            return;
        }


        const startUpData = {
            name: data.name,
            websiteUrl: data.websiteUrl,
            hardwareTech: data.hardwareTech,
            hardwareInnovations: data.hardwareInnovations,
            about: data.about,
            logo: logoId && logoId !== "" ? logoId : null,
            keyInvestors: investorsLogos ? investorsLogos : [],
            CustomersDetails: customerDetailsLogos ? customerDetailsLogos : [],
            metricFeatures: metrics ? metrics.map(metric => ({
                ...metric,
                icon: metric.icon && metric.icon !== "" ? metric.icon : null
            })) : [],
            category: {
                futureScope: selectedOptions,
                stages: data.stages,
                programmes: programmes,
            },
            grants : grantsInvestments
        };



        try {
            setIsStartupAdding(true);
            // Send image to the API
            const response = await axios.post("https://forgebackend.vercel.app/api/v1/startup/create", startUpData, {
                withCredentials: true
            });
            if (response?.data?.message) {
                toast.success(response?.data?.message)
                navigate("/dashboard")
            }
            console.log(response);
        } catch (error) {
            console.error("Error uploading image:", error);
            setIsStartupAdding(false);
        } finally {
            setIsStartupAdding(false)
        }
    };


    return (
        <div className="max-w-[1000px] mx-auto w-full py-10">
            <div className="flex items-center gap-3 mb-10">
                <Link to={"/dashboard"} className="">
                    <FaArrowLeftLong />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Add New Startup</h1>

            </div>
            <form onSubmit={handleSubmit(handleAddStartup)}>
                <div className="flex gap-10 w-full">
                    {/* Category details */}
                    <div className="w-full">
                        <h1 className="text-gray-900 font-semibold text-2xl">Category Details</h1>
                        <div className="flex flex-col gap-4 mt-5">

                            <div className="space-y-2 text-sm">
                                <label htmlFor="multi-select" className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-1">
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
                                <div className="mt-2">
                                    {selectedOptions.map((option) => (
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
                                {selectedOptionError && <p className="text-red-500 text-sm">Future scope is required</p>}

                            </div>

                            {/* <SelectInput
                                label="Future Scope"
                                name="futureScope"
                                options={options}
                                register={register("futureScope", { required: "Future Scope is required" })}
                                errorMessage={errors.stages?.message}
                            /> */}
                            <SelectInput
                            isMandatory={true}
                                label="Stages"
                                name="stages"
                                options={[
                                    { value: "Growth Stage", label: "Growth Stage" },
                                    { value: "Product Stage", label: "Product Stage" },
                                    { value: "Market Stage", label: "Market Stage" },
                                ]}
                                register={register("stages", {
                                    required: "Select name is required",
                                })}
                                errorMessage={errors.stages?.message}
                            />

                           
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

                            <TextArea
                            isMandatory={true}
                                label="About The Startup"
                                name="about"
                                placeholder="Say about your startup"
                                rows={5}
                                register={register("about", {
                                    required: "Description name is required",
                                })}
                                errorMessage={errors.about?.message}
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
                                    required: "Startup name is required",
                                })}
                                errorMessage={errors.name?.message}
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
                                    isLogoAdding ?
                                        <p className="text-orange-500">Uploading logo... Please wait.</p>
                                        :
                                        logoName && <p className="text-sm text-green-500 mt-2">File Selected: {logoName}</p>
                                }

                                {logoIdError && <p className="text-red-500 text-sm">Logo is required</p>}
                            </div>

                            <TextInput
                                label="Startup Website URL"
                                name="websiteUrl"
                                type="text"
                                placeholder="Enter website Url"
                                register={register("websiteUrl")}
                                errorMessage={errors.websiteUrl?.message}
                            />
                            <TextInput
                                label="Hardware Tech"
                                name="hardwareTech"
                                type="text"
                                placeholder="Enter hardware tech"
                                register={register("hardwareTech")}
                                errorMessage={errors.hardwareTech?.message}
                            />
                            <TextInput
                                label="Hardware Innovations"
                                name="hardwareInnovations"
                                type="text"
                                placeholder="Enter hardware innovations"
                                register={register("hardwareInnovations")}
                                errorMessage={errors.hardwareInnovations?.message}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-10 mt-10">
                    {/* Key investor Details */}
                    <div className="w-1/2">
                        <h1 className="text-gray-900 font-semibold text-2xl">Key Investor Details (Upto 8)</h1>
                        <div className="flex flex-wrap gap-5 mt-5">
                            {investorsLogoPreviews.map((image, index) => (
                                <div key={index} className="relative size-24">
                                    <img
                                        src={image}
                                        alt={`Investor Logo ${index + 1}`}
                                        className="size-24 object-cover rounded-md border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-0 right-1 text-red-500 text-2xl"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            {investorsLogos.length < 8 && (
                                <div className="flex flex-col gap-4">
                                    <input
                                        type="file"
                                        onChange={(e) => handleImageChange(e, investorsLogos.length)}
                                        className="hidden"
                                        id={`upload`}
                                        accept="image/*"
                                    />
                                    <label
                                        htmlFor={`upload`}
                                        className="w-24 h-24 bg-white rounded-md border px-3 py-2 text-sm focus-visible:outline-none flex items-center justify-center cursor-pointer"
                                    >
                                        <p className="text-center">
                                            {
                                                isInvestorLogoUploading ?
                                                    "Please wait..."
                                                    :
                                                    "Upload key investor logo"
                                            }
                                        </p>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/*Customer Details */}
                    <div className="w-1/2">
                        <h1 className="text-gray-900 font-semibold text-2xl">Customer Details (Upto 8)</h1>
                        <div className="flex flex-wrap gap-5 mt-5">
                            {customerDetailsLogoPreviews.map((image, index) => (
                                <div key={index} className="relative size-24">
                                    <img
                                        src={image}
                                        alt={`Investor Logo ${index + 1}`}
                                        className="size-24 object-cover rounded-md border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCustomerImage(index)}
                                        className="absolute top-0 right-1 text-red-500 text-2xl"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            {customerDetailsLogos.length < 8 && (
                                <div className="flex flex-col gap-4">
                                    <input
                                        type="file"
                                        onChange={(e) => handleCustomerImageChange(e, customerDetailsLogos.length)}
                                        className="hidden"
                                        id={`image-upload`}
                                        accept="image/*"
                                    />
                                    <label
                                        htmlFor={`image-upload`}
                                        className="w-24 h-24 bg-white rounded-md border px-3 py-2 text-sm focus-visible:outline-none flex items-center justify-center cursor-pointer"
                                    >
                                        <p className="text-center">
                                            {
                                                isCustomerLogoUploading ?
                                                    "Please wait..."
                                                    :
                                                    "Upload key customer logo"
                                            }
                                        </p>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-10">
                    {/* Metric Features */}
                    <div className="w-full mt-10">
                        <h1 className="text-gray-900 font-semibold text-2xl">Metric Features</h1>
                        <div className="flex flex-col gap-4 mt-5">
                            {metrics.map((metric, index) => (
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
                                    />

                                    {/* Feature Metric */}
                                    <TextInput
                                        label="Feature Metric"
                                        name="metric"
                                        type="text"
                                        placeholder="Enter Feature Metric"
                                        value={metric.metric}
                                        onChange={(e) => handleInputChange(e, index, "metric")}
                                    />

                                    {/* Feature Metric Icon */}
                                    <div className="space-y-2 text-sm">
                                        <label htmlFor={`file-${index}`} className="block text-zinc-700 dark:text-zinc-300 font-medium">
                                            Upload Icon
                                        </label>
                                        <input
                                            type="file"
                                            id={`file-${index}`}
                                            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus-visible:outline-none dark:border-zinc-700"
                                            onChange={(e) => handleAddMetricImage(e, index)}
                                        />
                                        {isMetricLogoAdding[index] && (
                                            <p className="text-orange-500">Please wait...</p>
                                        )}
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


                    {
                        metrics.length === 0 || metrics?.length > 0 &&
                        <div className="flex flex-col gap-5">
                            {
                                metrics?.map((metric, index) =>
                                    <div key={index} className="bg-white shadow-md rounded-xl p-5 w-[300px] relative">
                                        <h1 className="text-lg font-bold text-gray-800">Metric Heading</h1>
                                        <p className="text-gray-600">{metric?.heading ? metric?.heading : "No heading added"}</p>
                                        <h1 className="text-lg font-bold text-gray-800 mt-3">Metric</h1>
                                        <p className="text-gray-600">{metric?.metric ? metric?.metric : "No metri added"}</p>
                                        {/* <h1 className="text-lg font-bold text-gray-800 mt-3">Logo</h1>
                                        <img src={metric?.icon} alt="size-10" /> */}

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMetric(index)}
                                            className="absolute top-1 right-2 text-red-500 text-2xl"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    }
                </div>

                <button className="rounded-md bg-sky-500 px-4 py-2 text-white transition-colors hover:bg-sky-600 dark:bg-sky-700 w-full">
                    {
                        isStartupAdding ? "Loading..." : "Submit"
                    }
                </button>
            </form>
        </div>
    );
};

export default AddCategory;