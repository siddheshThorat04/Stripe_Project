import Product from "../models/product.model.js"
export const getCart=async(req,res)=>{
    try {
        const products=await Product.find({_id:{$in:req.user.cartItems}});
        const cartItems=products.map((product)=>{
            const item=req.user.cartItems.find((cartItem)=>cartItem.id===product.id);
            return {...product.toJSON(),quantity:item.quantity};
        })
    } catch (error) {
        
        res.json(500).json({message:"Error in Geting Cart Items",error:"Server Error"});
    }
}
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({ id: productId, quantity: 1 });
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in adding to cart", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in adding to cart", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const quantity = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find((item) => item.id === productId);
        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);
                await user.save;
                return res.json({ message: "Product Removed from Cart", cart: user.cartItems });
            }
            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({ error: "Product Not Found" });
        }
    } catch (error) {
        console.log("Error in updating Quantity", error.message);
        res.status(500).json({ message: "Server Error",error:"server Error in updating cart" });

    }
}