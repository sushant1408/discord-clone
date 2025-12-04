"use client";

// import "@uploadthing/react/styles.css";

import { FileIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ClientUploadedFileData } from "uploadthing/types";

import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: "serverImage" | "messageFile";
  value?: string;
}

const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const [file, setFile] = useState<ClientUploadedFileData<null> | null>(null);
  const fileType = file?.type?.split("/").pop();

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

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="size-10 shrink-0 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline break-all"
        >
          {value}
        </a>
        <button
          type="button"
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
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
        setFile(response?.[0]);
        onChange(response?.[0]?.ufsUrl);
      }}
      onUploadError={(error: Error) => {
        console.error(error);
      }}
    />
  );
};

export { FileUpload };
