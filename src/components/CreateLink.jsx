import React, { useEffect, useRef, useState } from "react";
import { UrlState } from "@/context";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Error from "./Error";
import { Card } from "./ui/card";
import * as yup from "yup";
import useFetch from "@/hooks/UseFetch";
import { createUrl } from "@/db/ApiUrls";
import { BeatLoader } from "react-spinners";

const CreateLink = () => {
  const { user } = UrlState();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const ref = useRef();
  const [validationErrors, setValidationErrors] = useState({});
  const [formValue, setFormValue] = useState({
    title: "",
    longUrl: longLink || "",
    customLink: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup.string().required("Long URL is required"),
    customLink: yup.string().optional(),
  });

  const {
    loading,
    error: fetchError,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, null); // Note: Do not call it immediately; pass null

  useEffect(() => {
    if (fetchError === null && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [fetchError, data, navigate]);

  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });
  };

  const createNewUrl = async () => {
    setValidationErrors({});
    try {
      await schema.validate(formValue, { abortEarly: false });

      const canvas = ref.current?.querySelector("canvas");
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await fnCreateUrl({ ...formValue, user_id: user.id, qrCode: blob });
    } catch (e) {
      if (e.name === "ValidationError") {
        const newErrors = {};
        e.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setValidationErrors(newErrors);
      }
    }
  };

  return (
    <Dialog
      defaultOpen={Boolean(longLink)}
      onOpenChange={(open) => {
        if (!open) {
          setSearchParams({});
        }
      }}
    >
      <DialogTrigger>
        <Button variant="destructive">Create a New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>

        {formValue?.longUrl && (
          <div className="my-4 flex justify-center" ref={ref}>
            <QRCode value={formValue.longUrl} size={250} />
          </div>
        )}

        <Input
          name="title"
          value={formValue.title}
          onChange={handleChange}
          placeholder="Short Link's Title"
        />
        {validationErrors.title && <Error message={validationErrors.title} />}

        <Input
          name="longUrl"
          placeholder="Enter your loooong URL"
          value={formValue.longUrl}
          onChange={handleChange}
        />
        {validationErrors.longUrl && (
          <Error message={validationErrors.longUrl} />
        )}

        <div className="flex items-center gap-2">
          <Card className="p-2">URLTrimmer.in</Card> /
          <Input
            name="customLink"
            value={formValue.customLink}
            onChange={handleChange}
            placeholder="Custom Link (optional)"
          />
        </div>
        {validationErrors.customLink && (
          <Error message={validationErrors.customLink} />
        )}
        {fetchError && (
          <Error message={fetchError.message || "Failed to create link"} />
        )}

        <DialogFooter className="sm:justify-start">
          <Button
            disabled={loading}
            onClick={createNewUrl}
            variant="destructive"
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
