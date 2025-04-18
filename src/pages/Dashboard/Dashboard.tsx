/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import StartupTable from "../../components/Dashboard/StartupTable/StartupTable";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";

export interface Startup {
  _id: string;
  name: string;
  hardwareTech: string;
  stages: string;
  programmes: string;
  status:string;
}


const Dashboard = () => {
  const navigate = useNavigate();
  const [isActiveStartup, setIsActiveStartup] = useState<boolean>(true);

  const handleLogout = () => {
    Cookies.remove("isAuthenticated");
    navigate("/");
    window.location.reload();
  };

  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStartups = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://forge-backend-self.vercel.app/api/v1/startup', {
          withCredentials : true
      });
        console.log(response);
        const data = response?.data?.startups?.map((item: any) => ({
          _id: item._id,
          name: item.name,
          hardwareTech: item.hardwareTech,
          stages: item.category?.stages || 'N/A',
          programmes: item.category?.programmes || 'N/A',
          status: item.status,
        }));
        setStartups(data);
      } catch (error) {
        console.error('Error fetching startups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const activeStartups = startups.filter(startup => startup.status === 'Active');
  const inactiveStartups = startups.filter(startup => startup.status === 'Inactive');

  return (
    <div className="py-10">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">All Startups</h1>
        <div className="flex gap-3">
          <Link
            to="/dashboard/add-startup"
            className="rounded-md bg-sky-500 px-4 py-2 text-white transition-colors hover:bg-sky-600 dark:bg-sky-700"
          >
            Add New Startup
          </Link>
         
          <button
            onClick={() => setIsActiveStartup(!isActiveStartup)}
            className="rounded-md bg-sky-500 px-4 py-2 text-white transition-colors hover:bg-sky-600 dark:bg-sky-700"
          >
            {
              isActiveStartup
               ? "Show Inactive Startups"
                : "Show Active Startups"
            }
          </button>

          <button
            onClick={handleLogout}
            className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-sky-600 dark:bg-sky-700"
          >
            Logout
          </button>
        </div>
      </div>
      <StartupTable startups={isActiveStartup ? activeStartups : inactiveStartups} loading={loading} />
    </div>
  );
};

export default Dashboard;
