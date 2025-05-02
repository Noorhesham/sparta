"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Users, Settings, BarChart3 } from "lucide-react";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";

export default function DashboardPage() {
  const t = useTranslations("dashboard.common");

  return (
    <MaxWidthWrapper className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to the Sparta dashboard. Manage your website content from here.</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <CardDescription>Your website pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">4</div>
              <Layers className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <CardDescription>Total administrator users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">1</div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Settings</CardTitle>
            <CardDescription>System configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">12</div>
              <Settings className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <CardDescription>Weekly visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">+573</div>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Frequently used dashboard pages</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <a
              href="/dashboard/homepage"
              className="flex items-center gap-2 p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors"
            >
              <Layers className="h-5 w-5" />
              <div>
                <div className="font-medium">Homepage Management</div>
                <div className="text-sm text-muted-foreground">Edit your website's main landing page</div>
              </div>
            </a>
            <a
              href="/dashboard/settings"
              className="flex items-center gap-2 p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <div>
                <div className="font-medium">Settings</div>
                <div className="text-sm text-muted-foreground">Configure your website settings</div>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-3">
              <div className="font-medium">Homepage Updated</div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Hero section was modified</span>
                <span>Just now</span>
              </div>
            </div>
            <div className="border-b pb-3">
              <div className="font-medium">Settings Changed</div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Site title was updated</span>
                <span>2 hours ago</span>
              </div>
            </div>
            <div>
              <div className="font-medium">New Service Added</div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Added to homepage services</span>
                <span>Yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
}
