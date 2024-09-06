// Script to format the images in gallery format

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const folderPath = "./images/thumbnails"; // Replace with your folder path
const outputFilePath = "./images.json";

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ext === ".jpg" || ext === ".jpeg" || ext === ".png"; // Add other image extensions if needed
  });

  const imageMetadata = [];

  imageFiles.forEach((file, index) => {
    const newFileName = `IMG-${1000 + index}.jpg`;
    const oldFilePath = path.join(folderPath, file);
    const newFilePath = path.join(folderPath, newFileName);

    sharp(oldFilePath)
      .metadata()
      .then((metadata) => {
        const { width, height } = metadata;

        // Rename the file
        fs.rename(oldFilePath, newFilePath, (err) => {
          if (err) {
            console.error(`Could not rename file ${file} to ${newFileName}.`, err);
            return;
          }

          // Store the image metadata
          imageMetadata.push({
            filenumber: index + 1,
            name: newFileName,
            width: width,
            height: height,
          });

          // If we have processed all files, write to images.json
          if (imageMetadata.length === imageFiles.length) {
            fs.writeFile(outputFilePath, JSON.stringify(imageMetadata, null, 2), (err) => {
              if (err) {
                console.error("Could not write JSON file.", err);
                return;
              }

              console.log("Renaming completed and images.json file created.");
            });
          }
        });
      })
      .catch((err) => {
        console.error(`Could not read metadata of file ${file}.`, err);
      });
  });
});
