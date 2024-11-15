// src/pages/Dashboard.tsx

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import Dialog from "./Dialog";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Settings,
  Plus,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRepo, setNewRepo] = useState({ name: "", url: "", branch: "" });

  // Sample data - in a real application, this would come from your backend
  const [services] = useState({
    clusterInfo: {
      kubernetesVersion: "1.26.1",
      totalPods: 24,
      totalDeployments: 8,
      totalServices: 12,
    },
    deployments: [
      {
        id: 1,
        name: "auth-service",
        status: "healthy",
        releaseTag: "v1.2.3",
        podCount: 3,
        lastUpdated: "2024-03-15T10:30:00Z",
      },
      {
        id: 2,
        name: "payment-service",
        status: "degraded",
        releaseTag: "v2.0.1",
        podCount: 2,
        lastUpdated: "2024-03-14T15:45:00Z",
      },
      {
        id: 3,
        name: "user-service",
        status: "healthy",
        releaseTag: "v1.1.0",
        podCount: 4,
        lastUpdated: "2024-03-13T09:15:00Z",
      },
    ],
  });

  const handleRefresh = (deploymentId: number) => {
    console.log(`Refreshing deployment ${deploymentId}`);
  };

  const handleDelete = (deploymentId: number) => {
    console.log(`Deleting deployment ${deploymentId}`);
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

  const handleScoutRepository = (formData: { field1: string; field2: string }) => {
    console.log("Scouting repository:", formData, newRepo);
    setIsDialogOpen(false);
    setNewRepo({ name: "", url: "", branch: "" });
  };

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
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Scout Repository
          </Button>
          <Dialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            headerTitle="Add a Repository"
            onSubmit={handleScoutRepository}
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
              {services.clusterInfo.kubernetesVersion}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Pods</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {services.clusterInfo.totalPods}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {services.clusterInfo.totalDeployments}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {services.clusterInfo.totalServices}
            </p>
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
                  <th className="text-left p-4">Service Name</th>
                  <th className="text-left p-4">Release Tag</th>
                  <th className="text-left p-4">Pods</th>
                  <th className="text-left p-4">Last Updated</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.deployments.map((deployment) => (
                  <tr key={deployment.id} className="border-b">
                    <td className="p-4">
                      {deployment.status === "healthy" ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <XCircle className="text-red-500" size={20} />
                      )}
                    </td>
                    <td className="p-4">{deployment.name}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {deployment.releaseTag}
                      </span>
                    </td>
                    <td className="p-4">{deployment.podCount}</td>
                    <td className="p-4">
                      {new Date(deployment.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRefresh(deployment.id)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button
                          onClick={() => handleSettings(deployment.id)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <Settings size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(deployment.id)}
                          className="p-2 hover:bg-gray-100 rounded-full text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Status Alerts */}
      {services.deployments
        .filter((d) => d.status === "degraded")
        .map((deployment) => (
          <Alert key={deployment.id} variant="destructive">
            <AlertDescription>
              {deployment.name} is currently experiencing issues. Please check
              the logs for more information.
            </AlertDescription>
          </Alert>
        ))}
    </div>
  );
};

export default Dashboard;
