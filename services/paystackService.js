import paystack from "paystack-api";

const paystckClient = paystack(process.env.PAYSTACK_SECRET_KEY);

export const initializeTransaction = async (email, amount, metadata) => {
  return await paystckClient.transaction.initialize({
    email,
    amount,
    metadata,
    callback_url: `${process.env.CLIENT_URL}/verify?orderId=${metadata.orderId}`,
    
    
  });
};

export const verifyTransaction = async (reference) => {
  return await paystckClient.transaction.verify(reference);
};




