import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ORDERS } from "../graphql/queries";

const useCustomerOrders = (userId: string) => {
  const { data, loading, error } = useQuery(GET_ORDERS);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!data) return;

    const orders: Order[] = data.getOrders.map(({ value }: OrderResponse) => ({
      carrier: value.carrier,
      createdAt: value.createdAt,
      trackingId: value.trackingId,
      shippingCost: value.shippingCost,
      Address: value.Address,
      City: value.City,
      Lng: value.Lng,
      Lat: value.Lat,
      trackingItems: value.trackingItems,
    }));

    const customerOrders = orders.filter(
      (order) => order.trackingItems.customer_id === userId
    );

    setOrders(customerOrders);
  }, [data, userId]);

  return { orders, loading, error };
};

export default useCustomerOrders;
