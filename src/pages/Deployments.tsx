import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TenantDeployments = () => {
  const router = useNavigate();
  const [tenants] = React.useState([
    {
      id: 1,
      name: "Deployment A",
      replicas: "1/2",
      manifest: "https:google.com",
      status: "healthy",
      age: "5 days ago",
    },
    {
      id: 2,
      name: "Deployment B",
      replicas: "2/4",
      manifest: "https:google.com",
      status: "degraded",
      age: "2 days ago",
    },
    {
      id: 3,
      name: "Deployment C",
      replicas: "2/3",
      manifest: "https:google.com",
      status: "healthy",
      age: "3 days ago",
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Tenant Deployments</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {tenant.name}
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    tenant.status === "healthy" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Pods</p>
                  <p className="text-lg font-semibold">{tenant.replicas}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Manifest</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                      <a
                        href={tenant.manifest}
                        target="_blank"
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        rel="noopener noreferrer"
                      >
                        {tenant.manifest}
                      </a>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold">{tenant.age}</p>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={() =>
                    console.log(`View details for tenant ${tenant.id}`)
                  }
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TenantDeployments;
