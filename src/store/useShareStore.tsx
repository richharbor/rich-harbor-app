import { create } from "zustand";


export const useShareStore = create((set, get) => ({
    dummyShares: [
        {
            id:1,
            shareName: "Alpha Corp",
            quantityAvailable: "1200",
            price: "45.50",
            deliveryTimeline: "2 weeks",
            confirmDelivery: true,
            shareInStock: true,
            preShareTransfer: false,
        },
        {
            id:2,
            shareName: "Beta Holdings",
            quantityAvailable: "800",
            price: "38.20",
            deliveryTimeline: "1 week",
            confirmDelivery: false,
            shareInStock: true,
            preShareTransfer: true,
        },
        {
            id:3,
            shareName: "Gamma Investments",
            quantityAvailable: "1500",
            price: "52.00",
            deliveryTimeline: "3 weeks",
            confirmDelivery: true,
            shareInStock: false,
            preShareTransfer: false,
        },
        {
            id:4,
            shareName: "Delta Ventures",
            quantityAvailable: "600",
            price: "27.75",
            deliveryTimeline: "5 days",
            confirmDelivery: false,
            shareInStock: true,
            preShareTransfer: false,
        },
        {
            id:5,
            shareName: "Epsilon Partners",
            quantityAvailable: "2000",
            price: "61.40",
            deliveryTimeline: "1 month",
            confirmDelivery: true,
            shareInStock: true,
            preShareTransfer: true,
        },
    ],

}))