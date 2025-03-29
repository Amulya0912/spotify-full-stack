import { v2 as cloudinary } from 'cloudinary'
import songModel from '../models/songModel.js';

const addSong = async (req,res) => {
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const album = req.body.album;
        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: "video" });
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;
        


        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration
        }
        const song = songModel(songData);
        await song.save();

        res.json({ success: true, message: "Song Added" });

    } catch (error) {
        res.json({ success: false });

    }

}


// const addSong = async (req, res) => {
//     try {
//         console.log("🔥 Request received at /api/song/add");
//         console.log("📩 Request Body:", req.body);
//         console.log("📂 Uploaded Files:", req.files);

//         // ✅ Check if all required fields are present
//         if (!req.body.name || !req.body.desc || !req.body.album || !req.files?.audio || !req.files?.image) {
//             return res.status(400).json({ success: false, message: "Missing required fields" });
//         }

//         const { name, desc, album } = req.body;
//         const audioFile = req.files.audio[0];
//         const imageFile = req.files.image[0];

//         console.log("🎵 Uploading audio to Cloudinary...");
//         const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: "video" });

//         console.log("🖼 Uploading image to Cloudinary...");
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

//         const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;
//         console.log("⏳ Duration Calculated:", duration);

//         const songData = {
//             name,
//             desc,
//             album,
//             image: imageUpload.secure_url,
//             file: audioUpload.secure_url,
//             duration
//         };

//         console.log("💾 Saving song to database...");
//         const song = new songModel(songData);
//         await song.save();

//         console.log("✅ Song added successfully!");
//         res.json({ success: true, message: "Song Added" });

//     } catch (error) {
//         console.error("❌ Error in addSong:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

const listSong = async (req,res) => {
    try {
        const allSongs = await songModel.find({});
        res.json({ success: true, songs: allSongs });
    } catch (error) {
        res.json({ success: false });
    }

}

const removeSong = async (req, res) => {
    try {
        await songModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Song removed" });
    } catch (error) {
        res.json({ success: false });
    }

}

export { addSong, listSong, removeSong }  