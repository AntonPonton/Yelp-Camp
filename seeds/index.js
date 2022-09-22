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
  for (let i = 0; i < 6; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 50);
    const randomTag = Math.floor(Math.random() * 6);
    tagsArr = ["dune", "sea", "forest", "jungle", "mountain", "space"];
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
          url: "https://res.cloudinary.com/dbkdxsoia/image/upload/v1662760581/YelpCamp/zct7tvwmr3rdtwjtthrf.png",
          filename: "YelpCamp/gk9xhf5x2unduev3bdxh",
        },
        {
          url: "https://res.cloudinary.com/dbkdxsoia/image/upload/v1663344477/YelpCamp/yprxcvuspancdjv5kpcr.png",
          filename: "suaobjjwtyiymtq36jkv",
        },
      ],
      tag: tagsArr[randomTag],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
