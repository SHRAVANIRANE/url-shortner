import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      {/*Footer*/}
      <footer className="p-10 text-center bg-gray-800 mt-10">
        Made with ❤️ by Shravani
      </footer>
    </div>
  );
};

export default AppLayout;
