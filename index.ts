import { existsSync, mkdirSync } from "fs";

async function downloadImages(file: string, folder: string) {
  // Read the file and split into lines (URLs)
  const urls = (await Bun.file(file).text()).split("\n");

  // Ensure the folder exists
  if (!existsSync(folder)) {
    mkdirSync(folder, { recursive: true });
  }

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const fileName = new URL(url).pathname.split("/").pop() || "image";
      const filePath = `${folder}/${fileName}`;

      // Save the image
      await Bun.write(filePath, new Uint8Array(buffer));
      console.log(`Saved ${fileName}`);
    } catch (error) {
      console.error(`Error downloading ${url}: ${error}`);
    }
  }
}

// input file is the first argument
const fileWithUrls = process.argv[2];
// target folder is the second argument, or default to the `dist` folder
const targetFolder = process.argv[3] || "dist";
// Start the download
downloadImages(fileWithUrls, targetFolder);
