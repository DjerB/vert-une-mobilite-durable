import axios from 'axios';

import { ASSETS, API_KEY } from '../constants/apis';

axios.defaults.headers.common['x-api-key'] = API_KEY;

const uploadFileToS3 = (presignedPostData, file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      Object.keys(presignedPostData.fields).forEach(k => {
        formData.append(k, presignedPostData.fields[k]);
      });

      formData.append("file", file);
  
      const xhr = new XMLHttpRequest();
      xhr.open("POST", presignedPostData.url, true);
      xhr.send(formData);
      xhr.onload = function() {
        this.status === 204 ? resolve() : reject("rejected");
      };
    });
};

export const uploadTo = (url, file, type, id, name) => axios.post(url, JSON.stringify({
        id,
        type: file.type,
        typeOfFile: type,
        name
    }), {
      headers: {
          'Content-Type': 'application/json'
      }
    })
    .then(async ({ data: presignedPostData }) => {
        console.log(presignedPostData);
        return await uploadFileToS3(presignedPostData, file);
    });

/*const compress = (file, type) => {
      if (type === "evidence") {
        
      }
      const width = 500; 500
      const height = 300; 410
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
                  const elem = document.createElement('canvas');
                  const scaleFactor = width / img.width;
                  elem.width = width;
                  elem.height = img.height * scaleFactor;
                  const ctx = elem.getContext('2d');
                  // img.width and img.height will contain the original dimensions
                  ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
                  ctx.canvas.toBlob((blob) => {
                      const file = new File([blob], fileName, {
                          type: 'image/jpeg',
                          lastModified: Date.now()
                      });
                  }, 'image/jpeg', 1);
              },
              reader.onerror = error => console.log(error);
      };
  }*/

export const getFrom = (url) => axios.get(url);

export const getAsset = (path) => axios.get(ASSETS + "/" + path);

export const getImagesFromBucketFolder = (folder) => axios.get(ASSETS, { folder });