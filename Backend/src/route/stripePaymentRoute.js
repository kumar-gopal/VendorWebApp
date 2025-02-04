import express from "express";
import Stripe from "stripe";
const router = express.Router();

// Initialize Stripe with Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});


router.post("/checkout", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount provided",
      });
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Specify the payment methods allowed
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: "Invoice Payment",
            },
            unit_amount: Number(amount) * 100, // Convert to paisa (Stripe uses the smallest unit)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://yourwebsite.com/success",
      cancel_url: "https://yourwebsite.com/cancel",
    });

    console.log("Checkout Session Created:", session);

    res.redirect(session.url);

    // res.status(201).json({
    //   success: true,
    //   message: "Invoice created successfully",
    //   sessionId: session.id,
    //   url: session.url, // This is the URL where the user will be redirected to pay
    // });

  } catch (error) {
    console.error("Error creating invoice:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
