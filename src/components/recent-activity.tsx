import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const activities = [
  {
    id: 1,
    user: "John Smith",
    action: "Created new user account",
    time: "2 minutes ago",
    avatar: "/professional-headshot.png",
  },
  {
    id: 2,
    user: "Sarah Johnson",
    action: "Updated security settings",
    time: "5 minutes ago",
    avatar: "/professional-woman-headshot.png",
  },
  {
    id: 3,
    user: "Michael Brown",
    action: "Generated monthly report",
    time: "10 minutes ago",
    avatar: "/professional-man-headshot.png",
  },
  {
    id: 4,
    user: "Emily Davis",
    action: "Modified user permissions",
    time: "15 minutes ago",
    avatar: "/professional-blonde-headshot.png",
  },
  {
    id: 5,
    user: "David Wilson",
    action: "Logged into admin panel",
    time: "20 minutes ago",
    avatar: "/professional-man-headshot-beard.png",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions performed by team members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                <AvatarFallback>
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.user}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
