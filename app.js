const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

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
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsTo(Cart, { through: CartItem });

async function syncDb() {
  try {
    const result = await sequelize.sync();
    //const result = await sequelize.sync({ force: true });
    let user = await User.findByPk(1);
    if (!user) {
      user = await User.create({ name: "Amruth", email: "amruth@gmail.com" });
      await user.createCart();
    }
    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
}

syncDb();
