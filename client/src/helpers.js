
/**
 * 
 * @param {*} file File/ Blob object
 */
export function getBase64(file) {
    return new Promise((res, rej) => {
        try {
            if (file !== undefined) {
                if (file.type === "image/jpeg") {

                }
                const reader = new FileReader(); // asynchronously read the files stored on the user's computer 
                reader.readAsDataURL(file); // encoded as Base 64 URL string 
                reader.onload = () => res(reader.result);
                reader.onerror = err => rej(err)
                // else rej('Unsported')...
            }
        }
        catch(e) {
            rej(e.message)
        }

    })
}

