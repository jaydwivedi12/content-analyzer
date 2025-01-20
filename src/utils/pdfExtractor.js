import * as pdfjsLib from 'pdfjs-dist/webpack'; 

export const processPDF = async (file, setExtractedText, setError) => {
  try {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const arrayBuffer = this.result;
      const pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
      let fullText = '';

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();

        let lastY = null;
        let currentLine = [];
        let pageText = [];

        textContent.items.forEach(item => {
          const text = item.str;
          const y = item.transform[5];
          
         if (lastY === null || Math.abs(y - lastY) < 5) {
            currentLine.push(text);
          } else {
            pageText.push(currentLine.join(' '));
            currentLine = [text];
          }

          lastY = y;
        });

        if (currentLine.length > 0) {
          pageText.push(currentLine.join(' '));
        }

        fullText += pageText.join('\n') + '\n\n';
      }

      setExtractedText(fullText);
    };

    fileReader.readAsArrayBuffer(file);
  } catch (error) {
    console.error('PDF Processing Error:', error);
    setError('Error processing PDF file. Please try again.');
  }
};
