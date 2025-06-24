import { Copy, Download, Trash } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import useFetch from "@/hooks/UseFetch";
import { deleteUrl } from "@/db/ApiUrls";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url, fetchUrl }) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const filename = `qr-code-${url?.title}.png`;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);
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
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() =>
            navigator.clipboard.writeText(
              "https://urltrimmer.in/" +
                (url?.custom_url ? url?.custom_url : url.short_url)
            )
          }
        >
          <Copy />
        </Button>
        <Button variant="ghost" onClick={downloadImage}>
          <Download />
        </Button>
        <Button
          variant="ghost"
          onClick={() => fnDelete().then(() => fetchUrl())}
        >
          {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
