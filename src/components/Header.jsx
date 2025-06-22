import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "@/context";
import useFetch from "@/hooks/UseFetch";
import { logout } from "@/db/apiAuth";
import { BarLoader } from "react-spinners";

const Header = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = UrlState();
  console.log("Current User object.", user);

  const { loading, fn: fnLogout } = useFetch(logout);

  return (
    <nav className="py-4 flex justify-between items-center">
      <Link to={"/"}>
        <img src="src/assets/logo.png" className="h-16" alt="URLTimmer" />
      </Link>
      <div>
        {!user ? (
          <Button
            onClick={() => {
              navigate("/auth");
            }}
          >
            {" "}
            Login
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
              <Avatar>
                <AvatarImage
                  src={user?.user_metadata?.profilepic || ""}
                  alt="Profile Picture"
                  className="object-cover h-full w-full"
                />

                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/dashboard" className="flex items-center">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  <span>My Links</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span
                  onClick={() => {
                    fnLogout().then(() => {
                      fetchUser();
                      navigate("/");
                    });
                  }}
                >
                  Logout
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
    </nav>
  );
};

export default Header;
