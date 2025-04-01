import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";
import Order from "@/models/order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// function to help manage clerk webhook

// to help sync the use creation.
// Inngest func to save user to database

export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data; // getting user data to save to DB

    // assingn data from clerk to our DB using DB schema
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB();

    await User.create(userData);
  }
);

// Inngest to update user data in DB
export const syncUserUpdate = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data; // getting user data from clerk to save to DB

    // assingn data from clerk to our DB using DB schema
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB();

    await User.findByIdAndUpdate(id, userData);
  }
);

// Inngets func to delete user from DB
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);

// innget to create user order in DB
export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",

    // suppose we get more 25 orders within timeout 5s, then all orders will be processed simutaneously
    batchEvents: {
      maxSize: 5,
      timeout: "5s",
    },
  },
  {
    event: "order/created",
  },
  async ({ events }) => {
    const orders = events.map((event) => {
      return {
        userId: event.data.userId,
        items: event.data.items,
        amount: event.data.amount,
        address: event.data.address,
        date: event.data.date,
      };
    });

    await connectDB();

    await Order.insertMany(orders);

    return { success: true, processed: orders.length };
  }
);
