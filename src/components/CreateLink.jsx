import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/UseFetch";
import { BeatLoader } from "react-spinners";
import { UrlState } from "@/context";
import { createUrl } from "@/db/ApiUrls";
import QRCode from "react-qr-code";

export function CreateLink() {
  const { user } = UrlState();
  const navigate = useNavigate();
  const ref = useRef();

  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink || "",
    customUrl: "",
  });
  // QRCode
  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const { loading, error, data, fn: fnCreateUrl } = useFetch(createUrl);

  useEffect(() => {
    if (error === null && data) {
      console.log("✅ Backend Response:", data);
      const id = data[0]?.id || data?.id;
      if (id) navigate(`/link/${id}`);
    }
  }, [error, data, navigate]);

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const createNewLink = async () => {
    console.log("🟢 Create button clicked");
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });

      const svg = ref.current?.querySelector("svg");
      if (!svg) {
        console.error("❌ SVG not found");
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      canvas.width = 250;
      canvas.height = 250;

      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = async () => {
        ctx.drawImage(img, 0, 0);
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );

        if (!blob) {
          console.error("❌ Failed to create blob");
          return;
        }

        const payload = {
          ...formValues,
          user_id: user?.id,
          qrCode: blob,
        };

        console.log("📤 Sending payload to backend:", payload);
        await fnCreateUrl(payload);
      };

      img.src =
        "data:image/svg+xml;base64," +
        btoa(unescape(encodeURIComponent(svgData)));
    } catch (e) {
      console.error("❌ Validation or other error:", e);
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };
  // createUrl
  return (
    <Dialog
      defaultOpen={!!longLink}
      onOpenChange={(open) => {
        if (!open) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
          <DialogDescription>
            Fill in the details below to create your custom short link.
          </DialogDescription>
        </DialogHeader>

        {formValues?.longUrl && (
          <div ref={ref}>
            <QRCode size={250} value={formValues.longUrl} />
          </div>
        )}

        <Input
          id="title"
          placeholder="Short Link's Title"
          value={formValues.title}
          onChange={handleChange}
        />
        {errors.title && <Error message={errors.title} />}

        <Input
          id="longUrl"
          placeholder="Enter your Loooong URL"
          value={formValues.longUrl}
          onChange={handleChange}
        />
        {errors.longUrl && <Error message={errors.longUrl} />}

        <div className="flex items-center gap-2">
          <Card className="p-2">trimrr.in</Card> /
          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>

        {error && <Error message={error.message || "Something went wrong"} />}

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="destructive"
            onClick={createNewLink}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLink;
