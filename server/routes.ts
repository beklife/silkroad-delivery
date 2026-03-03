import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { stripe } from "./stripe.js";
import {
  createOrder,
  getOrder,
  getOrderByStripeId,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} from "./db.js";

const DELIVERY_FEE = 2.5;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ─── Create PaymentIntent (card payment) ────────────────────────────────────
  app.post("/api/orders/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const { customer, items, subtotal } = req.body;

      if (!customer || !items || !subtotal) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const total = subtotal + DELIVERY_FEE;
      const amountInCents = Math.round(total * 100);

      // Create Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "eur",
        metadata: {
          customer_name: customer.name,
          customer_email: customer.email,
        },
      });

      // Save pending order to DB
      const order = createOrder({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        street: customer.street,
        postcode: customer.postcode,
        city: customer.city,
        notes: customer.notes,
        items,
        subtotal,
        delivery_fee: DELIVERY_FEE,
        total,
        payment_method: "card",
        stripe_payment_id: paymentIntent.id,
        status: "pending",
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
      });
    } catch (err: any) {
      console.error("create-payment-intent error:", err);
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Cash on delivery order ──────────────────────────────────────────────────
  app.post("/api/orders/cash", async (req: Request, res: Response) => {
    try {
      const { customer, items, subtotal } = req.body;

      if (!customer || !items || !subtotal) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const total = subtotal + DELIVERY_FEE;

      const order = createOrder({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        street: customer.street,
        postcode: customer.postcode,
        city: customer.city,
        notes: customer.notes,
        items,
        subtotal,
        delivery_fee: DELIVERY_FEE,
        total,
        payment_method: "cash",
        status: "accepted",
      });

      res.json({ orderId: order.id, orderNumber: order.order_number });
    } catch (err: any) {
      console.error("cash order error:", err);
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Get order by ID ─────────────────────────────────────────────────────────
  app.get("/api/orders/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid order ID" });
      return;
    }
    const order = getOrder(id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json({ ...order, items: JSON.parse(order.items) });
  });

  // ─── Cancel order ────────────────────────────────────────────────────────────
  app.post("/api/orders/:id/cancel", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { cancelledBy } = req.body;
      const order = getOrder(id);

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      // Customer can only cancel if order is still pending
      if (cancelledBy === "customer" && order.status !== "pending") {
        res.status(400).json({ message: "Order can no longer be cancelled" });
        return;
      }

      let refundId: string | undefined;

      // Issue Stripe refund if paid by card
      if (order.stripe_payment_id && order.status !== "pending") {
        const refund = await stripe.refunds.create({
          payment_intent: order.stripe_payment_id,
        });
        refundId = refund.id;
      }

      cancelOrder(id, cancelledBy ?? "unknown", refundId);
      res.json({ success: true, refundId });
    } catch (err: any) {
      console.error("cancel order error:", err);
      res.status(500).json({ message: err.message });
    }
  });

  // ─── Stripe webhook ──────────────────────────────────────────────────────────
  app.post("/api/stripe/webhook", async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      res.status(500).json({ message: "Webhook secret not configured" });
      return;
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody as Buffer,
        sig,
        webhookSecret
      );
    } catch (err: any) {
      console.error("Webhook signature error:", err.message);
      res.status(400).json({ message: `Webhook error: ${err.message}` });
      return;
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as any;
      const order = getOrderByStripeId(paymentIntent.id);
      if (order) {
        updateOrderStatus(order.id, "accepted");
      }
    }

    res.json({ received: true });
  });

  // ─── Admin — get all orders (password protected) ─────────────────────────────
  app.get("/api/admin/orders", (req: Request, res: Response) => {
    const password = req.headers["x-admin-password"];
    if (password !== process.env.ADMIN_PASSWORD) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const orders = getAllOrders().map((o) => ({
      ...o,
      items: JSON.parse(o.items),
    }));
    res.json(orders);
  });

  // ─── Admin — update order status ─────────────────────────────────────────────
  app.patch("/api/admin/orders/:id/status", (req: Request, res: Response) => {
    const password = req.headers["x-admin-password"];
    if (password !== process.env.ADMIN_PASSWORD) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const validStatuses = ["pending", "accepted", "preparing", "delivering", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }
    updateOrderStatus(id, status);
    res.json({ success: true });
  });

  return httpServer;
}
