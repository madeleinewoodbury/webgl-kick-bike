/**
 * Loads one or more images and calls the given callback function when all images are loaded.
 */
class ImageLoader {
  constructor() {}

  load(onLoad, urls) {
    const promises = [];
    const images = [];
    for (let i = 0; i < urls.length; i++) {
      promises.push(
        // Calls resolve() after each individual image is downloaded:
        new Promise((resolve, reject) => {
          images[i] = new Image();
          images[i].src = urls[i]; 
          images[i].onload = () => {
            resolve();
          };
          images[i].onerror = () => {
            reject();
          };
        })
      );
    }

    Promise.all(promises)
      .then(() => {
        onLoad(images);
      })
      .catch(() => {
        console.log('Error in image name...!');
      });
  }
}

export default ImageLoader;
