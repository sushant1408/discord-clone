"use client";

// import "@uploadthing/react/styles.css";

import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: "serverImage" | "messageFile";
  value?: string;
}

const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20!">
        <Image src={value} alt={value} fill className="rounded-full" />
        <button
          type="button"
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          onClick={() => onChange("")}
        >
          <XIcon className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(response) => {
        onChange(response?.[0]?.ufsUrl);
      }}
      onUploadError={(error: Error) => {
        console.error(error);
      }}
    />
  );
};

export { FileUpload };
