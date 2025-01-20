# Content Analyzer

### [Live Demo - Click Here](https://content-analyzer-j.vercel.app/)

### How to Run Locally

To run this project locally, follow the steps below:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jaydwivedi12/content-analyzer.git
   ```

2. **Go into the project directory:**:
   ```bash
   cd content-analyzer
   ```

3. **Install Dependencies**:
   Make sure you have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed. Then, install the necessary dependencies using:
   ```bash
   npm install
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

--------------------------------

### Functionality

1. **File Upload**: Users can upload files by either dragging and dropping them or selecting them manually from their device. Supported file types include PDF, JPEG, PNG, and TIFF.

2. **Text Extraction**:
   - **PDF Files**: For PDF files, I used a PDF parsing library to extract text from each page of the document.
   - **Image Files**: For image files, I have integrated Tesseract.js, a popular OCR library, The OCR process is handled in a web worker, which ensures that the extraction happens asynchronously, allowing the user interface to remain responsive.

3. **Progress Feedback**: As the OCR runs, the user is provided with real-time progress updates via a progress bar, which is displayed on the interface. This allows users to monitor the status of the extraction.

4. **Error Handling**: The system includes error handling to notify users in case of any issues during the file upload or text extraction process.

5. **Result Display**: Once the text extraction is complete, the extracted text is displayed for the user to review or copy.

