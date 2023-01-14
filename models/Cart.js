
import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    is_ordered: {
        type: Boolean,
        default: false,
        required: true
    }
})

export default mongoose.model('Cart', cartSchema);