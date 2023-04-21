import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { toast } from "react-toastify";

export default function useFirebaseImage(
    setValue,
    getValues,
    imageName = null,
    cb = null,
) {
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState("");
    if (!setValue || !getValues) return;
    const handleUpLoadImage = (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progressPercent =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progressPercent);
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        console.log("Nothing at all");
                }
            },
            (error) => {
                toast.error(error.message);
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at", downloadURL);
                    setImage(downloadURL);
                    toast.success("Add image successfully");
                });
            }
        );
    };
    const handleSelectImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setValue("image_name", file.name);
        handleUpLoadImage(file);
    };
    /* Delete image */
    const handleDeleteImage = () => {
        const storage = getStorage();
        // Create a reference to the file to delete
        const desertRef = ref(
            storage,
            "images/" + (imageName || getValues("image_name"))
        );
        // Delete the file
        deleteObject(desertRef)
            .then(() => {
                toast.success("Remove image successfully");
                setImage("");
                setProgress(0);
                cb && cb();
                // File deleted successfully
            })
            .catch((error) => {
                toast.error("Couldn't find an image to delete");
                // Uh-oh, an error occurred!
            });
    };
    return {
        image,
        progress,
        handleDeleteImage,
        handleSelectImage,
        setImage,
        setProgress,
    };
}
