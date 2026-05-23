import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Bell, Shield, CreditCard } from "lucide-react";

const Settings = () => {
  return (
    <div className="flex-1 space-y-4 p-8 pt-24 max-w-4xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Manage how you receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive weekly summaries and alerts via email.</p>
              </div>
              <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                <div className="h-5 w-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive real-time alerts on your devices.</p>
              </div>
              <div className="h-6 w-11 bg-muted rounded-full relative cursor-pointer">
                <div className="h-5 w-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm border"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Protect your account and data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Two-Factor Authentication (2FA)</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your password regularly to keep your account secure.</p>
              </div>
              <Button variant="outline">Update</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Billing & Subscription
            </CardTitle>
            <CardDescription>Manage your premium subscription plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-primary">Premium Plan</p>
                <p className="text-sm text-muted-foreground">₹9.99/month. Next billing date: Nov 15, 2024</p>
              </div>
              <Button>Manage Plan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
