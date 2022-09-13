const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 50);
    const camp = new Campground({
      //YOUR USER ID
      author: "630e12aec3800505415468e3",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci rerum fuga fugiat ipsa maiores dolorem quibusdam expedita veritatis labore ducimus quod quas repellat a, ullam dicta tempore dignissimos aliquam quasi!",
      price: randomPrice,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dbkdxsoia/image/upload/v1661947205/YelpCamp/gk9xhf5x2unduev3bdxh.jpg",
          filename: "YelpCamp/gk9xhf5x2unduev3bdxh",
        },
        {
          url: "https://res.cloudinary.com/dbkdxsoia/image/upload/v1661947432/YelpCamp/suaobjjwtyiymtq36jkv.jpg",
          filename: "suaobjjwtyiymtq36jkv",
        },
        {
          url: "https://res.cloudinary.com/dbkdxsoia/image/upload/v1661956040/YelpCamp/mvamrtkma5mfmbsqgn4c.jpg",
          filename: "YelpCamp/mvamrtkma5mfmbsqgn4c",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
