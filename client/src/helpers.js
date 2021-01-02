
/**
 * 
 * @param {*} file File/ Blob object
 */
export function getBase64(file) {
    return new Promise((res, rej) => {
        const SUPPORTED_FILE_TYPES = [
            "image/jpeg",
            "image/png",
        ];

        try {
            if (file !== undefined) {
                if (!SUPPORTED_FILE_TYPES.includes(file.type)) return rej('Unsported image type!')
                // if (file.size > 2048) return rej('Maximum image size is 2MB!')

                const reader = new FileReader(); // asynchronously read the files stored on the user's computer 
                reader.readAsDataURL(file); // encoded as Base 64 URL string 
                reader.onload = () => res(reader.result);
                reader.onerror = err => rej(err)
            }
        }
        catch (e) {
            rej(e.message)
        }

    })
}

