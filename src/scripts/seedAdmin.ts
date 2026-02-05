import { ICreateProviderProfile } from "../interfaces/providerProfile.interface";
import { prisma } from "../lib/prisma";

const adminSeed = async () => {
  try {
    const categoryData = {
      name: "china",
      image: "https://mrerro.com/images",
    };
    const result = await prisma.category.create({
      data: categoryData,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

adminSeed();

// try {
//     const categoryData = {
//       userId: "fAT9Ey9XR8j1shMifIwWjpnVU3KtXe8p",
//       businessName: "Mama Biryani & Catering",
//       description: "Authentic homemade biryani and traditional dishes.",
//       address: "Dhanmondi, Dhaka",
//       logoUrl: "https://example.com/logo.jpg",
//       coverUrl: "https://example.com/cover.jpg",
//       isOpen: true,
//       isVerified: false,
//       cuisineType: "Bengali, Indian",
//       deliveryFee: 40.0,
//       estimatedDeliveryTime: "30-45 mins",
//     };
//     const result = await prisma.providerProfile.create({
//       data: categoryData as ICreateProviderProfile,
//     });
//     return result;
//   } catch (error) {
//     console.log(error);
//   }
