
const paypal = require('../../helpers/paypal')
const Order = require('../../models/Order')
const Cart = require('../../models/Cart')

const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId
        } = req.body;
        const create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: 'https://shopnest-gowthami9.vercel.app/shop/paypal-return',
                cancel_url: 'https://shopnest-gowthami9.vercel.app/shop/paypal-cancel',
            },
            transactions: [
                {
                    item_list: {
                        items: cartItems.map(item => ({
                            name: item.title,
                            sku: item.productId,
                            price: item.price.toFixed(2),
                            currency: 'USD',
                            quantity: item.quantity
                        })),
                    },
                    amount: {
                        currency: 'USD',
                        total: totalAmount.toFixed(2)
                    },
                    description: 'description'
                }
            ]
        }
        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                console.log(error)
                return res.status(500).json({
                    success: false,
                    message: 'Error while creating paypal payment'
                })
            } else {
                const newlyCreatedOrder = new Order({
                    userId, cartId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId,
                });
                await newlyCreatedOrder.save();
                const approvalURL = paymentInfo.links.find((link) => link.rel === 'approval_url').href;
                res.status(201).json({
                    success: true,
                    approvalURL,
                    orderId: newlyCreatedOrder._id,
                })
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })
    }
}
const capturePayment = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order can not be found",
            });
        }

        paypal.payment.execute(
            paymentId,
            { payer_id: payerId },
            async (error, payment) => {
                if (error) {
                    console.log(error);

                    return res.status(500).json({
                        success: false,
                        message: "Error while executing PayPal payment",
                    });
                }

                if (payment.state !== "approved") {
                    return res.status(400).json({
                        success: false,
                        message: "PayPal payment was not approved",
                    });
                }

                order.paymentStatus = "paid";
                order.orderStatus = "confirmed";
                order.paymentId = paymentId;
                order.payerId = payerId;

                await Cart.findByIdAndDelete(order.cartId);
                await order.save();

                return res.status(200).json({
                    success: true,
                    message: "Order confirmed",
                    data: order,
                });
            }
        );
    } catch (e) {
        console.log(e);

        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};
    
const getAllOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId }).sort({ orderDate: -1 });

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

module.exports = {
    createOrder,
    capturePayment,
    getAllOrdersByUserId,
};