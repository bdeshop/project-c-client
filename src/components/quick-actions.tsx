import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Plus, FileText, Settings, Users, BarChart3, Shield } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
            <Plus className="h-5 w-5" />
            <span className="text-xs">Add User</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
            <FileText className="h-5 w-5" />
            <span className="text-xs">Generate Report</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
            <Settings className="h-5 w-5" />
            <span className="text-xs">System Settings</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
            <Users className="h-5 w-5" />
            <span className="text-xs">Manage Users</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">View Analytics</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
            <Shield className="h-5 w-5" />
            <span className="text-xs">Security Scan</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
