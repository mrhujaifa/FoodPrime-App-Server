import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createReview = async (payload: {
  rating: number;
  comment: string;
  customerId: string;
  mealId: string;
}) => {
  const { rating, comment, customerId, mealId } = payload;

  // ১. ফরেইন কি এরর এড়াতে সবার আগে চেক করুন ইউজারটি ডাটাবেসে আছে কি না
  const user = await prisma.user.findUnique({
    where: { id: customerId },
  });

  if (!user) {
    // এই এররটি আসলে বুঝবেন ফ্রন্টএন্ড থেকে ভুল 'customerId' পাঠানো হচ্ছে
    throw new Error(
      `User not found with ID: ${customerId}. Please check if you are sending the correct User ID.`,
    );
  }

  // ২. কন্ডিশন চেক: শুধুমাত্র DELIVERED অর্ডারের জন্য রিভিউ দেওয়া যাবে
  const isEligible = await prisma.order.findFirst({
    where: {
      customerId: customerId,
      status: OrderStatus.DELIVERED,
      items: {
        some: {
          mealId: mealId,
        },
      },
    },
  });

  if (!isEligible) {
    throw new Error(
      "You can only review items that have been delivered to you.",
    );
  }

  // ৩. ডাটাবেসে রিভিউ তৈরি করা
  return await prisma.review.create({
    data: {
      rating: Number(rating),
      comment,
      customerId: customerId, // এটি অবশ্যই User.id হতে হবে
      mealId: mealId,
    },
    include: {
      customer: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};

const getMealReviews = async (mealId: string) => {
  return await prisma.review.findMany({
    where: {
      mealId: mealId,
      parentId: null,
    },
    include: {
      customer: {
        select: { name: true, image: true },
      },
      replies: {
        include: {
          customer: { select: { name: true, image: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const reviewServices = {
  createReview,
  getMealReviews,
};
