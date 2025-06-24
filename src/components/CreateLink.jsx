import React from "react";
import { UrlState } from "@/context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { useNavigate, useSearchParams } from "react-router-dom";

const CreateLink = () => {
  const { user } = UrlState();
  const navigate = useNavigate;
  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  return (
    <div>
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateLink;
