// src/pages/Dashboard.tsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import ScoutDialog from "./ScoutDialog";
// import Modal from "react-modal";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Send,
  Edit,
  Settings,
  Loader2,
  Plus,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeployDialog from "./DeployDialog";
import UpdateDialog from "./UpdateDialog";

interface ClusterInfo {
  kubernetes_version: string;
  no_of_pods: number;
  no_of_deployments: number;
  no_of_services: number;
  tenant_username: string;
}

interface KubernetesSpec {
  replicas: number;
}

interface OtherInfo {
  endpoint: string;
  kuberenetes_spec: KubernetesSpec;
}

interface DeploymentInfo {
  deployment_name: string;
  age: string;
  status: string;
  desired_replicas: number;
  current_replicas: number;
  image: string;
  available_replicas: number;
  other_info: OtherInfo;
  out_of_sync: boolean;
}

interface Deployment {
  deployment_info: DeploymentInfo;
}

interface Release {
  html_url: string;
  tag_name: string;
  created_at: string;
  published_at: string;
}

interface ReleaseInfo {
  repo_url: string;
  releases: Release[];
}

interface RepoInfo {
  deployments: Deployment[];
  latest_image_url: string;
  release_info: ReleaseInfo;
  repo_name: string;
  repo_scout_id: string;
}

