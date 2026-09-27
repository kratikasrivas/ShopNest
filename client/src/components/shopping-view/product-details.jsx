import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "@heroicons/react/24/outline";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import StarRatingComponent from "../common/star-rating";
import {
  addReview,
  getReviews,
} from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));

        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setReviewMsg("");
    setRating(0);
  }

  function handleAddReview() {
    if (!reviewMsg.trim() || rating === 0) {
      toast({
        title: "Please provide a rating and review",
        variant: "destructive",
      });

      return;
    }

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setReviewMsg("");
        setRating(0);

        dispatch(getReviews(productDetails?._id));

        toast({
          title: "Review added successfully",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails?._id, dispatch]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-4 sm:max-w-[80vw] lg:max-w-[70vw] h-[80vh] overflow-y-auto">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <div>
            <h1 className="text-2xl font-bold">
              {productDetails?.title}
            </h1>

            <p className="text-muted-foreground text-xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p
              className={`text-2xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>

            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className="w-5 h-5 fill-primary"
                />
              ))}
            </div>

            <span className="text-muted-foreground">
              ({reviews?.length || 0})
            </span>
          </div>

          <div className="mt-5 mb-5">
            <Button
              className="w-full"
              onClick={() =>
                handleAddtoCart(productDetails?._id)
              }
            >
              Add to Cart
            </Button>
          </div>

          <Separator />

          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">
              Reviews
            </h2>

            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review?._id}
                    className="flex gap-4"
                  >
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {review?.userName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">
                          {review?.userName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-5 h-5 ${
                              star <= review?.reviewValue
                                ? "fill-primary"
                                : ""
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-muted-foreground">
                        {review?.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No reviews yet.
                </p>
              )}
            </div>

            <div className="mt-6">
              <StarRatingComponent
                rating={rating}
                handleRatingChange={setRating}
              />

              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Write a review..."
                  value={reviewMsg}
                  onChange={(event) =>
                    setReviewMsg(event.target.value)
                  }
                />

                <Button onClick={handleAddReview}>
                  Add Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;