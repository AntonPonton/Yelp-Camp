const mongoose = require("mongoose");
const { campgroundSchema } = require("../schemas");
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

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  let result;
  if (this.images.length !== 0) {
    result = `<div class="card text-center border-0" style="width: 10rem;">
<a href="/campgrounds/${this._id}" class="link-dark">
<img src="${this.images[0].url}" class="pop-up-image"/>
</a>
<p class="card-title mt-2"><strong>${this.title}</strong></p>
<p class="card-title"><small>${this.price} CHF / per night</small></p>
</div>`;
  } else {
    result = `<div class="card text-center border-0" style="width: 10rem;">
    <div
    class="bg-light card-img-top square img-fluid d-flex flex-column align-items-center justify-content-center"
    >
    <a href="/campgrounds/${this._id}" class="link-dark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="66"
            height="66"
            fill="gray"
            class="bi bi-emoji-frown"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
            />
            <path
              d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"
            />
          </svg>
          </a>
        <p class="text-muted mt-3">No photos yet!</p>
      </div>
<p class="card-title mt-2"><strong>${this.title}</strong></p>
<p class="card-title"><small>${this.price} CHF / per night</small></p>
</div>`;
  }
  return result;
});

/*



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
*/
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
