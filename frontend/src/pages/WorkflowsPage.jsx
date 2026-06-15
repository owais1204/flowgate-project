import { useEffect, useState } from 'react';
import { workflowApi } from '../services/api';

export default function WorkflowsPage() {

  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {

    try {

      setLoading(true);

      const response = await workflowApi.list();

      console.log("WORKFLOWS:", response.data);

      if (Array.isArray(response.data)) {
        setWorkflows(response.data);
      } else {
        setWorkflows([]);
      }

    } catch (error) {

      console.error(error);

      alert("Failed to load workflows");

    } finally {

      setLoading(false);
    }
  };

  const approveWorkflow = async (workflow) => {

  try {

    if (workflow.currentApprover === "MANAGER") {

      await workflowApi.managerApprove(workflow.id);

      alert("Manager Approved Successfully");

    } else if (workflow.currentApprover === "ADMIN") {

      await workflowApi.approve(workflow.id);

      alert("Admin Approved Successfully");

    } else {

      alert("Workflow already completed");
      return;
    }

    loadWorkflows();

  } catch (error) {

    console.error(error);

    alert("Approval Failed");
  }
};

  const rejectWorkflow = async (id) => {

    try {

      await workflowApi.reject(id);

      alert("Workflow Rejected Successfully");

      loadWorkflows();

    } catch (error) {

      console.error(error);

      alert("Reject Failed");
    }
  };

  const getStatusColor = (status) => {

    if (!status) return "bg-gray-800 text-gray-300";

    switch (status.toLowerCase()) {

      case "approved":
        return "bg-green-900 text-green-400";

      case "rejected":
        return "bg-red-900 text-red-400";

      default:
        return "bg-yellow-900 text-yellow-400";
    }
  };

  if (loading) {

    return (
      <div className="flex justify-center items-center min-h-screen bg-[#050816] text-white">
        Loading Workflows...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-8">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            Workflow Management
          </h1>

          <p className="text-gray-400 mt-2">
            View, approve and manage workflow requests
          </p>

        </div>

        <button
          className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-xl font-semibold"
          onClick={loadWorkflows}
        >
          Refresh
        </button>

      </div>

      <div className="bg-[#0B1023] border border-gray-800 rounded-2xl overflow-hidden">

        <table className="w-full">

          <thead>

            <tr className="border-b border-gray-800 text-gray-400">

              <th className="p-5 text-left">ID</th>
              <th className="p-5 text-left">TITLE</th>
              <th className="p-5 text-left">CATEGORY</th>
              <th className="p-5 text-left">PRIORITY</th>
              <th className="p-5 text-left">STATUS</th>
              <th className="p-5 text-left">ASSIGNED TO</th>
              <th className="p-5 text-left">ACTIONS</th>

            </tr>

          </thead>

          <tbody>

            {workflows.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center p-10 text-gray-500"
                >
                  No Workflows Found
                </td>

              </tr>

            ) : (

              workflows.map((workflow) => (

                <tr
                  key={workflow.id}
                  className="border-b border-gray-900 hover:bg-[#12182F]"
                >

                  <td className="p-5">
                    #{workflow.id}
                  </td>

                  <td className="p-5">

                    <div className="font-semibold">
                      {workflow.title}
                    </div>

                    <div className="text-sm text-gray-400">
                      {workflow.description}
                    </div>

                  </td>

                  <td className="p-5">
                    {workflow.category || "-"}
                  </td>

                  <td className="p-5">
                    {workflow.priority || "-"}
                  </td>

                  <td className="p-5">

                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(workflow.status)}`}
                    >
                      {workflow.status}
                    </span>

                  </td>

                  <td className="p-5">
                    {workflow.assignedTo || "-"}
                  </td>

                  <td className="p-5 flex gap-3">

                    {workflow.status !== "Approved" &&
                     workflow.status !== "Rejected" && (

                      <>
                        <button
                          onClick={() =>
                            approveWorkflow(workflow)
                          }
                          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            rejectWorkflow(workflow.id)
                          }
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl"
                        >
                          Reject
                        </button>
                      </>
                    )}

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}