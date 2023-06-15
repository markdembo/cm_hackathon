"use client";
import { useState, ChangeEvent, FormEvent } from "react";

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (file) {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          "https://backendcm.not-a-single-bug.workers.dev",
          //"https://webhook.site/04c7c9ce-2f84-4608-b477-b30a0453740b",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const downloadLink = await response.text();
          setDownloadLink(downloadLink);
          console.log("File uploaded successfully!");
        } else {
          // Handle upload error
          console.error("Failed to upload file.");
        }
      } catch (error) {
        // Handle network error
        console.error("An error occurred while uploading the file.", error);
      }

      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (downloadLink) {
      navigator.clipboard.writeText(downloadLink);
      setIsCopied(true);
      console.log("Download link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="fileInput"
              className="block text-lg font-medium text-gray-700"
            >
              Choose a file to upload:
            </label>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </form>
        {downloadLink && (
          <div>
            <label>Download Link:</label>
            <div className="flex flex-col">
              <input
                type="text"
                value={downloadLink}
                readOnly
                className=" bg-gray-300"
              />
              <button className="" onClick={handleCopyLink}>
                {isCopied ? "Copied!" : "Copy to Clipboard"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
