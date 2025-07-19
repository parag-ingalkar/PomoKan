import { LogOutIcon, UserPenIcon, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type User } from "@/utils/type-user";
import { useAuth } from "@/hooks/useAuth";

interface UserMenuProps {
	user: User | null;
}

export default function UserMenu({ user }: UserMenuProps) {
	const { logout } = useAuth();
	const navigate = useNavigate();
	const user_fallback = `${user?.first_name[0]}${user?.last_name[0]}`;
	const user_fullname = `${user?.first_name} ${user?.last_name}`;
	const user_email = `${user?.email}`;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
					<Avatar>
						<AvatarImage src="./avatar.jpg" alt="Profile image" />
						<AvatarFallback>{user_fallback}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="max-w-64" align="end">
				<DropdownMenuLabel className="flex min-w-0 flex-col">
					<span className="text-foreground truncate text-sm font-medium">
						{user_fullname}
					</span>
					<span className="text-muted-foreground truncate text-xs font-normal">
						{user_email}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => navigate("/settings")}>
						<Settings size={16} className="opacity-60" aria-hidden="true" />
						<span>Settings</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => navigate("/profile")}>
						<UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
						<span>Change Password</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={logout}>
					<LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
					<span>Logout</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
