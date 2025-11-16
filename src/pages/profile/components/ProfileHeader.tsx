import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import { Mail, MapPin, Phone, Calendar, Shield } from "lucide-react";

interface ProfileHeaderProps {
  user?: {
    name: string;
    username: string;
    email: string;
    profileImage: string;
    status: string;
    role: string;
    country: string;
    isVerified: boolean;
    emailVerified: boolean;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  if (!user) return null;

  const getUserInitials = () => {
    const name = user.name || user.username;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="glass-effect">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <Avatar className="h-24 w-24 ring-4 ring-border shadow-lg">
            <AvatarImage
              src={user.profileImage || "/admin-avatar.png"}
              alt={user.name}
            />
            <AvatarFallback className="gradient-primary text-white text-2xl font-bold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                {user.name || user.username}
                {user.isVerified && (
                  <Badge className="bg-blue-500 hover:bg-blue-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
                {user.emailVerified && (
                  <Badge variant="outline" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              {user.country && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{user.country}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Badge
                variant={user.status === "active" ? "default" : "secondary"}
                className={
                  user.status === "active"
                    ? "bg-green-500 hover:bg-green-600"
                    : ""
                }
              >
                {user.status === "active" ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline">{user.role.toUpperCase()}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
