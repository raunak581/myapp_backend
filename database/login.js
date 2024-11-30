const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize (replace with your database configuration)
// const sequelize = new Sequelize(
//   {
//     username: "mgl",
//       password: "1FKsOyTn9gZdvh4G",
//       database: "chatapp",
//       host: "31.220.96.248",
//       port: 3306,
//       dialect: "mysql",
//       "pool": {
//        "max": 40,
//        "min": 0,
//        "acquire": 60000,
//        "idle": 10000
//      }
//     }
//   );

const sequelize = new Sequelize(
  {
        username: "root",
          password: "cOzbhuWlGXCcHaiweUhMVyGcinrJSGCZ",
          database: "railway",
          host: "junction.proxy.rlwy.net",
          port: 41889,
          dialect: "mysql",
          "pool": {
           "max": 40,
           "min": 0,
           "acquire": 60000,
           "idle": 10000
         }
        }
)

// Define the ClothingItem model
const ClothingItem = sequelize.define('ClothingItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'clothing_items', // Table name in the database
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

ClothingItem.associate = (models) => {
  ClothingItem.hasMany(models.ClothingImage, {
    foreignKey: 'clothingId',
    as: 'images',
  });
};

const User = sequelize.define('User', {

  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // Ensures the field is not empty
      isAlpha: true, // Ensures the value contains only letters
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isAlpha: true,
    },
  },
  mobileNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures the mobile number is unique
    validate: {
      notEmpty: true,
      isNumeric: true, // Ensures the value contains only numbers
      len: [10, 10], // Ensures the value is exactly 10 digits
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures the email is unique
    validate: {
      notEmpty: true,
      isEmail: true, // Ensures the value is a valid email
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 100], // Ensures the password is at least 6 characters
    },
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: true,
      isDate: true, // Ensures the value is a valid date
    },
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['Male', 'Female', 'Other']], // Ensures the value is one of the allowed options
    },
  },
}, {
  tableName: 'users', // Specifies the table name in the database
  timestamps: true, // Adds createdAt and updatedAt timestamps
});


const ClothingImage = sequelize.define(
  'ClothingImage',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clothingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clothing_items', // Table name of ClothingItem
        key: 'id', // Foreign key references `id` in ClothingItem
      },
      onDelete: 'CASCADE', // Deletes images if the associated ClothingItem is deleted
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'clothing_images', // Table name in the database
    timestamps: true, // Adds `createdAt` and `updatedAt`
  }
);
ClothingImage.associate = (models) => {
  ClothingImage.belongsTo(models.ClothingItem, {
    foreignKey: 'clothingId',
    as: 'clothingItem',
  });
};


const WishlistItem = sequelize.define('WishlistItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: DataTypes.STRING,
  price: DataTypes.FLOAT,
  imageUrl: DataTypes.STRING,
  // Additional fields as needed
});

// Associations
WishlistItem.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(WishlistItem, { foreignKey: 'userId' });



const Cartitem = sequelize.define('Cartitem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: DataTypes.STRING,
  price: DataTypes.FLOAT,
  imageUrl: DataTypes.STRING,
  quantity:DataTypes.INTEGER,
  // Additional fields as needed
});

// Associations
Cartitem.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Cartitem, { foreignKey: 'userId' });