const Dashboard = () => {
  const router = useNavigate();
  const [isScoutDialogOpen, setIsScoutDialogOpen] = useState(false);
  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [clusterInfo, setClusterInfo] = useState<ClusterInfo | null>(null);
  const [repoInfo, setRepoInfo] = useState<RepoInfo[] | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const services = {
    deployments: [
      {
        deployment_info: {
          deployment_name: "deployment-service-new2",
          age: "0 minutes ago",
          status: "Unavailable",
          desired_replicas: 4,
          current_replicas: 4,
          image: "dubemezeagwu/deployment-service:v0.0.8",
          available_replicas: 2,
          other_info: {
            endpoint: "UNDEFINED",
            kuberenetes_spec: {
              replicas: 1,
            },
          },
          out_of_sync: false,
        },
      },
    ],
    latest_image_url: "dubemezeagwu/deployment-service:v0.0.8",
    release_info: {
      repo_url: "https://github.com/vignesh-codes/deployment-service",
      releases: [
        {
          html_url:
            "https://github.com/vignesh-codes/deployment-service/releases/tag/v0.0.8",
          tag_name: "v0.0.6",
          created_at: "2024-11-17T01:55:26Z",
          published_at: "2024-11-20T00:22:07Z",
        },
      ],
    },
    repo_name: "vignesh-codes/test-service",
    repo_scout_id: "6733ef6ce131df206b1c199lp",
  };

  useEffect(() => {
    const fetchClusterInfo = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(
          "http://104.198.50.89/v1/deployments/tenant/",
          {
            method: "GET",
            headers: {
              username: "default",
              Origin: "http://localhost:5173",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cluster information");
        }
        const data = await response.json();
        console.log(`data: ${JSON.stringify(data)}`);
        setClusterInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchClusterInfo();
  }, []);

  // useEffect(() => {
  //   setRepoInfo(() => [services]);
  // }, [services]);

  useEffect(() => {
    const fetchRepoInfo = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("http://104.198.50.89/v1/build/scout/", {
          method: "GET",
          headers: {
            username: "default",
            Origin: "http://localhost:5173",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch repo information");
        }
        const data = await response.json();
        const combinedData = [...data, services];
        console.log(`data: ${JSON.stringify(data[0])}`);
        setRepoInfo(combinedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchRepoInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!clusterInfo) {
    return null;
  }

  // const handleRefresh = (deploymentId: number) => {
  //   console.log(`Refreshing deployment ${deploymentId}`);
  // };

  const deleteDeployment = async (deploymentName: string) => {
    try {
      const response = await fetch(
        `http://104.198.50.89/v1/deployments/${deploymentName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            username: "default",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete deployment");
      }

      const result = await response.json();
      console.log(`Deployment ${deploymentName} deleted successfully:`, result);

      // Optionally, update the state to reflect the deletion
      setRepoInfo((prevRepoInfo) =>
        prevRepoInfo
          ? prevRepoInfo.filter(
              (repo) =>
                repo.deployments[0].deployment_info.deployment_name !==
                deploymentName
            )
          : null
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleSettings = (deploymentId: number) => {
    console.log(`Opening settings for deployment ${deploymentId}`);
  };

  // const handleScoutRepository = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Scouting repository:", newRepo);
  //   setIsDialogOpen(false);
  //   setNewRepo({ name: "", url: "", branch: "" });
  // };

  // const handleScoutRepository = (formData: { field1: string; field2: string }) => {
  //   console.log("Scouting repository:", formData, newRepo);
  //   setIsDialogOpen(false);
  //   setNewRepo({ name: "", url: "", branch: "" });
  // };

  const navigateToTenants = () => {
    router("/tenants-deployments");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Infrastructure Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setIsScoutDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Scout Repository
          </Button>
          <ScoutDialog
            isOpen={isScoutDialogOpen}
            onClose={() => setIsScoutDialogOpen(false)}
            headerTitle="Add a Repository"
            onSubmit={(formData) => {
              console.log("Form submitted:", formData);
            }}
          />
          <Button variant="outline" onClick={navigateToTenants}>
            <Users className="w-4 h-4 mr-2" /> Tenant Deployments
          </Button>
        </div>
      </div>

      {/* Cluster Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Kubernetes Version
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {clusterInfo.kubernetes_version}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Pods</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{clusterInfo.no_of_pods}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {clusterInfo.no_of_deployments}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{clusterInfo.no_of_services}</p>
          </CardContent>
        </Card>
      </div>

      {/* Deployments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Scouted Repositories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Repository Name</th>
                  <th className="text-left p-4">Release Tag</th>
                  <th className="text-left p-4">Pods</th>
                  <th className="text-left p-4">Last Updated</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {repoInfo?.map((data) => (
                  <tr key={data.repo_scout_id} className="border-b">
                    <td className="p-4">
                      {data.deployments[0].deployment_info.status ===
                      "Available" ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <XCircle className="text-red-500" size={20} />
                      )}
                    </td>
                    <td className="p-4">{data.repo_name}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {data.release_info.releases[0].tag_name}
                      </span>
                    </td>
                    <td className="p-4">
                      {data.deployments[0].deployment_info.available_replicas}/
                      {data.deployments[0].deployment_info.desired_replicas}
                    </td>
                    <td className="p-4">
                      {new Date(
                        data.release_info.releases[0].published_at
                      ).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {data.deployments[0].deployment_info.status !==
                          "Available" && (
                          <button
                            onClick={() => setIsDeployDialogOpen(true)}
                            className="p-2 hover:bg-green-100 rounded-full text-green-500"
                          >
                            <Send size={16} />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setIsUpdateDialogOpen(true)
                          }
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <Edit size={16} />
                        </button>
                        {data.deployments[0].deployment_info.status ==
                          "Available" && (
                            <button
                            onClick={() => deleteDeployment(data.deployments[0].deployment_info.deployment_name)}
                            className="p-2 hover:bg-gray-100 rounded-full text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleSettings(parseInt(data.repo_scout_id))
                          }
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <Settings size={16} />
                        </button>
                        <DeployDialog
                          isOpen={isDeployDialogOpen}
                          onClose={() => setIsDeployDialogOpen(false)}
                          repo_scout_id={data.repo_scout_id}
                          image={data.deployments[0].deployment_info.image}
                          onSubmit={(formData) => {
                            console.log("Form submitted:", formData);
                          }}
                        />
                        <UpdateDialog
                          isOpen={isUpdateDialogOpen}
                          onClose={() => setIsUpdateDialogOpen(false)}
                          name={data.deployments[0].deployment_info.deployment_name}
                          image={data.deployments[0].deployment_info.image}
                          onSubmit={(formData) => {
                            console.log("Form submitted:", formData);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
