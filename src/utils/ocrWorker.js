import { createWorker } from "tesseract.js";

const processImageWithOCR = async (file, setResult, setError, onProgress) => {

  try {
    const worker = await createWorker("eng", 1, {
      logger: (m) => {
        if (onProgress && m.status === "recognizing text") {
          onProgress(m.progress);
        }
      },
    });

    const ret = await worker.recognize(file);
    setResult(ret.data.text);
    await worker.terminate();
  } catch (error) {
    setError(error);
  }
};

export default processImageWithOCR;