const insertClothingItems = async () => {
  const clothingData = [
    {
      imageUrl: 'https://cdn.shopify.com/s/files/1/0598/8158/6848/files/LC02-COPPER117_3_720x.jpg?v=1719485412',
      name: 'Stylish Shirt',
      price: 1200,
      description: 'A trendy and comfortable shirt.',
    },
    {
      imageUrl: 'https://cdn.shopify.com/s/files/1/0598/8158/6848/files/LC02-DYROSE126_2_720x.jpg?v=1718267181',
      name: 'Elegant Dress',
      price: 2500,
      description: 'An elegant dress perfect for formal occasions.',
    },
    {
      imageUrl: 'https://cdn.shopify.com/s/files/1/0598/8158/6848/files/LC-BRMSTD158_4_720x.jpg?v=1719318727',
      name: 'Denim Jeans',
      price: 1800,
      description: 'Classic denim jeans with a modern fit.',
    },
    {
      imageUrl: 'https://cdn.shopify.com/s/files/1/0598/8158/6848/files/LC-LTPSTA142_3_720x.jpg?v=1719485548',
      name: 'Denim Jeans',
      price: 1800,
      description: 'Classic denim jeans with a modern fit.',
    },
    {
      imageUrl: 'https://cdn.shopify.com/s/files/1/0598/8158/6848/files/LC-PLUM25_2_720x.jpg?v=1719295542',
      name: 'Denim Jeans',
      price: 1800,
      description: 'Classic denim jeans with a modern fit.',
    },
    {
      imageUrl: 'https://cdn.shopify.com/s/files/1/0598/8158/6848/files/LL04-GREY78-1L4_3_720x.jpg?v=1718795021',
      name: 'Denim Jeans',
      price: 1800,
      description: 'Classic denim jeans with a modern fit.',
    },
    {
      imageUrl: 'https://cdn.shopify.com/s/files/1/0598/8158/6848/files/LL04-GREY78-2L5_3_720x.jpg?v=1719470956',
      name: 'Denim Jeans',
      price: 1800,
      description: 'Classic denim jeans with a modern fit.',
    },
    {
      imageUrl: 'https://cdn.shopify.com/s/files/1/0598/8158/6848/files/LL-BLSHPK165_3_720x.jpg?v=1718799312',
      name: 'Denim Jeans',
      price: 1800,
      description: 'Classic denim jeans with a modern fit.',
    },
    {
      imageUrl: 'https://cdn.shopify.com/s/files/1/0598/8158/6848/files/LL-BRGREEN60_3_720x.jpg?v=1718779415',
      name: 'Denim Jeans',
      price: 1800,
      description: 'Classic denim jeans with a modern fit.',
    },
    {
      imageUrl: 'https://cdn.shopify.com/s/files/1/0598/8158/6848/files/LC-BRMSTD158_4_720x.jpg?v=1719318727',
      name: 'Denim Jeans',
      price: 1800,
      description: 'Classic denim jeans with a modern fit.',
    },
    {
      imageUrl: 'https://cdn.shopify.com/s/files/1/0598/8158/6848/files/LC-BRMSTD158_4_720x.jpg?v=1719318727',
      name: 'Denim Jeans',
      price: 1800,
      description: 'Classic denim jeans with a modern fit.',
    },
  ];

  try {
    // Step 4: Sync the Model and Insert Data
    await sequelize.sync(); // Ensures the table exists before inserting data

    await ClothingItem.bulkCreate(clothingData); // Inserts multiple rows

    console.log('Clothing items inserted successfully!');
  } catch (error) {
    console.error('Error inserting clothing items:', error);
  } finally {
    await sequelize.close(); // Close the connection after operation
  }
};


const clothingimage = async () => {
  const clothingImages = [
    {
      clothingId: 1,
      imageUrl: "https://gocolors.com/cdn/shop/files/LLC-GOLD114_2.jpg?v=1719483713",
    },
    {
      clothingId: 1,
      imageUrl: "https://gocolors.com/cdn/shop/files/LLC-GOLD114_3.jpg?v=1719483713",
    },
    {
      clothingId: 1,
      imageUrl: "https://gocolors.com/cdn/shop/files/LLC-GOLD114_4.jpg?v=1719483713",
    },
    {
      clothingId: 1,
      imageUrl: "https://gocolors.com/cdn/shop/files/LLC-GOLD114_5.jpg?v=1719483713",
    },
    {
      clothingId: 2,
      imageUrl: "https://gocolors.com/cdn/shop/files/LC02-DYROSE126_3.jpg?v=1718267181",
    },
    {
      clothingId: 2,
      imageUrl: "https://gocolors.com/cdn/shop/files/LC02-DYROSE126_4.jpg?v=1718267181",
    },
    {
      clothingId: 2,
      imageUrl: "https://gocolors.com/cdn/shop/files/LC02-DYROSE126_5.jpg?v=1718267181",
    },
    {
      clothingId: 2,
      imageUrl: "https://gocolors.com/cdn/shop/files/LC02-DYROSE126_6.jpg?v=1718267181",
    },
    {
      clothingId: 3,
      imageUrl: "https://gocolors.com/cdn/shop/files/LC02-DYROSE126_5.jpg?v=1718267181",
    },
    {
      clothingId: 3,
      imageUrl: "https://gocolors.com/cdn/shop/files/LC02-DYROSE126_6.jpg?v=1718267181",
    },
    {
      clothingId: 4,
      imageUrl: "https://gocolors.com/cdn/shop/files/LC02-DYROSE126_5.jpg?v=1718267181",
    },
    {
      clothingId: 4,
      imageUrl: "https://gocolors.com/cdn/shop/files/LC02-DYROSE126_6.jpg?v=1718267181",
    },
    {
      clothingId: 5,
      imageUrl: "https://gocolors.com/cdn/shop/files/LC02-DYROSE126_5.jpg?v=1718267181",
    },
    {
      clothingId: 5,
      imageUrl: "https://gocolors.com/cdn/shop/files/LC02-DYROSE126_6.jpg?v=1718267181",
    },
  ];

  await ClothingImage.bulkCreate(clothingImages);

}



const connectDB = async () => {
  try {
    await sequelize.authenticate();
   //  await sequelize.sync({ alter: true });
    console.log('MySQL connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
connectDB();


module.exports = { connectDB, insertClothingItems, ClothingItem, ClothingImage, sequelize, User,WishlistItem,Cartitem };
