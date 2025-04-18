/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { MdAirplanemodeActive, MdOutlineAirplanemodeInactive, MdOutlineDeleteOutline } from 'react-icons/md';

const StartupTable = ({ startups, loading }: { startups: any, loading: boolean }) => {

  const handleMakeInactive = async (id: string) => {
    try {
      const response = await axios.put(
        `https://forgebackend.vercel.app/api/v1/startup/change-inactive/${id}`,
        {},
        { withCredentials: true }
      );
      if (response?.status === 200) {
        toast.success("Status changed to inactive");
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error Response:', error.response);
        toast.error(`Error: ${error.response.data.message || "Please try again."}`);
      } else {
        toast.error("Error changing status. Please try again.");
      }
    }
  };

  const handleMakeActive = async (id: string) => {
    try {
      const response = await axios.put(
        `https://forgebackend.vercel.app/api/v1/startup/change-active/${id}`,
        {},
        { withCredentials: true }
      );
      if (response?.status === 200) {
        toast.success("Status changed to active");
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error Response:', error.response);
        toast.error(`Error: ${error.response.data.message || "Please try again."}`);
      } else {
        toast.error("Error changing status. Please try again.");
      }
    }
  };

  const handleDeleteStartup = async (id: string) => {
    try {
      const response = await axios.delete(`https://forgebackend.vercel.app/api/v1/startup/${id}`, {
        withCredentials: true
      });
      console.log(response);
      if (response?.status === 200) {
        toast.success("Successfully deleted");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Error deleting startup. Please try again.");
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Startup Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Stages</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Programmes</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-sm text-gray-700">
                Loading...
              </td>
            </tr>
          ) : startups.length > 0 ? (
            startups.map((startup: any, index: number) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">{startup.name}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{startup.stages}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{startup.programmes?.join(", ")}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{startup.status}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <div className="flex gap-5">
                    <div className="relative group">
                      <Link to={`/dashboard/update-startup/${startup?._id}`} className="text-blue-500 hover:text-blue-700 text-xl">
                        <FaEdit />
                      </Link>
                      <div className="absolute top-[-45px] left-[-23px] translate-y-[-20px] opacity-0 z-[-1] group-hover:translate-y-0 group-hover:opacity-100 group-hover:z-[1000] transition-all duration-500">
                        <p className="text-[0.9rem] w-max bg-gray-100 border border-gray-300 rounded px-3 py-2">
                          Edit
                        </p>
                      </div>
                    </div>
                    {
                      startup?.status === "Active" ?
                        <div className="relative group">
                          <button onClick={() => handleMakeInactive(startup?._id)} className="text-orange-500 hover:text-red-700 text-xl">
                            <MdOutlineAirplanemodeInactive />
                          </button>
                          <div className="absolute top-[-45px] left-[-23px] translate-y-[-20px] opacity-0 z-[-1] group-hover:translate-y-0 group-hover:opacity-100 group-hover:z-[1000] transition-all duration-500">
                            <p className="text-[0.9rem] w-max bg-gray-100 border border-gray-300 rounded px-3 py-2">
                              Inactive
                            </p>
                          </div>
                        </div>
                        :
                        <div className="relative group">
                          <button onClick={() => handleMakeActive(startup?._id)} className="text-green-500 hover:text-green-700 text-xl">
                            <MdAirplanemodeActive />
                          </button>
                          <div className="absolute top-[-45px] left-[-23px] translate-y-[-20px] opacity-0 z-[-1] group-hover:translate-y-0 group-hover:opacity-100 group-hover:z-[1000] transition-all duration-500">
                            <p className="text-[0.9rem] w-max bg-gray-100 border border-gray-300 rounded px-3 py-2">
                              Active
                            </p>
                          </div>
                        </div>
                    }

                    <div className="relative group">
                      <button onClick={() => handleDeleteStartup(startup?._id)} className="text-red-500 hover:text-red-700 text-xl">
                      <MdOutlineDeleteOutline />
                      </button>
                      <div className="absolute top-[-45px] left-[-23px] translate-y-[-20px] opacity-0 z-[-1] group-hover:translate-y-0 group-hover:opacity-100 group-hover:z-[1000] transition-all duration-500">
                        <p className="text-[0.9rem] w-max bg-gray-100 border border-gray-300 rounded px-3 py-2">
                          Delete
                        </p>
                      </div>
                    </div>


                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-sm text-gray-700">
                No Startup Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StartupTable;
