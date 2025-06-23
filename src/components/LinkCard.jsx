import React from "react";

const LinkCard = ({ url, fetchUrl }) => {
  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img src={url?.qr} alt="QR Code" />
    </div>
  );
};

export default LinkCard;
