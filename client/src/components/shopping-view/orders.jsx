import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrdersByUserId } from "@/store/shop/order-slice";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.shopOrder);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllOrdersByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>

                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell>{order.orderStatus}</TableCell>

                  <TableCell>${order.totalAmount}</TableCell>

                  <TableCell>
                    <Dialog
                      open={
                        openDetailsDialog &&
                        selectedOrder?._id === order._id
                      }
                      onOpenChange={setOpenDetailsDialog}
                    >
                      <Button
                        onClick={() => {
                          setSelectedOrder(order);
                          setOpenDetailsDialog(true);
                        }}
                      >
                        View Details
                      </Button>

                      <ShoppingOrderDetailsView
                        orderDetails={selectedOrder}
                      />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;