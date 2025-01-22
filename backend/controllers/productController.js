import Product from "../models/product.model.js"
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json(products)
    } catch (error) {
        console.log("Error in getting all Products :", error.message)
        res.status(500).json({ message: "Server Error:", error: error.message })
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts))
        }
        featuredProducts = Product.find({ isFeatured: true }).lean();
        if (!featuredProducts) {
            return res.status(404).json({ message: "No Featured Products Found" })
        }
        // store in reddis 

        await reddis.set("featured_products", JSON.stringify(featuredProducts))
        res.json(featuredProducts)
    } catch (error) {
        console.log("Error in getting all Products :", error.message)
        res.status(500).json({ message: "Server Error:", error: error.message })
    }
}

export const creaeteProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;
        let cloudinaryResponse = null;
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }
        const product = new Product({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        })
        res.status(201).json({ message: "Product Created Successfully", product })
    } catch (error) {
        console.log("Error in creating Product :", error.message)
        res.status(500).json({ message: "Server Error:", error: error.message })
    }
}
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.image) {
            // await cloudinary.uploader.destroy(product.image.public_id);
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted successfully");

            } catch (error) {
                console.log("Error in deleting image from cloudinary");

            }
            await Product.findByIdAndDelete(req.params.id);
            res.json({ message: "Product deleted successfully" });

        }
    } catch (error) {
        console.log("Error in deleting Product :", error.message)
        res.status(500).json({ message: "Server Error:", error: error.message })
    }
}
export const getRecommondedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 },
            },
            {
                $project: {
                    id: 1,
                    name: 1,
                    price: 1,
                    image: 1,
                    description: 1
                },

            }
        ]);
        res.json(products);
    } catch (error) {
        console.log("Error in getting recommondations :", error.message)
        res.satus(400).json({ message: "Server Error:", error: error.message })
    }
}
export const getCategoryProducts = async (req, res) => {
    try {
        const products = await Product.find({category:req.params.category});
        if (!products) {
            return res.status(404).json({ message: "Products not found" });
        }
        res.status(200).json(products);

    } catch (error) {
        console.log("Error in getting categorized Products :", error.message)
        res.status(500).json({ message: "Server Error:", error: error.message })
    }
}
export const toggleFeaturedProduct=async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            product.isFeatured = !product.isFeatured;
            await product.save();
            await updateFeaturedProductsCache();
            return res.json(product);
        }else{
            return res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        
    }
}


async function updateFeaturedProductsCache() {
   try {
     const featuredProducts = await Product.find({ isFeatured: true }).lean();
     await redis.set("featured_products", JSON.stringify(featuredProducts)); 
   } catch (error) {
        console.log("Error in updating Cache updateFeaturedProductsCache");
   }
}