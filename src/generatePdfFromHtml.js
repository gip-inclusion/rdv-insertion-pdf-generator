import Bottleneck from "bottleneck";
import tmp from "tmp";

const limiter = new Bottleneck({
  maxConcurrent: 1,
});

export const logWithRequestId = (requestId, message, error) => {
  console.log(`[${requestId}] - ${message}`);
  if (error) {
    console.error(`[${requestId}] - ${error}`);
  }
};

export const makeGeneratePdfFromHtml =
  (browser) => async (htmlContent, requestId) => {
    return limiter.schedule(async () => {
      const durationLabel = `[${requestId}] - Pdf generation duration`;
      console.time(durationLabel);

      logWithRequestId(requestId, "generatePdfFromHtml started");
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(5_000);
      const tmpFile = tmp.fileSync({ suffix: '.pdf' });

      try {
        await page.setContent(htmlContent, { waitUntil: "load" });
        await page.emulateMediaType("print");

        const base64Pdf = (
          await page.pdf({
            path: tmpFile.name,
            margin: {
              top: "0cm",
              right: "0cm",
              bottom: "0cm",
              left: "0cm",
            },
            printBackground: true,
            format: "A4",
          })
        ).toString("base64");

        logWithRequestId(requestId, "generatePdfFromHtml finished");

        return base64Pdf;
      } catch (error) {
        logWithRequestId(requestId, "generatePdfFromHtml FAILED", error);
        throw error;
      } finally {
        console.timeEnd(durationLabel);
        await page.close();
        tmpFile.removeCallback();
      }
    });
  };
