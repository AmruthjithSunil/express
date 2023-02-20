const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { Sequelize } = require("sequelize");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  try {
    req.user = await User.findByPk(1);
    next();
  } catch (err) {
    console.log(err);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

async function syncDb() {
  try {
    const result = await sequelize.sync();
    let user = await User.findByPk(1);
    if (!user) {
      user = await User.create({ name: "Amruth", email: "amruth@gmail.com" });
    }
    //console.log(user);
    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
}

syncDb();

// sequelize
//   .sync({ force: true })
//   .then((result) => {
//     //console.log(result);
//     app.listen(3000);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
