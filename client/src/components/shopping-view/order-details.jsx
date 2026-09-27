import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
    return (
        <DialogContent className="size:max-w-[600px]">
            <div className="grid gap-6">
                <div className="grid gap-6">
                    <div className="flex mt-6 items-center justify-between">
                        <p className="font-medium">Order ID</p>
                        <Label>{orderDetails?._id}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Date</p>
                        <Label>
                            {orderDetails?.orderDate
                                ? new Date(orderDetails.orderDate).toLocaleDateString()
                                : ""}
                        </Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Status</p>
                        <Label>{orderDetails?.orderStatus}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Price</p>
                        <Label>${orderDetails?.totalAmount}</Label>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Order Details</div>
                        <ul className="grid gap-3">
                            {orderDetails?.cartItems?.map((item) => (
                                <li
                                    key={item.productId}
                                    className="flex items-center justify-between"
                                >
                                    <span>
                                        {item.title} x {item.quantity}
                                    </span>

                                    <span>
                                        ${item.salePrice || item.price}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Shipping Info</div>
                        <div className="grid gap-0.5 text-muted-foreground">
                            <span>{orderDetails?.addressInfo?.address}</span>
                            <span>{orderDetails?.addressInfo?.city}</span>
                            <span>{orderDetails?.addressInfo?.pincode}</span>
                            <span>{orderDetails?.addressInfo?.phone}</span>
                            <span>{orderDetails?.addressInfo?.notes}</span>
                        </div>

                    </div>

                </div>
            </div>
        </DialogContent>
    );
}
export default ShoppingOrderDetailsView;