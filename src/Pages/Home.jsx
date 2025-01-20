import React, { useState, useRef } from "react";
import { Upload, XCircle } from "lucide-react";
import { processPDF } from "../utils/pdfExtractor";
import processImageWithOCR from "../utils/ocrWorker";
import { Github } from "lucide-react";

const Home = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    setError("");
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/tiff",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or image file (JPEG, PNG, TIFF)");
      return;
    }

    setFile(file);
  };

  const clearFile = () => {
    setFile(null);
    setResult("");
    setError("");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processDocument = async () => {
    if (!file) return;

    setProcessing(true);
    setError("");
    setResult("");
    setProgress(0);

    try {
      if (file.type === "application/pdf") {
        await processPDF(file, setResult, setError);
      } else {
        await processImageWithOCR(file, setResult, setError, (progress) =>
          setProgress(progress)
        );
      }
    } catch (err) {
      setError("Error processing document: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="mb-6 p-6 bg-white">
        <h1 className="text-2xl font-bold text-gray-800">Content Analyzer</h1>
      </div>

      <div className="min-w-2xl bg-white rounded-lg shadow-md p-6 flex-1">
        <div
          className={`border-2 border-zinc-900 rounded-lg p-8 text-center ${
            isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
          } ${error ? "border-red-500" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".pdf,.jpg,.jpeg,.png,.tiff"
            className="hidden"
          />

          {!file ? (
            <div className="space-y-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Select File
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  or drag and drop PDF/image file here
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm truncate">{file.name}</span>
                <button
                  onClick={clearFile}
                  className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={processDocument}
                disabled={processing}
                className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  processing
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {processing ? "Processing..." : "Process Document"}
              </button>
            </div>
          )}

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        {processing && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Progress:</h3>
            <div className="w-full bg-gray-200 rounded">
              <div
                className="bg-blue-500 text-xs font-medium text-white text-center p-1 leading-none rounded"
                style={{ width: `${progress * 100}%` }}
              >
                {Math.round(progress * 100)}%
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Extracted Text:</h3>
            <p className="whitespace-pre-wrap text-sm">{result}</p>
          </div>
        )}
      </div>

      <footer className="bg-white shadow-sm mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center items-center">
          <p className="text-sm text-gray-500">
            Created by Jay Dwivedi
            <a
              href="https://github.com/jaydwivedi12/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <Github className="h-4 w-4 mr-1" />
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
