import { response, request } from "express";

import Bill from "./bill.model.js";
import User from "../users/user.model.js";
import Purchase from "../purchases/purchase.model.js";

export const payPurchase = async (req =request, res = response) => {
    const {id} = req.user;
    const user = await User.findOne({_id: id});

    const query = {pending: true, user: user._id}
    const purchase = await Purchase.findOne(query);

    

    if(!purchase){
        return res.status(404).json({ msg: 'The user dont have a shoppingcart pending' });
    }

    const bill = new Bill({
        user: user._id,
        purchase: purchase._id
    })


    const total = bill.shippingTax + purchase.subtotal;

    bill.total = total;

    const formattedDateTime = `${bill.dateTime.getFullYear()}-${('0' + (bill.dateTime.getMonth() + 1)).slice(-2)}-${('0' + bill.dateTime.getDate()).slice(-2)}   ${('0' + bill.dateTime.getHours()).slice(-2)}:${('0' + bill.dateTime.getMinutes()).slice(-2)}:${('0' + bill.dateTime.getSeconds()).slice(-2)}`;

    await bill.save();

    user.shopping = false;
    await user.save();
    purchase.pending = false;
    await purchase.save();

    res.status(200).json({ 
        msg: 'purchase has been pay',
        msg: 'BILL GENERATED',
        bill: {
            ...bill.toObject(),
            user: user.email,
            purchase: purchase,
            dateTime: formattedDateTime
        }
    });
}