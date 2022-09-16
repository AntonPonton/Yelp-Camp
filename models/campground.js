const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

ImageSchema.virtual("preview").get(function () {
  return this.url.replace("/upload", "/upload/w_100");
});

const opts = { toJSON: { virtuals: true }, timestamps: true };

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
  },
  opts
);

/* `<img src="${this.images[0].url}" class="pop-up-image"/>
<a href="/campgrounds/${this._id}" class="link-dark">${this.title}</a>*/
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
<div class="card text-center border-0" style="width: 10rem;">
<a href="/campgrounds/${this._id}" class="link-dark">
<img src="${this.images[0].url}" class="pop-up-image"/>
</a>
<p class="card-title mt-2"><strong>${this.title}</strong></p>
<p class="card-title"><small>${this.price} CHF / per night</small></p>
</div>
`;
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
