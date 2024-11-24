const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize (replace with your database configuration)
const sequelize = new Sequelize('Gocolors', 'raunak', '123456', {
  host: '127.0.0.1',
  dialect: 'mysql', // Use your database dialect (mysql, postgres, sqlite, etc.)
});

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
    // await sequelize.sync({ alter: true });
    console.log('MySQL connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
connectDB();



module.exports = { sequelize, connectDB, insertClothingItems, ClothingItem, ClothingImage };
