import React from "react";
import { Link } from "react-router-dom";

const LinkCard = ({ url, fetchUrl }) => {
  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        alt="QR Code"
        className="h-32 object-contain ring ring-blue-500 self-start"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 mx-5">
        <span className="font-extrabold text-3xl hover:underline cursor-pointer">
          {url?.title}
        </span>
        <span className="text-2xl font-bold text-blue-400 hover:underline cursor-pointer">
          https://urltrimmer.in/
          {url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer">
          {url?.original_url}
        </span>
        <span className="flex items-end font-extralight text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
    </div>
  );
};

export default LinkCard;
