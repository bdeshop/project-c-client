import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { FileText, Download, Calendar, Filter } from "lucide-react"

export function ReportsPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
            <p className="text-muted-foreground">Generate and download comprehensive reports</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                User Activity Report
              </CardTitle>
              <CardDescription>Detailed user engagement and activity metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Last Generated:</span>
                  <span className="text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>File Size:</span>
                  <span className="text-muted-foreground">2.4 MB</span>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Monthly Summary
              </CardTitle>
              <CardDescription>Comprehensive monthly performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Last Generated:</span>
                  <span className="text-muted-foreground">1 day ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>File Size:</span>
                  <span className="text-muted-foreground">5.1 MB</span>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Custom Report
              </CardTitle>
              <CardDescription>Generate custom reports with specific filters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <span className="text-muted-foreground">Ready to generate</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated Size:</span>
                  <span className="text-muted-foreground">~3.2 MB</span>
                </div>
              </div>
              <Button className="w-full">Generate Report</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
