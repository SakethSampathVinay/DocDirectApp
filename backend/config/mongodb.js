import mongoose from "mongoose"



const connectToDB = async () => {
    await mongoose.connect("mongodb+srv://sakethsampath2006:R2yXmI3Bqh76ARjC@cluster0.bijq6.mongodb.net/DocDirect");
    const db = mongoose.connection;
    db.on("open", (open) => console.log("MongoDB Connected Successfully"));
    db.on("error", (err) => console.log(err));

}

export default connectToDB;